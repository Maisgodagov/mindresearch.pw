import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'Такого страха у меня никогда не было' },
  { value: '1', label: 'Такой страх у меня был однажды' },
  { value: '2', label: 'Такой страх у меня был несколько раз' },
  { value: '3', label: 'Периодически такой страх у меня возникает' },
  { value: '4', label: 'Этот страх меня преследует постоянно' },
];

const items = [
  'Страх темноты',
  'Страх перед вызовом отвечать на уроке',
  'Страх утраты любви со стороны близких',
  'Страх физического насилия',
  'Страх оказаться заложником в руках бандитов',
  'Страх высоты',
  'Страх быть осмеянным классом',
  'Страх предательства со стороны друзей',
  'Страх не оправдать доверия со стороны близких людей',
  'Страх перед потусторонними силами',
  'Страх животных',
  'Страх получить плохую оценку',
  'Страх быть высмеянным друзьями или родней',
  'Страх оказаться в толпе в момент паники',
  'Страх сглаза или порчи',
  'Страх закрытых помещений',
  'Страх попасть в транспортную аварию',
  'Страх перед вызовом к директору',
  'Страх выглядеть смешным или жалким',
  'Страх перед Богом',
  'Страх полёта на самолётах',
  'Страх быть не таким, как остальные ученики',
  'Страх быть уличённым во лжи',
  'Страх аттракционов',
  'Страх быть ограбленным на улице',
  'Страх болезни',
  'Страх быть выгнанным из класса',
  'Страх медицинских процедур',
  'Страх критики со стороны близких',
  'Страх смерти близких людей',
  'Страх одиночества',
  'Страх собственной смерти',
  'Страх перед вызовом родителей в школу',
  'Страх наказания родителями за неуспеваемость',
  'Страх сексуального насилия',
  'Страх террористического взрыва',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_159_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_159',
  title: 'Виды страха',
  description: "Опросник изучает выраженность страхов перед различными явлениями и ситуациями у подростков. Результаты позволяют описать, какие темы вызывают больше опасений; они не являются клинической диагностикой тревожного расстройства.",
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 4,
  scales: [
    { key: 'phobias', label: 'Фобии', items: [1, 6, 11, 16, 17, 21, 24, 26, 28, 30], reverseItems: [], aggregation: 'mean' },
    { key: 'academic', label: 'Учебные страхи', items: [2, 7, 12, 18, 22, 27, 33, 34], reverseItems: [], aggregation: 'mean' },
    { key: 'social', label: 'Социальные страхи', items: [3, 9, 13, 8, 19, 29, 23, 31], reverseItems: [], aggregation: 'mean' },
    { key: 'criminal', label: 'Криминальные страхи', items: [4, 5, 14, 25, 35, 36], reverseItems: [], aggregation: 'mean' },
    { key: 'mystical', label: 'Мистические страхи', items: [10, 15, 20, 32], reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы указывают, что страха никогда не было',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 0])),
    expected: { phobias: 0, academic: 0, social: 0, criminal: 0, mystical: 0 },
  },
  {
    title: 'Проверка распределения ключевых пунктов: страхи пунктов 2 и 1',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), index === 0 ? 4 : index === 1 ? 2 : 0])),
    expected: { phobias: 0.4, academic: 0.25, social: 0, criminal: 0, mystical: 0 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'shkuratova-ermak-vfear-2004-v1',
};
