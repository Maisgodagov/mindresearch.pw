import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const choices = [
  { value: '1', label: 'Совершенно не согласен' },
  { value: '2', label: 'Частично не согласен' },
  { value: '3', label: 'Не определился' },
  { value: '4', label: 'Частично согласен' },
  { value: '5', label: 'Полностью согласен' },
];

const statements = [
  'Я нахожусь в затруднительном положении, из которого нет выхода',
  'Мне пора сдаться, т.к. я ничего не могу изменить к лучшему',
  'Бывало, что я наносил себе физический вред или пытался убить себя',
  'Я могу думать только о плохом, что происходит в моей жизни',
  'Вы часто чувствуете себя одиноким?',
  'Иногда я не могу сдержать желание ударить другого человека',
  'Всем будет легче если меня не станет',
];

const questions: SeedSection['questions'] = statements.map((text, index) => ({
  code: `test_1027_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: choices,
}));

export const instrument: SeedSection = {
  code: 'test_1027',
  title: 'Опросник кризисного состояния несовершеннолетнего (ОКС-7)',
  description: 'Краткий опросник для первичной оценки выраженности кризисных переживаний у несовершеннолетних: безвыходности, безнадёжности, самоповреждения, негативных руминаций, одиночества, агрессии и ощущения себя обузой. Помогает специалисту заметить основания для индивидуальной клинической оценки; не предназначен для самостоятельного прогноза суицидального поведения.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [{
    key: 'crisis_indicators',
    label: 'Кризисные переживания (пункты 1–7)',
    items: [1, 2, 3, 4, 5, 6, 7],
    reverseItems: [],
    aggregation: 'sum',
  }],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: минимальные ответы, критерий скрининга не достигнут',
    answers: { '1': 1, '2': 1, '3': 1, '4': 1, '5': 1, '6': 1, '7': 1 },
    expected: { crisis_indicators: 7 },
  },
  {
    title: 'Ручная проверка: высокий ответ по пункту 3; интерпретационный критерий достигнут',
    answers: { '1': 1, '2': 1, '3': 4, '4': 1, '5': 1, '6': 1, '7': 1 },
    expected: { crisis_indicators: 10 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'oks-7-akhapkin-et-al-2024-ru-v1',
};
