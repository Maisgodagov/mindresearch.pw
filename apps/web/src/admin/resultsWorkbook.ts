export type ExportAnswer = {
  questionId?: string;
  code: string;
  question: string;
  displayValue: string;
  value?: unknown;
  type?: string;
};
type ExportGroup = {
  id?: string;
  code: string;
  title: string;
  result: { values: Record<string, unknown> } | null;
  answers: ExportAnswer[];
};
export type ResultsRespondent = {
  id: string;
  alias: string;
  age?: number | null;
  gender?: string | null;
  groups: ExportGroup[];
};
export type ExportSection = {
  id?: string; code: string; title: string; sectionKind: string;
  questions?: { questionId?: string; code: string; question: string }[];
};
const identityCodes = new Set(['alias', 'age', 'gender']);
export function exportableSections(sections: ExportSection[], questions: { sectionId?: string; sectionCode?: string; code: string; questionId?: string; text: string }[]): ExportSection[] {
  return sections.map(section => ({ ...section, questions: questions
    .filter(question => (section.id && question.sectionId ? question.sectionId === section.id : question.sectionCode === section.code) && (section.code !== 'respondent' || !identityCodes.has(question.code)))
    .map(question => ({ questionId: question.questionId, code: question.code, question: question.text }))
  })).filter(section => section.code !== 'respondent' || section.questions.length > 0);
}
export const sectionKey = (section: ExportSection) => section.id ?? section.code;
export type ExportScope = 'selected' | 'filtered' | 'all';
export type ExportSelection = { sectionKeys: string[]; scope: ExportScope };
type Highlight = { color: string; explanation: string };
type Metric = { key: string; label: string; value: number; highlight?: Highlight };
type Column = { key: string; label: string };
const record = (value: unknown): Record<string, unknown> | null => value !== null && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : null;
const numeric = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);

export const RESULT_COLORS = { low: 'FFDCEAF7', normal: 'FFE2EFDA', medium: 'FFFCE8CE', high: 'FFF8D9D7' } as const;

// Use saved interpretation, not a fraction of the scale maximum or this sample's mean.
function metricHighlight(data: Record<string, unknown>, value: number, referenceMean: unknown = data.referenceMean): Highlight | undefined {
  for (const classification of [data.level, data.category, data.levelLabel]) {
    if (typeof classification !== 'string') continue;
    const level = classification.trim().toLowerCase();
    const label = typeof data.levelLabel === 'string' ? data.levelLabel : classification;
    if (['low', 'very_low', 'below_average', 'below-average'].includes(level) || /^(низк|очень низк|ниже среднего)/u.test(level)) return { color: RESULT_COLORS.low, explanation: `Интерпретация методики: ${label}.` };
    if (['normal', 'norm', 'within_norm', 'within_normal_range'].includes(level) || /^(норма$|нормальн|в пределах нормы|в норме$)/u.test(level)) return { color: RESULT_COLORS.normal, explanation: `Интерпретация методики: ${label}.` };
    if (['high', 'very_high', 'above_average', 'above-average', 'elevated'].includes(level) || /^(высок|повышенн|выше среднего)/u.test(level)) return { color: RESULT_COLORS.high, explanation: `Интерпретация методики: ${label}.` };
    if (['medium', 'moderate', 'average'].includes(level) || /^(средн|умеренн)/u.test(level)) return { color: RESULT_COLORS.medium, explanation: `Интерпретация методики: ${label}.` };
  }
  if (data.elevated === true) return { color: RESULT_COLORS.high, explanation: numeric(referenceMean) ? `Выше нормативного ориентира методики: ${referenceMean}.` : 'Методика отмечает повышенное значение.' };
  if (numeric(referenceMean)) {
    if (value > referenceMean) return { color: RESULT_COLORS.high, explanation: `Выше среднего ориентира методики: ${referenceMean}.` };
    if (value === referenceMean) return { color: RESULT_COLORS.medium, explanation: `На уровне среднего ориентира методики: ${referenceMean}.` };
    return { color: RESULT_COLORS.low, explanation: `Ниже среднего ориентира методики: ${referenceMean}.` };
  }
}

/** Read saved scores, never question answers, thresholds or quality metadata. */
export function resultMetrics(values: Record<string, unknown>): Metric[] {
  if (values.complete === false) return [];
  const rows: Metric[] = [];
  const add = (raw: unknown, key: string, fallback: string) => {
    if (numeric(raw)) { rows.push({ key, label: fallback, value: raw }); return; }
    const data = record(raw);
    if (!data) return;
    const value = [data.score, data.average, data.sum, data.value].find(numeric);
    if (value !== undefined) {
      const highlight = metricHighlight(data, value);
      rows.push({ key, label: typeof data.label === 'string' ? data.label : fallback, value, ...(highlight ? { highlight } : {}) });
    }
  };
  add(values.overall, 'overall', 'Общий показатель');
  for (const container of ['scales', 'domains', 'facets']) {
    const collection = record(values[container]);
    if (collection) for (const [key, value] of Object.entries(collection)) add(value, `${container}.${key}`, key);
  }
  for (const [key, label] of [['score', 'Суммарный балл'], ['sum', 'Суммарный балл'], ['average', 'Средний балл']] as const) {
    if (numeric(values[key])) {
      const reference = record(values.reference);
      let highlight = values.instrument === 'SCCS' && numeric(values.average)
        ? metricHighlight(values, values.average, reference?.mean)
        : metricHighlight(values, values[key], key === 'average' ? reference?.mean ?? values.referenceMean : values.referenceMean);
      if (highlight && values.instrument === 'SCCS' && key !== 'average') highlight = { ...highlight, explanation: `Сравнение по среднему баллу (${values.average}). ${highlight.explanation}` };
      rows.push({ key, label, value: values[key], ...(highlight ? { highlight } : {}) });
    }
  }
  return rows;
}

const findGroup = (person: ResultsRespondent, section: ExportSection) => person.groups.find(group => section.id ? group.id === section.id : group.code === section.code);
const answerKey = (answer: { questionId?: string; code: string }) => answer.questionId ?? answer.code;

export async function createResultsWorkbook(
  people: ResultsRespondent[],
  sections: ExportSection[],
  options: { schemaPeople?: ResultsRespondent[]; respondentNumbers?: Record<string, number> } = {},
) {
  if (!people.length || !sections.length) throw new Error('Выберите участников и хотя бы один раздел опроса.');
  const { default: ExcelJS } = await import('exceljs');
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'mindresearch by Евгения Годагова';
  workbook.created = new Date();
  const sheet = workbook.addWorksheet('Результаты');
  const schemaPeople = [...(options.schemaPeople ?? []), ...people];
  const blocks = sections.map(section => {
    const groups = schemaPeople.flatMap(person => { const group = findGroup(person, section); return group ? [group] : []; });
    const scored = section.sectionKind === 'verified' || (section.sectionKind !== 'custom' && section.code.startsWith('test_')) || section.code.startsWith('custom_method_') || groups.some(group => group.result != null);
    const columns = new Map<string, Column>();
    if (!scored) for (const question of section.questions ?? []) columns.set(answerKey(question), { key: answerKey(question), label: question.question });
    for (const group of groups) {
      const answers = section.code === 'respondent' ? group.answers.filter(answer => !identityCodes.has(answer.code)) : group.answers;
      const rows = scored ? resultMetrics(group.result?.values ?? {}) : answers.map(answer => ({ key: answerKey(answer), label: answer.question }));
      for (const row of rows) if (!columns.has(row.key)) columns.set(row.key, { key: row.key, label: row.label });
    }
    if (!columns.size) columns.set('unavailable', { key: 'unavailable', label: scored ? 'Результат не рассчитан' : 'Нет ответов' });
    return { section, scored, columns: [...columns.values()] };
  });
  const columnCount = 4 + blocks.reduce((count, block) => count + block.columns.length, 0);
  if (columnCount > 16384 || people.length > 1048574) throw new Error('Превышен размер листа Excel. Выберите меньше разделов или участников.');
  sheet.addRow(['№', 'Имя / псевдоним', 'Возраст', 'Пол']);
  sheet.addRow([]);
  for (let column = 1; column <= 4; column++) sheet.mergeCells(1, column, 2, column);
  sheet.getCell('A1').note = 'Светло-синий — низкий уровень или ниже среднего; светло-зелёный — норма; светло-оранжевый — средний уровень; светло-красный — высокий уровень или значение выше ориентира методики. Подсветка применяется только при наличии такой интерпретации. Высокое значение не обязательно означает неблагоприятный результат. Основание подсветки указано в примечании к выделенной ячейке.';
  const boundaries: number[] = [];
  let column = 5;
  blocks.forEach((block, index) => {
    const start = column;
    sheet.getCell(1, start).value = block.section.title;
    if (block.columns.length > 1) sheet.mergeCells(1, start, 1, start + block.columns.length - 1);
    const fill = index % 2 ? 'FFF1F4ED' : 'FFE8EFE4';
    for (const metric of block.columns) {
      sheet.getCell(2, column).value = metric.label;
      for (const row of [1, 2]) sheet.getCell(row, column).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fill } };
      sheet.getColumn(column).width = block.scored ? 22 : 38;
      column++;
    }
    boundaries.push(start);
  });
  people.forEach((person, index) => {
    const highlights = new Map<number, Highlight>();
    const identity = person.groups.find(group => group.code === 'respondent');
    const demographic = (code: string) => identity?.answers.find(answer => answer.code === code);
    const rawAge = person.age ?? demographic('age')?.value ?? demographic('age')?.displayValue;
    const age = rawAge !== '' && rawAge != null && Number.isFinite(Number(rawAge)) ? Number(rawAge) : '';
    const row: (number | string)[] = [options.respondentNumbers?.[person.id] ?? index + 1, person.alias, age, person.gender ?? demographic('gender')?.displayValue ?? ''];
    for (const block of blocks) {
      const group = findGroup(person, block.section);
      const values = new Map<string, string | number>();
      const metricHighlights = new Map<string, Highlight>();
      if (group) {
        if (block.scored) for (const metric of resultMetrics(group.result?.values ?? {})) {
          values.set(metric.key, metric.value);
          if (metric.highlight) metricHighlights.set(metric.key, metric.highlight);
        }
        else for (const answer of group.answers) {
          const number = answer.type === 'number' && answer.value != null && String(answer.value).trim() !== '' ? Number(answer.value) : NaN;
          values.set(answerKey(answer), Number.isFinite(number) ? number : answer.displayValue);
        }
      }
      for (const metric of block.columns) {
        row.push(values.get(metric.key) ?? '');
        const highlight = metricHighlights.get(metric.key);
        if (highlight) highlights.set(row.length, highlight);
      }
    }
    const added = sheet.addRow(row);
    for (const [column, highlight] of highlights) {
      added.getCell(column).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: highlight.color } };
      added.getCell(column).note = highlight.explanation;
    }
  });
  sheet.views = [{ state: 'frozen', xSplit: 4, ySplit: 2 }];
  sheet.autoFilter = { from: { row: 2, column: 1 }, to: { row: people.length + 2, column: columnCount } };
  [8, 28, 12, 18].forEach((width, index) => { sheet.getColumn(index + 1).width = width; });
  sheet.getRow(1).height = 44;
  sheet.getRow(2).height = 56;
  sheet.eachRow((row, rowIndex) => {
    for (let col = 1; col <= columnCount; col++) {
      const cell = row.getCell(col);
      cell.font = { name: 'Calibri', size: 11, bold: rowIndex <= 2, color: { argb: 'FF304536' } };
      cell.alignment = { vertical: 'middle', wrapText: true, horizontal: col === 2 && rowIndex > 2 ? 'left' : 'center' };
      if (rowIndex <= 2 && col <= 4) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE6EBE3' } };
      cell.border = { bottom: { style: 'hair', color: { argb: 'FFDCE3D8' } }, ...(boundaries.includes(col) ? { left: { style: 'medium', color: { argb: 'FFA1B09B' } } } : {}) };
      if (rowIndex > 2 && col > 4 && typeof cell.value === 'number') cell.numFmt = '0.00';
    }
  });
  return workbook;
}
