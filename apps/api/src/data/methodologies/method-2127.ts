import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const answerOptions = [
  { value: '1', label: 'Полностью не согласен' },
  { value: '2', label: 'Скорее не согласен' },
  { value: '3', label: 'В чем-то согласен, в чем-то нет' },
  { value: '4', label: 'Скорее согласен' },
  { value: '5', label: 'Полностью согласен' },
];

const items = [
  'Нет никакой определенной причины в том, что я существую.',
  'Каждый из нас призван внести свой собственный особый вклад в мир.',
  'Я призван реализовать свой потенциал.',
  'Жизнь, несомненно, имеет смысл.',
  'У меня никогда не будет духовной связи с кем-либо.',
  'Где-то в глубине себя я чувствую, какую жизнь я должен прожить.',
  'Моя жизнь имеет смысл.',
  'При решении некоторых задач меня как будто ведут высшие силы.',
  'Наши пороки подтверждают, что в существовании человечества практически нет смысла.',
  'Я нахожу смысл даже в своих ошибках и прегрешениях.',
  'Я вижу особую цель своего пребывания в мире.',
  'Я чувствую свое призвание к некоторым видам деятельности.',
  'В человеческом существовании нет никакой особой причины или смысла.',
  'Мы все участвуем в чем-то большем и великом, нежели мы сами.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2141_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: answerOptions,
}));

export const instrument: SeedSection = {
  code: 'test_2141',
  title: 'Шкала духовного смысла (SMS), русскоязычная адаптация',
  description: 'Измеряет духовную осмысленность как переживание смысла жизни, своего вклада и участия в чем-то превосходящем отдельного человека. Русскоязычная адаптация включает аспекты осмысленности и призвания; подходит для русскоязычных взрослых респондентов независимо от религиозной самоидентификации.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'meaningfulness', label: 'Осмысленность', items: [1, 2, 4, 5, 7, 9, 13], reverseItems: [1, 5, 9, 13], aggregation: 'sum' },
    { key: 'calling', label: 'Призвание', items: [3, 6, 8, 10, 11, 12, 14], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы полностью не согласен',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { meaningfulness: 23, calling: 7 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'sms-vitko-zolotareva-lebedeva-lynch-2022-v1',
};
