import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Совсем нет' },
  { value: '2', label: 'Немного' },
  { value: '3', label: 'Средне' },
  { value: '4', label: 'Сильно' },
  { value: '5', label: 'Очень сильно' },
];

const items = [
  'После участия в видеоконференции… Я чувствую усталость',
  'После участия в видеоконференции… Я чувствую себя вымотанным',
  'После участия в видеоконференции… Я чувствую себя психически истощенным',
  'После участия в видеоконференции… У меня все плывет перед глазами',
  'После участия в видеоконференции… Я чувствую раздражение в глазах',
  'После участия в видеоконференции… Я чувствую резь и боль в глазах',
  'После участия в видеоконференции… Я избегаю общения',
  'После участия в видеоконференции… Я хочу побыть в одиночестве',
  'После участия в видеоконференции… Мне нужно время на себя',
  'После участия в видеоконференции… Я боюсь подумать о делах, которые надо делать',
  'После участия в видеоконференции… Мне не хочется ничего делать',
  'После участия в видеоконференции… Чувствую себя слишком уставшим, чтобы делать что-то еще',
  'После участия в видеоконференции… Я чувствую себя выжатым эмоционально',
  'После участия в видеоконференции… Я чувствую раздражение',
  'После участия в видеоконференции… Я чувствую себя подавленным',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2488_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2488',
  title: 'Шкала усталости и утомления при видеоконференциях (ZEF Scale, русская версия НИУ ВШЭ)',
  description: 'Шкала оценивает истощение после участия в онлайн-видеоконференциях у взрослых участников таких встреч. Она охватывает общую, зрительную, социальную, мотивационную и эмоциональную усталость; автор опроса может использовать отдельные профили этих аспектов и совокупный балл для описания выраженности поствидеоконференционного утомления.',
  categoryIds: ['cyberpsychology'],
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'general', label: 'Общая усталость', items: [1, 2, 3], reverseItems: [], aggregation: 'sum' },
    { key: 'visual', label: 'Зрительная усталость', items: [4, 5, 6], reverseItems: [], aggregation: 'sum' },
    { key: 'social', label: 'Социальная усталость', items: [7, 8, 9], reverseItems: [], aggregation: 'sum' },
    { key: 'motivational', label: 'Мотивационная усталость', items: [10, 11, 12], reverseItems: [], aggregation: 'sum' },
    { key: 'emotional', label: 'Эмоциональная усталость', items: [13, 14, 15], reverseItems: [], aggregation: 'sum' },
    { key: 'total', label: 'Совокупная усталость', items: Array.from({ length: 15 }, (_, index) => index + 1), reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Минимальные ответы: сумма 3 по каждой субшкале и 15 в целом',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { general: 3, visual: 3, social: 3, motivational: 3, emotional: 3, total: 15 },
  },
  {
    title: 'Максимальные ответы: сумма 15 по каждой субшкале и 75 в целом',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 5])),
    expected: { general: 15, visual: 15, social: 15, motivational: 15, emotional: 15, total: 75 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'zef-scale-hse-ru-15item-sums-v1',
};
