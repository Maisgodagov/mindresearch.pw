import { describe, expect, it } from 'vitest';
import { munInstrument, munItems, munOptions } from '../data/mun.js';
import { MUN_NO_KEY, MUN_YES_KEY, scoreMun } from './mun.js';

const protocol = (valueFor: (item: number) => number) =>
  new Map(Array.from({ length: 20 }, (_, index) => [index + 1, valueFor(index + 1)]));
const yesKey = new Set<number>(MUN_YES_KEY);
const keyedProtocol = (matches: number) => {
  const answers = new Map<number, number>();
  let correct = 0;
  for (let item = 1; item <= 20; item += 1) {
    const keyedAnswer = yesKey.has(item) ? 1 : 0;
    const shouldMatch = correct < matches;
    answers.set(item, shouldMatch ? keyedAnswer : 1 - keyedAnswer);
    if (shouldMatch) correct += 1;
  }
  return answers;
};

describe('MUN (Rean, 2026 validated form)', () => {
  it('keeps the exact published item count, response options, and complete key', () => {
    expect(munInstrument.code).toBe('test_21');
    expect(munItems).toHaveLength(20);
    expect(munInstrument.questions).toHaveLength(20);
    expect(munOptions.map(({ value }) => value)).toEqual(['1', '0']);
    expect([...MUN_YES_KEY, ...MUN_NO_KEY].sort((a, b) => a - b)).toEqual(
      Array.from({ length: 20 }, (_, index) => index + 1),
    );
  });

  it('matches all-yes, all-no, and opposite-key control protocols', () => {
    expect(scoreMun(protocol(() => 1))?.overall.score).toBe(13);
    expect(scoreMun(protocol(() => 0))?.overall.score).toBe(7);
    expect(scoreMun(protocol((item) => yesKey.has(item) ? 1 : 0))?.overall.score).toBe(20);
    expect(scoreMun(protocol((item) => yesKey.has(item) ? 0 : 1))?.overall.score).toBe(0);
  });

  it('applies only the published classification ranges and leaves zero unclassified', () => {
    expect(scoreMun(keyedProtocol(1))?.overall.category).toBe('Мотивация боязни неудачи');
    expect(scoreMun(keyedProtocol(7))?.overall.category).toBe('Мотивация боязни неудачи');
    expect(scoreMun(keyedProtocol(8))?.overall.category).toBe('Мотивационный полюс ярко не выражен');
    expect(scoreMun(keyedProtocol(10))?.overall.category).toBe('Мотивационный полюс ярко не выражен');
    expect(scoreMun(keyedProtocol(12))?.overall.category).toBe('Мотивационный полюс ярко не выражен');
    expect(scoreMun(keyedProtocol(13))?.overall.category).toBe('Мотивационный полюс ярко не выражен');
    expect(scoreMun(keyedProtocol(14))?.overall.category).toBe('Мотивация на успех');
    expect(scoreMun(keyedProtocol(20))?.overall.category).toBe('Мотивация на успех');
    const zero = scoreMun(protocol((item) => yesKey.has(item) ? 0 : 1));
    expect(zero?.overall.score).toBe(0);
    expect(zero?.overall.category).toBeNull();
    expect(zero?.overall.interpretation).toBeNull();
  });

  it('rejects incomplete, invalid, out-of-range, and unexpected-item protocols', () => {
    const incomplete = protocol(() => 1);
    incomplete.delete(20);
    expect(scoreMun(incomplete)).toBeNull();
    expect(scoreMun(protocol((item) => item === 20 ? 2 : 1))).toBeNull();
    expect(scoreMun(protocol((item) => item === 20 ? 0.5 : 1))).toBeNull();
    const unexpected = protocol(() => 1);
    unexpected.set(21, 1);
    expect(scoreMun(unexpected)).toBeNull();
  });
});
