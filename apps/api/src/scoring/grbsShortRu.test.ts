import { describe, expect, it } from 'vitest';
import { grbsShortRuInstrument, grbsShortRuScoring, grbsShortRuValidationCases } from '../data/grbsShortRu.js';
import { calculateConfigurableScores, checkConfigurableCases } from './configurable.js';
import type { ConfigurableQuestion } from './configurable.js';

describe('Russian short Gender Role Beliefs Scale', () => {
  it('keeps the published 10-item form, response range, and single reverse item', () => {
    expect(grbsShortRuInstrument.questions).toHaveLength(10);
    expect(grbsShortRuScoring).toMatchObject({ min: 1, max: 7, scales: [{ items: [1,2,3,4,5,6,7,8,9,10], reverseItems: [3], aggregation: 'sum' }] });
  });

  it('matches minimum, maximum, and mixed published-rule control calculations', () => {
    expect(checkConfigurableCases({ questions: grbsShortRuInstrument.questions as ConfigurableQuestion[], scoring: grbsShortRuScoring, cases: grbsShortRuValidationCases }).passed).toBe(true);
    expect(grbsShortRuValidationCases.map(testCase => calculateConfigurableScores(grbsShortRuScoring, testCase.answers)?.total)).toEqual([10, 70, 36]);
  });

  it('does not calculate an incomplete protocol', () => {
    expect(calculateConfigurableScores(grbsShortRuScoring, { '1': 4, '3': 4 })).toBeNull();
  });
});
