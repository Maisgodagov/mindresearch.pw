import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'Точно не засну' },
  { value: '1', label: 'Очень небольшая вероятность заснуть' },
  { value: '2', label: 'Вероятно, могу заснуть' },
  { value: '3', label: 'Очень большая вероятность, что засну' },
];

const items = [
  'Когда сижу и читаю.',
  'Когда смотрю телевизор.',
  'Когда пассивно сижу в кресле на публичном мероприятии (например, в театре, на собрании).',
  'Когда еду в машине как пассажир в течение часа без остановок.',
  'Когда обстоятельства позволили прилечь отдохнуть в дневное время.',
  'Когда сижу и с кем-то разговариваю.',
  'Когда спокойно сижу после обеда (без употребления алкоголя).',
  'За рулем автомобиля, когда остановился на несколько минут в пробке.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2571_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2571',
  title: 'Эпвортская шкала сонливости (ESS), русский перевод psytests.org (2024)',
  description: 'Шкала оценивает субъективную вероятность задремать или уснуть в восьми повседневных ситуациях и даёт суммарную оценку общей дневной склонности ко сну. Она может помочь автору опроса собрать показатель дневной сонливости у взрослых; эта регистрация использует русский перевод psytests.org 2024 года, который источник обозначает как неадаптированный, поэтому результат предназначен для ориентировочной оценки, а не диагноза.',
  categoryIds: ['clinical-sleep'],
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 3,
  scales: [{
    key: 'total',
    label: 'Суммарная дневная склонность ко сну (ESS)',
    items: [1, 2, 3, 4, 5, 6, 7, 8],
    reverseItems: [],
    aggregation: 'sum',
  }],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: для каждого из восьми пунктов выбран ответ 0',
    answers: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0, '6': 0, '7': 0, '8': 0 },
    expected: { total: 0 },
  },
  {
    title: 'Ручная проверка: ответы 0–3 по порядку дают сумму 12',
    answers: { '1': 0, '2': 1, '3': 2, '4': 3, '5': 0, '6': 1, '7': 2, '8': 3 },
    expected: { total: 12 },
  },
  {
    title: 'Ручная проверка: для каждого из восьми пунктов выбран ответ 3',
    answers: { '1': 3, '2': 3, '3': 3, '4': 3, '5': 3, '6': 3, '7': 3, '8': 3 },
    expected: { total: 24 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'ess-johns-1991-psytests-ru-2024-sum-8-v1',
};
