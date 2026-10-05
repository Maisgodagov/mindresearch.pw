import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Полностью не согласен' },
  { value: '2', label: 'Умеренно не согласен' },
  { value: '3', label: 'Слегка не согласен' },
  { value: '4', label: 'Нейтрально / не знаю' },
  { value: '5', label: 'Слегка согласен' },
  { value: '6', label: 'Умеренно согласен' },
  { value: '7', label: 'Полностью согласен' },
];

const items = [
  'Собеседник давал мне понять, что я говорю понятно и разговор продуктивен.',
  'Мы ни к чему не пришли, ничего не достигли в разговоре.',
  'Я бы хотел(а) пообщаться так еще раз.',
  'Собеседник искренне хотел узнать меня лучше.',
  'Я очень недоволен/недовольна этим разговором.',
  'Во время разговора я чувствовал(а), что мне удавалось управлять впечатлением о себе.',
  'Я остался/осталась очень доволен/довольна разговором.',
  'Собеседник проявил большой интерес к тому, о чем я говорил(а).',
  'Я НЕ получил(а) удовольствие от этого разговора.',
  'Собеседник ничем не подкреплял свои слова и мнение.',
  'Я чувствовал(а), что могу говорить с этим человеком о чем угодно.',
  'Мы смогли все обсудить, каждый сказал все, что хотел.',
  'Я чувствовал(а), что мы легко можем посмеяться над чем-то вместе.',
  'Разговор шел гладко.',
  'Слова собеседника часто не добавляли к разговору ничего нового, лишь незначительные детали.',
  'Мы говорили о том, что меня НЕ интересовало.',
];

const reverseItems = [2, 5, 9, 10, 15, 16];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1302_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1302',
  title: 'Опросник удовлетворенности межличностным общением',
  description: 'Методика оценивает субъективную удовлетворенность конкретным разговором, включая впечатления о действиях собеседника и собственные эмоциональные переживания. Подходит для оценки состоявшегося взаимодействия у взрослых участников; представлена русскоязычная адаптация Анисимовой и Марарицы.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'satisfaction', label: 'Удовлетворенность межличностным общением', items: Array.from({ length: 16 }, (_, index) => index + 1), reverseItems, aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы нейтральные: сумма 64',
    answers: Object.fromEntries(Array.from({ length: 16 }, (_, index) => [String(index + 1), 4])),
    expected: { satisfaction: 64 },
  },
  {
    title: 'Максимум по прямым и минимум по реверсивным пунктам: сумма 112',
    answers: Object.fromEntries(Array.from({ length: 16 }, (_, index) => [String(index + 1), reverseItems.includes(index + 1) ? 1 : 7])),
    expected: { satisfaction: 112 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'icsi-anisimova-mararitsa-2024-16-item-v1',
};
