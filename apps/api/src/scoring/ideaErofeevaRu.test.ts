import { describe, expect, it } from 'vitest';
import { calculateConfigurableScores, checkConfigurableCases } from './configurable.js';
import { ideaErofeevaRuInstrument, ideaErofeevaRuScoring, ideaErofeevaRuValidationCases } from '../data/ideaErofeevaRu.js';

describe('Erofeeva Russian IDEA, 19-item adaptation', () => {
  it('contains the 19-item Russian form and disjoint five-factor key', () => {
    expect(ideaErofeevaRuInstrument.questions).toHaveLength(19);
    expect(ideaErofeevaRuScoring.scales.map(scale => scale.items.length)).toEqual([5, 4, 3, 3, 4]);
    expect(ideaErofeevaRuScoring.scales.flatMap(scale => scale.items).sort((a, b) => a - b)).toEqual(Array.from({ length: 19 }, (_, index) => index + 1));
  });

  it('matches the published sums and rejects a missing scored answer', () => {
    expect(checkConfigurableCases({
      questions: ideaErofeevaRuInstrument.questions.map(question => ({ text: question.text, options: question.options ?? [] })),
      scoring: ideaErofeevaRuScoring,
      cases: ideaErofeevaRuValidationCases,
    })).toMatchObject({ passed: true });
    expect(calculateConfigurableScores(ideaErofeevaRuScoring, { '9': 2 })).toBeNull();
  });
});
