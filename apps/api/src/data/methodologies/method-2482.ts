import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Совсем не ощущаю / не чувствую / не переживаю / не думаю' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: 'Чрезвычайно сильно / в очень большой степени' },
];

const items = [
  'Насколько Вы ощущаете неопределенность?',
  'Насколько Вы чувствуете себя в зоне риска?',
  'Насколько Вы ощущаете угрозу?',
  'Насколько Вы переживаете по этому поводу?',
  'Насколько часто Вы думаете об этом?',
];

const endpointLabels = [
  ['Совсем не ощущаю', 'Ощущаю чрезвычайно сильную неопределенность'],
  ['Совсем не чувствую', 'Чувствую в очень большой степени'],
  ['Совсем не ощущаю', 'Ощущаю чрезвычайно сильную угрозу'],
  ['Совсем не переживаю', 'Переживаю в очень большой степени'],
  ['Совсем не думаю', 'Озабочен в очень большой степени'],
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2500_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: options.map((option, optionIndex) => ({
    ...option,
    label: optionIndex === 0 ? endpointLabels[index][0] : optionIndex === 4 ? endpointLabels[index][1] : option.label,
  })),
}));

export const instrument: SeedSection = {
  code: 'test_2500',
  title: 'Шкала финансовой угрозы (FTS), русская адаптация',
  description: 'Однофакторная шкала оценивает субъективное восприятие угрозы стабильности и безопасности личных финансов: неопределенность, ощущение риска и угрозы, беспокойство и когнитивную озабоченность текущей финансовой ситуацией. Русская адаптация Максименко и Лазарева проверена на российской взрослой выборке; полезна авторам опросов, изучающим финансовый стресс и его психологические связи.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'total', label: 'Финансовая угроза', items: [1, 2, 3, 4, 5], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: все минимальные ответы дают 5',
    answers: { '1': 1, '2': 1, '3': 1, '4': 1, '5': 1 },
    expected: { total: 5 },
  },
  {
    title: 'Ручная проверка: ответы из таблицы адаптации суммируются в 18,45',
    answers: { '1': 3.74, '2': 3.57, '3': 3.62, '4': 3.66, '5': 3.86 },
    expected: { total: 18.45 },
  },
];

export const methodology: MethodologyRegistration = {
  categoryIds: ["social-attitude"],
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'fts-marjanovic-maximenko-lazarev-2026-five-item-sum-v1',
};
