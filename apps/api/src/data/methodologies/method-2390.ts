import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Абсолютно неверно' },
  { value: '2', label: 'Неверно' },
  { value: '3', label: 'Скорее неверно' },
  { value: '4', label: 'Нечто среднее' },
  { value: '5', label: 'Скорее верно' },
  { value: '6', label: 'Верно' },
  { value: '7', label: 'Абсолютно верно' },
];

const items = [
  'Потому что я нахожу свою работу интересной.',
  'Потому что ее выполнение приносит мне пользу.',
  'Потому что я обязан это делать.',
  'Возможно и существуют основания для ее выполнения, но лично я не нахожу ни одного.',
  'Потому что мне приятно выполнять работу.',
  'Потому что выполнение моей профессиональной деятельности выгодно для меня.',
  'Потому что моя работа — это то, что мне приходится делать.',
  'Я, конечно, выполняю свою работу, но я не уверен, что она того стоит.',
  'Потому что моя работа приносит мне удовольствие.',
  'Это мой выбор.',
  'Потому что у меня нет выбора.',
  'Я не знаю. Я не считаю, что она мне что-то дает.',
  'Потому что я чувствую себя хорошо, когда ею занимаюсь.',
  'Потому что я считаю, что моя работа является важной для меня.',
  'Потому что я чувствую, что мне всё равно придется ее делать.',
  'Я ее выполняю, но я не уверен, что это именно то, чем надо заниматься.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2408_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2408',
  title: 'Шкала ситуационной мотивации (SIMS), русская адаптация',
  description: 'SIMS оценивает причины вовлечённости человека в конкретную деятельность в данный момент. Четыре аспекта — внутренняя мотивация, идентифицированная регуляция, внешняя регуляция и амотивация — помогают автору опроса описать качество ситуативной мотивации; эта русская адаптация Таушановой сформулирована применительно к профессиональной деятельности.',
  categoryIds: ['framework-sdt'],
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'intrinsic', label: 'Внутренняя мотивация', items: [1, 5, 9, 13], reverseItems: [], aggregation: 'mean' },
    { key: 'identified', label: 'Идентифицированная регуляция', items: [2, 6, 10, 14], reverseItems: [], aggregation: 'mean' },
    { key: 'external', label: 'Внешняя регуляция', items: [3, 7, 11, 15], reverseItems: [], aggregation: 'mean' },
    { key: 'amotivation', label: 'Амотивация', items: [4, 8, 12, 16], reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручной контроль: все ответы 1 дают 1 по каждой четырёхпунктовой шкале',
    answers: Object.fromEntries(Array.from({ length: 16 }, (_, index) => [String(index + 1), 1])),
    expected: { intrinsic: 1, identified: 1, external: 1, amotivation: 1 },
  },
  {
    title: 'Ручной контроль: все ответы 7 дают 7 по каждой четырёхпунктовой шкале',
    answers: Object.fromEntries(Array.from({ length: 16 }, (_, index) => [String(index + 1), 7])),
    expected: { intrinsic: 7, identified: 7, external: 7, amotivation: 7 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['framework-sdt'],
  scoringConfig,
  validationCases,
  formulaVersion: 'guay-vallerand-blanchard-sims-taushanova-ru-2013-v1',
};
