import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const itemTexts = [
  'К концу спора мы полностью и в равной мере выслушиваем друг друга.',
  'Когда мы начинаем ссориться или спорить, я думаю: «Ну вот, опять».',
  'В целом, я бы сказал(а), что мы неплохо решаем наши проблемы.',
  'Наши споры остаются неоконченными и нерешёнными.',
  'Мы по несколько дней не можем устранить наши разногласия.',
  'Наши споры, похоже, заканчиваются тупиком, вызывающим разочарование.',
  'Нам нужно улучшить то, как мы урегулируем наши разногласия.',
  'В целом, наши споры непродолжительны и быстро забываются.',
];

const options = [
  { value: '1', label: 'Совершенно не соответствует' },
  { value: '2', label: 'Не соответствует' },
  { value: '3', label: 'Отчасти соответствует и отчасти не соответствует' },
  { value: '4', label: 'Соответствует' },
  { value: '5', label: 'Полностью соответствует' },
];

const questions: SeedSection['questions'] = itemTexts.map((text, index) => ({
  code: `test_1085_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

const instrument: SeedSection = {
  code: 'test_1085',
  title: 'Опросник неэффективного решения конфликтов (IAI)',
  description: 'Опросник оценивает, насколько конструктивно пара справляется с разногласиями в близких романтических или супружеских отношениях. Восемь утверждений охватывают взаимное выслушивание, повторяемость и затянутость споров, тупиковые исходы и способность пары решать проблемы; версия Сычёва и Аношкина предназначена для взрослых, состоящих в добрачных или супружеских отношениях.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    {
      key: 'ineffectiveArguing',
      label: 'Неэффективность решения конфликтов',
      items: [1, 2, 3, 4, 5, 6, 7, 8],
      reverseItems: [1, 3, 8],
      aggregation: 'sum',
    },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы минимальные: обратные пункты дают максимум после реверса',
    answers: Object.fromEntries(itemTexts.map((_, index) => [String(index + 1), 1])),
    expected: { ineffectiveArguing: 20 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'kurdek-iai-sychev-anoshkin-2024-eight-item-v1',
};
