import { describe, expect, it } from 'vitest';
import { fomosRuInstrument, fomosRuItems } from '../data/fomosRu.js';
import { FOMOS_RU_SCALES, scoreFomosRu } from './fomosRu.js';

const protocol = (valueFor: (item: number) => number) => new Map(Array.from({ length: 6 }, (_, index) => [index + 1, valueFor(index + 1)]));

describe('Russian FoMO Scale', () => {
  it('matches the six-item Russian adaptation and two distinct subscales', () => {
    expect(fomosRuInstrument.code).toBe('test_27');
    expect(fomosRuItems).toHaveLength(6);
    expect(Object.values(FOMOS_RU_SCALES).flatMap(({ items }) => items).sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(fomosRuInstrument.questions.every((question) => question.options?.length === 5)).toBe(true);
  });
  it('calculates the documented 3-item factor sums and the six-item total', () => {
    const result = scoreFomosRu(protocol((item) => item <= 3 ? item : item - 2));
    expect(result?.scales).toMatchObject({
      missedPleasure: { score: 6, average: 2, itemCount: 3 },
      missedSocial: { score: 9, average: 3, itemCount: 3 },
      overall: { score: 15, average: 2.5, itemCount: 6 },
    });
    expect(scoreFomosRu(protocol(() => 1))?.scales.overall.score).toBe(6);
    expect(scoreFomosRu(protocol(() => 5))?.scales.overall.score).toBe(30);
  });
  it('rejects incomplete and invalid response protocols', () => {
    const incomplete = protocol(() => 3); incomplete.delete(2);
    expect(scoreFomosRu(incomplete)).toBeNull();
    expect(scoreFomosRu(protocol((item) => item === 1 ? 0 : 3))).toBeNull();
    expect(scoreFomosRu(protocol((item) => item === 1 ? 6 : 3))).toBeNull();
  });
});
