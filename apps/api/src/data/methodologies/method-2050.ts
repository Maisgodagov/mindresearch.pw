import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Согласен' },
  { value: '0', label: 'Не согласен' },
];

const items = [
  'Все стало настолько неопределенно в наши дни, что уже кажется, что может случиться всё что угодно.',
  'Чего не хватает в мире в наше время, так это старой дружбы длиною в жизнь.',
  'В таком беспорядке, в котором все находится в наше время, человеку становится день ото дня сложнее понимать свое место.',
  'В наши дни все меняется так быстро, что мне зачастую бывает сложно определить, каким правилам нужно следовать.',
  'Я часто чувствую, что многие вещи, основополагающие для наших родителей, вот-вот рухнут на наших глазах.',
  'Проблема сегодняшнего мира состоит в том, что большинство людей толком ни во что не верят.',
  'Я часто чувствую себя не в своей тарелке, неприкаянным.',
  'В прежние времена людям было лучше, поскольку каждый знал, какого поведения от него ожидали.',
  'Мне кажется, что другим людям проще чем мне принимать решения, что хорошо и что плохо.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2064_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2064',
  title: 'Шкала аномии МакКлоски и Шаар',
  description: 'Девятипунктовая шкала оценивает субъективное переживание аномии: ощущение неопределённости и утраты понятных правил, ослабления устойчивых социальных связей, ценностной дезориентации и затруднений в суждениях о правильном и неправильном. Подходит для исследовательских опросов взрослых; исходная версия МакКлоски и Шаар разработана для взрослого населения США.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 1,
  scales: [
    { key: 'anomy', label: 'Суммарный балл аномии', items: [1, 2, 3, 4, 5, 6, 7, 8, 9], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы «Не согласен»',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 0])),
    expected: { anomy: 0 },
  },
  {
    title: 'Все ответы «Согласен»',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { anomy: 9 },
  },
  {
    title: 'Проверка порога: согласие с первыми шестью утверждениями',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), index < 6 ? 1 : 0])),
    expected: { anomy: 6 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'mcclosky-schaar-anomy-ru-lytkina-2014-v1',
};
