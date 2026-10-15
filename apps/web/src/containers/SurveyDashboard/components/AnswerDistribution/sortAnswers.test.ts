import { describe, expect, it } from 'vitest';
import { sortNumericAnswers } from './sortAnswers';
const rows = (...labels: string[]) => labels.map((answer, i) => ({answer, count: i + 1}));
describe('numeric answer distribution', () => {
  it('sorts numbers rather than strings and preserves counts', () => {
    const original = rows('38', '1000', '2', '25');
    expect(sortNumericAnswers(original)).toEqual([original[2], original[3], original[0], original[1]]);
    expect(original.map(x => x.answer)).toEqual(['38', '1000', '2', '25']);
  });
  it('supports negative and decimal values', () => {
    expect(sortNumericAnswers(rows('2,5', '-10', '0', '2.05')).map(x => x.answer)).toEqual(['-10', '0', '2.05', '2,5']);
  });
  it('preserves categorical and mixed labels', () => {
    for (const labels of [['Да', 'Нет'], ['10', 'Не знаю'], ['', '2'], ['18–25', '26–35']]) {
      const data = rows(...labels); expect(sortNumericAnswers(data)).toBe(data);
    }
  });
  it('handles empty results and stable equal values', () => {
    expect(sortNumericAnswers([])).toEqual([]);
    const data = rows('2', '02', '1'); expect(sortNumericAnswers(data)).toEqual([data[2], data[0], data[1]]);
  });
});
