import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const feelings = [
  'восторг',
  'бодрость',
  'раскрепощение (свободу)',
  'спокойствие',
  'интерес',
  'удовлетворенность',
  'счастье',
  'радость',
  'уверенность',
  'удовольствие',
  'усталость',
  'напряжение',
  'неудовлетворенность собой',
  'бессилие',
  'тщетность (напрасность ожиданий, безуспешность стремлений)',
  'тревогу',
  'страх',
  'скованность',
  'растерянность',
  'досаду',
  'скуку',
  'разочарование',
  'уныние',
  'грусть',
  'печаль',
  'тоску',
  'единство с этим человеком (или общность)',
  'дружелюбие (к этому человеку)',
  'добросердечие (к этому человеку)',
  'уверенность в собственной правоте',
  'собственную достаточную значимость',
  'гордость за себя',
  'признательность (этому человеку)',
  'уважение (к этому человеку)',
  'любовь (к этому человеку)',
  'собственное одиночество',
  'отвращение к этому человеку (или неприязнь)',
  'злобу, злость (на этого человека)',
  'вину перед ним (или раскаяние)',
  'зависть (по отношению к этому человеку)',
  'стыд перед этим человеком (или смущение)',
  'обиду (на этого человека)',
  'презрение (по отношению к этому человеку)',
  'ненависть (по отношению к этому человеку)',
];

const options = [
  { value: '0', label: 'Чувство совсем не возникало' },
  { value: '1', label: 'Очень слабое чувство' },
  { value: '2', label: 'Слабое чувство' },
  { value: '3', label: 'Несколько ниже средней степени силы' },
  { value: '4', label: 'Чувство средней степени силы' },
  { value: '5', label: 'Несколько выше средней степени силы' },
  { value: '6', label: 'Сильное чувство' },
  { value: '7', label: 'Очень сильное чувство' },
];

const questions: SeedSection['questions'] = feelings.map((text, index) => ({
  code: `test_1502_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1502',
  title: 'Профиль чувств в отношениях (ПЧО), редакция 2025 г.',
  description: 'Методика Л. В. Куликова описывает чувственную гамму отношения человека к значимому другому или целостной группе в типичных ситуациях общения. Пять профилей охватывают гедонические, астенические и меланхолические переживания, а также сближающие и удаляющие чувства; результаты помогают автору опроса изучить эмоциональную сторону межличностного взаимодействия.',
  questions,
};

const scaleDefinitions = [
  ['hedonic', 'Гедонические чувства', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]],
  ['asthenic', 'Астенические чувства', [11, 12, 13, 14, 15, 16, 17, 18, 19]],
  ['melancholic', 'Меланхолические чувства', [20, 21, 22, 23, 24, 25, 26]],
  ['approach', 'Сближающие чувства', [27, 28, 29, 30, 31, 32, 33, 34, 35]],
  ['distancing', 'Удаляющие чувства', [36, 37, 38, 39, 40, 41, 42, 43, 44]],
] as const;

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 7,
  scales: scaleDefinitions.map(([key, label, items]) => ({
    key,
    label,
    items: [...items],
    reverseItems: [],
    aggregation: 'sum',
  })),
};

const validationCases: ValidationCase[] = [
  {
    title: 'Вручную проверенный профиль: все чувства отсутствовали',
    answers: Object.fromEntries(feelings.map((_, index) => [String(index + 1), 0])),
    expected: { hedonic: 0, asthenic: 0, melancholic: 0, approach: 0, distancing: 0 },
  },
  {
    title: 'Вручную проверенный профиль: одинаковая выраженность всех чувств',
    answers: Object.fromEntries(feelings.map((_, index) => [String(index + 1), 1])),
    expected: { hedonic: 10, asthenic: 9, melancholic: 7, approach: 9, distancing: 9 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'kulikov-pcho-2025-v1',
};
