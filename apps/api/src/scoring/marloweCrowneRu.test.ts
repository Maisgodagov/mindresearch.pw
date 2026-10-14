import { describe, expect, it } from 'vitest';
import { instrument, methodology, scoringConfig } from '../data/methodologies/method-1363.js';
import { calculateConfigurableScores, checkConfigurableCases, validateConfigurableMethodology } from './configurable.js';

// Independently transcribed from the Russian 20-item key, not from itemScores.
const yesKey = new Set([1, 2, 3, 4, 5, 8, 11, 14, 15, 16, 20]);
const all = (value: string) => Object.fromEntries(Array.from({ length: 20 }, (_, i) => [String(i + 1), value]));
const keyed = (match: boolean) => Object.fromEntries(Array.from({ length: 20 }, (_, i) => [String(i + 1), yesKey.has(i + 1) === match ? 'yes' : 'no']));

describe('Marlowe–Crowne, Hanin Russian 20-item version', () => {
  it.each([['yes', 11], ['no', 9]])('scores all %s answers as %i', (answer, expected) => {
    expect(calculateConfigurableScores(scoringConfig, all(answer))).toEqual({ approval_motivation: expected });
  });

  it('scores all keyed answers as 20 and all opposite answers as zero', () => {
    expect(calculateConfigurableScores(scoringConfig, keyed(true))).toEqual({ approval_motivation: 20 });
    expect(calculateConfigurableScores(scoringConfig, keyed(false))).toEqual({ approval_motivation: 0 });
  });

  it('awards exactly one point for each individual keyed answer', () => {
    for (let item = 1; item <= 20; item++) {
      const answers = keyed(false);
      answers[String(item)] = yesKey.has(item) ? 'yes' : 'no';
      expect(calculateConfigurableScores(scoringConfig, answers)).toEqual({ approval_motivation: 1 });
    }
  });

  it('requires all 20 valid yes/no answers', () => {
    const answers = all('yes');
    delete answers['20'];
    expect(calculateConfigurableScores(scoringConfig, answers)).toBeNull();
    expect(calculateConfigurableScores(scoringConfig, { ...all('yes'), '5': 'maybe' })).toBeNull();
    expect(calculateConfigurableScores(scoringConfig, { ...all('yes'), '5': null })).toBeNull();
  });

  it('retains the published survey question codes and stored answer values', () => {
    expect(instrument.code).toBe('test_1391');
    expect(instrument.questions.map(q => q.code)).toEqual(Array.from({ length: 20 }, (_, i) => `test_1391_${i + 1}`));
    expect(instrument.questions.every(q => q.options?.map(o => o.value).join(',') === 'yes,no')).toBe(true);
  });

  it('passes the catalog control examples and answer boundary checks', () => {
    expect(checkConfigurableCases({ questions: instrument.questions.map(q => ({ text: q.text, options: q.options! })), scoring: scoringConfig, cases: methodology.validationCases! }).passed).toBe(true);
  });
  it('provides a complete catalog description, sources and valid scoring configuration', () => {
    const details = methodology.details!;
    expect(validateConfigurableMethodology({ methodology: { ...details, author: details.author!, title: instrument.title }, questions: instrument.questions.map(q => ({ text: q.text, options: q.options! })), scoring: scoringConfig, cases: methodology.validationCases! })).toEqual([]);
    expect(details.summary).toContain('социальной желательности');
    expect(details.sources.length).toBeGreaterThanOrEqual(3);
  });
});
