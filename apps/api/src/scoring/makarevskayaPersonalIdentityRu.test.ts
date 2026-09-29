import { describe, expect, it } from 'vitest';
import { calculateConfigurableScores, checkConfigurableCases } from './configurable.js';
import { makarevskayaPersonalIdentityRuInstrument, makarevskayaPersonalIdentityRuScoring, makarevskayaPersonalIdentityRuValidationCases } from '../data/makarevskayaPersonalIdentityRu.js';

describe('Makarevskaya–Ryabikina Personal Identity Methodology', () => {
  it('uses the published 30-item, five-point form and scores only the explicit total index', () => {
    expect(makarevskayaPersonalIdentityRuInstrument.questions).toHaveLength(30);
    expect(makarevskayaPersonalIdentityRuScoring.scales).toEqual([
      { key: 'identityIndex', label: 'Общий индекс идентичности', items: Array.from({ length: 30 }, (_, index) => index + 1), reverseItems: [], aggregation: 'sum' },
    ]);
  });

  it('matches manual boundary and middle checks and rejects an incomplete protocol', () => {
    expect(checkConfigurableCases({
      questions: makarevskayaPersonalIdentityRuInstrument.questions.map(question => ({ text: question.text, options: question.options ?? [] })),
      scoring: makarevskayaPersonalIdentityRuScoring,
      cases: makarevskayaPersonalIdentityRuValidationCases,
    })).toMatchObject({ passed: true });
    expect(calculateConfigurableScores(makarevskayaPersonalIdentityRuScoring, { '1': 3 })).toBeNull();
  });
});
