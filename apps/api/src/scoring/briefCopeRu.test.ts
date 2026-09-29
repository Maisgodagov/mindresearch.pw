import { describe, expect, it } from 'vitest';
import { briefCopeRuInstrument, briefCopeRuItems, briefCopeRuOptions } from '../data/briefCopeRu.js';
import { BRIEF_COPE_RU_SCALE_ITEMS, scoreBriefCopeRu } from './briefCopeRu.js';

const protocol = (valueFor: (item: number) => number) =>
  new Map(briefCopeRuItems.map(({ number }) => [number, valueFor(number)]));

describe('Brief COPE Russian revised 24-item version', () => {
  it('matches the published retained item numbers and response scale', () => {
    expect(briefCopeRuInstrument.code).toBe('test_20');
    expect(briefCopeRuItems.map(({ number }) => number)).toEqual([
      1, 2, 3, 4, 6, 8, 9, 11, 12, 13, 14, 16, 17, 19, 21, 23, 24, 25, 26, 27, 28, 29, 30, 32,
    ]);
    expect(briefCopeRuInstrument.questions).toHaveLength(24);
    expect(briefCopeRuOptions.map(({ value }) => value)).toEqual(['1', '2', '3', '4']);
    expect(Object.values(BRIEF_COPE_RU_SCALE_ITEMS).flat()).toHaveLength(24);
  });

  it('calculates the six published subscales as direct-coded item means', () => {
    const result = scoreBriefCopeRu(protocol((item) => item % 4 + 1));
    expect(result?.complete).toBe(true);
    expect(result?.answered).toBe(24);
    expect(result?.scales).toMatchObject({
      socioEmotionalSupport: { score: 2.17, itemCount: 6 },
      religion: { score: 1.5, itemCount: 4 },
      acceptance: { score: 3.75, itemCount: 4 },
      problemFocusedCoping: { score: 1.75, itemCount: 4 },
      avoidance: { score: 3, itemCount: 4 },
      humor: { score: 1.5, itemCount: 2 },
    });
    expect(scoreBriefCopeRu(protocol(() => 1))?.scales.avoidance.score).toBe(1);
    expect(scoreBriefCopeRu(protocol(() => 4))?.scales.avoidance.score).toBe(4);
  });

  it('rejects incomplete, invalid, out-of-range, and unexpected-item protocols', () => {
    const answers = protocol(() => 2);
    answers.delete(11);
    expect(scoreBriefCopeRu(answers)).toBeNull();
    expect(scoreBriefCopeRu(protocol((item) => item === 11 ? 0 : 2))).toBeNull();
    expect(scoreBriefCopeRu(protocol((item) => item === 11 ? 5 : 2))).toBeNull();
    expect(scoreBriefCopeRu(protocol((item) => item === 11 ? 2.5 : 2))).toBeNull();
    const unexpected = protocol(() => 2);
    unexpected.set(5, 2);
    expect(scoreBriefCopeRu(unexpected)).toBeNull();
  });
});
