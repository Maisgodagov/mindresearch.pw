import { describe, expect, it } from 'vitest';
import { cpmqRuInstrument, cpmqRuScoring, cpmqRuValidationCases } from '../data/cpmqRu.js';
import { calculateConfigurableScores, checkConfigurableCases } from './configurable.js';

describe('Russian CPM-Q', () => {
  it('contains the published 72 items and eight scales with nine keyed items each', () => {
    expect(cpmqRuInstrument.questions).toHaveLength(72);
    expect(cpmqRuScoring.scales).toHaveLength(8);
    expect(cpmqRuScoring.scales.map(scale => scale.items)).toEqual([
      [6, 14, 22, 30, 38, 46, 54, 62, 70],
      [1, 9, 17, 25, 33, 41, 49, 57, 65],
      [4, 12, 20, 28, 36, 44, 52, 60, 68],
      [7, 15, 23, 31, 39, 47, 55, 63, 71],
      [2, 10, 18, 26, 34, 42, 50, 58, 66],
      [5, 13, 21, 29, 37, 45, 53, 61, 69],
      [8, 16, 24, 32, 40, 48, 56, 64, 72],
      [3, 11, 19, 27, 35, 43, 51, 59, 67],
    ]);
    expect(checkConfigurableCases({
      questions: cpmqRuInstrument.questions.map(question => ({ text: question.text, options: question.options ?? [] })),
      scoring: cpmqRuScoring,
      cases: cpmqRuValidationCases,
    })).toMatchObject({ passed: true });
  });

  it('calculates published scale means without reversing items', () => {
    const answers = Object.fromEntries(Array.from({ length: 72 }, (_, index) => [String(index + 1), index % 5 + 1]));
    const result = calculateConfigurableScores(cpmqRuScoring, answers);
    expect(result).not.toBeNull();
    expect(result?.delta_plus).toBe(3);
    expect(result?.alpha_plus).toBe(3);
    expect(result?.gamma_plus).toBe(3.2222222222222223);
    expect(result?.beta_plus).toBe(2.888888888888889);
    expect(result?.delta_minus).toBe(2.888888888888889);
    expect(result?.alpha_minus).toBe(3.111111111111111);
    expect(result?.gamma_minus).toBe(2.7777777777777777);
    expect(result?.beta_minus).toBe(2.7777777777777777);
  });

  it('does not calculate an incomplete protocol', () => {
    expect(calculateConfigurableScores(cpmqRuScoring, { '1': 3 })).toBeNull();
  });
});
