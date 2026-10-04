import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const partOneOptions = [
  { value: '5', label: 'В полной мере' },
  { value: '4', label: 'В значительной степени' },
  { value: '3', label: 'На достаточном уровне' },
  { value: '2', label: 'В незначительной степени' },
  { value: '1', label: 'Практически нет' },
];
const partTwoOptions = [
  { value: '1', label: 'Совершенно не верно' },
  { value: '2', label: 'Едва ли это верно' },
  { value: '3', label: 'Скорее всего, верно' },
  { value: '4', label: 'Совершенно верно' },
];

const partOne = [
  'Аккуратность (умение содержать в порядке вещи).',
  'Дисциплинированность (умение следовать установленным правилам в делах).',
  'Ответственность (умение держать слово).',
  'Воля (умение не отступать перед трудностями).',
  'Хорошие манеры поведения.',
  'Жизнерадостность (способность принимать жизнь и радоваться жизни).',
  'Образованность.',
  'Ум (способность здраво и логично мыслить).',
  'Высокие жизненные запросы.',
  'Самостоятельность (способность самому принимать ответственные жизненные решения).',
  'Честность в отношениях с людьми.',
  'Доброта в отношениях с людьми.',
  'Чуткость в отношениях с людьми.',
  'Справедливость в отношениях с людьми.',
  'Терпимость к взглядам и мнениям других.',
];
const partTwo = [
  'Образовательное учреждение помогает ребенку поверить в свои силы.',
  'Образовательное учреждение помогает ребенку учиться решать жизненные проблемы.',
  'Образовательное учреждение помогает ребенку учиться преодолевать жизненные трудности.',
  'Образовательное учреждение помогает ребенку учиться правильно общаться со сверстниками.',
  'Образовательное учреждение помогает ребенку учиться правильно общаться со взрослыми.',
];
const partThree = [
  'Что больше всего радует Вас в жизни?',
  'Что больше всего радует в жизни Вашего ребенка (Ваших детей)?',
  'Какие качества Вы больше всего цените в людях?',
  'Чего Вы больше всего боитесь в жизни?',
  'Чего больше всего боится в жизни Ваш ребенок (Ваши дети)?',
  'Какие качества больше всего ценит Ваш ребенок (Ваши дети) в других людях?',
  'Какими видите жизненные перспективы Вашего ребенка (Ваших детей)?',
  'Каким должно быть хорошее учебное заведение?',
  'В какой степени учебное заведение, где учится Ваш ребенок (Ваши дети), отвечает этим требованиям?',
  'Чем и как Вы помогаете учебному заведению в воспитании Вашего ребенка (Ваших детей)?',
];

const questions: SeedSection['questions'] = [
  ...partOne.map((text, index) => ({ code: `test_640_${index + 1}`, text, type: 'single' as const, required: true, options: partOneOptions })),
  ...partTwo.map((text, index) => ({ code: `test_640_${index + 16}`, text, type: 'single' as const, required: true, options: partTwoOptions })),
  ...partThree.map((text, index) => ({ code: `test_640_${index + 21}`, text, type: 'text' as const, required: true })),
];

export const instrument: SeedSection = {
  code: 'test_640',
  title: 'Комплексная методика изучения удовлетворенности родителей жизнедеятельностью образовательного учреждения',
  description: 'Методика Андреева помогает получить родительскую оценку вклада образовательного учреждения в воспитание поведенческих качеств, жизненной компетентности и морально-психологических качеств ребенка, а также помощи в решении жизненных проблем. Открытые вопросы дополняют эти оценки представлениями родителей о жизненных ценностях и соответствии жизни учреждения их ожиданиям. Предназначена для родителей учащихся образовательных учреждений; подходит для анализа оценок по отдельным аспектам и содержательных ответов.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'behavioral_qualities', label: 'Поведенческие качества (часть I)', items: [1, 2, 3, 4, 5], reverseItems: [], aggregation: 'mean' },
    { key: 'life_competence', label: 'Жизненная компетентность (часть I)', items: [6, 7, 8, 9, 10], reverseItems: [], aggregation: 'mean' },
    { key: 'moral_psychological_qualities', label: 'Морально-психологические качества (часть I)', items: [11, 12, 13, 14, 15], reverseItems: [], aggregation: 'mean' },
    { key: 'part_one_overall', label: 'Общий показатель части I', items: Array.from({ length: 15 }, (_, i) => i + 1), reverseItems: [], aggregation: 'mean' },
    { key: 'life_problem_support', label: 'Помощь в решении жизненных проблем (часть II)', items: [16, 17, 18, 19, 20], reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Максимальные оценки дают среднее 5 и 4 по соответствующим частям',
    answers: { ...Object.fromEntries(Array.from({ length: 15 }, (_, i) => [String(i + 1), 5])), ...Object.fromEntries(Array.from({ length: 5 }, (_, i) => [String(i + 16), 4])) },
    expected: { behavioral_qualities: 5, life_competence: 5, moral_psychological_qualities: 5, part_one_overall: 5, life_problem_support: 4 },
  },
  {
    title: 'Минимальные ответы дают среднее 1 в части I и 1.5 в части II',
    answers: { ...Object.fromEntries(Array.from({ length: 15 }, (_, i) => [String(i + 1), 1])), ...Object.fromEntries(Array.from({ length: 5 }, (_, i) => [String(i + 16), i % 2 ? 2 : 1])) },
    expected: { behavioral_qualities: 1, life_competence: 1, moral_psychological_qualities: 1, part_one_overall: 1, life_problem_support: 1.4 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'andreev-parent-satisfaction-educational-institution-three-parts-2001-v1',
};
