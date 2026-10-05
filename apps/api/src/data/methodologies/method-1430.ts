import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const items = [
  'У моей семьи высокие стандарты по отношению к моим достижениям в работе или учебе.',
  'Моя семья ожидает, что я — организованный человек.',
  'Аккуратность важна для моей семьи.',
  'Мои устремления и усилия никогда не кажутся достаточными моей семье.',
  'Моя семья считает, что все вещи должны находиться на своих местах.',
  'У моей семьи высокие ожидания в отношении меня.',
  'Я редко оправдываю высокие ожидания своей семьи.',
  'Моя семья ожидает, что я всегда буду организованным/-ой и дисциплинированным/-ой.',
  'Мои лучшие достижения никогда не кажутся достаточно хорошими для моей семьи.',
  'Моя семья устанавливает очень высокую планку стандартов для меня.',
  'Ничего, кроме совершенства, не приемлемо в моей семье.',
  'Моя семья ожидает от меня лучшего.',
  'Мои результаты редко достигают уровня стандартов моей семьи.',
  'Моя семья ожидает, что я стараюсь сделать максимально хорошо все, чем я занят/-а.',
  'Я редко способен/-на соответствовать высокому уровню ожиданий своей семьи по поводу своих достижений.',
  'Я осознаю, что моя семья устанавливает нереалистично высокие стандарты.',
  'Моя семья ожидает, что у меня сильная потребность стремиться к превосходным успехам.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1458_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: [
    { value: '1', label: 'Совершенно не согласен/-на' },
    { value: '2', label: 'Не согласен/-на' },
    { value: '3', label: 'Скорее не согласен/-на' },
    { value: '4', label: 'Нейтрально' },
    { value: '5', label: 'Скорее согласен/-на' },
    { value: '6', label: 'Согласен/-на' },
    { value: '7', label: 'Полностью согласен/-на' },
  ],
}));

export const instrument: SeedSection = {
  code: 'test_1458',
  title: 'Почти совершенная семейная шкала (FAPS), русская версия',
  description: 'FAPS оценивает, насколько человек воспринимает семью как источник перфекционистских требований. Три субшкалы охватывают высокие семейные стандарты, порядок и ощущение несоответствия ожиданиям. Русская версия Т. М. Пермяковой и М. С. Шевелевой предназначена для оценки восприятия семейных установок; результаты отражают отдельные аспекты, а не диагноз.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'familyStandards', label: 'Семейные стандарты', items: [1, 6, 10, 12, 14, 17], reverseItems: [], aggregation: 'sum' },
    { key: 'familyOrder', label: 'Семейный порядок', items: [2, 3, 5, 8], reverseItems: [], aggregation: 'sum' },
    { key: 'familyDiscrepancy', label: 'Несоответствие семейным ожиданиям', items: [4, 7, 9, 11, 13, 15, 16], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная сверка: ответы 1 по всем пунктам дают суммы, равные числу пунктов каждой субшкалы',
    answers: Object.fromEntries(Array.from({ length: 17 }, (_, index) => [String(index + 1), 1])),
    expected: { familyStandards: 6, familyOrder: 4, familyDiscrepancy: 7 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'wang-faps-russian-17item-subscale-sums-v1',
};
