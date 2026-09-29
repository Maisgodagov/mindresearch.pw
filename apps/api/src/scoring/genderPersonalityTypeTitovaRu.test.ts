import { describe, expect, it } from 'vitest';
import { genderPersonalityTypeTitovaRuInstrument, genderPersonalityTypeTitovaRuScoring, genderPersonalityTypeTitovaRuValidationCases } from '../data/genderPersonalityTypeTitovaRu.js';
import { calculateConfigurableScores, checkConfigurableCases } from './configurable.js';

describe('Titova Russian Gender Personality Type Questionnaire', () => {
  it('contains the published 10-item form and five response choices', () => {
    expect(genderPersonalityTypeTitovaRuInstrument.questions).toHaveLength(10);
    expect(genderPersonalityTypeTitovaRuInstrument.questions.every(question => question.options?.length === 5)).toBe(true);
  });

  it('matches manual controls for reverse-keyed sums and weighted raw indices', () => {
    expect(checkConfigurableCases({
      questions: genderPersonalityTypeTitovaRuInstrument.questions.map(question => ({ text: question.text, options: question.options ?? [] })),
      scoring: genderPersonalityTypeTitovaRuScoring,
      cases: genderPersonalityTypeTitovaRuValidationCases,
    }).passed).toBe(true);

    expect(calculateConfigurableScores(genderPersonalityTypeTitovaRuScoring, genderPersonalityTypeTitovaRuValidationCases[2].answers)).toEqual({
      familyRoles: 12,
      emotions: 9,
      womenInPolitics: 9,
      normativeExpectations: 6,
      genderSimilarityIndex: -4,
      womenSocialStatusIndex: 2,
    });
  });

  it('rejects an incomplete response set', () => {
    expect(calculateConfigurableScores(genderPersonalityTypeTitovaRuScoring, { '1': 3 })).toBeNull();
  });
});
