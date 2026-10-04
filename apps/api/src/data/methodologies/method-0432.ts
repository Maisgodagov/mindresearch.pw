import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const frequency = [
  { value: '1', label: 'Всегда' },
  { value: '2', label: 'Часто' },
  { value: '3', label: 'Иногда' },
  { value: '4', label: 'Редко' },
  { value: '5', label: 'Никогда / Почти никогда' },
];
const degree = [
  { value: '1', label: 'В очень высокой степени' },
  { value: '2', label: 'В высокой степени' },
  { value: '3', label: 'Нечто среднее' },
  { value: '4', label: 'В малой степени' },
  { value: '5', label: 'В очень малой степени' },
];

const prompts = [
  'Как часто вы чувствуете себя уставшим?',
  'Как часто вы чувствуете себя физически истощенным?',
  'Как часто вы чувствуете себя эмоционально истощенным?',
  'Как часто вы думаете: «Я больше не могу это выносить!»?',
  'Как часто вы чувствуете себя изможденным?',
  'Как часто вы чувствуете себя ослабленным и уязвимым для болезней?',
  'Вы чувствуете себя «выжатым» к концу рабочего дня?',
  'Вы ощущаете бессилие по утрам при одной только мысли о предстоящем рабочем дне?',
  'Чувствуете ли вы, что каждый рабочий час для вас утомителен?',
  'Хватает ли у вас энергии на семью и друзей в свободное от работы время?',
  'Ваша работа эмоционально изматывающая?',
  'Ваша работа вас разочаровывает?',
  'Вы чувствуете себя выгоревшим из-за своей работы?',
  'Считаете ли вы, что работать с клиентами тяжело?',
  'Работа с клиентами отнимает у вас много энергии?',
  'Работа с клиентами вас раздражает?',
  'Вы чувствуете, что отдаете больше, чем получаете взамен, работая с клиентами?',
  'Вы устаете от работы с клиентами?',
  'Задумываетесь ли вы иногда, надолго ли вас хватит в работе с клиентами?',
];

const questions: SeedSection['questions'] = prompts.map((text, index) => ({
  code: `test_468_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: index < 10 || index >= 17 ? frequency : degree,
}));

export const instrument: SeedSection = {
  code: 'test_468',
  title: 'Копенгагенский опросник выгорания (CBI), русскоязычная версия psytests.org (2025)',
  description: 'CBI оценивает выраженность истощения в трех контекстах: общее личное истощение, истощение, связанное с работой, и истощение при работе с клиентами или другими людьми. Подходит для взрослых респондентов, в том числе работников помогающих и иных профессий; шкала клиентского выгорания применима только к тем, кто работает с клиентами. Доступный русский перевод psytests.org (2025) не заявлен как российская адаптация.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'personal', label: 'Личное выгорание', items: [1, 2, 3, 4, 5, 6], reverseItems: [], aggregation: 'mean', weights: { 1: 100, 2: 75, 3: 50, 4: 25, 5: 0, 6: 0 } },
    { key: 'work', label: 'Выгорание, связанное с работой', items: [7, 8, 9, 10, 11, 12, 13], reverseItems: [10], aggregation: 'mean', weights: { 7: 100, 8: 75, 9: 50, 10: 25, 11: 0, 12: 0, 13: 0 } },
    { key: 'client', label: 'Выгорание, связанное с клиентами', items: [14, 15, 16, 17, 18, 19], reverseItems: [], aggregation: 'mean', weights: { 14: 100, 15: 75, 16: 50, 17: 25, 18: 0, 19: 0 } },
  ],
};
// Scores map responses to 100, 75, 50, 25, 0 in order; item 10 is reverse keyed.
const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: ответ с максимальным истощением во всех пунктах; пункт 10 обратный',
    answers: Object.fromEntries(Array.from({ length: 19 }, (_, index) => [String(index + 1), index === 9 ? 5 : 1])),
    expected: { personal: 100, work: 100, client: 100 },
  },
  {
    title: 'Ручная проверка: средний ответ даёт по 50 баллов на каждой шкале',
    answers: Object.fromEntries(Array.from({ length: 19 }, (_, index) => [String(index + 1), 3])),
    expected: { personal: 50, work: 50, client: 50 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'cbi-kristensen-2005-psytests-ru-2025-v1',
};
