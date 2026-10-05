import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Да' },
  { value: '0', label: 'Нет' },
];

const items = [
  'Я часто думаю о смерти и это вызывает у меня тревогу.',
  'Я не тревожусь о судьбе, потому что я с ней смирился.',
  'Я часто испытываю тревогу, потому что переживаю, что жизнь может не иметь смысла.',
  'Я не беспокоюсь и не думаю о своей вине.',
  'Я часто испытываю тревогу из-за чувства вины.',
  'Я часто испытываю тревогу по поводу того, что меня есть за что осуждать.',
  'Я никогда не думаю о бесконечной пустоте вокруг нас.',
  'Я часто думаю о том, что то, что когда-то было в жизни важным, теперь пустое.',
  'Я не беспокоюсь о том, что могу заслуживать осуждения.',
  'Я не беспокоюсь о смерти, потому что готов ко всему, что она может принести.',
  'Я часто думаю о судьбе, и это вызывает у меня тревогу.',
  'Я не беспокоюсь о судьбе, потому что уверен, что всё образуется.',
  'Я знаю, что жизнь имеет смысл.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1332_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1332',
  title: 'Опросник экзистенциальной тревоги (EAQ)',
  description: 'Самоотчётная методика оценивает выраженность экзистенциальной тревоги в рамках концепции Пола Тиллиха: опасения, связанные со смертью и судьбой, пустотой и бессмысленностью, виной и осуждением. Подходит для исследовательского и обзорного опроса взрослых; опубликованные данные также описывают применение EAQ у подростков. Русский перевод psytests.org (2024) воспроизводит оригинальные материалы, но сведения о его отдельной адаптации отсутствуют.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 1,
  scales: [{
    key: 'existential_anxiety',
    label: 'Общая экзистенциальная тревога',
    items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    reverseItems: [2, 4, 7, 9, 10, 12, 13],
    aggregation: 'sum',
  }],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы «Нет»: семь реверсивных ответов дают семь баллов',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 0])),
    expected: { existential_anxiety: 7 },
  },
  {
    title: 'Все ответы «Да»: шесть прямых пунктов дают шесть баллов',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { existential_anxiety: 6 },
  },
  {
    title: 'Все прямые пункты отвечены «Да», реверсивные — «Нет»: максимум 13',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), [2, 4, 7, 9, 10, 12, 13].includes(index + 1) ? 0 : 1])),
    expected: { existential_anxiety: 13 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'eaq-weems-2004-psytests-ru-2024-v1',
};
