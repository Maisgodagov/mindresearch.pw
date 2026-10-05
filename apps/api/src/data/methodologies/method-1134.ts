import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const answerOptions = [
  'Совершенно не согласен',
  'Не согласен',
  'Скорее не согласен',
  'Нечто среднее',
  'Скорее согласен',
  'Согласен',
  'Совершенно согласен',
].map((label, index) => ({ value: String(index + 1), label }));

const items = [
  'Я довольно легко сближаюсь с людьми.',
  'Для меня некомфортно зависеть от других людей.',
  'Мне комфортно, когда другие полагаются на меня.',
  'Я редко переживаю о том, что меня могут бросить.',
  'Мне не нравится, когда кто-то слишком сильно сближается со мной.',
  'Мне несколько некомфортно находиться в слишком близких отношениях.',
  'Мне трудно полностью доверять другим.',
  'Я нервничаю всякий раз, когда кто-то слишком сильно сближается со мной.',
  'Часто другие хотят от меня большей близости, чем было бы комфортно для меня.',
  'Зачастую люди не желают сближаться настолько, как бы мне этого хотелось.',
  'Я часто беспокоюсь, что моя партнерша на самом деле меня не любит.',
  'Я редко беспокоюсь, что моя партнерша может от меня уйти.',
  'Мне часто хочется полностью слиться с кем-то, и это желание иногда отпугивает людей.',
  'Я уверен, что мне никогда не сделают больно, внезапно оборвав отношения.',
  'Обычно мне нужно больше близости и открытости, чем другим.',
  'Мне редко приходит в голову мысль, что меня могут бросить.',
  'Я уверен, что моя партнерша любит меня так же сильно, как и я ее.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1164_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: answerOptions,
}));

export const instrument: SeedSection = {
  code: 'test_1164',
  title: 'Опросник привязанности для взрослых (AAQ)',
  description: 'Опросник оценивает два измерения привязанности во взрослых романтических отношениях: избегание близости и тревожную озабоченность надежностью отношений, возможным отвержением или уходом партнера. Подходит для исследования того, насколько человеку свойственны дистанцирование от близости и беспокойство о взаимности чувств; русская версия psytests.org (2023), без сведений об отдельной адаптации.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    {
      key: 'avoidance',
      label: 'Избегание привязанности',
      items: [1, 2, 3, 5, 6, 7, 8, 9],
      reverseItems: [1, 3],
      aggregation: 'mean',
    },
    {
      key: 'anxiety',
      label: 'Тревожность привязанности',
      items: [4, 10, 11, 12, 13, 14, 15, 16, 17],
      reverseItems: [4, 12, 14, 16, 17],
      aggregation: 'mean',
    },
  ],
};

const allAnswers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы минимальны: реверсивные пункты дают семь, остальные — один',
    answers: allAnswers(1),
    expected: { avoidance: 2.5, anxiety: 13 / 9 },
  },
  {
    title: 'Все ответы максимальны: реверсивные пункты дают один, остальные — семь',
    answers: allAnswers(7),
    expected: { avoidance: 5.5, anxiety: 47 / 9 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'aaq-simpson-rholes-phillips-1996-psytests-ru-2023-v1',
};
