import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Полностью не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Нейтрально' },
  { value: '4', label: 'Согласен' },
  { value: '5', label: 'Полностью согласен' },
];

const items = [
  'Я конкурентоспособный человек.',
  'Победа для меня важна.',
  'Я изо всех сил стараюсь выиграть.',
  'Я ставлю перед собой цели, когда соревнуюсь.',
  'Я целеустремлённый участник соревнований.',
  'Для меня очень важно набрать больше очков, чем соперник.',
  'Я решительно настроен быть лучшим каждый раз, когда соревнуюсь.',
  'Я наиболее конкурентоспособен, когда стремлюсь к личным целям.',
  'Я с нетерпением жду соревнований.',
  'Я ненавижу проигрывать.',
  'Я очень воодушевлён на соревнованиях.',
  'Я стараюсь больше всего, когда у меня есть конкретная цель.',
  'Моя цель в спорте — быть лучшим.',
  'В спорте я доволен только победой.',
  'Я хочу быть успешным в спорте.',
  'Для меня очень важно показывать максимум своих возможностей.',
  'Я очень много работаю, чтобы добиться успеха в спорте.',
  'Неудачи расстраивают меня.',
  'Лучшая проверка моих способностей — соревнование с другими.',
  'Для меня крайне важно достижение поставленных мною целей.',
  'Я с нетерпением жду соревнований как возможности проверить свои силы.',
  'Я счастлив, когда выигрываю.',
  'Я выступаю лучше всего, когда соревнуюсь с соперником.',
  'Лучший способ определить мои способности — поставить цель и постараться её достичь.',
  'Я хочу быть лучшим каждый раз, когда участвую в соревнованиях.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1241_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1241',
  title: 'Опросник соревновательных ценностей (SOQ)',
  description: 'Опросник оценивает соревновательную направленность спортсмена по трём аспектам: стремление участвовать и добиваться успеха в состязании, ориентацию на победу и ориентацию на личные цели и стандарты результата. Подходит для изучения индивидуальных различий у спортсменов и других участников спортивных соревнований; версия основана на русской адаптации 2023 года.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'competitiveness', label: 'Соревновательность', items: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25], reverseItems: [], aggregation: 'sum' },
    { key: 'win_orientation', label: 'Ориентация на победу', items: [2, 6, 10, 14, 18, 22], reverseItems: [], aggregation: 'sum' },
    { key: 'goal_orientation', label: 'Ориентация на цель', items: [4, 8, 12, 16, 20, 24], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Минимальные ответы дают нижние границы всех трёх сумм',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { competitiveness: 13, win_orientation: 6, goal_orientation: 6 },
  },
  {
    title: 'Проверка раздельного подсчёта пунктов трёх шкал',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), index + 1])),
    expected: { competitiveness: 85, win_orientation: 66, goal_orientation: 60 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'gill-deeter-soq-bochaver-bondarev-dovzhik-2023-v1',
};
