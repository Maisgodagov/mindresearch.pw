import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const items = [
  'Когда я работаю над учебными задачами, я не отвлекаюсь на посторонние мысли.',
  'Я учусь с увлечением.',
  'Когда я учусь, я не обращаю внимания ни на что вокруг.',
  'Во время учебы я полностью погружаюсь в ту задачу, которой занимаюсь в данный момент.',
  'Учеба вызывает у меня приятные ощущения.',
  'Я учусь с большим удовольствием.',
  'Во время учебы я чувствую себя счастливым(ой).',
  'Учиться мне в радость.',
  'Я выполняю учебные задания, даже если за них не ставят оценки.',
  'Даже в свободное время меня тянет заниматься чем-то связанным с учебой.',
  'Я учусь, потому что мне это нравится.',
  'Когда я что-то изучаю, я делаю это для себя.',
  'Меня мотивирует учеба сама по себе, а не формальная необходимость получить образование.',
];

const options = [
  { value: '1', label: 'Никогда' },
  { value: '2', label: 'Очень редко' },
  { value: '3', label: 'Редко' },
  { value: '4', label: 'Когда как' },
  { value: '5', label: 'Часто' },
  { value: '6', label: 'Очень часто' },
  { value: '7', label: 'Всегда' },
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2326_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2326',
  title: 'Шкала потока в учебе (WOLF-S), русская версия',
  description: 'Опросник оценивает переживание потока в учебной деятельности у обучающихся: поглощённость учебными задачами, удовольствие от учёбы и внутреннюю мотивацию. Русская локализация Ивановой и Денисова предназначена для исследовательских опросов обучающихся; показатели помогают описать выраженность этих аспектов учебного опыта.',
  categoryIds: ['learning'],
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'absorption', label: 'Поглощённость', items: [1, 2, 3, 4], reverseItems: [], aggregation: 'mean' },
    { key: 'enjoyment', label: 'Удовольствие от учёбы', items: [5, 6, 7, 8], reverseItems: [], aggregation: 'mean' },
    { key: 'intrinsic_motivation', label: 'Внутренняя мотивация', items: [9, 10, 11, 12, 13], reverseItems: [], aggregation: 'mean' },
    { key: 'total', label: 'Общий балл потока в учёбе', items: Array.from({ length: 13 }, (_, i) => i + 1), reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  { title: 'Все ответы на минимальной частоте', answers: Object.fromEntries(items.map((_, i) => [String(i + 1), 1])), expected: { absorption: 1, enjoyment: 1, intrinsic_motivation: 1, total: 1 } },
  { title: 'Все ответы на максимальной частоте', answers: Object.fromEntries(items.map((_, i) => [String(i + 1), 7])), expected: { absorption: 7, enjoyment: 7, intrinsic_motivation: 7, total: 7 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'wolf-s-ivanova-denisov-2024-v1',
};
