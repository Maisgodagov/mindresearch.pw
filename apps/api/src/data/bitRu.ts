import type { SeedSection } from '../types.js';
import type { ConfigurableScoring, ValidationCase } from '../scoring/configurable.js';

const options = [
  { value: '1', label: '1 — Полностью не согласен' },
  { value: '2', label: '2 — Не согласен' },
  { value: '3', label: '3 — Ни то, ни другое' },
  { value: '4', label: '4 — Согласен' },
  { value: '5', label: '5 — Полностью согласен' },
];

const items = [
  'В моей жизни есть понятная цель.',
  'Я с оптимизмом смотрю в будущее.',
  'Моя жизнь складывается хорошо.',
  'Бо́льшую часть времени я чувствую себя хорошо.',
  'То, чем я занимаюсь в жизни, имеет ценность и смысл.',
  'Я способен добиться успеха, если приложу к этому усилия.',
  'Я достигаю большинства своих целей.',
  'В большинстве моих занятий я чувствую себя полным сил.',
  'В моем окружении есть люди, которые ценят меня как личность.',
  'У меня есть чувство сопричастности своему окружению.',
];

const answers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const cycleAnswers = Object.fromEntries(items.map((_, index) => [String(index + 1), (index % 5) + 1]));

export const bitRuInstrument: SeedSection = {
  code: 'test_59',
  title: 'Краткий опросник процветания, BIT (адаптация Костенко, Набиевой и Лебедевой, 2025)',
  description: 'Русская адаптация 10-пунктового Brief Inventory of Thriving. Оценивается общий показатель психологического благополучия.',
  questions: items.map((text, index) => ({ code: `test_59_${index + 1}`, text, type: 'single', required: true, options })),
};

export const bitRuScoring: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [{ key: 'thriving', label: 'Процветание (общий показатель)', items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], reverseItems: [], aggregation: 'sum' }],
};

export const bitRuValidationCases: ValidationCase[] = [
  { title: 'Все ответы — 1', answers: answers(1), expected: { thriving: 10 } },
  { title: 'Все ответы — 5', answers: answers(5), expected: { thriving: 50 } },
  { title: 'Контроль: цикл ответов 1–5', answers: cycleAnswers, expected: { thriving: 30 } },
];
