import type { SeedSection } from '../types.js';
import type { ConfigurableScoring, ValidationCase } from '../scoring/configurable.js';

const options = [
  { value: '1', label: '1 — Совершенно не верно' },
  { value: '2', label: '2 — Скорее неверно' },
  { value: '3', label: '3 — Нейтрально' },
  { value: '4', label: '4 — Скорее верно' },
  { value: '5', label: '5 — Совершенно верно' },
];

const items = [
  'Я свободно выражаю свои эмоции и чувства.',
  'Я сам(а) решаю сложные задачи, требующие продуманного решения.',
  'Я сам(а) решаю, что делаю после школы.',
  'Я сам(а) выбираю своих друзей.',
  'Когда я сочувствую другому человеку, я заражаюсь его эмоциями.',
  'Я сам(а) пытаюсь понять сложную проблему и проанализировать её.',
  'Я сам(а) могу выполнить даже сложные действия.',
  'Высказывания окружающих влияют на моё мнение.',
  'Я могу определить, что чувствую, и найти подходящие слова для того, чтобы описать свои эмоции и чувства.',
  'Я сам(а) планирую своё время.',
  'Мне нравится, когда кто-либо проверяет, как я сделал(а) ту или иную работу.',
  'Я всегда стремлюсь высказать своё мнение, даже если оно отлично от мнения других.',
];

export const karabanovaAutonomyRuInstrument: SeedSection = {
  code: 'test_51',
  title: 'Опросник автономии подростка (О. А. Карабанова, Н. Н. Поскребышева)',
  description: '12 утверждений для оценки общей личностной автономии и четырёх её компонентов: эмоционального, когнитивного, поведенческого и ценностного. Российская апробация описана на московской выборке подростков 14–16 лет.',
  questions: items.map((text, index) => ({ code: `test_51_${index + 1}`, text, type: 'single', required: true, options })),
};

export const karabanovaAutonomyRuScoring: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'emotional', label: 'Эмоциональная автономия', items: [1, 5, 9], reverseItems: [5], aggregation: 'sum' },
    { key: 'cognitive', label: 'Когнитивная автономия', items: [2, 6, 10], reverseItems: [], aggregation: 'sum' },
    { key: 'behavioral', label: 'Поведенческая автономия', items: [3, 7, 11], reverseItems: [11], aggregation: 'sum' },
    { key: 'values', label: 'Ценностная автономия', items: [4, 8, 12], reverseItems: [8], aggregation: 'sum' },
    // В опубликованном приложении общий балл предписан как сырая сумма всех 12 ответов.
    { key: 'total', label: 'Общий показатель автономии (сырая сумма по авторской инструкции)', items: Array.from({ length: 12 }, (_, index) => index + 1), reverseItems: [], aggregation: 'sum' },
  ],
};

const answers = (values: number[]) => Object.fromEntries(values.map((value, index) => [String(index + 1), value]));
export const karabanovaAutonomyRuValidationCases: ValidationCase[] = [
  { title: 'Минимальные ответы: проверка общего балла и обратных пунктов шкал', answers: answers(Array(12).fill(1)), expected: { emotional: 7, cognitive: 3, behavioral: 7, values: 7, total: 12 } },
  { title: 'Максимальные ответы: проверка диапазонов', answers: answers(Array(12).fill(5)), expected: { emotional: 11, cognitive: 15, behavioral: 11, values: 11, total: 60 } },
  { title: 'Смешанный протокол с разными значениями по каждому пункту', answers: answers([1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2]), expected: { emotional: 6, cognitive: 8, behavioral: 10, values: 9, total: 33 } },
];
