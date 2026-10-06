import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Не согласен' },
  { value: '2', label: 'Скорее не согласен' },
  { value: '3', label: 'Нечто среднее' },
  { value: '4', label: 'Скорее согласен' },
  { value: '5', label: 'Согласен' },
];

const items = [
  'Мне трудно чем-либо мотивировать себя в работе.',
  'Я безразличен к своей работе.',
  'Я не испытываю интеллектуального вовлечения в свою работу.',
  'Я эмоционально отстранен от своей работы.',
  'Мое отношение к работе можно охарактеризовать как пассивное.',
  'Если я сразу не найду чего-то, что необходимо для выполнения рабочего задания, то достаточно быстро прекращу поиски.',
  'Хотя я и выполняю всё, что мне поручено, я обычно не работаю усердней, чем необходимо.',
  'Работа с результатом среднего качества кажется мне вполне допустимой.',
  'Когда появляются новые рабочие задачи, я не возражаю, если за них берутся другие.',
  'Обычно я не проявляю инициативу, когда начальство распределяет задания.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2343_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

const instrument: SeedSection = {
  code: 'test_2343',
  title: 'Шкала профессиональной апатии (JAS), русская адаптация',
  description: 'Шкала оценивает профессиональную апатию у работающих взрослых по двум аспектам: апатичным мыслям (снижению интереса и эмоциональной приверженности к работе) и апатичным действиям (ослаблению усилий и инициативы при решении рабочих задач). Подходит для исследовательских опросов сотрудников; не является диагностикой выгорания.',
  categoryIds: ['work'],
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'apathetic_thoughts', label: 'Апатичные мысли', items: [1, 2, 3, 4, 5], reverseItems: [], aggregation: 'sum' },
    { key: 'apathetic_actions', label: 'Апатичные действия', items: [6, 7, 8, 9, 10], reverseItems: [], aggregation: 'sum' },
    { key: 'overall_apathy', label: 'Общая профессиональная апатия', items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы «Не согласен»',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { apathetic_thoughts: 5, apathetic_actions: 5, overall_apathy: 10 },
  },
  {
    title: 'Все ответы «Согласен»',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 5])),
    expected: { apathetic_thoughts: 25, apathetic_actions: 25, overall_apathy: 50 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['work'],
  scoringConfig,
  validationCases,
  formulaVersion: 'jas-zolotareva-2020-v1',
};
