import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'Совсем нет' },
  { value: '1', label: 'В течение нескольких дней' },
  { value: '2', label: 'Более, чем половину этого времени' },
  { value: '3', label: 'Почти каждый день' },
];

const items = [
  'Чувство тревоги или раздражения',
  'Неспособность справиться со своим беспокойством',
  'Снижение интереса и удовольствия от привычных дел',
  'Чувство подавленности или безнадежности',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1616_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1616',
  title: 'Скрининг тревоги и депрессии PHQ-4',
  description: 'Ультракраткий скрининговый опросник для оценки выраженности тревожных и депрессивных симптомов за последние две недели. Охватывает тревогу и трудность контроля беспокойства, а также снижение интереса и подавленность; русская адаптация предназначена для скрининга общей русскоязычной популяции и не устанавливает диагноз.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 3,
  scales: [
    { key: 'anxiety', label: 'Тревога (пункты 1–2)', items: [1, 2], reverseItems: [], aggregation: 'sum' },
    { key: 'depression', label: 'Депрессия (пункты 3–4)', items: [3, 4], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: по пунктам 1–2 сумма тревоги 3, по пунктам 3–4 сумма депрессии 5',
    answers: { '1': 1, '2': 2, '3': 2, '4': 3 },
    expected: { anxiety: 3, depression: 5 },
  },
  {
    title: 'Все ответы «Совсем нет» дают нулевые суммы',
    answers: { '1': 0, '2': 0, '3': 0, '4': 0 },
    expected: { anxiety: 0, depression: 0 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'phq-4-zolotareva-kostenko-ru-2024-subscale-sums-v1',
};
