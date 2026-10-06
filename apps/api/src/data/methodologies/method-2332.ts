import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Никогда' },
  { value: '2', label: 'Редко' },
  { value: '3', label: 'Иногда' },
  { value: '4', label: 'Часто' },
  { value: '5', label: 'Всегда' },
];

const items = [
  'Я с оптимизмом смотрю в будущее.',
  'Я чувствую себя полезной.',
  'Я расслаблена.',
  'Мне интересны другие люди.',
  'Я энергична.',
  'Я хорошо справляюсь с проблемами.',
  'Я мыслю ясно.',
  'Я довольна собой.',
  'Я чувствую свою близость к другим людям.',
  'Я уверена в себе.',
  'Я способна составить свое собственное мнение о разных вещах.',
  'Я чувствую, что меня любят.',
  'Мне интересно новое.',
  'Я чувствую себя бодрой.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2350_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2350',
  title: 'Шкала психологического благополучия Варвик—Эдинбург (WEMWBS)',
  description: 'WEMWBS оценивает позитивное психическое благополучие за последние две недели: положительные переживания, оптимизм, энергию и ясность мышления, уверенность и позитивное функционирование, а также близость и интерес к другим людям. Полная 14-пунктовая версия подходит для исследовательских и популяционных опросов; русский текст представлен в адаптации С. К. Нартовой-Бочавер.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [{
    key: 'total',
    label: 'Общий балл психологического благополучия WEMWBS',
    items: Array.from({ length: 14 }, (_, index) => index + 1),
    reverseItems: [],
    aggregation: 'sum',
  }],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: все ответы «Никогда» дают минимум 14',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { total: 14 },
  },
  {
    title: 'Ручная проверка смешанного профиля: сумма прямых ответов равна 42',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), (index % 5) + 1])),
    expected: { total: 42 },
  },
  {
    title: 'Ручная проверка: все ответы «Всегда» дают максимум 70',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 5])),
    expected: { total: 70 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['meaning-satisfaction'],
  scoringConfig,
  validationCases,
  formulaVersion: 'wemwbs-14-nartova-bochaver-2013-direct-sum-v1',
};
