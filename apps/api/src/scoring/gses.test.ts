import { describe, expect, it } from 'vitest';
import { gsesInstrument, gsesItems, gsesOptions } from '../data/gses.js';
import { scoreGses } from './gses.js';

describe('GSES Russian adaptation', () => {
  it('uses the published 10-item Russian form and four response options', () => {
    expect(gsesInstrument.code).toBe('test_19');
    expect(gsesInstrument.questions).toHaveLength(10);
    expect(gsesInstrument.questions.map((question) => question.text)).toEqual(gsesItems);
    expect(gsesOptions.map((option) => option.label)).toEqual([
      'Абсолютно неверно',
      'Едва ли это верно',
      'Скорее всего верно',
      'Совершенно верно',
    ]);
  });

  it('sums all ten direct-coded answers without reverse scoring', () => {
    expect(scoreGses(new Map(Array.from({ length: 10 }, (_, index) => [index + 1, 1]))))
      .toMatchObject({ score: 10, average: 1, min: 1, max: 4 });
    expect(scoreGses(new Map(Array.from({ length: 10 }, (_, index) => [index + 1, 4]))))
      .toMatchObject({ score: 40, average: 4 });
    expect(scoreGses(new Map(Array.from({ length: 10 }, (_, index) => [index + 1, index % 4 + 1]))))
      .toMatchObject({ score: 23, average: 2.3 });
  });

  it('does not calculate incomplete, invalid, or out-of-range protocols', () => {
    expect(scoreGses(new Map([[1, 4]]))).toBeNull();
    expect(scoreGses(new Map(Array.from({ length: 10 }, (_, index) => [index + 1, index === 4 ? 0 : 3])))).toBeNull();
    expect(scoreGses(new Map(Array.from({ length: 10 }, (_, index) => [index + 1, index === 4 ? 5 : 3])))).toBeNull();
    expect(scoreGses(new Map([...Array.from({ length: 9 }, (_, index) => [index + 1, 3] as const), [11, 3]]))).toBeNull();
  });
});
