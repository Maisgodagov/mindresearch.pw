import { describe, expect, it } from 'vitest';
import { calculateConfigurableScores, checkConfigurableCases } from './configurable.js';
import { fourFactorSelfRuInstrument, fourFactorSelfRuScoring, fourFactorSelfRuValidationCases } from '../data/fourFactorSelfRu.js';

describe('Dorfman–Kalugin Four-Factor Self Questionnaire', () => {
  it('contains the final 37-item form and only scores the four published scales', () => {
    expect(fourFactorSelfRuInstrument.questions).toHaveLength(37);
    expect(fourFactorSelfRuScoring.scales.map(scale => scale.items.length)).toEqual([8, 8, 8, 7]);
    expect(fourFactorSelfRuScoring.scales.flatMap(scale => scale.items).sort((a, b) => a - b)).toEqual([
      4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 24, 25, 26, 27, 28, 29, 31, 32, 33, 35, 36, 37,
    ]);
  });

  it('matches minimum, maximum and mixed hand-calculated profiles and rejects incomplete protocols', () => {
    expect(checkConfigurableCases({
      questions: fourFactorSelfRuInstrument.questions.map(question => ({ text: question.text, options: question.options ?? [] })),
      scoring: fourFactorSelfRuScoring,
      cases: fourFactorSelfRuValidationCases,
    })).toMatchObject({ passed: true });
    expect(calculateConfigurableScores(fourFactorSelfRuScoring, { '5': 1 })).toBeNull();
  });
});
