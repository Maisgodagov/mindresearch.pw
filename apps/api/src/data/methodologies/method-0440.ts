import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Совсем не важно' },
  { value: '2', label: 'Не важно' },
  { value: '3', label: 'Почти не важно' },
  { value: '4', label: 'Нечто среднее' },
  { value: '5', label: 'Немного важно' },
  { value: '6', label: 'Важно' },
  { value: '7', label: 'Очень важно' },
];

const items = [
  'Для меня важно иметь друзей из родной страны.',
  'Для меня важно соблюдать традиции родной страны.',
  'Для меня важно придерживаться черт, характерных для родной страны.',
  'Для меня важно поступать так, как поступают люди в родной стране.',
  'Для меня важно иметь друзей из принимающей страны (страны проживания).',
  'Для меня важно соблюдать традиции принимающей страны.',
  'Для меня важно развивать черты, характерные для принимающей страны.',
  'Для меня важно поступать так, как поступают люди в принимающей стране.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_476_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_476',
  title: 'Краткая шкала аккультурационных ориентаций (BAOS)',
  description: 'Методика измеряет две независимые ориентации мигранта: на культуру родной страны и на культуру принимающей страны. В каждой оценивается значимость дружбы, традиций, культурных характеристик и привычных способов действий; подходит для исследований людей, живущих в новом культурном контексте, в русскоязычной версии Ооки и Вачкова.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'home_orientation', label: 'Ориентация на культуру родной страны', items: [1, 2, 3, 4], reverseItems: [], aggregation: 'sum' },
    { key: 'host_orientation', label: 'Ориентация на культуру принимающей страны', items: [5, 6, 7, 8], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: все ответы 1 дают минимумы независимых шкал',
    answers: { '1': 1, '2': 1, '3': 1, '4': 1, '5': 1, '6': 1, '7': 1, '8': 1 },
    expected: { home_orientation: 4, host_orientation: 4 },
  },
  {
    title: 'Ручная проверка: максимальные ответы по родной и минимальные по принимающей культуре',
    answers: { '1': 7, '2': 7, '3': 7, '4': 7, '5': 1, '6': 1, '7': 1, '8': 1 },
    expected: { home_orientation: 28, host_orientation: 4 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'demes-geeraert-baos-russian-ooki-vachkov-2022-two-independent-sums-v1',
};
