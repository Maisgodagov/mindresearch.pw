import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const answers = [
  { value: '0', label: 'Никогда' },
  { value: '1', label: 'Редко' },
  { value: '2', label: 'Иногда' },
  { value: '3', label: 'Часто' },
  { value: '4', label: 'Всегда' },
];

const items = [
  'Когда я нахожусь на людях, я сравниваю свою внешность с внешностью других.',
  'Когда я знакомлюсь с новым человеком (того же пола), я сравниваю свой размер тела с его/ее размером тела.',
  'Когда я на работе или на учебе, я сравниваю свою фигуру с фигурой других.',
  'Когда я нахожусь на людях, я сравниваю свою жировую прослойку с жировой прослойкой других.',
  'Когда я хожу по магазинам с одеждой, я сравниваю свой вес с весом других.',
  'Когда я бываю на вечеринках, я сравниваю свою фигуру с фигурой других.',
  'Когда я общаюсь с друзьями, я сравниваю свой вес с весом других.',
  'Когда я на работе или учебе, я сравниваю свой размер тела с размером тела других.',
  'Когда я общаюсь с друзьями, я сравниваю свою фигуру с фигурой других.',
  'Когда я ем в ресторане, я сравниваю свою жировую прослойку с жировой прослойкой других.',
  'Когда я в спортзале, я сравниваю свою внешность с внешностью других.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2438_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: answers,
}));

export const instrument: SeedSection = {
  code: 'test_2438',
  title: 'Шкала сравнения физической внешности (PACS-R), русскоязычная версия',
  description: 'Шкала PACS-R измеряет общую склонность сравнивать собственную внешность с внешностью других в разных ситуациях. Пункты охватывают сравнение внешнего вида, размера тела, фигуры, жировой прослойки и веса; русскоязычная версия адаптирована и апробирована на российской выборке мужчин и женщин от 18 лет.',
  categoryIds: ['clinical-body'],
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 4,
  scales: [
    {
      key: 'appearanceComparison',
      label: 'Ориентированность на сравнение по внешности',
      items: items.map((_, index) => index + 1),
      reverseItems: [],
      aggregation: 'mean',
    },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы «Никогда»: средняя оценка равна нулю',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 0])),
    expected: { appearanceComparison: 0 },
  },
  {
    title: 'Все ответы «Всегда»: средняя оценка равна четырём',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 4])),
    expected: { appearanceComparison: 4 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'pacs-r-artemtseva-samoylenko-2022-ru-v1',
};
