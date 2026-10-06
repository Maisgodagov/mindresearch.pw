import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'полностью не согласен' },
  { value: '2', label: 'согласен в малой степени' },
  { value: '3', label: 'согласен почти наполовину' },
  { value: '4', label: 'согласен наполовину' },
  { value: '5', label: 'согласен более чем наполовину' },
  { value: '6', label: 'согласен почти полностью' },
  { value: '7', label: 'согласен полностью' },
];

const items = [
  'В последнее время у меня возникали ситуации, когда не с кем посоветоваться, рассказать о своих проблемах.',
  'Мне всегда есть с кем поделиться своими мыслями.',
  'Мне кажется, что близкие люди не понимают меня.',
  'Часто мне некому высказать все, что есть на душе.',
  'У меня есть люди, которые поддерживают меня в трудную минуту.',
  'Я всегда стараюсь найти время побыть наедине с собой.',
  'Бывает, я испытываю чувство потерянности, обособленности от людей.',
  'Я часто вижу равнодушие окружающих, вокруг толпа народу, а ты один.',
  'Я редко углубляюсь (погружаюсь) в собственные мысли.',
  'Чувство отчужденности (отдаленности) от всего происходящего является обычным для меня.',
  'Я не чувствую свою обособленность от окружающих.',
  'В последнее время я испытываю равнодушие, безразличие ко всему происходящему.',
  'Моя самостоятельность часто приводит к тому, что люди отдаляются, отчуждаются от меня.',
  'Находясь в группе людей, я часто чувствую себя одиноким.',
  'В последнее время я воспринимаю мир как нечто чуждое и чужое мне.',
  'Бывает, я чувствую себя никому не нужным.',
  'Бывает, я чувствую себя одиноким из-за своей самоуверенности.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2450_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2450',
  title: 'Шкала субъективного переживания одиночества (СПО)',
  description: 'Методика С. В. Духновского оценивает выраженность субъективного переживания одиночества как показателя близости и отдаленности, гармоничности и дисгармоничности межличностных отношений. Пункты охватывают нехватку поддержки и понимания, отчужденность, эмоциональное безразличие и чувство одиночества среди людей. Версия предназначена для оценки отношений со значимыми людьми; используется в индивидуальной и групповой диагностике межличностных отношений.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [{
    key: 'loneliness',
    label: 'Переживание одиночества (СПО)',
    items: Array.from({ length: 17 }, (_, index) => index + 1),
    reverseItems: [2, 5, 9, 11],
    aggregation: 'sum',
  }],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная сверка: минимальные ответы на прямых и максимальные на обратных пунктах',
    answers: Object.fromEntries(Array.from({ length: 17 }, (_, index) => [String(index + 1), [2, 5, 9, 11].includes(index + 1) ? 7 : 1])),
    expected: { loneliness: 17 },
  },
  {
    title: 'Ручная сверка: все ответы 4 дают сумму 68',
    answers: Object.fromEntries(Array.from({ length: 17 }, (_, index) => [String(index + 1), 4])),
    expected: { loneliness: 68 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['social-loneliness'],
  scoringConfig,
  validationCases,
  formulaVersion: 'duhnovsky-spo-17item-sum-reverse-4-v1',
};
