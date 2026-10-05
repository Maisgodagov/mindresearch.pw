import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Неверно (НЕТ)' },
  { value: '2', label: 'Скорее неверно' },
  { value: '3', label: 'Ни да, ни нет' },
  { value: '4', label: 'Скорее верно' },
  { value: '5', label: 'Верно (ДА)' },
];

const items = [
  'Мне нравится делать уроки.',
  'Мне будет стыдно, если я их не сделаю.',
  'Я чувствую, что развиваюсь, решая непростые задачи.',
  'Иначе у меня будут проблемы с родителями.',
  'Это поможет мне добиться успехов в школе.',
  'Не хочу, чтобы меня ругали родители.',
  'Я люблю учиться.',
  'Мне стыдно получать плохие отметки.',
  'Мне нравится знать и уметь все больше и больше.',
  'Мне запрещают заниматься чем-то другим, пока они не сделаны.',
  'Мне совестно не делать.',
  'У меня нет выбора, надо делать.',
  'Это поможет мне в будущем стать тем, кем я хочу.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_768_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_768',
  title: 'Опросник мотивации выполнения домашних заданий (МДЗ)',
  description: 'Методика оценивает у школьников 3–11-х классов причины выполнения домашних заданий: автономную мотивацию (познавательный интерес, саморазвитие и понимание ценности учебы), интроецированную мотивацию (стыд и чувство долга) и экстернальную мотивацию, связанную с требованиями и давлением родителей. Профиль помогает исследовать, какие мотивы связаны с настойчивостью и учебной успешностью.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'autonomous', label: 'Автономная мотивация', items: [1, 3, 5, 7, 9, 13], reverseItems: [], aggregation: 'mean' },
    { key: 'introjected', label: 'Интроецированная мотивация', items: [2, 8, 11], reverseItems: [], aggregation: 'mean' },
    { key: 'external', label: 'Экстернальная мотивация', items: [4, 6, 10, 12], reverseItems: [], aggregation: 'mean' },
    { key: 'cognitive', label: 'Познавательная мотивация', items: [1, 7], reverseItems: [], aggregation: 'mean' },
    { key: 'self_development', label: 'Мотивация саморазвития', items: [3, 9], reverseItems: [], aggregation: 'mean' },
    { key: 'identified', label: 'Идентифицированная мотивация', items: [5, 13], reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: все ответы «верно» дают максимум по всем шкалам',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 5])),
    expected: { autonomous: 5, introjected: 5, external: 5, cognitive: 5, self_development: 5, identified: 5 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'mdz-gordeeva-sychev-2025-13items-mean-v1',
};
