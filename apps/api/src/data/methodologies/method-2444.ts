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
  { value: '7', label: 'Совершенно согласен' },
];

const items = [
  'Я плохо выношу неопределенные ситуации.',
  'Мне бывает трудно реагировать на непредвиденные события.',
  'Я не думаю, что новые ситуации более опасны, чем привычные.',
  'Меня привлекают ситуации, которые можно по-разному истолковать.',
  'Я бы предпочел избежать решения проблем, которые необходимо рассматривать с разных точек зрения.',
  'Я пытаюсь избегать неопределенных ситуаций.',
  'Я хорошо справляюсь с непредсказуемыми ситуациями.',
  'Я предпочитаю привычные ситуации новым.',
  'Проблемы, которые нельзя рассмотреть только с одной точки зрения, несколько пугают меня.',
  'Я избегаю ситуаций, которые слишком трудны для моего понимания.',
  'Я терпим к неопределенным ситуациям.',
  'Мне нравится решать сложные проблемы, которые допускают неоднозначное толкование.',
  'Я стараюсь избегать проблем, которые, по-видимому, не имеют единственного «лучшего» решения.',
  'Я часто ищу что-то новое и не стараюсь сохранять все по-старому в своей жизни.',
  'Как правило, я предпочитаю новое, нежели привычное.',
  'Мне не нравятся неопределенные ситуации.',
  'Некоторые проблемы так сложны, что попытка понять их доставляет удовольствие.',
  'Я без особого труда справляюсь с неожиданными ситуациями.',
  'Мне нравится заниматься проблемами, которые своей сложностью ставят в тупик некоторых людей.',
  'Мне тяжело делать выбор, когда его результат неясен.',
  'Мне нравится, когда мне время от времени делают сюрпризы.',
  'Я предпочитаю ситуации, в которых есть доля неопределенности.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2462_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

const instrument: SeedSection = {
  code: 'test_2462',
  title: 'Шкала толерантности к неопределенности Маклейна (MSTAT-I)',
  description: '22-пунктовая версия MSTAT-I оценивает индивидуальное отношение к неоднозначным стимулам и ситуациям: новизне, сложности, непредсказуемости и проблемам с несколькими возможными интерпретациями. Пункты охватывают как избегание неопределённости, так и интерес к ней; методика подходит для исследовательского самоотчёта взрослых и старших подростков, а русскоязычная факторная структура изучалась на студенческих выборках. Результаты помогают автору опроса сопоставлять общий уровень и отдельные аспекты отношения к неопределённости.',
  questions,
};

const allItems = Array.from({ length: 22 }, (_, index) => index + 1);
const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'novelty', label: 'Отношение к новизне', items: [8, 14, 15], reverseItems: [8], aggregation: 'sum' },
    { key: 'complexity', label: 'Отношение к сложным задачам', items: [5, 9, 10, 12, 13, 17, 19], reverseItems: [5, 9, 10, 13], aggregation: 'sum' },
    { key: 'ambiguity', label: 'Отношение к неопределённым ситуациям', items: [1, 2, 4, 6, 7, 11, 16, 18, 22], reverseItems: [1, 2, 6, 16], aggregation: 'sum' },
    { key: 'preference', label: 'Предпочтение неопределённости', items: [3, 4, 7, 11, 12, 14, 15, 17, 18, 19, 21, 22], reverseItems: [], aggregation: 'sum' },
    { key: 'tolerance_avoidance', label: 'Толерантность / избегание неопределённости', items: [1, 2, 5, 6, 8, 9, 10, 13, 16, 20], reverseItems: [1, 2, 5, 6, 8, 9, 10, 13, 16, 20], aggregation: 'sum' },
    { key: 'total', label: 'Общий балл толерантности к неопределённости', items: allItems, reverseItems: [1, 2, 5, 6, 8, 9, 10, 13, 16, 20], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: все ответы 1, десять обратных пунктов получают 7',
    answers: Object.fromEntries(allItems.map((item) => [String(item), 1])),
    expected: { novelty: 13, complexity: 23, ambiguity: 47, preference: 12, tolerance_avoidance: 60, total: 88 },
  },
  {
    title: 'Ручная проверка: все ответы 7, десять обратных пунктов получают 1',
    answers: Object.fromEntries(allItems.map((item) => [String(item), 7])),
    expected: { novelty: 13, complexity: 23, ambiguity: 47, preference: 84, tolerance_avoidance: 20, total: 66 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['regulation-uncertainty'],
  scoringConfig,
  validationCases,
  formulaVersion: 'mclain-mstat-i-lukovitskaya-osin-2010-v1',
};