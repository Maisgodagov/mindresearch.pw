import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Совсем нетипично' },
  { value: '2', label: 'Скорее нетипично' },
  { value: '3', label: 'Отчасти типично' },
  { value: '4', label: 'Скорее типично' },
  { value: '5', label: 'Очень типично' },
];

const items = [
  'Если я не успеваю сделать всё запланированное, я не беспокоюсь об этом.',
  'Тревога одерживает надо мной верх.',
  'Я не склонен беспокоиться о чём-либо.',
  'Многие ситуации заставляют меня беспокоиться.',
  'Я знаю, что мне не следует беспокоиться, но я просто не могу ничего с этим сделать.',
  'Когда на меня давят, я сильно беспокоюсь.',
  'Я всегда беспокоюсь о чём-то.',
  'Мне кажется, что отогнать беспокойные мысли — это просто.',
  'Как только я заканчиваю одно задание, я начинаю беспокоиться о следующих, которые мне нужно сделать.',
  'Я никогда ни о чём не беспокоюсь.',
  'Когда я больше не могу ничего сделать, я перестаю беспокоиться.',
  'Я был невротиком всю жизнь.',
  'Я замечаю, что беспокоюсь о чём-то.',
  'Начав беспокоиться, я не могу остановиться.',
  'Я беспокоюсь всё время.',
  'Я беспокоюсь о проектах, пока они не будут сделаны.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1423_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1423',
  title: 'Пенсильванский опросник беспокойства (PSWQ)',
  description: 'PSWQ оценивает устойчивую склонность к чрезмерному и трудно контролируемому беспокойству. Пункты охватывают его интенсивность, распространённость в разных ситуациях и ощущение невозможности остановить тревожные мысли; пять утверждений сформулированы в обратном направлении. Русский перевод П. Ярышевой (2018) предназначен для оценки взрослых респондентов.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'worry', label: 'Склонность к беспокойству', items: Array.from({ length: 16 }, (_, i) => i + 1), reverseItems: [1, 3, 8, 10, 11], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Минимальные ответы: реверсивные пункты становятся максимальными',
    answers: Object.fromEntries(items.map((_, i) => [String(i + 1), 1])),
    expected: { worry: 36 },
  },
  {
    title: 'Максимальные ответы: реверсивные пункты становятся минимальными',
    answers: Object.fromEntries(items.map((_, i) => [String(i + 1), 5])),
    expected: { worry: 60 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'pswq-meyer-et-al-1990-yarysheva-ru-2018-reverse-1-3-8-10-11-v1',
};
