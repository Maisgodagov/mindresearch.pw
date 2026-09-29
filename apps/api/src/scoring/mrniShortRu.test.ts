import { describe, expect, it } from 'vitest';
import { mrniShortRuInstrument, mrniShortRuScoring, mrniShortRuValidationCases } from '../data/mrniShortRu.js';
import { calculateConfigurableScores, checkConfigurableCases } from './configurable.js';
import type { ConfigurableQuestion } from './configurable.js';

describe('Russian short MRNI-R', () => {
  it('uses the published 21-item form and a single overall mean', () => {
    expect(mrniShortRuInstrument.questions).toHaveLength(21);
    expect(mrniShortRuScoring.scales).toEqual([{ key: 'traditionalIdeology', label: 'Поддержка традиционной маскулинной идеологии', items: Array.from({ length: 21 }, (_, index) => index + 1), reverseItems: [], aggregation: 'mean' }]);
  });

  it('matches minimum, maximum, and mixed control profiles', () => {
    expect(checkConfigurableCases({ questions: mrniShortRuInstrument.questions as ConfigurableQuestion[], scoring: mrniShortRuScoring, cases: mrniShortRuValidationCases }).passed).toBe(true);
    expect(mrniShortRuValidationCases.map(testCase => calculateConfigurableScores(mrniShortRuScoring, testCase.answers)?.traditionalIdeology)).toEqual([1, 7, 4]);
  });

  it('does not calculate an incomplete response set', () => {
    expect(calculateConfigurableScores(mrniShortRuScoring, { '1': 7 })).toBeNull();
  });
});
