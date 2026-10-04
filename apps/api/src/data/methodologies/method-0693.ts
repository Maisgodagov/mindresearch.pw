import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Совершенно не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Скорее не согласен' },
  { value: '4', label: 'Нечто среднее' },
  { value: '5', label: 'Скорее согласен' },
  { value: '6', label: 'Согласен' },
  { value: '7', label: 'Полностью согласен' },
];

const items = [
  'Моя жизнь в целом имеет смысл.',
  'Все мое существование наполнено смыслом.',
  'Моя жизнь бессмысленна.',
  'Мое существование лишено смысла.',
  'Я могу понять смысл того, что происходит в моей жизни.',
  'Когда я смотрю на мою жизнь в целом, многое кажется мне понятным.',
  'Я не могу найти смысл в событиях моей жизни.',
  'У меня есть ясное ощущение того, чего я пытаюсь достичь в жизни.',
  'У меня есть определенные жизненные цели, побуждающие меня двигаться вперед.',
  'Я не знаю, чего я пытаюсь достичь в жизни.',
  'У меня нет убедительных жизненных целей, которые заставляют меня двигаться вперед.',
  'Факт моей жизни важен даже в масштабе Вселенной.',
  'Даже учитывая, насколько велика Вселенная, могу сказать, что моя жизнь имеет значение.',
  'Мое существование не имеет ценности на фоне глобальных процессов.',
  'Учитывая необъятность Вселенной, моя жизнь не имеет значения.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_724_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_724',
  title: 'Многомерная методика экзистенциального смысла (ММЭС, MEMS)',
  description: 'Методика оценивает субъективный смысл жизни по четырём шкалам: суждениям о смысле жизни, связности жизненного опыта, целенаправленности и экзистенциальной значимости собственной жизни. Подходит для исследовательских и опросных задач со взрослыми и старшими подростками; русская 15-пунктовая версия проверялась на выборках участников 17–67 лет. Результаты помогают различать общий смысл жизни и его когнитивные, мотивационные и значимостные компоненты.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'meaningJudgments', label: 'Суждения о смысле жизни', items: [1, 2, 3, 4], reverseItems: [3, 4], aggregation: 'sum' },
    { key: 'coherence', label: 'Связность', items: [5, 6, 7], reverseItems: [7], aggregation: 'sum' },
    { key: 'purpose', label: 'Целенаправленность', items: [8, 9, 10, 11], reverseItems: [10, 11], aggregation: 'sum' },
    { key: 'mattering', label: 'Значимость', items: [12, 13, 14, 15], reverseItems: [14, 15], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: все ответы 1; реверсивные пункты преобразуются в 7',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { meaningJudgments: 16, coherence: 15, purpose: 22, mattering: 22 },
  },
  {
    title: 'Ручная проверка: все ответы 7; реверсивные пункты преобразуются в 1',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 7])),
    expected: { meaningJudgments: 12, coherence: 9, purpose: 16, mattering: 16 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'mems-ru-emelianchuk-leontiev-2026-15items-sum-reverse-3-4-7-10-11-14-15-v1',
};
