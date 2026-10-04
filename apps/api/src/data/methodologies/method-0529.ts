import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const categories = [
  'Неудовлетворенность',
  'Одиночество',
  'Свобода',
  'Грех',
  'Страдание',
  'Ответственность',
  'Страх смерти',
  'Бессмысленность',
];
const times = ['Прошлое', 'Настоящее', 'Будущее'];
const options = Array.from({ length: 7 }, (_, value) => ({
  value: String(value),
  label: value === 0 ? 'Полностью отсутствует' : value === 6 ? 'Постоянно присутствует' : String(value),
}));

const questions: SeedSection['questions'] = categories.flatMap((category, categoryIndex) =>
  times.map((time, timeIndex) => ({
    code: `test_564_${categoryIndex * times.length + timeIndex + 1}`,
    text: `${category}: оцените проявленность в вашей жизни — ${time.toLowerCase()}.`,
    type: 'single' as const,
    required: true,
    options,
  })),
);

export const instrument: SeedSection = {
  code: 'test_564',
  title: 'Методика диагностики духовного кризиса (ДДК)',
  description: 'Экспериментальная самооценочная методика Л. В. Шутовой и А. В. Ляшук для описания вероятности и временной динамики духовного кризиса. Охватывает неудовлетворенность, одиночество, свободу, грех, страдание, ответственность, страх смерти и бессмысленность в прошлом, настоящем и будущем; предназначена для взрослых респондентов и может помочь автору опроса исследовать экзистенциальные переживания, не являясь клиническим диагнозом.',
  questions,
};

const items = Array.from({ length: 24 }, (_, index) => index + 1);
const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 6,
  scales: [
    { key: 'spiritual_crisis_pct', label: 'Вероятность духовного кризиса, %', items, reverseItems: [], aggregation: 'sum', weights: Object.fromEntries(items.map(item => [item, 100 / 144])) },
    { key: 'existential_vacuum_pct', label: 'Напряженность экзистенциального вакуума, %', items: [4, 5, 6, 7, 8, 16, 17, 18, 22, 23, 24], reverseItems: [], aggregation: 'sum', weights: Object.fromEntries([4, 5, 6, 7, 8, 16, 17, 18, 22, 23, 24].map(item => [item, 100 / 90])) },
    { key: 'past_pct', label: 'Временной коэффициент: прошлое, %', items: [1, 4, 7, 10, 13, 16, 19, 22], reverseItems: [], aggregation: 'sum', weights: Object.fromEntries([1, 4, 7, 10, 13, 16, 19, 22].map(item => [item, 100 / 48])) },
    { key: 'present_pct', label: 'Временной коэффициент: настоящее, %', items: [2, 5, 8, 11, 14, 17, 20, 23], reverseItems: [], aggregation: 'sum', weights: Object.fromEntries([2, 5, 8, 11, 14, 17, 20, 23].map(item => [item, 100 / 48])) },
    { key: 'future_pct', label: 'Временной коэффициент: будущее, %', items: [3, 6, 9, 12, 15, 18, 21, 24], reverseItems: [], aggregation: 'sum', weights: Object.fromEntries([3, 6, 9, 12, 15, 18, 21, 24].map(item => [item, 100 / 48])) },
  ],
};

const allAnswers = (value: number) => Object.fromEntries(items.map(item => [String(item), value]));
const validationCases: ValidationCase[] = [
  { title: 'Все оценки минимальны', answers: allAnswers(0), expected: { spiritual_crisis_pct: 0, existential_vacuum_pct: 0, past_pct: 0, present_pct: 0, future_pct: 0 } },
  { title: 'Все оценки максимальны', answers: allAnswers(6), expected: { spiritual_crisis_pct: 100, existential_vacuum_pct: 100, past_pct: 100, present_pct: 100, future_pct: 100 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'ddk-shutova-lyashuk-2005-v1',
};
