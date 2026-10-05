import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const statements = [
  'У меня было ощущение чего-то бесконечного',
  'Я чувствовал, что Бог рядом',
  'Я чувствовал себя полностью верным себе',
  'Я чувствовал единство с природой',
  'Я чувствовал свою связь со всем человечеством',
  'Я чувствовал свою связь с невыразимой силой бытия',
  'Я чувствовал свою близость к Богу',
  'У меня было ощущение единства своего внутреннего мира',
  'Я ощущал свою связь с природой',
  'Я ощущал свою близость ко всему человечеству',
  'Я чувствовал единство с чем-то, что не могу описать словами',
  'Я знал, что Бог со мной',
  'Я чувствовал себя соответствующим своей сущности',
  'Я ощущал свою близость к природе',
  'Я ощущал единство со всем человечеством',
  'Я чувствовал присутствие чего-то из другого мира или измерения',
  'Я чувствовал присутствие Бога',
  'У меня было чувство своей целостности',
];

const options = [
  { value: '1', label: 'Совершенно не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Ни да, ни нет' },
  { value: '4', label: 'Согласен' },
  { value: '5', label: 'Полностью согласен' },
];

const instrument: SeedSection = {
  code: 'test_974',
  title: 'Опросник духовных переживаний (ОДП / SOS-Ru)',
  description: 'Русскоязычная версия измеряет выраженность духовных переживаний, связанных с Богом, трансцендентностью, человечеством, природой и самостью. Пять субшкал помогают автору опроса различать религиозные, трансцендентные, гуманистические, природные и связанные с целостностью Я аспекты духовного опыта; версия разработана и апробирована на русскоязычных участниках от 17 лет.',
  questions: statements.map((text, index) => ({
    code: `test_974_${index + 1}`,
    text,
    type: 'single',
    required: true,
    options,
  })),
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'transcendence', label: 'Трансцендентность', items: [1, 6, 11, 16], reverseItems: [], aggregation: 'mean' },
    { key: 'god', label: 'Бог', items: [2, 7, 12, 17], reverseItems: [], aggregation: 'mean' },
    { key: 'self', label: 'Самость', items: [3, 8, 13, 18], reverseItems: [], aggregation: 'mean' },
    { key: 'nature', label: 'Природа', items: [4, 9, 14], reverseItems: [], aggregation: 'mean' },
    { key: 'humanity', label: 'Человечество', items: [5, 10, 15], reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы минимальны: среднее каждой субшкалы равно 1',
    answers: Object.fromEntries(statements.map((_, index) => [String(index + 1), 1])),
    expected: { transcendence: 1, god: 1, self: 1, nature: 1, humanity: 1 },
  },
  {
    title: 'Все ответы максимальны: среднее каждой субшкалы равно 5',
    answers: Object.fromEntries(statements.map((_, index) => [String(index + 1), 5])),
    expected: { transcendence: 5, god: 5, self: 5, nature: 5, humanity: 5 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'soss-ru-2022-v1',
};
