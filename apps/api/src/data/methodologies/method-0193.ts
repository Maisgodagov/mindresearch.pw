import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const itemData = [
  'Боли в животе или желудке',
  'Головные боли',
  'Боли в нижней части спины',
  'Обморок или головокружение',
  'Боли в руках или ногах',
  'Учащенное сердцебиение',
  'Тошнота или расстройство желудка',
  'Слабость в некоторых частях тела',
] as const;

const options = [
  { value: '0', label: 'Совсем нет' },
  { value: '1', label: 'Редко' },
  { value: '2', label: 'Иногда' },
  { value: '3', label: 'Часто' },
  { value: '4', label: 'Очень часто' },
];

const questions: SeedSection['questions'] = itemData.map((text, index) => ({
  code: `test_225_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_225',
  title: 'Детский опросник соматических симптомов (CSSI-8, русскоязычная адаптация)',
  description: 'Краткая самоотчетная методика оценивает общую тяжесть соматических симптомов у детей и подростков за последние две недели. Охватывает симптомы со стороны желудочно-кишечной, опорно-двигательной и сердечно-сосудистой систем, головокружение и слабость. Русскоязычная версия исследована на детях и подростках 9–17 лет из учреждений для сирот и детей, оставшихся без попечения родителей; автору опроса она полезна для описания выраженности соматических жалоб, но сама по себе не устанавливает диагноз.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 4,
  scales: [
    { key: 'somatization', label: 'Общий показатель соматизации', items: Array.from({ length: 8 }, (_, index) => index + 1), reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы «Совсем нет»: нулевой суммарный показатель',
    answers: Object.fromEntries(itemData.map((_, index) => [String(index + 1), 0])),
    expected: { somatization: 0 },
  },
  {
    title: 'Все ответы «Очень часто»: максимальный суммарный показатель',
    answers: Object.fromEntries(itemData.map((_, index) => [String(index + 1), 4])),
    expected: { somatization: 32 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'cssi-8-ru-zolotareva-khegay-2024-sum-v1',
};
