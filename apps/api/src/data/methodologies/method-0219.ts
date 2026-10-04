import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Почти никогда' },
  { value: '2', label: 'Редко' },
  { value: '3', label: 'Сравнительно редко' },
  { value: '4', label: 'Сравнительно часто' },
  { value: '5', label: 'Часто' },
  { value: '6', label: 'Почти всегда' },
];

const items = [
  'Это занятие доставляет мне удовольствие.',
  'Я знаю, ради чего я это делаю.',
  'Делая это, я испытываю радость.',
  'Мне приходится постараться, чтобы сделать то, что нужно.',
  'Во время этого я не испытываю никаких чувств.',
  'Занимаясь этим, я прилагаю немало сил.',
  'Я наслаждаюсь этим занятием.',
  'Мне скучно этим заниматься.',
  'То, что я делаю, наполнено для меня смыслом.',
  'Я вкладываю в это много энергии.',
  'В это время я ощущаю пустоту.',
  'Это занятие связано с тем, что для меня важно.',
] as const;

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_251_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_251',
  title: 'Диагностика переживаний в деятельности (ДПД; обновлённый вариант)',
  description: 'Методика оценивает субъективные переживания в конкретной выполняемой деятельности по четырём аспектам: удовольствие, осмысленность, прилагаемое усилие и пустота. Она помогает автору опроса сопоставить качество переживания разных видов деятельности; опубликованные версии применялись в профессиональной и учебной деятельности, досуге и повседневных ситуациях.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 6,
  scales: [
    { key: 'pleasure', label: 'Удовольствие', items: [1, 3, 7], reverseItems: [], aggregation: 'sum' },
    { key: 'meaning', label: 'Смысл', items: [2, 9, 12], reverseItems: [], aggregation: 'sum' },
    { key: 'effort', label: 'Усилие', items: [4, 6, 10], reverseItems: [], aggregation: 'sum' },
    { key: 'void', label: 'Пустота', items: [5, 8, 11], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы «почти никогда»: минимальные суммы по четырём прямым шкалам',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { pleasure: 3, meaning: 3, effort: 3, void: 3 },
  },
  {
    title: 'Проверка ключа: единицы в удовольствии, смысле и усилии; максимум в пустоте',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), [5, 8, 11].includes(index + 1) ? 6 : 1])),
    expected: { pleasure: 3, meaning: 3, effort: 3, void: 18 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'dpd-leontiev-osin-2018-updated-12item-four-direct-sums-v1',
};
