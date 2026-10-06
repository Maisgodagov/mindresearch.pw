import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Совсем нет' },
  { value: '2', label: 'Немного' },
  { value: '3', label: 'Более-менее' },
  { value: '4', label: 'Вполне' },
  { value: '5', label: 'Абсолютно' },
];

const items = [
  'Я уверен в своих способностях.',
  'Я волнуюсь о том, как меня воспринимают: как успешного человека или как неудачника.',
  'Я удовлетворен тем, как выглядит мое тело в данный момент.',
  'Я разочарован собственным поведением.',
  'Я чувствую, что с трудом понимаю то, что читаю.',
  'Я чувствую, что другие уважают меня и восхищаются мной.',
  'Я недоволен своим весом.',
  'Я застенчив.',
  'Я чувствую себя таким же умным, как и остальные.',
  'Я недоволен собой.',
  'Я нравлюсь себе.',
  'Я доволен своим внешним видом на данный момент.',
  'Я обеспокоен тем, что обо мне думают другие люди.',
  'Я уверен, что всё понимаю.',
  'Я чувствую себя хуже остальных на данный момент.',
  'Я чувствую себя непривлекательным.',
  'Я озабочен тем, какое произвожу впечатление.',
  'Я чувствую себя менее способным к обучению, чем остальные, на данный момент.',
  'Я чувствую, что не преуспеваю.',
  'Я беспокоюсь, что глупо выгляжу.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2407_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2407',
  title: 'Шкала ситуативной самооценки (SSES)',
  description: 'Шкала оценивает самооценку как текущее состояние, отдельно охватывая уверенность в действиях и достижениях, социальное восприятие себя и отношение к внешности. Подходит для оценки моментальных изменений у взрослых и подростков старшего возраста; это не мера устойчивой глобальной самооценки.',
  categoryIds: ['self-esteem'],
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'performance', label: 'Самооценка действий и достижений', items: [1, 4, 5, 9, 14, 18, 19], reverseItems: [4, 5, 18, 19], aggregation: 'sum' },
    { key: 'social', label: 'Социальная самооценка', items: [2, 8, 10, 13, 15, 17, 20], reverseItems: [2, 8, 10, 13, 15, 17, 20], aggregation: 'sum' },
    { key: 'appearance', label: 'Самооценка внешности', items: [3, 6, 7, 11, 12, 16], reverseItems: [7, 16], aggregation: 'sum' },
    { key: 'total', label: 'Общая ситуативная самооценка', items: Array.from({ length: 20 }, (_, index) => index + 1), reverseItems: [2, 4, 5, 7, 8, 10, 13, 15, 16, 17, 18, 19, 20], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: все ответы 1; обратные пункты преобразуются в 5',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { performance: 11, social: 35, appearance: 24, total: 63 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'heatherton-polivy-sses-ru-2014-v1',
};
