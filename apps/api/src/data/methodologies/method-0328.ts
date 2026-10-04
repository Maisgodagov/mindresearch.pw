import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = Array.from({ length: 11 }, (_, value) => ({
  value: String(value),
  label: value === 0 ? 'Совершенно не удовлетворен' : value === 10 ? 'Полностью удовлетворен' : String(value),
}));

const items = [
  'Насколько вы удовлетворены своим уровнем жизни (материальным положением)?',
  'Насколько вы удовлетворены своим здоровьем?',
  'Насколько вы удовлетворены своими достижениями в жизни?',
  'Насколько вы удовлетворены своими взаимоотношениями с близкими людьми?',
  'Насколько вы удовлетворены уровнем личной безопасности?',
  'Насколько вы удовлетворены своими отношениями с окружающими людьми?',
  'Насколько вы удовлетворены степенью своей уверенности в будущем?',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_360_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_360',
  title: 'Индекс личного благополучия взрослых (PWI-A)',
  description: 'Краткий индекс субъективного качества жизни взрослых: оценивает удовлетворённость уровнем жизни, здоровьем, достижениями, близкими отношениями, личной безопасностью, отношениями с окружающими и уверенностью в будущем. Подходит для общего взрослого населения от 18 лет; позволяет увидеть как общий индекс благополучия, так и профиль отдельных жизненных сфер.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 10,
  scales: [
    { key: 'living_standard', label: 'Уровень жизни', items: [1], reverseItems: [], aggregation: 'mean' },
    { key: 'health', label: 'Здоровье', items: [2], reverseItems: [], aggregation: 'mean' },
    { key: 'achievement', label: 'Достижения в жизни', items: [3], reverseItems: [], aggregation: 'mean' },
    { key: 'close_relationships', label: 'Отношения с близкими', items: [4], reverseItems: [], aggregation: 'mean' },
    { key: 'personal_safety', label: 'Личная безопасность', items: [5], reverseItems: [], aggregation: 'mean' },
    { key: 'community_relationships', label: 'Отношения с окружающими', items: [6], reverseItems: [], aggregation: 'mean' },
    { key: 'future_security', label: 'Уверенность в будущем', items: [7], reverseItems: [], aggregation: 'mean' },
    { key: 'pwi_total', label: 'Индекс личного благополучия', items: [1, 2, 3, 4, 5, 6, 7], reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все сферы имеют оценку 5',
    answers: { '1': 5, '2': 5, '3': 5, '4': 5, '5': 5, '6': 5, '7': 5 },
    expected: { living_standard: 5, health: 5, achievement: 5, close_relationships: 5, personal_safety: 5, community_relationships: 5, future_security: 5, pwi_total: 5 },
  },
  {
    title: 'Ручная проверка: среднее семи доменов (2+4+6+8+10+0+5)/7',
    answers: { '1': 2, '2': 4, '3': 6, '4': 8, '5': 10, '6': 0, '7': 5 },
    expected: { living_standard: 2, health: 4, achievement: 6, close_relationships: 8, personal_safety: 10, community_relationships: 0, future_security: 5, pwi_total: 5 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'pwi-a-7-domain-mean-0-10-v1',
};
