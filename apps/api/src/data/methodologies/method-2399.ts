import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'Совсем нет' },
  { value: '1', label: 'Не очень часто' },
  { value: '2', label: 'Периодически' },
  { value: '3', label: 'Довольно часто' },
  { value: '4', label: 'Очень часто' },
];

const items = [
  'Проблемы с желудочно-кишечным трактом',
  'Боль в спине',
  'Боль в руках, ногах или суставах',
  'Головная боль',
  'Боль в груди или одышка',
  'Головокружение',
  'Чувство усталости или недостаток энергии',
  'Проблемы со сном',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2417_${index + 1}`,
  text: `${index === 0 ? 'Насколько часто проблема беспокоила вас в течение прошедшей недели? ' : ''}${text}`,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2417',
  title: 'Шкала соматических симптомов (SSS-8), русская версия',
  description: 'Краткая русская версия SSS-8 оценивает субъективную нагрузку восьми распространённых соматических симптомов за последнюю неделю: желудочно-кишечные проблемы, боль, кардиореспираторные жалобы, головокружение, усталость и нарушения сна. Единый суммарный показатель полезен для скринингового описания выраженности соматических жалоб и наблюдения за их изменением у взрослых; он не устанавливает причину симптомов и не является диагнозом.',
  categoryIds: ['clinical-somatic'],
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 4,
  scales: [
    { key: 'total', label: 'Общая нагрузка соматических симптомов', items: [1, 2, 3, 4, 5, 6, 7, 8], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: все ответы «Совсем нет» дают нулевой балл',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 0])),
    expected: { total: 0 },
  },
  {
    title: 'Ручная проверка: ответы 0–4 по порядку суммируются в 16',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), index % 5])),
    expected: { total: 16 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['clinical-somatic'],
  scoringConfig,
  validationCases,
  formulaVersion: 'sss-8-zolotareva-ru-2022-gierk-2014-v1',
};
