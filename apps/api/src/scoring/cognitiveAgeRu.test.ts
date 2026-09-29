import { describe, expect, it } from 'vitest';
import { calculateConfigurableScores, checkConfigurableCases } from './configurable.js';
import { cognitiveAgeRuInstrument, cognitiveAgeRuScoring, cognitiveAgeRuValidationCases } from '../data/cognitiveAgeRu.js';

describe('Barak–Sergienko Cognitive Age Scale', () => {
  it('contains exactly four integer-age numeric prompts and a four-item mean', () => {
    expect(cognitiveAgeRuInstrument.questions).toHaveLength(4);
    expect(cognitiveAgeRuInstrument.questions.every(question => question.type === 'number')).toBe(true);
    expect(cognitiveAgeRuScoring.scales.find(scale => scale.key === 'cognitiveAge')?.items).toEqual([1, 2, 3, 4]);
  });

  it('reproduces component ages and the arithmetic mean; rejects incomplete responses', () => {
    expect(checkConfigurableCases({
      questions: cognitiveAgeRuInstrument.questions.map(question => ({ text: question.text, options: question.options ?? [] })),
      scoring: cognitiveAgeRuScoring,
      cases: cognitiveAgeRuValidationCases,
    })).toMatchObject({ passed: true });
    expect(calculateConfigurableScores(cognitiveAgeRuScoring, { '1': 40, '2': 30 })).toBeNull();
    expect(calculateConfigurableScores(cognitiveAgeRuScoring, { '1': 20, '2': 30, '3': 40, '4': 50 })?.cognitiveAge).toBe(35);
  });
});
