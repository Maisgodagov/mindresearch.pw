import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Наименее важно' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
  { value: '6', label: '6' },
  { value: '7', label: 'Наиболее важно' },
];

const items = [
  'Птиц и животных',
  'Растений',
  'Морской флоры и фауны',
  'Детей',
  'Людей, живущих в моей стране',
  'Всех людей',
  'Моего здоровья',
  'Моего будущего',
  'Моего образа жизни',
];

const questions: SeedSection['questions'] = items.map((item, index) => ({
  code: `test_2515_${index + 1}`,
  text: `Меня беспокоят экологические проблемы из-за последствий для ${item.toLowerCase()}.`,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2515',
  title: 'Шкала экологической обеспокоенности У. Шульца (ECS), русская адаптация Ивановой и коллег',
  description: 'Шкала оценивает обеспокоенность экологическими проблемами по важности их последствий для биосферы, других людей и самого респондента. Три подшкалы помогают авторам опроса различать биосферическую, альтруистическую и эгоистическую направленность обеспокоенности; русская адаптация рассчитана на взрослых респондентов и не имеет тестовых норм.',
  categoryIds: ['social-attitude'],
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'biospheric_concern', label: 'Биосферическая обеспокоенность', items: [1, 2, 3], reverseItems: [], aggregation: 'mean' },
    { key: 'altruistic_concern', label: 'Альтруистическая обеспокоенность', items: [4, 5, 6], reverseItems: [], aggregation: 'mean' },
    { key: 'egoistic_concern', label: 'Эгоистическая обеспокоенность', items: [7, 8, 9], reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: оценки 1–3, 4–6 и 7–9 отдельно дают средние соответствующих троек',
    answers: { '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 1, '9': 3 },
    expected: { biospheric_concern: 2, altruistic_concern: 5, egoistic_concern: 11 / 3 },
  },
  {
    title: 'Ручная проверка: все максимальные оценки дают 7 по каждой подшкале',
    answers: Object.fromEntries(Array.from({ length: 9 }, (_, index) => [String(index + 1), 7])),
    expected: { biospheric_concern: 7, altruistic_concern: 7, egoistic_concern: 7 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'schultz-ecs-ivanova-2023-final-9-item-three-subscale-means-v1',
};
