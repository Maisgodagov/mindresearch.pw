import { describe, expect, it } from 'vitest';
import { lopukhovaGenderTypeRuInstrument, lopukhovaGenderTypeRuScoring, lopukhovaGenderTypeRuValidationCases } from '../data/lopukhovaGenderTypeRu.js';
import { calculateConfigurableScores, checkConfigurableCases } from './configurable.js';
import type { ConfigurableQuestion } from './configurable.js';

describe('Lopukhova Russian gender-type method', () => {
  it('has 27 items and three disjoint nine-item keys', () => {
    expect(lopukhovaGenderTypeRuInstrument.questions).toHaveLength(27);
    const groups = lopukhovaGenderTypeRuScoring.scales.map(scale => scale.items);
    expect(groups.map(items => items.length)).toEqual([9, 9, 9]);
    expect(new Set(groups.flat()).size).toBe(27);
  });

  it('matches the published minimum, maximum, and neutral-midpoint controls', () => {
    expect(checkConfigurableCases({ questions: lopukhovaGenderTypeRuInstrument.questions as ConfigurableQuestion[], scoring: lopukhovaGenderTypeRuScoring, cases: lopukhovaGenderTypeRuValidationCases }).passed).toBe(true);
    expect(lopukhovaGenderTypeRuValidationCases.map(testCase => calculateConfigurableScores(lopukhovaGenderTypeRuScoring, testCase.answers))).toEqual([
      { masculinity: 9, femininity: 9, buffer: 9 },
      { masculinity: 45, femininity: 45, buffer: 45 },
      { masculinity: 27, femininity: 27, buffer: 27 },
    ]);
  });

  it('rejects an incomplete protocol', () => {
    expect(calculateConfigurableScores(lopukhovaGenderTypeRuScoring, { '1': 3 })).toBeNull();
  });
});
