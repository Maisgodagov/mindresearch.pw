import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const pairs = [
  ['Дружелюбие', 'Враждебность'],
  ['Согласие', 'Несогласие'],
  ['Удовлетворенность', 'Неудовлетворенность'],
  ['Увлеченность', 'Равнодушие'],
  ['Продуктивность', 'Непродуктивность'],
  ['Теплота', 'Холодность'],
  ['Сотрудничество', 'Отсутствие сотрудничества'],
  ['Взаимная поддержка', 'Недоброжелательность'],
  ['Занимательность', 'Скука'],
  ['Успешность', 'Неуспешность'],
];

const options = Array.from({ length: 8 }, (_, index) => ({
  value: String(index + 1),
  label: String(index + 1),
}));

const questions: SeedSection['questions'] = pairs.map(([left, right], index) => ({
  code: `test_690_${index + 1}`,
  text: `${left} — ${right}`,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_690',
  title: 'Методика оценки психологической атмосферы в коллективе (Ф. Фидлер, адаптация Ю. Л. Ханина)',
  description: 'Методика оценивает воспринимаемую психологическую атмосферу группы в текущий период по десяти характеристикам: дружелюбие, согласие, удовлетворенность, увлеченность, продуктивность, теплота, сотрудничество, взаимная поддержка, занимательность и успешность. Подходит для группового исследования трудовых, учебных и спортивных коллективов; исходная русскоязычная адаптация Ханина разрабатывалась для спортивных команд. Индивидуальный балл отражает субъективную оценку участника, а групповой профиль строится по ответам нескольких членов коллектива.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 8,
  scales: [
    {
      key: 'atmosphere_total',
      label: 'Субъективная оценка психологической атмосферы',
      items: Array.from({ length: 10 }, (_, index) => index + 1),
      reverseItems: [],
      aggregation: 'sum',
    },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы у левого положительного полюса: минимальная сумма',
    answers: Object.fromEntries(pairs.map((_, index) => [String(index + 1), '1'])),
    expected: { atmosphere_total: 10 },
  },
  {
    title: 'Все ответы у правого отрицательного полюса: максимальная сумма',
    answers: Object.fromEntries(pairs.map((_, index) => [String(index + 1), '8'])),
    expected: { atmosphere_total: 80 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'fiedler-hanin-group-atmosphere-8point-v1',
};
