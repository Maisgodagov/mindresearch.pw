import { describe, expect, it } from 'vitest';
import { calculateConfigurableScores } from './configurable.js';
import { paqShortRuInstrument, paqShortRuScoring, paqShortRuValidationCases } from '../data/paqShortRu.js';

describe('Russian PAQ-S', () => {
  it('uses the published six-item Russian form and seven-point response scale', () => {
    expect(paqShortRuInstrument.questions).toHaveLength(6);
    expect(paqShortRuInstrument.questions.map(question => question.code)).toEqual(Array.from({ length: 6 }, (_, index) => `test_22_${index + 1}`));
    expect(paqShortRuInstrument.questions.every(question => question.options?.map(option => option.value).join(',') === '1,2,3,4,5,6,7')).toBe(true);
  });

  it('matches published score range and sums all six items without reverse coding', () => {
    const cases = paqShortRuValidationCases;
    expect(calculateConfigurableScores(paqShortRuScoring, cases[0].answers)).toEqual({ total: 6 });
    expect(calculateConfigurableScores(paqShortRuScoring, cases[1].answers)).toEqual({ total: 42 });
    expect(calculateConfigurableScores(paqShortRuScoring, cases[2].answers)).toEqual({ total: 21 });
  });

  it('does not calculate a score for an incomplete protocol', () => {
    expect(calculateConfigurableScores(paqShortRuScoring, { '1': 7, '2': 7, '3': 7, '4': 7, '5': 7 })).toBeNull();
  });
});
