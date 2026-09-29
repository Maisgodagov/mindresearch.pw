import { describe, expect, it } from 'vitest';
import { caasRuInstrument, caasRuItems, caasRuOptions, caasRuScoring, caasRuValidationCases } from '../data/caasRu.js';
import { calculateConfigurableScores } from './configurable.js';

describe('Russian CAAS / SHKAS', () => {
  it('uses the published 24-item form and five-point scale', () => {
    expect(caasRuInstrument.code).toBe('test_23');
    expect(caasRuItems).toHaveLength(24);
    expect(caasRuInstrument.questions.map((question) => question.code)).toEqual(
      Array.from({ length: 24 }, (_, index) => `test_23_${index + 1}`),
    );
    expect(caasRuInstrument.questions.map((question) => question.text)).toEqual(caasRuItems);
    expect(caasRuOptions.map(({ value }) => value)).toEqual(['1', '2', '3', '4', '5']);
  });

  it('matches the published four six-item keys and overall sum in control protocols', () => {
    expect(caasRuScoring.scales.map(({ items }) => items)).toEqual([
      [1, 2, 3, 4, 5, 6],
      [7, 8, 9, 10, 11, 12],
      [13, 14, 15, 16, 17, 18],
      [19, 20, 21, 22, 23, 24],
      Array.from({ length: 24 }, (_, index) => index + 1),
    ]);
    for (const controlCase of caasRuValidationCases) {
      expect(calculateConfigurableScores(caasRuScoring, controlCase.answers)).toEqual(controlCase.expected);
    }
  });

  it('rejects incomplete and out-of-range response protocols', () => {
    expect(calculateConfigurableScores(caasRuScoring, { '1': 5, '2': 5 })).toBeNull();
    expect(calculateConfigurableScores(caasRuScoring, Object.fromEntries(
      Array.from({ length: 24 }, (_, index) => [String(index + 1), index === 0 ? 6 : 3]),
    ))).toBeNull();
  });
});
