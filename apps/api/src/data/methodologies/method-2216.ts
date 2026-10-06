import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const silhouettes = Array.from({ length: 9 }, (_, index) => ({
  value: String(index + 1),
  label: `Силуэт ${index + 1}`,
}));

const items = [
  'Моя фигура соответствует фигуре №',
  'Идеальная фигура, которой мне хотелось бы обладать, — это фигура №',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2232_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: silhouettes,
}));

const instrument: SeedSection = {
  code: 'test_2232',
  title: 'Шкала образа тела CDRS (русскоязычная адаптация)',
  description: 'Визуальная шкала оценивает воспринимаемый размер собственного тела и желаемый размер тела по отдельным женским или мужским силуэтам, а также расхождение между ними как показатель неудовлетворённости телом. Подходит для скрининговых и исследовательских опросов русскоязычных взрослых и подростков; это краткая оценка образа тела, а не самостоятельная диагностика расстройства.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 9,
  scales: [
    { key: 'current', label: 'Воспринимаемый размер тела', items: [1], reverseItems: [], aggregation: 'sum' },
    { key: 'ideal', label: 'Идеальный размер тела', items: [2], reverseItems: [], aggregation: 'sum' },
    { key: 'discrepancy', label: 'Индекс расхождения (неудовлетворённость телом)', items: [1, 2], reverseItems: [], aggregation: 'formula', formula: 'answer[1] - answer[2]' },
  ],
};

const validationCases: ValidationCase[] = [
  { title: 'Ручная проверка: текущий силуэт 7, идеальный 4; расхождение 7 − 4 = 3', answers: { '1': 7, '2': 4 }, expected: { current: 7, ideal: 4, discrepancy: 3 } },
  { title: 'Ручная проверка: одинаковые оценки дают нулевое расхождение', answers: { '1': 5, '2': 5 }, expected: { current: 5, ideal: 5, discrepancy: 0 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['clinical-body'],
  scoringConfig,
  validationCases,
  formulaVersion: 'cdrs-thompson-gray-1995-zolotareva-2023-actual-minus-ideal-v1',
};
