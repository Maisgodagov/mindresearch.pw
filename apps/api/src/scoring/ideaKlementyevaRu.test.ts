import { describe, expect, it } from 'vitest';
import { calculateConfigurableScores, checkConfigurableCases } from './configurable.js';
import { ideaKlementyevaRuInstrument, ideaKlementyevaRuScoring, ideaKlementyevaRuValidationCases } from '../data/ideaKlementyevaRu.js';

describe('Klementyeva Russian IDEA-R, 31-item adaptation', () => {
  it('contains the published 31-item form and six disjoint scales', () => {
    expect(ideaKlementyevaRuInstrument.questions).toHaveLength(31);
    expect(ideaKlementyevaRuScoring.scales.map(scale => scale.items.length)).toEqual([10, 8, 4, 4, 2, 3]);
    expect(ideaKlementyevaRuScoring.scales.flatMap(scale => scale.items).sort((a, b) => a - b)).toEqual(Array.from({ length: 31 }, (_, index) => index + 1));
  });

  it('matches the six published sums and rejects a missing scored answer', () => {
    expect(checkConfigurableCases({
      questions: ideaKlementyevaRuInstrument.questions.map(question => ({ text: question.text, options: question.options ?? [] })),
      scoring: ideaKlementyevaRuScoring,
      cases: ideaKlementyevaRuValidationCases,
    })).toMatchObject({ passed: true });
    expect(calculateConfigurableScores(ideaKlementyevaRuScoring, { '7': 2 })).toBeNull();
  });
});
