import { describe, expect, it } from 'vitest';
import { iafRuInstrument, iafRuItems } from '../data/iafRu.js';
import { IAF_RU_SCALES, scoreIafRu } from './iafRu.js';

const protocol = (valueFor: (item: number) => number) =>
  new Map(iafRuItems.map((_, index) => [index + 1, valueFor(index + 1)]));

describe('Russian Index of Autonomous Functioning', () => {
  it('matches the published Russian 15-item form and three subscales', () => {
    expect(iafRuInstrument.code).toBe('test_24');
    expect(iafRuItems).toHaveLength(15);
    expect(Object.values(IAF_RU_SCALES).flatMap(({ items }) => items).sort((a, b) => a - b))
      .toEqual(Array.from({ length: 15 }, (_, index) => index + 1));
  });

  it('calculates direct means for the three documented subscales without inventing a total index', () => {
    const result = scoreIafRu(protocol((item) => item % 5 + 1));
    expect(result?.scales).toMatchObject({
      authorship: { score: 2.6, itemCount: 5 },
      interest: { score: 3.4, itemCount: 5 },
      control: { score: 3, itemCount: 5 },
    });
    expect(result).not.toHaveProperty('overall');
    expect(scoreIafRu(protocol(() => 1))?.scales.authorship.score).toBe(1);
    expect(scoreIafRu(protocol(() => 5))?.scales.authorship.score).toBe(5);
  });

  it('rejects incomplete or invalid response protocols', () => {
    const incomplete = protocol(() => 3);
    incomplete.delete(10);
    expect(scoreIafRu(incomplete)).toBeNull();
    expect(scoreIafRu(protocol((item) => item === 1 ? 0 : 3))).toBeNull();
    expect(scoreIafRu(protocol((item) => item === 1 ? 6 : 3))).toBeNull();
    expect(scoreIafRu(protocol((item) => item === 1 ? 2.5 : 3))).toBeNull();
  });
});
