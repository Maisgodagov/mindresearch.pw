import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const answerOptions = Array.from({ length: 8 }, (_, index) => ({
  value: String(index + 1),
  label: String(index + 1),
}));

const items = Array.from({ length: 60 }, (_, index) => {
  const series = ['A', 'B', 'C', 'D', 'E'][Math.floor(index / 12)];
  const number = (index % 12) + 1;
  return { series, number };
});

const questions: SeedSection['questions'] = items.map(({ series, number }, index) => ({
  code: `test_1481_${index + 1}`,
  text: `Задание ${series}${number}: выберите недостающий фрагмент матрицы.`,
  type: 'single',
  required: true,
  options: answerOptions,
}));

export const instrument: SeedSection = {
  code: 'test_1481',
  title: 'Прогрессивные матрицы Равена — стандартная классическая форма',
  description: 'Невербальная методика оценки общего интеллектуального развития и способности выявлять закономерности в зрительном материале. Пять серий матричных задач охватывают зрительный анализ и синтез, абстрактное рассуждение и установление отношений между фигурами. Классическая стандартная форма предназначена для детей 8–14 лет и взрослых 20–65 лет; результат полезен как количественная оценка выполнения и профиль по сериям.',
  questions,
};

const answerKey = [
  [4, 5, 1, 2, 6, 3, 6, 2, 1, 3, 5, 4],
  [2, 6, 1, 2, 1, 3, 5, 6, 4, 3, 4, 5],
  [8, 2, 3, 8, 7, 4, 5, 1, 7, 6, 1, 2],
  [3, 4, 3, 7, 8, 6, 5, 4, 1, 2, 5, 6],
  [7, 6, 8, 2, 1, 5, 1, 4, 5, 6, 3, 5],
];

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 8,
  scales: [
    ...['A', 'B', 'C', 'D', 'E'].map((series, seriesIndex) => ({
      key: series,
      label: `Серия ${series}`,
      items: Array.from({ length: 12 }, (_, itemIndex) => seriesIndex * 12 + itemIndex + 1),
      reverseItems: [],
      aggregation: 'sum' as const,
      weights: Object.fromEntries(Array.from({ length: 12 }, (_, itemIndex) => [itemIndex + 1, answerKey[seriesIndex][itemIndex]])),
    })),
    {
      key: 'total',
      label: 'Общая сумма правильных ответов',
      items: Array.from({ length: 60 }, (_, index) => index + 1),
      reverseItems: [],
      aggregation: 'sum',
      weights: Object.fromEntries(answerKey.flatMap((seriesAnswers, seriesIndex) => seriesAnswers.map((answer, itemIndex) => [seriesIndex * 12 + itemIndex + 1, answer]))),
    },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы совпадают с ключом: 60 правильных',
    answers: Object.fromEntries(answerKey.flatMap((seriesAnswers, seriesIndex) => seriesAnswers.map((answer, itemIndex) => [String(seriesIndex * 12 + itemIndex + 1), answer]))),
    expected: { A: 12, B: 12, C: 12, D: 12, E: 12, total: 60 },
  },
  {
    title: 'Первое задание серии A верно, остальные не совпадают',
    answers: Object.fromEntries(Array.from({ length: 60 }, (_, index) => [String(index + 1), index === 0 ? 4 : 1])),
    expected: { A: 1, B: 1, C: 1, D: 2, E: 2, total: 7 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'raven-spm-classic-ru-mukhordova-shreiber-2011-v1',
};
