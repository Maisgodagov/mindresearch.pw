import { describe, expect, it } from 'vitest';
import { scoreNmpqRu } from './nmpqRu.js';

describe('NMP-Q Russian adaptation scoring', () => {
  it('calculates four keyed subscales and total from the published Russian key', () => {
    const answers = new Map(Array.from({ length: 20 }, (_, index) => [index + 1, index % 5 + 1]));
    const result = scoreNmpqRu(answers)!;
    expect(result.scales.informationAccess.score).toBe(10);
    expect(result.scales.disconnectedOthers.score).toBe(15);
    expect(result.scales.disconnectedLovedOnes.score).toBe(20);
    expect(result.scales.missingNews.score).toBe(15);
    expect(result.scales.overall.score).toBe(60);
  });

  it('rejects missing, out-of-range, and non-integer answers', () => {
    expect(scoreNmpqRu(new Map())).toBeNull();
    const outOfRange = new Map(Array.from({ length: 20 }, (_, index) => [index + 1, 1]));
    outOfRange.set(20, 6);
    expect(scoreNmpqRu(outOfRange)).toBeNull();
    outOfRange.set(20, 2.5);
    expect(scoreNmpqRu(outOfRange)).toBeNull();
  });
});
