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
  'Я склонен манипулировать другими, чтобы добиться своего.',
  'Я использовал обман или ложь для достижения своих целей.',
  'Я использовал лесть для достижения своих целей.',
  'Я склонен использовать других людей в своих целях.',
  'Я склонен не испытывать угрызения совести.',
  'Я склонен не беспокоиться о моральных качествах моих поступков.',
  'Я склонен к бессердечности и нечувствительности.',
  'Я склонен к цинизму.',
  'Я бы хотел, чтобы мной восхищались другие люди.',
  'Я бы хотел, чтобы другие люди обращали на меня внимание.',
  'Я склонен к поиску престижа и социального статуса.',
  'Я бы хотел, чтобы другие люди делали мне особые одолжения.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1298_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

const instrument: SeedSection = {
  code: 'test_1298',
  title: 'Опросник «Тёмная дюжина» (DTDD), русскоязычная версия Корниловой и др. (2015)',
  description: 'Краткий опросник для оценки трёх субклинических черт Тёмной триады: макиавеллизма, психопатии и нарциссизма. Четыре пункта каждой шкалы позволяют описать манипулятивно-инструментальную ориентацию, бессердечность и отсутствие угрызений совести, а также стремление к восхищению, вниманию и статусу. Русскоязычная версия Корниловой и коллег апробирована на участниках 17–62 лет и предназначена для исследовательской оценки неклинических личностных черт, а не для клинической диагностики.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'machiavellianism', label: 'Макиавеллизм', items: [1, 2, 3, 4], reverseItems: [], aggregation: 'sum' },
    { key: 'psychopathy', label: 'Психопатия', items: [5, 6, 7, 8], reverseItems: [], aggregation: 'sum' },
    { key: 'narcissism', label: 'Нарциссизм', items: [9, 10, 11, 12], reverseItems: [], aggregation: 'sum' },
  ],
};

// All-minimum response checked against the published scale key: each four-item scale sums to 4.
const validationCases: ValidationCase[] = [{
  title: 'Минимальный ответ по всем пунктам',
  answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
  expected: { machiavellianism: 4, psychopathy: 4, narcissism: 4 },
}];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'dtdd-kornilova-ru-2015-12item-three-sums-v1',
};
