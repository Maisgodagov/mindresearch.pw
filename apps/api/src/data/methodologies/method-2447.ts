import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const items = [
  'Чувство нервозности, тревоги или напряжения.',
  'Невозможность прекратить или контролировать переживания.',
  'Чрезмерное беспокойство.',
  'Ощущение страха.',
  'Неспособность прекратить думать о будущем изменении климата и других глобальных экологических проблемах.',
  'Неспособность прекратить думать о прошлых событиях, связанных с изменением климата.',
  'Неспособность прекратить думать о потерях для окружающей среды.',
  'Проблемы со сном.',
  'Трудности в получении удовольствия от общения с семьей и друзьями.',
  'Проблемы с работой и/или учебой.',
  'Ощущение тревоги по поводу влияния ваших личных действий на Землю.',
  'Ощущение тревоги по поводу личной ответственности за решение экологических проблем.',
  'Чувство тревоги по поводу того, что ваши усилия недостаточны для решения проблемы.',
];

const responseOptions = [
  { value: '0', label: 'Совсем не беспокоили' },
  { value: '1', label: 'Несколько раз за последние дни' },
  { value: '2', label: 'Больше половины этого времени' },
  { value: '3', label: 'Почти каждый день' },
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2465_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: responseOptions,
}));

export const instrument: SeedSection = {
  code: 'test_2465',
  title: 'Шкала тревоги из-за экологических проблем HEAS-13',
  description: 'Русскоязычная версия HEAS-13 оценивает тревогу, связанную с экологическими проблемами, по четырём аспектам: аффективные симптомы, навязчивые экологические мысли, поведенческие затруднения и беспокойство о личном воздействии на планету. Версия опубликована при адаптации на выборке взрослых волонтёров, ликвидировавших последствия экологической катастрофы в Чёрном море; результаты полезны для исследовательского описания этих компонентов и общего показателя экологической тревоги.',
  categoryIds: ['social-attitude'],
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 3,
  scales: [
    { key: 'affective', label: 'Аффективные симптомы', items: [1, 2, 3, 4], reverseItems: [], aggregation: 'sum' },
    { key: 'rumination', label: 'Руминация', items: [5, 6, 7], reverseItems: [], aggregation: 'sum' },
    { key: 'behavioral', label: 'Поведенческие симптомы', items: [8, 9, 10], reverseItems: [], aggregation: 'sum' },
    { key: 'personalImpact', label: 'Беспокойство по поводу личного воздействия на планету', items: [11, 12, 13], reverseItems: [], aggregation: 'sum' },
    { key: 'total', label: 'Общий показатель тревоги из-за экологических проблем', items: Array.from({ length: 13 }, (_, index) => index + 1), reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: все ответы «совсем не беспокоили» дают нулевые суммы',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 0])),
    expected: { affective: 0, rumination: 0, behavioral: 0, personalImpact: 0, total: 0 },
  },
  {
    title: 'Ручная проверка: ответы 1–13 по порядку; суммы факторов и общий итог',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), index + 1])),
    expected: { affective: 10, rumination: 18, behavioral: 27, personalImpact: 36, total: 91 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['social-attitude'],
  scoringConfig,
  validationCases,
  formulaVersion: 'heas-13-zolotareva-kazennaya-ugлова-2025-four-subscales-total-sum-0-3-v1',
};
