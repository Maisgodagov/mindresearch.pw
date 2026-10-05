import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Очень медленно' },
  { value: '2', label: 'Медленно' },
  { value: '3', label: 'Ни медленно, ни быстро' },
  { value: '4', label: 'Быстро' },
  { value: '5', label: 'Очень быстро' },
];

const items = [
  'Я нахожу, что время идет...',
  'Когда я читаю...',
  'Когда я ем...',
  'Когда я один...',
  'Когда я с людьми...',
  'Когда я развлекаюсь...',
  'Когда я занят...',
  'Когда я свободен...',
  'Когда я иду пешком...',
  'Когда я определяю время в эксперименте...',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1833_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1833',
  title: 'Тест осознавания времени (ТОВ)',
  description: 'Тест оценивает субъективную скорость течения времени в целом и в девяти повседневных ситуациях. Профиль ответов помогает автору опроса описать переживание замедления или ускорения времени; русская адаптация предназначена для клинического применения у пациентов с аффективными расстройствами и оценки изменений состояния.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'mean_time_speed', label: 'Средняя субъективная скорость течения времени', items: Array.from({ length: 10 }, (_, index) => index + 1), reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: нейтральная оценка по всем пунктам',
    answers: Object.fromEntries(Array.from({ length: 10 }, (_, index) => [String(index + 1), 3])),
    expected: { mean_time_speed: 3 },
  },
  {
    title: 'Ручная проверка: сумма десяти ответов делится на число пунктов',
    answers: Object.fromEntries(Array.from({ length: 10 }, (_, index) => [String(index + 1), index < 5 ? 1 : 5])),
    expected: { mean_time_speed: 3 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'solomon-time-awareness-test-simutkin-golovin-2003-v1',
};
