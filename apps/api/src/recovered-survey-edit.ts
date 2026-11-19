import type { PoolConnection } from 'mysql2/promise';
import { applyInstrumentForm } from './data/instrumentForms.js';

// Explicit exceptions for the two recovered surveys; never supplied by the client.
export const canEditRecoveredSurvey = (id: string) => [
  '6b64468e-d38e-471b-ab1a-a51e6a491a80',
  '9c9a8e58-d204-49bb-a5a0-29a8e8f6abc0',
].includes(id);

const conflict = () => Object.assign(new Error('После прохождений нельзя добавлять, удалять или перемещать блоки и вопросы.'), { status: 409 });

export function assertRecoveredStructure(stored: any[], incoming: any[]) {
  if (stored.length !== incoming.length) throw conflict();
  stored.forEach((section, index) => {
    const next = incoming[index];
    if (next.id !== section.id || (section.instrumentId ? next.kind !== 'library' || next.instrumentId !== section.instrumentId : next.kind !== 'custom')) throw conflict();
    if (!section.instrumentId && (section.questions.length !== next.questions.length || section.questions.some((q: any, i: number) => q.id !== next.questions[i].id))) throw conflict();
  });
}

export async function updateRecoveredSurvey(connection: PoolConnection, surveyId: string, incoming: any[]) {
  if (!canEditRecoveredSurvey(surveyId)) throw conflict();
  const [sections] = await connection.query<any[]>('SELECT id,code,source_instrument_id instrumentId FROM sections WHERE survey_id=? AND code<>\'respondent\' ORDER BY position', [surveyId]);
  for (const section of sections) {
    const [questions] = await connection.query<any[]>('SELECT id,code FROM questions WHERE section_id=? ORDER BY position', [section.id]);
    section.questions = questions;
  }
  assertRecoveredStructure(sections, incoming);
  for (const [index, section] of sections.entries()) {
    const next = incoming[index];
    if (section.instrumentId) {
      const [base] = await connection.query<any[]>('SELECT code,text,options,validation FROM instrument_questions WHERE instrument_id=? ORDER BY position', [section.instrumentId]);
      if (base.length !== section.questions.length || base.some((q, i) => q.code !== section.questions[i].code)) throw conflict();
      const parse = (x: any) => typeof x === 'string' ? JSON.parse(x) : x;
      const forms = applyInstrumentForm(section.code, base.map(q => ({ ...q, options: parse(q.options) ?? [], validation: parse(q.validation) })), next.formGender, next.formFallback);
      for (const [i, q] of forms.entries()) await connection.execute('UPDATE questions SET text=?,options=?,validation=? WHERE id=? AND section_id=?', [q.text, JSON.stringify(q.options), JSON.stringify(q.validation ?? null), section.questions[i].id, section.id]);
    } else {
      await connection.execute('UPDATE sections SET title=?,description=? WHERE id=? AND survey_id=?', [next.title, next.description, section.id, surveyId]);
      for (const q of next.questions) await connection.execute('UPDATE questions SET text=?,type=?,required=?,options=?,validation=? WHERE id=? AND section_id=?', [q.text, q.type, q.required, JSON.stringify(q.options ?? []), JSON.stringify(q.validation ?? null), q.id, section.id]);
    }
  }
}
