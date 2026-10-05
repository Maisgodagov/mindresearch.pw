import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const statements = [
  'Чувствуете ли Вы запах во время еды или приготовления пищи?',
  'Чувствуете ли Вы запах свежей выпечки?',
  'Чувствуете ли Вы запах рыбы или морепродуктов (креветки, морская капуста и пр.)?',
  'Чувствуете ли Вы запах чая или кофе?',
  'Чувствуете ли Вы запах фруктов?',
  'Чувствуете ли Вы запах жареного мяса (на гриле, на мангале и пр.)?',
  'Чувствуете ли Вы запах мыла или шампуня?',
  'Чувствуете ли Вы запах зубной пасты?',
  'Чувствуете ли Вы запах сигарет?',
  'Чувствуете ли Вы запах туалета?',
  'Чувствуете ли Вы запах гари или дыма?',
];
const options = [
  { value: '0', label: 'Никогда (0%)' },
  { value: '1', label: 'Редко (20%)' },
  { value: '2', label: 'Иногда (50%)' },
  { value: '3', label: 'Часто (70%)' },
  { value: '4', label: 'Всегда (100%)' },
];
const questions: SeedSection['questions'] = statements.map((text, index) => ({
  code: `test_1088_${index + 1}`, text, type: 'single', required: true, options,
}));

export const instrument: SeedSection = {
  code: 'test_1088',
  title: 'Опросник обонятельной дисфункции (OQ), русскоязычная адаптация',
  description: 'Опросник оценивает субъективную способность распознавать запахи в повседневных ситуациях. Один общий показатель отражает самооценку обоняния по бытовым, пищевым и окружающим запахам; русскоязычная версия адаптирована и исследована на выборке участников 16–37 лет. Результат помогает автору опроса описать выраженность возможных нарушений обоняния в исследовательском или диагностическом контексте.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 4,
  scales: [{ key: 'total', label: 'Общий балл обонятельной функции', items: statements.map((_, i) => i + 1), reverseItems: [], aggregation: 'sum' }],
};

const validationCases: ValidationCase[] = [
  { title: 'Все ответы «Никогда»: минимальный общий балл', answers: Object.fromEntries(statements.map((_, i) => [String(i + 1), 0])), expected: { total: 0 } },
  { title: 'Ручная проверка: ответы 4, 3 и 2, остальные нулевые', answers: Object.fromEntries(statements.map((_, i) => [String(i + 1), [4, 3, 2][i] ?? 0])), expected: { total: 9 } },
  { title: 'Все ответы «Всегда»: максимальный общий балл', answers: Object.fromEntries(statements.map((_, i) => [String(i + 1), 4])), expected: { total: 44 } },
];

export const methodology: MethodologyRegistration = {
  instrument, scoringConfig, validationCases, formulaVersion: 'oq-dobretsov-kashirsky-ru-2023-sum-11-v1',
  details: {
    version: 'Русскоязычная адаптация OQ, 11 пунктов (2023)',
    summary: instrument.description!,
    steps: ['Для каждого запаха выбирается частота его ощущения от «Никогда» до «Всегда».', 'Вариантам присваиваются баллы 0, 1, 2, 3 и 4 соответственно; общий балл равен сумме ответов по 11 пунктам (0–44).', 'Для русскоязычной выборки публикация приводит диапазоны: 39–44 — нормосмия; 31–38 — лёгкая гипосмия; 18–30 — гипосмия средней тяжести; 11–17 — тяжёлая гипосмия; 0–10 — аносмия.'],
    keys: [{ label: 'Общий балл', value: 'Сумма пунктов 1–11; каждый оценивается 0–4. Реверсивных пунктов нет. Диапазон 0–44.' }],
    notes: ['Вопросы 2 и 3 русской адаптации заменены относительно корейского оригинала; использован текст приложения русскоязычной публикации.', 'Категории общего балла для российской выборки опубликованы в статье адаптации; они являются исследовательскими порогами данной версии.'],
    sources: [
      { title: 'Добрецов К. Г., Каширский Д. В. Опросник обонятельной дисфункции: русскоязычная адаптация методики Olfactory Questionnaire (OQ) — публикация с приложением-бланком и шкалами российской выборки', url: 'https://www.mediasphera.ru/issues/rossijskaya-rinologiya/2023/3/1086954742023031201' },
      { title: 'Kim J. W. et al. Validation of Olfactory Questionnaire in Koreans: an Alternative for Conventional Psychophysical Olfactory Tests — первичная статья OQ', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7870423/' },
      { title: 'Опросник обонятельной дисфункции (OQ) — русская страница методики Psytests', url: 'https://psytests.org/diag/oq.html' },
    ],
  },
};
