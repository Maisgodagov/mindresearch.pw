import { describe, expect, it } from 'vitest';
import { smdsRuInstrument, smdsRuItems } from '../data/smdsRu.js';
import { scoreSmdsRu } from './smdsRu.js';

const protocol = (value: number) => new Map(Array.from({ length: 9 }, (_, index) => [index + 1, value]));

describe('Russian Social Media Disorder Scale', () => {
  it('has nine binary items and the Russian instrument code', () => {
    expect(smdsRuInstrument.code).toBe('test_26');
    expect(smdsRuItems).toHaveLength(9);
    expect(smdsRuInstrument.questions.every((question) => question.options?.map(({ value }) => value).join(',') === '1,0')).toBe(true);
  });
  it('counts affirmative answers and applies only the published screening threshold', () => {
    expect(scoreSmdsRu(protocol(0))?.scales.overall.score).toBe(0);
    expect(scoreSmdsRu(protocol(1))?.scales.overall.score).toBe(9);
    expect(scoreSmdsRu(new Map([[1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 0], [7, 0], [8, 0], [9, 0]]))?.screeningNote).toContain('не является диагнозом');
  });
  it('rejects incomplete or non-binary protocols', () => {
    const incomplete = protocol(0); incomplete.delete(9);
    expect(scoreSmdsRu(incomplete)).toBeNull();
    expect(scoreSmdsRu(new Map([...protocol(0), [9, 2]]))).toBeNull();
  });
});
