import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Полностью не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Скорее не согласен' },
  { value: '4', label: 'Нечто среднее' },
  { value: '5', label: 'Скорее согласен' },
  { value: '6', label: 'Согласен' },
  { value: '7', label: 'Полностью согласен' },
];

const items = [
  'Это занятие дарит мне богатые переживания.',
  'То новое, которое я открываю для себя в этом занятии, позволяет мне ценить его ещё сильнее.',
  'Это занятие оставляет у меня незабываемые впечатления.',
  'Это занятие позволяет мне проявлять мои лучшие качества.',
  'Это занятие находится в гармонии с другими моими жизненными делами.',
  'Это занятие — моя страсть, с которой я всё же могу справиться.',
  'Я полностью увлечён этим занятием.',
  'Я не могу жить без этого занятия.',
  'Желание этим заниматься настолько сильное, что я не могу от него удержаться.',
  'Я с трудом представляю свою жизнь без этого занятия.',
  'Я испытываю эмоциональную привязанность к этому занятию.',
  'Мне сложно контролировать свою потребность в этом занятии.',
  'Я испытываю практически одержимое влечение к этому занятию.',
  'Моё настроение зависит от того, могу ли я заниматься этим делом.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2440_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2440',
  title: 'Шкала страсти к делу Р. Валлеранда (русскоязычная адаптация)',
  description: 'Русскоязычная адаптация шкалы оценивает выраженность страсти к выбранной учебной, профессиональной, спортивной или иной значимой деятельности. Она различает гармоничную страсть, сочетающую увлечённость и согласованность с другими сторонами жизни, и одержимую страсть, связанную с сильной потребностью, эмоциональной зависимостью и трудностью контроля. Подходит для русскоязычных респондентов; исследователям полезна для сопоставления этих двух аспектов отношения к конкретному занятию.',
  categoryIds: ['work'],
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'harmonious_passion', label: 'Гармоничная страсть', items: [1, 2, 3, 4, 5, 6, 7], reverseItems: [], aggregation: 'sum' },
    { key: 'obsessive_passion', label: 'Одержимая страсть', items: [8, 9, 10, 11, 12, 13, 14], reverseItems: [], aggregation: 'sum' },
    { key: 'total_passion', label: 'Общий показатель страсти', items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы минимальны: каждая семипунктовая субшкала равна 7',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { harmonious_passion: 7, obsessive_passion: 7, total_passion: 14 },
  },
  {
    title: 'Проверка границ: гармоничная страсть минимальна, одержимая максимальна',
    answers: { '1': 1, '2': 1, '3': 1, '4': 1, '5': 1, '6': 1, '7': 1, '8': 7, '9': 7, '10': 7, '11': 7, '12': 7, '13': 7, '14': 7 },
    expected: { harmonious_passion: 7, obsessive_passion: 49, total_passion: 56 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'vallerand-passion-scale-zolotareva-ru-14item-7point-sums-v1',
};
