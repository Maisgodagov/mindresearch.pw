import { describe, expect, it } from 'vitest';
import { bsmasRuInstrument, bsmasRuItems } from '../data/bsmasRu.js';
import { scoreBsmasRu } from './bsmasRu.js';

const protocol = (value: number) => new Map(Array.from({ length: 6 }, (_, index) => [index + 1, value]));

describe('Russian Bergen Social Media Addiction Scale', () => {
  it('has the six published Russian items and validated response range', () => {
    expect(bsmasRuInstrument.code).toBe('test_25');
    expect(bsmasRuItems).toHaveLength(6);
    expect(bsmasRuInstrument.questions.every((question) => question.options?.length === 5)).toBe(true);
  });
  it('sums all six items without adding unsupported cutoffs', () => {
    expect(scoreBsmasRu(protocol(1))?.scales.overall.score).toBe(6);
    expect(scoreBsmasRu(protocol(5))?.scales.overall.score).toBe(30);
    expect(scoreBsmasRu(new Map([[1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 1]]))?.scales.overall.score).toBe(16);
  });
  it('rejects incomplete and out-of-range protocols', () => {
    const incomplete = protocol(3); incomplete.delete(6);
    expect(scoreBsmasRu(incomplete)).toBeNull();
    expect(scoreBsmasRu(new Map([...protocol(3), [6, 6]]))).toBeNull();
  });
});
