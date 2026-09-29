import { describe, expect, it } from 'vitest';
import { igds9RuInstrument, igds9RuItems } from '../data/igds9Ru.js';
import { scoreIgds9Ru } from './igds9Ru.js';

describe('Russian IGDS9-SF scoring', () => {
  it('sums the nine 1–5 responses and reports the published five-of-nine indicator', () => {
    expect(igds9RuInstrument.code).toBe('test_30');
    expect(igds9RuItems).toHaveLength(9);
    const answers = new Map(Array.from({ length: 9 }, (_, index) => [index + 1, index < 5 ? 5 : 2]));
    const result = scoreIgds9Ru(answers)!;
    expect(result.scales.overall).toMatchObject({ score: 33, min: 9, max: 45, itemCount: 9 });
    expect(result.screening).toMatchObject({ frequentResponseCount: 5, fiveOfNineCriterion: true });
  });

  it('rejects missing and out-of-range answers', () => {
    expect(scoreIgds9Ru(new Map())).toBeNull();
    const answers = new Map(Array.from({ length: 9 }, (_, index) => [index + 1, 2]));
    answers.set(9, 0);
    expect(scoreIgds9Ru(answers)).toBeNull();
  });
});
