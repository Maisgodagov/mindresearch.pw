import { describe, expect, it } from 'vitest';
import { isriRuInstrument, isriRuScoring, isriRuValidationCases } from '../data/isriRu.js';
import { aiqIvRuInstrument, aiqIvRuScoring, aiqIvRuValidationCases } from '../data/aiqIvRu.js';
import { didsRuInstrument, didsScoring, didsValidationCases, riscRuInstrument, riscScoring, riscValidationCases, scsRuInstrument, selfConstrualScoring, selfConstrualValidationCases } from '../data/selfConstrualRu.js';
import { calculateConfigurableScores, checkConfigurableCases } from './configurable.js';

describe('Russian Self-Construal questionnaires', () => {
  it('keeps the 24-item SCS adaptation separate and scores two direct 12-item means', () => {
    expect(scsRuInstrument.questions).toHaveLength(24);
    expect(scsRuInstrument.questions.every(question => question.options?.length === 7)).toBe(true);
    expect(selfConstrualScoring.scales.map(scale => scale.items)).toEqual([
      Array.from({ length: 12 }, (_, i) => i + 1),
      Array.from({ length: 12 }, (_, i) => i + 13),
    ]);
    expect(selfConstrualScoring.scales.every(scale => scale.reverseItems.length === 0 && scale.aggregation === 'mean')).toBe(true);
    expect(checkConfigurableCases({
      questions: scsRuInstrument.questions.map(question => ({ text: question.text, options: question.options ?? [] })),
      scoring: selfConstrualScoring,
      cases: selfConstrualValidationCases,
    })).toMatchObject({ passed: true });
    expect(calculateConfigurableScores(selfConstrualScoring, { '1': 1 })).toBeNull();
  });

  it('scores Russian RISC with only items 8 and 9 reversed', () => {
    expect(riscRuInstrument.questions).toHaveLength(11);
    expect(riscScoring.scales[0].reverseItems).toEqual([8, 9]);
    expect(checkConfigurableCases({
      questions: riscRuInstrument.questions.map(question => ({ text: question.text, options: question.options ?? [] })),
      scoring: riscScoring,
      cases: riscValidationCases,
    })).toMatchObject({ passed: true });
    expect(calculateConfigurableScores(riscScoring, Object.fromEntries(Array.from({ length: 11 }, (_, i) => [String(i + 1), 4])))).toEqual({ relational: 4 });
    expect(calculateConfigurableScores(riscScoring, { '1': 4 })).toBeNull();
  });

  it('scores the five Russian DIDS dimensions as separate five-item means', () => {
    expect(didsRuInstrument.questions).toHaveLength(25);
    expect(didsRuInstrument.questions.every(question => question.options?.length === 5)).toBe(true);
    expect(didsScoring.scales.map(scale => scale.items)).toEqual([
      [1, 2, 3, 4, 5], [6, 7, 8, 9, 10], [11, 12, 13, 14, 15], [16, 17, 18, 19, 20], [21, 22, 23, 24, 25],
    ]);
    expect(didsScoring.scales.every(scale => scale.reverseItems.length === 0 && scale.aggregation === 'mean')).toBe(true);
    expect(checkConfigurableCases({
      questions: didsRuInstrument.questions.map(question => ({ text: question.text, options: question.options ?? [] })),
      scoring: didsScoring,
      cases: didsValidationCases,
    })).toMatchObject({ passed: true });
    expect(calculateConfigurableScores(didsScoring, { '1': 1 })).toBeNull();
  });

  it('scores the Russian six-item ISRI with the adaptation-specific 0–4 anchors', () => {
    expect(isriRuInstrument.questions).toHaveLength(6);
    expect(isriRuInstrument.questions.every(question => question.options?.length === 5)).toBe(true);
    expect(isriRuInstrument.questions[0].options?.map(option => option.value)).toEqual(['0', '1', '2', '3', '4']);
    expect(isriRuScoring.scales).toEqual([{ key: 'identityResolution', label: 'Суммарный показатель идентичности', items: [1, 2, 3, 4, 5, 6], reverseItems: [], aggregation: 'sum' }]);
    expect(checkConfigurableCases({
      questions: isriRuInstrument.questions.map(question => ({ text: question.text, options: question.options ?? [] })),
      scoring: isriRuScoring,
      cases: isriRuValidationCases,
    })).toMatchObject({ passed: true });
    expect(calculateConfigurableScores(isriRuScoring, { '1': 4 })).toBeNull();
    expect(calculateConfigurableScores(isriRuScoring, { '1': 5, '2': 1, '3': 1, '4': 1, '5': 1, '6': 1 })).toBeNull();
  });

  it('scores the Russian 35-item AIQ-IV only on its four documented orientations', () => {
    expect(aiqIvRuInstrument.questions).toHaveLength(35);
    expect(aiqIvRuInstrument.questions.every(question => question.options?.map(option => option.value).join(',') === '1,2,3,4,5')).toBe(true);
    expect(aiqIvRuScoring.scales.map(scale => [scale.key, scale.items.length, scale.aggregation])).toEqual([
      ['personal', 10, 'sum'], ['relational', 10, 'sum'], ['public', 7, 'sum'], ['collective', 8, 'sum'],
    ]);
    expect(aiqIvRuScoring.scales.flatMap(scale => scale.items).sort((a, b) => a - b)).toEqual(Array.from({ length: 35 }, (_, index) => index + 1));
    expect(checkConfigurableCases({
      questions: aiqIvRuInstrument.questions.map(question => ({ text: question.text, options: question.options ?? [] })),
      scoring: aiqIvRuScoring,
      cases: aiqIvRuValidationCases,
    })).toMatchObject({ passed: true });
    expect(calculateConfigurableScores(aiqIvRuScoring, { '1': 3 })).toBeNull();
  });
});
