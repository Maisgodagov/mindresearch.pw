import { describe, expect, it } from 'vitest';
import { createResultsWorkbook, resultMetrics, RESULT_COLORS, type ExportSection, type ResultsRespondent } from './resultsWorkbook';
import { scoreMspss } from '../../../api/src/scoring/mspss';
import { scoreDebq } from '../../../api/src/scoring/debq';

const section = (code: string, title: string, sectionKind = 'verified'): ExportSection => ({ id: code, code, title, sectionKind });
const group = (code: string, values: Record<string, unknown> | null, answers: ResultsRespondent['groups'][number]['answers'] = []) => ({ id: code, code, title: code, result: values ? { values } : null, answers });
const people: ResultsRespondent[] = [
  { id: 'a', alias: 'Анна', age: 28, gender: 'Женский', groups: [
    group('debq', { answered: 33, complete: true, scales: { restraint: { label: 'Ограничительное', average: 1.7, max: 5 }, emotional: { label: 'Эмоциогенное', average: 4, referenceMean: 2 }, external: { label: 'Экстернальное', average: 4 } } }, [{ code: 'q1', question: 'Скрытый вопрос методики', displayValue: 'Секретный ответ' }]),
    group('eat', { score: 18, max: 78, answered: 26 }),
    group('custom', null, [{ questionId: 'c1', code: 'q1', question: 'Город', displayValue: '=SUM(A1:A3)' }, { questionId: 'c2', code: 'q2', question: 'Количество', displayValue: '0', value: '0', type: 'number' }]),
  ] },
  { id: 'b', alias: 'Борис', age: 29, gender: 'Мужской', groups: [group('debq', null), group('eat', { score: 0 }), group('custom', null, [{ questionId: 'c2', code: 'q2', question: 'Количество', displayValue: '2', value: 2, type: 'number' }])] },
];

describe('Wide survey results workbook', () => {
  it('matches the Word layout, preserves numbers and separates selected method blocks', async () => {
    const workbook = await createResultsWorkbook(people, [section('debq', 'DEBQ'), section('eat', 'EAT-26')]);
    expect(workbook.worksheets.map(sheet => sheet.name)).toEqual(['Результаты']);
    const sheet = workbook.worksheets[0];
    expect(sheet.rowCount).toBe(4);
    expect(sheet.columnCount).toBe(8);
    expect(sheet.getRow(3).values).toEqual([undefined, 1, 'Анна', 28, 'Женский', 1.7, 4, 4, 18]);
    expect(sheet.getRow(4).values).toEqual([undefined, 2, 'Борис', 29, 'Мужской', '', '', '', 0]);
    expect(sheet.getCell('E1').value).toBe('DEBQ');
    expect(sheet.getCell('G1').master.address).toBe('E1');
    expect(sheet.getCell('H1').value).toBe('EAT-26');
    expect(sheet.getCell('E2').value).toBe('Ограничительное');
    expect(sheet.getCell('H3').border.left?.style).toBe('medium');
    expect(sheet.views[0]).toMatchObject({ xSplit: 4, ySplit: 2 });
    expect(JSON.stringify(sheet.model)).not.toContain('Секретный ответ');
    expect(JSON.stringify(sheet.model)).not.toContain('answered');
    const { default: ExcelJS } = await import('exceljs');
    const reopened = new ExcelJS.Workbook();
    await reopened.xlsx.load(await workbook.xlsx.writeBuffer());
    expect(reopened.worksheets[0].getCell('E3').value).toBe(1.7);
    expect(reopened.worksheets[0].getCell('H4').value).toBe(0);
  });

  it('exports only chosen methods and retains original respondent numbering', async () => {
    const workbook = await createResultsWorkbook([people[1]], [section('eat', 'EAT-26')], { respondentNumbers: { b: 7 } });
    const sheet = workbook.worksheets[0];
    expect(sheet.columnCount).toBe(5);
    expect(sheet.getRow(3).values).toEqual([undefined, 7, 'Борис', 29, 'Мужской', 0]);
    expect(JSON.stringify(sheet.model)).not.toContain('DEBQ');
  });

  it('keeps missing results blank using the complete population schema', async () => {
    const workbook = await createResultsWorkbook([people[1]], [section('debq', 'DEBQ')], { schemaPeople: people });
    expect(workbook.worksheets[0].getRow(3).values).toEqual([undefined, 1, 'Борис', 29, 'Мужской', '', '', '']);
    expect(workbook.worksheets[0].getCell('G2').value).toBe('Экстернальное');
  });

  it('includes unscored user tests without confusing identical question codes across blocks', async () => {
    const workbook = await createResultsWorkbook(people, [section('custom', 'Авторский тест', 'custom')]);
    const sheet = workbook.worksheets[0];
    expect(sheet.columnCount).toBe(6);
    expect(sheet.getCell('E2').value).toBe('Город');
    expect(sheet.getCell('E3').value).toBe('=SUM(A1:A3)');
    expect(sheet.getCell('E3').type).toBe(3); // An Excel string, never a formula.
    expect(sheet.getCell('F3').value).toBe(0);
    expect(sheet.getCell('E4').value).toBe('');
    expect(sheet.getCell('F4').value).toBe(2);
  });

  it('uses calculated scales for custom methodologies and supports domains and facets', async () => {
    const person: ResultsRespondent = { id: 'x', alias: 'Участник', groups: [group('custom_method_x', { scales: { a: { label: 'Шкала А', score: 4.25, min: 0, max: 10, aggregation: 'mean' } } }, [{ code: 'q1', question: 'Не экспортировать', displayValue: 'ответ' }]), group('bfi', { domains: { a: { label: 'Домен', average: 3.5 } }, facets: { a: { label: 'Аспект', average: 2.7 } } })] };
    const workbook = await createResultsWorkbook([person], [section('custom_method_x', 'Моя методика', 'custom'), section('bfi', 'BFI-2')]);
    expect(workbook.worksheets[0].getRow(3).values).toEqual([undefined, 1, 'Участник', '', '', 4.25, 3.5, 2.7]);
    expect(JSON.stringify(workbook.worksheets[0].model)).not.toContain('Не экспортировать');
  });

  it('distinguishes repeated methodology instances by section ID', async () => {
    const person: ResultsRespondent = { id: 'x', alias: 'Участник', groups: [{ ...group('first', { score: 5 }), code: 'test_1' }, { ...group('second', { score: 7 }), code: 'test_1' }] };
    const workbook = await createResultsWorkbook([person], [{ ...section('test_1', 'Первое измерение'), id: 'first' }, { ...section('test_1', 'Второе измерение'), id: 'second' }]);
    expect(workbook.worksheets[0].getRow(3).values).toEqual([undefined, 1, 'Участник', '', '', 5, 7]);
  });

  it('retains all custom question columns even when selected people have no answers', async () => {
    const workbook = await createResultsWorkbook([{ id: 'x', alias: 'Участник', groups: [] }], [{ ...section('custom', 'Мой тест', 'custom'), questions: [{ questionId: 'a', code: 'q1', question: 'Первый вопрос' }, { questionId: 'b', code: 'q2', question: 'Второй вопрос' }] }]);
    const sheet = workbook.worksheets[0];
    expect(sheet.columnCount).toBe(6);
    expect(sheet.getCell('F2').value).toBe('Второй вопрос');
    expect(sheet.getCell('F3').value).toBe('');
  });

  it('leaves an empty scored method blank and rejects an empty selection', async () => {
    const workbook = await createResultsWorkbook([people[0]], [section('missing', 'Ещё не пройдена')]);
    expect(workbook.worksheets[0].getCell('E3').value).toBe('');
    await expect(createResultsWorkbook([], [section('eat', 'EAT-26')])).rejects.toThrow();
    await expect(createResultsWorkbook(people, [])).rejects.toThrow();
  });

  it('reads only finite score fields, never score limits or processing metadata', () => {
    expect(resultMetrics({ answered: 12, min: 0, max: 50, score: 0, average: 2.5, reference: { mean: 10, sampleSize: 349 }, scales: { bad: { score: NaN } } })).toEqual([{ key: 'score', label: 'Суммарный балл', value: 0 }, { key: 'average', label: 'Средний балл', value: 2.5, highlight: { color: RESULT_COLORS.low, explanation: 'Ниже среднего ориентира методики: 10.' } }]);
    expect(resultMetrics({ complete: false, score: 18 })).toEqual([]);
  });

  it('colors real MSPSS levels, including the inclusive medium boundaries, and preserves them in XLSX', async () => {
    const sample = [2, 3, 5, 6].map((answer, index) => ({ id: String(index), alias: 'Участник', age: 28, groups: [group('test_1', scoreMspss(new Map(Array.from({ length: 12 }, (_, i) => [i + 1, answer]))) as unknown as Record<string, unknown>)] }));
    const workbook = await createResultsWorkbook(sample, [section('test_1', 'MSPSS')]);
    const sheet = workbook.worksheets[0];
    const color = (address: string) => { const fill = sheet.getCell(address).fill; return fill?.type === 'pattern' ? fill.fgColor?.argb : undefined; };
    expect(color('E3')).toBe(RESULT_COLORS.low);
    expect(color('E4')).toBe(RESULT_COLORS.medium);
    expect(color('E5')).toBe(RESULT_COLORS.medium);
    expect(color('E6')).toBe(RESULT_COLORS.high);
    expect(color('F6')).toBe(RESULT_COLORS.high);
    expect(color('C6')).toBeUndefined(); // Age is never classified by methodology thresholds.
    expect(sheet.getCell('E6').value).toBe(6);
    const { default: ExcelJS } = await import('exceljs');
    const reopened = new ExcelJS.Workbook();
    await reopened.xlsx.load(await workbook.xlsx.writeBuffer());
    expect(reopened.worksheets[0].getCell('E4').fill).toMatchObject({ type: 'pattern', fgColor: { argb: RESULT_COLORS.medium } });
    expect(reopened.worksheets[0].getCell('E6').fill).toMatchObject({ type: 'pattern', fgColor: { argb: RESULT_COLORS.high } });
    expect(JSON.stringify(reopened.worksheets[0].getCell('E6').note)).toContain('Высокая');
  });

  it('compares DEBQ with its own scale references, not a shared cutoff', async () => {
    const answers = new Map(Array.from({ length: 33 }, (_, i) => [i + 1, i < 4 ? 3 : 2]));
    const result = scoreDebq(answers)!;
    const workbook = await createResultsWorkbook([{ id: 'a', alias: 'Участник', groups: [group('test_6', result as unknown as Record<string, unknown>)] }], [section('test_6', 'DEBQ')]);
    const sheet = workbook.worksheets[0];
    expect(sheet.getCell('E3').value).toBe(2.4);
    expect(sheet.getCell('E3').fill).toMatchObject({ type: 'pattern', fgColor: { argb: RESULT_COLORS.medium } });
    expect(sheet.getCell('F3').value).toBe(2);
    expect(sheet.getCell('F3').fill).toMatchObject({ type: 'pattern', fgColor: { argb: RESULT_COLORS.high } });
    expect(sheet.getCell('G3').fill).toMatchObject({ type: 'pattern', fgColor: { argb: RESULT_COLORS.low } });
    expect(sheet.getCell('F3').note).toContain('1.8');
  });

  it('uses top-level average levels and compares SCCS totals through the correct mean-score scale', () => {
    expect(resultMetrics({ score: 20, level: 'average', levelLabel: 'Средняя самооценка' })[0].highlight?.color).toBe(RESULT_COLORS.medium);
    expect(resultMetrics({ score: 27, level: 'high' })[0].highlight?.color).toBe(RESULT_COLORS.high);
    const sccs = resultMetrics({ instrument: 'SCCS', average: 3.5, sum: 42, reference: { mean: 3.09 } });
    expect(sccs.every(metric => metric.highlight?.color === RESULT_COLORS.high)).toBe(true);
    expect(sccs.find(metric => metric.key === 'sum')?.highlight?.explanation).toContain('среднему баллу (3.5)');
  });

  it('distinguishes explicit normal classifications from average and preserves blue and green in XLSX', async () => {
    const labels = ['low', 'below_average', 'Ниже среднего', 'Низкий уровень', 'normal', 'Норма', 'В пределах нормы', 'Нормальный уровень', 'average'];
    const sample = labels.map((level, index) => ({ id: String(index), alias: 'Участник', groups: [group('test_1', { score: 2, level })] }));
    const workbook = await createResultsWorkbook(sample, [section('test_1', 'Методика')]);
    const { default: ExcelJS } = await import('exceljs');
    const reopened = new ExcelJS.Workbook();
    await reopened.xlsx.load(await workbook.xlsx.writeBuffer());
    labels.forEach((label, index) => {
      const cell = reopened.worksheets[0].getCell(index + 3, 5);
      expect(cell.value).toBe(2);
      expect(cell.fill).toMatchObject({ type: 'pattern', fgColor: { argb: index < 4 ? RESULT_COLORS.low : index < 8 ? RESULT_COLORS.normal : RESULT_COLORS.medium } });
      expect(JSON.stringify(cell.note)).toContain(label);
    });
    expect(resultMetrics({ score: 2, elevated: false })[0].highlight).toBeUndefined();
    expect(resultMetrics({ instrument: 'SCCS', average: 2, sum: 24, reference: { mean: 3.09 } }).every(metric => metric.highlight?.color === RESULT_COLORS.low)).toBe(true);
  });

  it('never invents norms from maxima, score names, averages or unrelated categories', async () => {
    expect(resultMetrics({ score: 99, max: 100, average: 4.9 }).every(metric => !metric.highlight)).toBe(true);
    expect(resultMetrics({ overall: { score: 20, category: 'Мотивация на успех' } })[0].highlight).toBeUndefined();
    expect(resultMetrics({ scales: { a: { label: 'Средний балл', average: 4.9, max: 5 } } })[0].highlight).toBeUndefined();
    const workbook = await createResultsWorkbook(people, [section('custom', 'Мой тест', 'custom'), section('missing', 'Нет результата')]);
    expect(workbook.worksheets[0].getCell('F3').fill).not.toMatchObject({ type: 'pattern', pattern: 'solid' });
    expect(workbook.worksheets[0].getCell('G3').fill).not.toMatchObject({ type: 'pattern', pattern: 'solid' });
  });
});
