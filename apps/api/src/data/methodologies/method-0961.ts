import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const answerLabels = [
  'Совершенно не подходит',
  'Не подходит',
  'Скорее не подходит',
  'Нейтрально',
  'Скорее подходит',
  'Подходит',
  'Полностью подходит',
];

const answers = answerLabels.map((label, index) => ({ value: String(index + 1), label }));

const items = [
  'Способен из уже имеющегося сделать что-то необычное',
  'Умеет продуктивно применять знания',
  'Задается целью не выучить («вызубрить»), а прежде всего понять',
  'Свободен от стереотипов, открыт',
  'Обладает способностью к импровизации',
  'Тяготеет к искусству (например, музыке)',
  'Умеет быть непохожим на других людей',
  'Обладает хорошим воображением',
  'Стремится создавать что-то новое',
  'Стремится выразить свое мнение',
  'Ведет активный образ жизни, ищет что-то новое в жизни',
  'Открыт новому опыту',
  'Способен продуцировать новые идеи',
  'Готов принимать критику',
  'Умеет находить качественно новые решения в неординарных ситуациях',
  'Способен придумывать новое решение привычных задач',
  'Интеллектуально развит',
  'Способен создавать новые способы применения известных предметов',
  'Старается проявить себя в различных областях деятельности',
  'Склонен к поиску и принятию нестандартных решений',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_991_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: answers,
}));

export const instrument: SeedSection = {
  code: 'test_991',
  title: 'Опросник имплицитных теорий креативности (КИТ), версия Павловой 2014',
  description: 'Опросник выявляет бытовые представления о качествах творческого человека по четырём аспектам: оригинальность решений в привычных условиях, интеллектуально-личностный потенциал, стремление к новизне в неопределённых ситуациях и проявление креативности в деятельности и общении. Подходит для изучения того, какие характеристики респонденты считают необходимыми творческой личности; опубликованная версия 2014 года включает 20 пунктов.',
  questions,
};

const scaleItems = {
  originality: [1, 8, 13, 16, 20],
  potential: [2, 3, 12, 14, 17],
  novelty: [4, 5, 9, 15, 18],
  activity: [6, 7, 10, 11, 19],
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'originality', label: 'Оригинальность', items: scaleItems.originality, reverseItems: [], aggregation: 'sum' },
    { key: 'potential', label: 'Интеллектуально-личностный потенциал (ИЛП)', items: scaleItems.potential, reverseItems: [], aggregation: 'sum' },
    { key: 'novelty', label: 'Новизна', items: scaleItems.novelty, reverseItems: [], aggregation: 'sum' },
    { key: 'activity', label: 'Деятельность', items: scaleItems.activity, reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы «Совершенно не подходит» дают по 5 баллов на каждой шкале',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { originality: 5, potential: 5, novelty: 5, activity: 5 },
  },
  {
    title: 'Все ответы «Полностью подходит» дают по 35 баллов на каждой шкале',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 7])),
    expected: { originality: 35, potential: 35, novelty: 35, activity: 35 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'kit-pavlova-2014-20-item-v1',
};
