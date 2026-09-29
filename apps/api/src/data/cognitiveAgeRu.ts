import type { SeedSection } from '../types.js';
import type { ConfigurableScoring, ValidationCase } from '../scoring/configurable.js';

const items = [
  'Как Вы думаете, на сколько лет Вы себя ощущаете?',
  'Как Вы считаете, на сколько лет Вы выглядите?',
  'Какому возрасту, по Вашему мнению, соответствуют Ваши действия и социальная активность?',
  'Какому возрасту, по Вашему мнению, соответствуют Ваши интересы и когнитивные функции?',
];

export const cognitiveAgeRuInstrument: SeedSection = {
  code: 'test_48',
  title: 'Шкала оценки когнитивного (субъективного) возраста',
  description: 'Четыре числовые оценки субъективного возраста: биологического (самоощущение), эмоционального (внешность), социального (действия и активность) и интеллектуального (интересы и когнитивные функции). Введите возраст в полных годах для каждого пункта.',
  questions: items.map((text, index) => ({
    code: `test_48_${index + 1}`,
    text,
    type: 'number',
    required: true,
    validation: { min: 1, max: 120, step: 1 },
  })),
};

export const cognitiveAgeRuScoring: ConfigurableScoring = {
  min: 1,
  max: 120,
  scales: [
    { key: 'biologicalAge', label: 'Биологический субъективный возраст (ощущает себя)', items: [1], reverseItems: [], aggregation: 'mean' },
    { key: 'emotionalAge', label: 'Эмоциональный субъективный возраст (выглядит)', items: [2], reverseItems: [], aggregation: 'mean' },
    { key: 'socialAge', label: 'Социальный субъективный возраст (действия и активность)', items: [3], reverseItems: [], aggregation: 'mean' },
    { key: 'intellectualAge', label: 'Интеллектуальный субъективный возраст (интересы)', items: [4], reverseItems: [], aggregation: 'mean' },
    { key: 'cognitiveAge', label: 'Средний субъективный возраст', items: [1, 2, 3, 4], reverseItems: [], aggregation: 'mean' },
  ],
};

const allAnswers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));

export const cognitiveAgeRuValidationCases: ValidationCase[] = [
  { title: 'Четыре одинаковые оценки: среднее совпадает с компонентами', answers: allAnswers(40), expected: { biologicalAge: 40, emotionalAge: 40, socialAge: 40, intellectualAge: 40, cognitiveAge: 40 } },
  { title: 'Разные оценки: проверка среднего всех четырёх компонентов', answers: { '1': 20, '2': 30, '3': 40, '4': 50 }, expected: { biologicalAge: 20, emotionalAge: 30, socialAge: 40, intellectualAge: 50, cognitiveAge: 35 } },
  { title: 'Возрастной профиль с дробным средним', answers: { '1': 31, '2': 36, '3': 42, '4': 47 }, expected: { biologicalAge: 31, emotionalAge: 36, socialAge: 42, intellectualAge: 47, cognitiveAge: 39 } },
];
