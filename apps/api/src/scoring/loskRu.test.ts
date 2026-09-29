import { describe, expect, it } from 'vitest';
import { calculateConfigurableScores, checkConfigurableCases } from './configurable.js';
import { loskRuInstrument, loskRuScoring, loskRuValidationCases } from '../data/loskRu.js';

describe('Russian Kozlov Personal Self-Identity Questionnaire (LOSK)', () => {
  it('uses the 60-item five-point form and three disjoint 20-item scales', () => {
    expect(loskRuInstrument.questions).toHaveLength(60);
    expect(loskRuInstrument.questions.every(question => question.options?.map(option => option.value).join(',') === '1,2,3,4,5')).toBe(true);
    expect(loskRuScoring.scales.map(scale => [scale.key, scale.items.length, scale.aggregation, scale.reverseItems])).toEqual([
      ['materialSelf', 20, 'sum', []],
      ['socialSelf', 20, 'sum', []],
      ['spiritualSelf', 20, 'sum', []],
    ]);
    const keyedItems = loskRuScoring.scales.flatMap(scale => scale.items).sort((a, b) => a - b);
    expect(keyedItems).toEqual(Array.from({ length: 60 }, (_, index) => index + 1));
  });

  it('matches minimum, maximum and mixed-profile manual control calculations', () => {
    expect(checkConfigurableCases({
      questions: loskRuInstrument.questions.map(question => ({ text: question.text, options: question.options ?? [] })),
      scoring: loskRuScoring,
      cases: loskRuValidationCases,
    })).toMatchObject({ passed: true });
    expect(calculateConfigurableScores(loskRuScoring, { '1': 3 })).toBeNull();
  });
});
