import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'Совсем нет' },
  { value: '1', label: 'В течение нескольких дней' },
  { value: '2', label: 'Более чем половину этого времени' },
  { value: '3', label: 'Почти каждый день' },
];

const items = [
  'Чувство тревоги или раздражения.',
  'Неспособность справиться со своим беспокойством.',
  'Чрезмерное беспокойство по разным поводам.',
  'Неспособность расслабляться.',
  'Ощущение такого беспокойства, что трудно найти себе место.',
  'Склонность быстро испытывать злость или раздражительность.',
  'Чувство страха, как будто может случиться что-то ужасное.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_918_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_918',
  title: 'Шкала генерализованного тревожного расстройства, GAD-7 (русская адаптация Золотарёвой)',
  description: 'Краткая шкала оценивает выраженность тревожных симптомов за последние две недели: тревогу и раздражительность, трудности контроля беспокойства и расслабления, беспокойство в разных ситуациях и ожидание неблагоприятного события. Подходит для скрининговой оценки взрослых и популяционных исследований; сама по себе не устанавливает диагноз.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 3,
  scales: [
    { key: 'anxiety', label: 'Выраженность тревожных симптомов (сумма GAD-7)', items: [1, 2, 3, 4, 5, 6, 7], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: ответы 0, 1, 2, 3, 0, 1, 2 дают сумму 9',
    answers: { '1': 0, '2': 1, '3': 2, '4': 3, '5': 0, '6': 1, '7': 2 },
    expected: { anxiety: 9 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'gad-7-ru-zolotareva-2023-v1',
};
