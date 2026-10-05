import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Определенно не согласна' },
  { value: '2', label: 'Не согласна' },
  { value: '3', label: 'Нечто среднее' },
  { value: '4', label: 'Согласна' },
  { value: '5', label: 'Абсолютно согласна' },
];

const items = [
  'Для меня важно выглядеть спортивной.',
  'Я часто думаю о том, чтобы выглядеть мускулистой.',
  'Я хочу, чтобы моё тело выглядело очень худым.',
  'Я хочу, чтобы моё тело выглядело так, словно в нём очень мало жира.',
  'Я часто думаю о том, чтобы выглядеть худой.',
  'Я трачу много времени на то, чтобы выглядеть более спортивной.',
  'Я часто думаю о том, чтобы выглядеть спортивной.',
  'Я хочу, чтобы моё тело выглядело очень подтянутым.',
  'Я часто думаю о том, чтобы иметь минимальный уровень жира в теле.',
  'Я трачу много времени на то, чтобы выглядеть более мускулистой.',
  'Я чувствую, что члены моей семьи ожидают, чтобы я выглядела более худой.',
  'Я чувствую, что члены моей семьи оказывают на меня давление, чтобы я выглядела лучше.',
  'Члены моей семьи советуют мне снизить количество жира в теле.',
  'Члены моей семьи хотят, чтобы я стала более спортивной и подтянутой.',
  'Мои друзья и знакомые считают, что мне нужно стать худее.',
  'Я чувствую, что мои друзья и знакомые ожидают, чтобы я выглядела лучше.',
  'Я чувствую, что мои друзья и знакомые хотят, чтобы я была в лучшей физической форме.',
  'Мои друзья и знакомые считают, что мне нужно уменьшить уровень жира в теле.',
  'Я чувствую, что медиа подталкивают меня к тому, чтобы быть в лучшей физической форме.',
  'Я чувствую, что медиа подталкивают меня к тому, чтобы стать худее.',
  'Я чувствую, что медиа заставляют меня думать о том, чтобы улучшить свою внешность.',
  'Я чувствую, что медиа подталкивают меня к тому, чтобы снизить уровень жира в теле.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1255_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1255',
  title: 'Опросник социокультурных установок в отношении телесности (SATAQ-4), женская форма',
  description: 'SATAQ-4 оценивает усвоение идеалов худобы и спортивно-мускулистого тела, а также воспринимаемое давление семьи, друзей и медиа в отношении внешности. Пять отдельных показателей помогают исследовать источники социокультурных влияний на образ тела и сопоставлять их между собой; эта форма воспроизводит русскоязычный женский бланк и подходит для исследовательских опросов женщин. Исходная структура также изучалась у мужчин, но этот текст — гендерно маркированная женская версия.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'muscular_athletic_internalization', label: 'Интернализация мускулистого и спортивного идеала', items: [1, 2, 6, 7, 10], reverseItems: [], aggregation: 'mean' },
    { key: 'thin_low_fat_internalization', label: 'Интернализация идеала худобы и низкого содержания жира', items: [3, 4, 5, 8, 9], reverseItems: [], aggregation: 'mean' },
    { key: 'family_pressure', label: 'Давление семьи', items: [11, 12, 13, 14], reverseItems: [], aggregation: 'mean' },
    { key: 'peer_pressure', label: 'Давление друзей и знакомых', items: [15, 16, 17, 18], reverseItems: [], aggregation: 'mean' },
    { key: 'media_pressure', label: 'Давление медиа', items: [19, 20, 21, 22], reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы «Определенно не согласна» дают минимумы шкал',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { muscular_athletic_internalization: 1, thin_low_fat_internalization: 1, family_pressure: 1, peer_pressure: 1, media_pressure: 1 },
  },
  {
    title: 'Проверка соответствия пунктов подшкалам и расчёта средних',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), index + 1])),
    expected: { muscular_athletic_internalization: 5.2, thin_low_fat_internalization: 5.8, family_pressure: 13.5, peer_pressure: 17.5, media_pressure: 21.5 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'sataq-4-schaefer-2015-psytests-female-ru-v1',
};
