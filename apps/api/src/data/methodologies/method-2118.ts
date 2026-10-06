import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '-3', label: 'Очень выражено слева' },
  { value: '-2', label: 'Выражено слева' },
  { value: '-1', label: 'Скорее слева, чем справа' },
  { value: '0', label: 'Ни один полюс не преобладает' },
  { value: '1', label: 'Скорее справа, чем слева' },
  { value: '2', label: 'Выражено справа' },
  { value: '3', label: 'Очень выражено справа' },
];

const pairs = [
  ['Теплые', 'Холодные'],
  ['Приятные', 'Неприятные'],
  ['Радостные', 'Тягостные'],
  ['Трудные', 'Легкие'],
  ['Скованные', 'Непринужденные'],
  ['Простые', 'Сложные'],
  ['Близкие', 'Отчужденные'],
  ['Хрупкие', 'Прочные'],
  ['Устойчивые', 'Переменчивые'],
  ['Гармоничные', 'Уродливые'],
  ['Гладкие', 'Шероховатые'],
  ['Тщательные', 'Небрежные'],
  ['Грубые', 'Нежные'],
  ['Враждебные', 'Дружеские'],
  ['Бодрящие', 'Обессиливающие'],
] as const;

const positiveOnLeft = new Set([4, 6, 9, 11]);

const questions = pairs.map(([left, right], index) => ({
  code: `sdoo_${index + 1}`,
  text: `Оцените ваши отношения с супругом по паре определений: «${left} — ${right}». Речь идет об отношениях, существующих между вами.`,
  type: 'single' as const,
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2132',
  title: 'Шкала дифференциальной оценки отношений (ДОО)',
  description: 'Шкала ДОО А. Н. Волковой оценивает общее воспринимаемое благополучие отношений супругов по 15 парам противоположных характеристик: эмоциональный тон, близость и отчужденность, легкость взаимодействия, устойчивость и гармоничность. Она подходит для исследования отношений в супружеских парах; формулировка инструкции позволяет уточнять оценку текущих, прошлых или отношений за период брака.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: -3,
  max: 3,
  scales: [{
    key: 'relationship_wellbeing',
    label: 'Общее благополучие отношений',
    items: pairs.map((_, index) => index + 1),
    reverseItems: [...positiveOnLeft].map(index => index + 1),
    aggregation: 'sum',
    weights: Object.fromEntries(pairs.map((_, index) => [index + 1, positiveOnLeft.has(index + 1) ? -1 : 1])),
  }],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: положительный ответ на благополучный полюс каждой пары даёт максимум 45',
    answers: Object.fromEntries(pairs.map((_, index) => [String(index + 1), positiveOnLeft.has(index + 1) ? '-3' : '3'])),
    expected: { relationship_wellbeing: 45 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'volkova-doo-15-pairs-positive-pole-sum-v1',
};
