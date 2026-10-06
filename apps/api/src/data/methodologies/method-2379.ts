import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const answers = Array.from({ length: 9 }, (_, index) => ({ value: String(index + 1), label: String(index + 1) }));

const items = [
  'Я способен сохранять комфортное состояние настолько, насколько возможно во время выполнения движений.',
  'Я способен сохранять ум сфокусированным на движениях моего тела.',
  'Я могу координировать движения тела вместе с дыханием.',
  'Я способен двигаться плавно.',
  'Я способен поддерживать чувство устойчивости в теле.',
  'Я способен сохранять дыхание плавным и длинным.',
  'Во время работы с дыханием я могу сохранять спокойствие.',
  'Я способен концентрироваться на дыхании.',
  'Я способен делать дыхание более длинным и глубоким без чувства беспокойства.',
  'Если я отвлекся, я могу снова сконцентрироваться.',
  'При необходимости я способен представлять объект или воспроизводить ощущения от него в уме.',
  'Я способен сохранять концентрацию на медитативных объектах или точках.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2397_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: answers,
}));

export const instrument: SeedSection = {
  code: 'test_2397',
  title: 'Шкала самоэффективности занятий йогой (YSES), русскоязычная адаптация',
  description: 'Методика измеряет уверенность практикующего в способности эффективно заниматься йогой и охватывает работу с телом, дыханием и умом (концентрацию в медитативной практике). Русскоязычная адаптация проверена на взрослых практикующих йогу; подходит для исследовательской оценки общей самоэффективности и трёх её аспектов.',
  categoryIds: ['sport'],
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 9,
  scales: [
    { key: 'total', label: 'Общая самоэффективность занятий йогой', items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], reverseItems: [], aggregation: 'sum' },
    { key: 'body', label: 'Работа с телом', items: [1, 2, 3, 4, 5], reverseItems: [], aggregation: 'sum' },
    { key: 'breath', label: 'Работа с дыханием', items: [6, 7, 8, 9], reverseItems: [], aggregation: 'sum' },
    { key: 'mind', label: 'Работа с умом', items: [10, 11, 12], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы 1: минимум по всем шкалам',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { total: 12, body: 5, breath: 4, mind: 3 },
  },
  {
    title: 'Все ответы 9: максимум по всем шкалам',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 9])),
    expected: { total: 108, body: 45, breath: 36, mind: 27 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'yses-ru-kulizhnikov-zolotareva-2026-sum-v1',
};
