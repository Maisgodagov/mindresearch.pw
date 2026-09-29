import { describe, expect, it } from 'vitest';
import { bisBasRuInstrument, bisBasRuScoring, bisBasRuValidationCases } from '../data/bisBasRu.js';
import { calculateConfigurableScores, checkConfigurableCases } from './configurable.js';

describe('Russian Carver–White BIS/BAS', () => {
  it('uses the 14 items retained in the Russian validation and the four published factors', () => {
    expect(bisBasRuInstrument.questions).toHaveLength(14);
    expect(bisBasRuScoring.scales.map(scale => scale.items)).toEqual([[4, 8, 10, 12, 13, 14], [1, 5, 7], [2, 3, 11], [6, 9]]);
    expect(checkConfigurableCases({
      questions: bisBasRuInstrument.questions.map(question => ({ text: question.text, options: question.options ?? [] })),
      scoring: bisBasRuScoring,
      cases: bisBasRuValidationCases,
    })).toMatchObject({ passed: true });
  });

  it('reverses only the retained negatively keyed BIS item and requires a complete form', () => {
    expect(calculateConfigurableScores(bisBasRuScoring, Object.fromEntries(Array.from({ length: 14 }, (_, index) => [String(index + 1), 1]))))
      .toEqual({ bis: 9, drive: 3, reward_responsiveness: 3, fun_seeking: 2 });
    expect(calculateConfigurableScores(bisBasRuScoring, { '1': 4 })).toBeNull();
  });
});
