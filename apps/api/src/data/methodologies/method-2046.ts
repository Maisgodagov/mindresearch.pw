import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

// Russian 30-item ARS-30 wording and vignette from the Postylakova adaptation
// display form; reverse key and factor membership follow Cassidy's author key.
const answers = [
  { value: '1', label: 'Очень маловероятно' },
  { value: '2', label: 'Маловероятно' },
  { value: '3', label: 'Возможно' },
  { value: '4', label: 'Вероятно' },
  { value: '5', label: 'Скорее всего' },
];

const items = [
  'Я бы не согласился с отзывом преподавателей.',
  'Я бы использовал их отзывы, чтобы улучшить свою работу.',
  'Я бы просто сдался.',
  'Я бы использовал эту ситуацию, чтобы мотивировать себя.',
  'Я бы изменил свои карьерные планы.',
  'Я бы, наверное, стал раздражаться.',
  'Я бы начал думать, что мои шансы на успехи в университете очень слабы.',
  'Я бы стал рассматривать эту ситуацию как вызов.',
  'Я бы сделал всё возможное, чтобы перестать думать негативно.',
  'Я бы рассматривал эту ситуацию как временную.',
  'Я бы работал усерднее.',
  'Я бы, наверное, впал в депрессию.',
  'Я бы попытался придумать новые решения.',
  'Я был бы очень разочарован.',
  'Я бы обвинял преподавателя.',
  'Я бы продолжал стараться.',
  'Я бы не стал менять свои долгосрочные цели и амбиции.',
  'Я бы использовал свои прошлые успехи, чтобы помочь себе в мотивации.',
  'Я бы начал думать, что мои шансы получить работу, которую я хочу, очень низкие.',
  'Я бы начал отслеживать и оценивать свои достижения и усилия.',
  'Я бы обратился за помощью к своим преподавателям.',
  'Я бы сам себя поддерживал.',
  'Я бы запретил себе паниковать.',
  'Я бы старался учиться разными способами.',
  'Я бы поставил перед собой свои собственные цели для достижения.',
  'Я бы искал поддержки у моей семьи и друзей.',
  'Я бы старался больше думать о своих сильных и слабых сторонах, чтобы помочь себе работать лучше.',
  'Я бы чувствовал себя так, будто всё рухнуло и теперь так плохо и останется.',
  'Я бы начал сам устанавливать себе награды и наказания в зависимости от моих достижений.',
  'Я бы с нетерпением искал случая, чтобы показать, что я могу улучшить свои оценки.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2060_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: answers,
}));

export const instrument: SeedSection = {
  code: 'test_2060',
  title: 'Шкала академической жизнеспособности ARS-30 (адаптация Ю. В. Постыляковой)',
  description: 'ARS-30 оценивает академическую жизнеспособность студентов через предполагаемые когнитивно-эмоциональные и поведенческие реакции на учебные неудачи и критику. Шкала охватывает настойчивость, рефлексию и адаптивный поиск помощи, а также негативный аффект и эмоциональную реакцию; предназначена для исследовательских опросов студентов в ситуации академических трудностей.',
  questions,
};

const reverseItems = [2, 4, 8, 9, 10, 11, 13, 16, 17, 18, 20, 21, 22, 23, 24, 25, 26, 27, 29, 30];
const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'total', label: 'Общий балл академической жизнеспособности', items: Array.from({ length: 30 }, (_, i) => i + 1), reverseItems, aggregation: 'sum' },
    { key: 'perseverance', label: 'Настойчивость', items: [1, 2, 3, 4, 5, 8, 9, 10, 11, 13, 15, 16, 17, 30], reverseItems: reverseItems.filter(item => [1, 2, 3, 4, 5, 8, 9, 10, 11, 13, 15, 16, 17, 30].includes(item)), aggregation: 'sum' },
    { key: 'reflection_help', label: 'Рефлексия и адаптивный поиск помощи', items: [18, 20, 21, 22, 24, 25, 26, 27, 29], reverseItems: [18, 20, 21, 22, 24, 25, 26, 27, 29], aggregation: 'sum' },
    { key: 'negative_affect', label: 'Негативный аффект и эмоциональная реакция', items: [6, 7, 12, 14, 19, 23, 28], reverseItems: [23], aggregation: 'sum' },
  ],
};

// Manual check: all responses at 3 stay 3 under 1..5 reversal; each sum is
// its number of items multiplied by 3.
const validationCases: ValidationCase[] = [{
  title: 'Ручная проверка: нейтральные ответы 3 по всем 30 пунктам',
  answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 3])),
  expected: { total: 90, perseverance: 42, reflection_help: 27, negative_affect: 21 },
}];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'ars-30-cassidy-2016-postylakova-ru-2021-author-key-v1',
};
