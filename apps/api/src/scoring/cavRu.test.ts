import { describe, expect, it } from 'vitest';
import { cavRuInstrument, cavRuItems } from '../data/cavRu.js';
import { scoreCavRu } from './cavRu.js';

describe('Russian CAV scoring', () => {
  it('uses the published 12 + 12 factor assignment and frequency range', () => {
    expect(cavRuInstrument.code).toBe('test_29');
    expect(cavRuItems).toHaveLength(24);
    const answers = new Map(Array.from({ length: 24 }, (_, index) => [index + 1, index < 12 ? 2 : 3]));
    const result = scoreCavRu(answers)!;
    expect(result.scales.cyberAggression.score).toBe(24);
    expect(result.scales.cyberVictimization.score).toBe(36);
  });

  it('rejects missing and invalid responses', () => {
    expect(scoreCavRu(new Map())).toBeNull();
    const answers = new Map(Array.from({ length: 24 }, (_, index) => [index + 1, 0]));
    answers.set(24, 5);
    expect(scoreCavRu(answers)).toBeNull();
  });
});
