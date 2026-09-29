import { describe, expect, it } from 'vitest';
import { genderDifferencesGurievaRuInstrument, genderDifferencesGurievaRuScoring, genderDifferencesGurievaRuValidationCases } from '../data/genderDifferencesGurievaRu.js';
import { calculateConfigurableScores, checkConfigurableCases } from './configurable.js';

describe('Gurieva Russian Gender Differences Questionnaire', () => {
  it('contains the published 28-item form with one shared five-point response scale', () => {
    expect(genderDifferencesGurievaRuInstrument.questions).toHaveLength(28);
    expect(genderDifferencesGurievaRuInstrument.questions.every(question => question.options?.length === 5)).toBe(true);
  });

  it('matches manual checks for the four scales with acceptable reliability', () => {
    expect(genderDifferencesGurievaRuScoring.scales.map(scale => scale.key)).toEqual([
      'work', 'politics', 'leisure', 'careerAdvancementInequality',
    ]);
    expect(checkConfigurableCases({
      questions: genderDifferencesGurievaRuInstrument.questions.map(question => ({ text: question.text, options: question.options ?? [] })),
      scoring: genderDifferencesGurievaRuScoring,
      cases: genderDifferencesGurievaRuValidationCases,
    }).passed).toBe(true);
  });

  it('rejects missing answers for any scored item', () => {
    expect(calculateConfigurableScores(genderDifferencesGurievaRuScoring, { '1': 3 })).toBeNull();
  });
});
