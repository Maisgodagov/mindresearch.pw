import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const emojis = [
  '👨‍👩‍👧', '😆', '😟', '💛', '😡', '👰', '🧑‍🔬', '🙅',
  '👪', '🤣', '😔', '❤️', '👿', '💍', '📚', '🤷',
  '👨‍👩‍👧‍👦', '😄', '😢', '😍', '👹', '💼', '🦉', '🧘',
  '👩‍👧', '😊😋', '😭', '💋', '👺', '💰', '🧠', '🤐',
  '👨‍👧', '😃', '😞💧', '😘', '😤', '🏆', '🎓', '😶',
  '👩‍👩‍👧', '😹', '😥', '💓', '👊', '👑', '🤔', '🙄',
  '👨‍👦', '😅', '😰', '💕', '💢', '🤑', '🤓', '🧎',
  '👩‍👧‍👦', '😊😋', '😞💧', '👄', '👹', '🧑‍⚖️', '❤️', '🧘',
];

const options = [
  { value: '1', label: 'Полностью не согласен' },
  { value: '2', label: 'Скорее не согласен' },
  { value: '3', label: 'Нейтрально' },
  { value: '4', label: 'Скорее согласен' },
  { value: '5', label: 'Полностью согласен' },
];

const questions: SeedSection['questions'] = emojis.map((emoji, index) => ({
  code: `test_2517_${index + 1}`,
  text: `Я человек, который... ${emoji}`,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2517',
  title: 'Шкала эмодзи-черт (Emoji Trait Scale), русская версия 2025 года',
  description: 'Экспериментальная самооценочная методика измеряет восемь групп личностных черт, выраженных через эмодзи: семейность, смешливость, негативную эмоциональность, любвеобильность, агрессивность, высокий статус, ученость и закрытость. Она подходит для исследовательского описания профиля взрослых респондентов; опубликованное исследование включало участников 18–53 лет. Факторную структуру автор считает требующей дальнейшей репликации, поэтому результаты следует рассматривать как исследовательские показатели, а не диагноз.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'family', label: 'Семейность', items: [1, 9, 17, 25, 33, 41, 49, 57], reverseItems: [], aggregation: 'sum' },
    { key: 'risibility', label: 'Смешливость', items: [2, 10, 18, 26, 34, 42, 50, 58], reverseItems: [], aggregation: 'sum' },
    { key: 'negative_emotionality', label: 'Негативная эмоциональность', items: [3, 11, 19, 27, 35, 43, 51, 59], reverseItems: [], aggregation: 'sum' },
    { key: 'love', label: 'Любвеобильность', items: [4, 12, 20, 28, 36, 44, 52, 60], reverseItems: [], aggregation: 'sum' },
    { key: 'aggressiveness', label: 'Агрессивность', items: [5, 13, 21, 29, 37, 45, 53, 61], reverseItems: [], aggregation: 'sum' },
    { key: 'high_status', label: 'Высокий статус', items: [6, 14, 22, 30, 38, 46, 54, 62], reverseItems: [], aggregation: 'sum' },
    { key: 'scholarship', label: 'Ученость', items: [7, 15, 23, 31, 39, 47, 55, 63], reverseItems: [], aggregation: 'sum' },
    { key: 'closedness', label: 'Закрытость', items: [8, 16, 24, 32, 40, 48, 56, 64], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: в каждой позиции значение равно номеру шкалы по модулю пяти',
    answers: Object.fromEntries(emojis.map((_, index) => [String(index + 1), (index % 5) + 1])),
    expected: { family: 24, risibility: 24, negative_emotionality: 24, love: 24, aggressiveness: 24, high_status: 24, scholarship: 24, closedness: 24 },
  },
  {
    title: 'Минимальные ответы: по 8 баллов на шкале',
    answers: Object.fromEntries(emojis.map((_, index) => [String(index + 1), 1])),
    expected: { family: 8, risibility: 8, negative_emotionality: 8, love: 8, aggressiveness: 8, high_status: 8, scholarship: 8, closedness: 8 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['personality'],
  scoringConfig,
  validationCases,
  formulaVersion: 'emoji-trait-scale-ilichev-2025-eight-sums-v1',
};
