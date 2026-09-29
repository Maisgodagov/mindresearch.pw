import { describe, expect, it } from 'vitest';
import {
  spsrqChildRuInstrument,
  spsrqChildRuScoring,
  spsrqChildRuValidationCases,
  spsrqJuniorRuInstrument,
  spsrqJuniorRuScoring,
  spsrqJuniorRuValidationCases,
} from '../data/spsrqRu.js';
import { calculateConfigurableScores, checkConfigurableCases } from './configurable.js';

describe('Russian SPSRQ adaptations', () => {
  it('keeps the validated adolescent self-report and child parent-report forms separate', () => {
    expect(spsrqJuniorRuInstrument.questions).toHaveLength(30);
    expect(spsrqChildRuInstrument.questions).toHaveLength(33);
    expect(spsrqJuniorRuInstrument.questions[0].options).toEqual([{ value: '0', label: 'Нет' }, { value: '1', label: 'Да' }]);
    expect(spsrqChildRuInstrument.questions[0].options).toHaveLength(5);
  });

  it('matches the published Junior-SPSRQ Russian key, including the 16/14 top-level split', () => {
    expect(spsrqJuniorRuScoring.scales.map(scale => scale.items)).toEqual([
      [2, 4, 5, 6, 8, 9, 12, 13, 14, 17, 18, 21, 23, 24, 27, 29],
      [2, 5, 8, 9, 17, 29],
      [4, 6, 12, 13, 14, 18, 21, 23, 24, 27],
      [1, 3, 7, 10, 11, 15, 16, 19, 20, 22, 25, 26, 28, 30],
      [7, 15, 16, 22, 30],
      [1, 3, 10, 11, 19, 20, 25, 26, 28],
    ]);
    expect(checkConfigurableCases({
      questions: spsrqJuniorRuInstrument.questions.map(question => ({ text: question.text, options: question.options ?? [] })),
      scoring: spsrqJuniorRuScoring,
      cases: spsrqJuniorRuValidationCases,
    })).toMatchObject({ passed: true });
  });

  it('matches the child parent-report two-scale key and uses sum scoring only', () => {
    expect(spsrqChildRuScoring.scales.map(scale => scale.items)).toEqual([
      [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30],
      [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31, 32, 33],
    ]);
    expect(checkConfigurableCases({
      questions: spsrqChildRuInstrument.questions.map(question => ({ text: question.text, options: question.options ?? [] })),
      scoring: spsrqChildRuScoring,
      cases: spsrqChildRuValidationCases,
    })).toMatchObject({ passed: true });
    expect(calculateConfigurableScores(spsrqChildRuScoring, { '1': 5 })).toBeNull();
  });
});
