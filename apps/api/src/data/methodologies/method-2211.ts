import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Полностью не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Скорее не согласен' },
  { value: '4', label: 'Ни то, ни другое' },
  { value: '5', label: 'Скорее согласен' },
  { value: '6', label: 'Согласен' },
  { value: '7', label: 'Полностью согласен' },
];

const items = [
  'Я бы чувствовал себя некомфортно, если бы я выполнял работу, в ходе которой мне нужно было бы использовать робота.',
  'В разговоре с роботом я бы относился к нему подозрительно и с недоверием.',
  'Я бы сильно нервничал, даже если бы просто находился перед роботом.',
  'Я чувствовал бы себя комфортно с роботами, у которых есть эмоции.',
  'Я переживаю, что буду слишком сильно зависеть от роботов.',
  'Я переживал, если бы роботы или системы искусственного интеллекта рассуждали о разных вещах.',
  'Я был бы спокоен при разговоре с роботом.',
  'Если бы у роботов были эмоции, то я бы смог с ними подружиться.',
  'Я переживаю, что роботы будут негативно влиять на детей.',
  'Может случиться что-то плохое, если роботы будут как живые существа.',
  'Роботы не представляют для меня никакого интереса.',
  'Мне было бы не по себе, если бы роботы действительно испытывали эмоции.',
  'Я бы волновался во взаимодействии с роботом в присутствии других людей.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2227_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2227',
  title: 'Шкала негативного отношения к роботам (NARS), русскоязычная модификация',
  description: 'Русскоязычная модификация NARS оценивает негативное отношение к роботам по трём аспектам: дискомфорт во взаимодействии, опасения по поводу социального влияния роботов и эмоциональное отношение к роботам. Подходит для исследовательских опросов русскоязычных респондентов; модификация Акмаева изучалась на выборке студентов-медиков и практикующих врачей, поэтому перенос результатов на другие группы требует осторожности.',
  categoryIds: ['cyberpsychology'],
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'interaction', label: 'Негативное отношение к взаимодействию с роботами', items: [1, 3, 7, 11, 13], reverseItems: [7], aggregation: 'sum' },
    { key: 'social_influence', label: 'Негативное отношение к социальному влиянию роботов', items: [2, 5, 6, 9, 10], reverseItems: [], aggregation: 'sum' },
    { key: 'emotional_interaction', label: 'Негативное отношение к эмоциональному компоненту во взаимодействии с роботами', items: [4, 8, 12], reverseItems: [4, 8], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: ответы 1 по всем пунктам; пункты 7, 4 и 8 инвертируются в 7',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { interaction: 11, social_influence: 5, emotional_interaction: 15 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'nars-akmaev-ru-2022-13item-seven-point-reverse-4-7-8-sum-v1',
};
