import { describe, expect, it } from 'vitest';
import { calculateConfigurableScores, checkConfigurableCases } from './configurable.js';
import { belongingExclusionRuInstrument, belongingExclusionRuScoring, belongingExclusionRuValidationCases } from '../data/belongingExclusionRu.js';

describe('Suvorova–Rakhanova–Korzun Belonging–Exclusion Scale', () => {
  it('uses the final 13-item, seven-point form with the published disjoint key', () => {
    expect(belongingExclusionRuInstrument.questions).toHaveLength(13);
    expect(belongingExclusionRuScoring.scales.map(scale => [scale.items.length, scale.reverseItems])).toEqual([
      [6, [1, 3, 5, 8, 10]],
      [3, [13]],
      [4, [4, 7, 11]],
    ]);
    expect(belongingExclusionRuScoring.scales.flatMap(scale => scale.items).sort((a, b) => a - b)).toEqual(Array.from({ length: 13 }, (_, index) => index + 1));
  });

  it('matches manual reverse-key calculations and rejects an incomplete protocol', () => {
    expect(checkConfigurableCases({
      questions: belongingExclusionRuInstrument.questions.map(question => ({ text: question.text, options: question.options ?? [] })),
      scoring: belongingExclusionRuScoring,
      cases: belongingExclusionRuValidationCases,
    })).toMatchObject({ passed: true });
    expect(calculateConfigurableScores(belongingExclusionRuScoring, { '1': 1 })).toBeNull();
  });
});
