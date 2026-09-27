import { describe, expect, it } from 'vitest';
import { scoreSham, SHAM_SCALES } from './sham.js';
import { shamInstrument } from '../data/sham.js';

const answers = (value: number) => new Map(Array.from({ length: 28 }, (_, index) => [index + 1, value]));

describe('scoreSham', () => {
  it('ships the complete questionnaire with the published response scale', () => {
    expect(shamInstrument.questions).toHaveLength(28);
    expect(shamInstrument.questions.map(question => question.code)).toEqual(Array.from({ length: 28 }, (_, index) => `test_7_${index + 1}`));
    expect(shamInstrument.questions.every(question => question.required && question.options?.map(option => option.value).join(',') === '1,2,3,4,5')).toBe(true);
  });
  it('uses the published seven-scale key', () => {
    expect(SHAM_SCALES).toEqual({
      cognitive: { label: 'Познавательная мотивация', items: [1, 8, 15, 22] },
      achievement: { label: 'Мотивация достижения', items: [2, 9, 16, 23] },
      selfDevelopment: { label: 'Мотивация саморазвития', items: [3, 10, 17, 24] },
      selfRespect: { label: 'Мотивация самоуважения', items: [4, 11, 18, 25] },
      introjected: { label: 'Интроецированная мотивация', items: [5, 12, 19, 26] },
      external: { label: 'Экстернальная мотивация', items: [6, 13, 20, 27] },
      amotivation: { label: 'Амотивация', items: [7, 14, 21, 28] },
    });
  });

  it('returns 4 for every scale when all answers are 1', () => {
    const result = scoreSham(answers(1));
    expect(Object.values(result!.scales).map(scale => scale.score)).toEqual([4, 4, 4, 4, 4, 4, 4]);
  });

  it('returns 20 for every scale when all answers are 5', () => {
    const result = scoreSham(answers(5));
    expect(Object.values(result!.scales).map(scale => scale.score)).toEqual([20, 20, 20, 20, 20, 20, 20]);
  });

  it('keeps the seven item groups independent', () => {
    const values = answers(1);
    SHAM_SCALES.cognitive.items.forEach(item => values.set(item, 5));
    const result = scoreSham(values)!;
    expect(result.scales.cognitive.score).toBe(20);
    expect(Object.values(result.scales).filter(scale => scale.label !== 'Познавательная мотивация').every(scale => scale.score === 4)).toBe(true);
  });

  it('does not calculate an incomplete or invalid protocol', () => {
    const incomplete = answers(3);
    incomplete.delete(28);
    expect(scoreSham(incomplete)).toBeNull();
    const invalid = answers(3);
    invalid.set(28, 6);
    expect(scoreSham(invalid)).toBeNull();
    const wrongKeys = answers(3);
    wrongKeys.delete(1);
    wrongKeys.set(29, 3);
    expect(scoreSham(wrongKeys)).toBeNull();
  });
});
