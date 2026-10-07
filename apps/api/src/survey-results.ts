import { db } from './db.js';
import { assessmentCalculators, calculateConfiguredAssessmentsForSession } from './scoring/index.js';
import { qualityEnabled, storedQualities } from './quality/service.js';

const parseJson = (value: any): any => {
  if (typeof value !== 'string') return value;
  try { return JSON.parse(value); } catch { return value; }
};
const displayValue = (value: any, options: any[]) => (Array.isArray(value) ? value : [value])
  .map(v => options.find(o => String(o.value) === String(v))?.label ?? String(v)).join(', ');
const inList = (ids: string[]) => ids.map(() => '?').join(',');

// Scores are already saved during answering. Repair only missing/stale scored blocks,
// rather than running every calculator for every participant on every page load.
const pendingRepairs = new Map<string, Promise<void>>();
const recentAttempts = new Map<string, { signature: string; at: number }>();
async function repairAssessments(surveyId: string, sessionIds?: string[]) {
  const key = `${surveyId}:${sessionIds?.join(',') ?? 'all'}`;
  const existing = pendingRepairs.get(key);
  if (existing) return existing;
  const repair = (async () => {
    const restriction = sessionIds ? ` AND rs.id IN (${inList(sessionIds)})` : ' AND rs.deleted_at IS NULL';
    const [rows] = await db.query<any[]>(`SELECT rs.id sessionId,s.code,s.source_instrument_id,
      i.scoring_config IS NOT NULL configured,i.formula_version formulaVersion,ar.formula_version savedFormulaVersion,COUNT(a.id) answered,COUNT(q.id) questions,
      MAX(a.answered_at) lastAnswer,ar.calculated_at calculatedAt,rs.status
      FROM response_sessions rs JOIN sections s ON s.survey_id=rs.survey_id
      JOIN questions q ON q.section_id=s.id
      LEFT JOIN answers a ON a.question_id=q.id AND a.session_id=rs.id
      LEFT JOIN assessment_results ar ON ar.session_id=rs.id AND ar.section_id=s.id
      LEFT JOIN instruments i ON i.id=s.source_instrument_id AND i.is_verified=TRUE
      WHERE rs.survey_id=?${restriction}
      GROUP BY rs.id,s.id
      HAVING answered>0 AND (calculatedAt IS NULL OR lastAnswer>calculatedAt OR (configured AND formulaVersion<>savedFormulaVersion))`, [surveyId, ...(sessionIds ?? [])]);
    const bySession = new Map<string, string[]>();
    const attempted = new Map<string, { signature: string; at: number }>();
    for (const row of rows) {
      if (!assessmentCalculators[row.code] && !row.configured) continue;
      if (!row.calculatedAt && row.status !== 'completed' && Number(row.answered) < Number(row.questions)) continue;
      const attemptKey = `${row.sessionId}:${row.code}`;
      const signature = `${new Date(row.lastAnswer).getTime()}:${row.answered}:${row.questions}:${row.formulaVersion}`;
      const previous = recentAttempts.get(attemptKey);
      if (previous?.signature === signature && Date.now() - previous.at < 300_000) continue;
      attempted.set(attemptKey, { signature, at: Date.now() });
      const codes = bySession.get(row.sessionId) ?? [];
      codes.push(row.code); bySession.set(row.sessionId, codes);
    }
    const queue = [...bySession];
    // Keep enough DB connections available for respondents and other requests.
    await Promise.all(Array.from({ length: Math.min(2, queue.length) }, async () => {
      while (queue.length) {
        const [id, codes] = queue.shift()!;
        await calculateConfiguredAssessmentsForSession(id, codes);
      }
    }));
    for (const [key, attempt] of attempted) recentAttempts.set(key, attempt);
    while (recentAttempts.size > 5000) recentAttempts.delete(recentAttempts.keys().next().value!);
  })();
  pendingRepairs.set(key, repair);
  try { await repair; } finally { pendingRepairs.delete(key); }
}

export async function loadSurveyResults(surveyId: string, options: { summary?: boolean; sessionIds?: string[] } = {}) {
  const { summary = false, sessionIds } = options;
  if (sessionIds?.length === 0) return { respondents: [], deletedRespondents: [], sections: [], distribution: [] };
  await repairAssessments(surveyId, sessionIds);
  const restriction = sessionIds ? ` AND rs.id IN (${inList(sessionIds)})` : '';
  const values = [surveyId, ...(sessionIds ?? [])];
  const [[sections], [sessions], [scoreRows], qualities] = await Promise.all([
    db.query<any[]>(`SELECT code,title,section_kind sectionKind FROM sections WHERE survey_id=? AND code<>'respondent' ORDER BY position`, [surveyId]),
    db.query<any[]>(`SELECT rs.id,rs.status,rs.started_at startedAt,rs.last_activity_at lastActivityAt,
      rs.completed_at completedAt,rs.deleted_at deletedAt,COUNT(a.id) answered,
      MAX(CASE WHEN s.code='respondent' AND q.code='alias' THEN CAST(a.value AS CHAR) END) aliasValue,
      m.cohort,m.calibration_trusted calibrationTrusted,m.eligibility,m.eligibility_reason eligibilityReason,m.confirmed_duplicate confirmedDuplicate
      FROM response_sessions rs LEFT JOIN answers a ON a.session_id=rs.id
      LEFT JOIN questions q ON q.id=a.question_id LEFT JOIN sections s ON s.id=q.section_id
      LEFT JOIN quality_metadata m ON m.session_id=rs.id
      WHERE rs.survey_id=?${restriction} GROUP BY rs.id ORDER BY rs.started_at DESC,rs.id DESC`, values),
    db.query<any[]>(`SELECT ar.session_id sessionId,s.id sectionId,s.code,s.title,s.position,
      ar.formula_version formulaVersion,ar.result${summary ? '' : ',ar.interpretation'}
      FROM assessment_results ar JOIN sections s ON s.id=ar.section_id JOIN response_sessions rs ON rs.id=ar.session_id
      WHERE rs.survey_id=?${restriction} ORDER BY s.position`, values),
    qualityEnabled() ? storedQualities(surveyId, { summary, sessionIds }) : Promise.resolve({} as Record<string, any>),
  ]);
  const grouped = new Map<string, Map<string, any>>();
  const groupFor = (sessionId: string, row: any) => {
    let groups = grouped.get(sessionId);
    if (!groups) { groups = new Map(); grouped.set(sessionId, groups); }
    let group = groups.get(row.sectionId);
    if (!group) {
      group = { id: row.sectionId, code: row.code, title: row.title, position: row.position, result: null, answers: [] };
      groups.set(row.sectionId, group);
    }
    return group;
  };
  for (const row of scoreRows) groupFor(row.sessionId, row).result = {
    formulaVersion: row.formulaVersion, values: parseJson(row.result), interpretation: parseJson(row.interpretation) ?? null,
  };
  if (!summary && sessions.length) {
    const ids = sessions.map(row => row.id);
    const [[questionRows], [answerRows], [timings]] = await Promise.all([
      db.query<any[]>(`SELECT q.id questionId,q.code questionCode,q.text questionText,q.type,q.options,q.position questionPosition,
        s.id sectionId,s.code,s.title,s.position FROM questions q JOIN sections s ON s.id=q.section_id WHERE s.survey_id=? ORDER BY s.position,q.position`, [surveyId]),
      db.query<any[]>(`SELECT a.session_id sessionId,a.question_id questionId,a.value FROM answers a JOIN response_sessions rs ON rs.id=a.session_id WHERE rs.survey_id=? AND rs.id IN (${inList(ids)})`, [surveyId, ...ids]),
      db.query<any[]>(`SELECT t.session_id sessionId,t.question_id questionId,SUM(t.active_ms) activeMs,COUNT(*) visits FROM question_timings t JOIN response_sessions rs ON rs.id=t.session_id WHERE rs.survey_id=? AND rs.id IN (${inList(ids)}) GROUP BY t.session_id,t.question_id`, [surveyId, ...ids]),
    ]);
    const questions = new Map(questionRows.map(row => [row.questionId, { ...row, options: parseJson(row.options) ?? [] }]));
    const timingByAnswer = new Map(timings.map(row => [`${row.sessionId}:${row.questionId}`, row]));
    for (const answer of answerRows) {
      const question = questions.get(answer.questionId);
      if (!question) continue;
      const timing = timingByAnswer.get(`${answer.sessionId}:${answer.questionId}`), value = parseJson(answer.value);
      groupFor(answer.sessionId, question).answers.push({ questionId: question.questionId, code: question.questionCode,
        question: question.questionText, type: question.type, position: question.questionPosition, options: question.options,
        value, displayValue: displayValue(value, question.options), activeMs: timing ? Number(timing.activeMs) : null, visits: timing ? Number(timing.visits) : null });
    }
  }
  const respondents = sessions.map(({ aliasValue, ...session }) => ({ ...session,
    alias: String(parseJson(aliasValue) || 'Без псевдонима'),
    cohort: session.cohort ?? 'unassigned', calibrationTrusted: Boolean(session.calibrationTrusted),
    eligibility: session.eligibility ?? 'unknown', confirmedDuplicate: Boolean(session.confirmedDuplicate),
    groups: [...(grouped.get(session.id)?.values() ?? [])].sort((a, b) => a.position - b.position).map(group => ({ ...group, answers: group.answers.sort((a: any, b: any) => a.position - b.position) })),
    qualityV2: qualities[session.id] ?? null, detailsLoaded: !summary,
  }));
  const [distributionRows] = sessionIds ? [[]] : await db.query<any[]>(`SELECT q.code,q.text,q.options,a.value,COUNT(*) count
    FROM answers a JOIN questions q ON q.id=a.question_id JOIN response_sessions rs ON rs.id=a.session_id
    WHERE rs.survey_id=? AND rs.deleted_at IS NULL GROUP BY q.id,a.value ORDER BY q.position`, [surveyId]);
  const distribution = distributionRows.map(row => ({ code: row.code, text: row.text, value: parseJson(row.value),
    count: Number(row.count), label: displayValue(parseJson(row.value), parseJson(row.options) ?? []) }));
  return { sections, respondents: respondents.filter(p => !p.deletedAt), deletedRespondents: respondents.filter(p => p.deletedAt), distribution };
}

export async function loadQuestionTimingSummary(surveyId: string) {
  // Transfer one numeric value per answered question internally, not question text/options
  // and full responses; only the aggregate rows are sent to the browser.
  const [[questions], [measurements]] = await Promise.all([
    db.query<any[]>(`SELECT q.id,q.code,q.text question,s.id sectionId,s.title section FROM questions q JOIN sections s ON s.id=q.section_id WHERE s.survey_id=? ORDER BY s.position,q.position`, [surveyId]),
    db.query<any[]>(`SELECT t.question_id questionId,t.session_id,SUM(t.active_ms) activeMs FROM question_timings t
      JOIN response_sessions rs ON rs.id=t.session_id JOIN answers a ON a.session_id=t.session_id AND a.question_id=t.question_id
      WHERE rs.survey_id=? AND rs.deleted_at IS NULL AND rs.status='completed' GROUP BY t.question_id,t.session_id`, [surveyId]),
  ]);
  const timesByQuestion = new Map<string, number[]>();
  for (const row of measurements) {
    const times = timesByQuestion.get(row.questionId) ?? [];
    times.push(Number(row.activeMs)); timesByQuestion.set(row.questionId, times);
  }
  return questions.flatMap(question => {
    const times = timesByQuestion.get(question.id);
    if (!times?.length) return [];
    times.sort((a, b) => a - b); const middle = Math.floor(times.length / 2);
    return [{ key: `${question.sectionId}:${question.code}`, section: question.section, question: question.question,
      count: times.length, average: times.reduce((a, b) => a + b, 0) / times.length,
      median: times.length % 2 ? times[middle] : (times[middle - 1] + times[middle]) / 2 }];
  });
}
