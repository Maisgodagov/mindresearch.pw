import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: 'yes', label: 'Да' },
  { value: 'no', label: 'Нет' },
];

const youngerItems = [
  'Всегда бы играл(а) с младшим братом (сестрой).',
  'Отдавал(а) бы ему (ей) свои самые лучшие игрушки.',
  'Брал(а) бы его (ее) с собой на прогулку.',
  'Защищал(а) бы его (ее) во дворе.',
  'Ухаживал(а) бы за ним (ней).',
  'Хвалил(а) бы его (ее) маме и папе.',
  'Радовался (ась) бы, что он (она) у меня есть.',
  'Сидел(а) бы с ним (ней) дома, чтобы он (она) не оставался (ась) один (одна).',
  'Читал(а) бы ему (ей) сказки.',
  'Отводил(а) бы его (ее) в детский сад или в школу.',
];

const olderItems = [
  'Гордился (лась) бы тем, что у тебя есть старший (ая) брат (сестра).',
  'Брал(а) бы всегда с него (нее) пример.',
  'Дружил(а) бы с ним (нею) как с лучшим другом (подругой).',
  'Всем бы рассказывал(а), что у тебя есть старший (ая) брат (сестра).',
  'Хвалил(а) бы его (ее) маме и папе.',
  'Не мешал(а) бы ему (ей) делать уроки.',
  'Не жаловался (ась) бы на него (нее) маме и папе.',
  'Помогал(а) бы ему (ей) выполнять все по дому.',
  'Делился (ась) бы с ним (нею) всем самым вкусным.',
  'Отдавал(а) бы ему (ей) все самое лучшее.',
];

const makeQuestions = (items: string[], prefix: string) => items.map((text, index) => ({
  code: `test_2419_${prefix}_${index + 1}`,
  text,
  type: 'single' as const,
  required: true,
  options,
}));

const questions: SeedSection['questions'] = [
  { code: 'test_2419_intro_younger', text: 'Форма для оценки отношения к младшему брату или младшей сестре. Если бы от тебя зависело, то ты…', type: 'single', required: false, options: [{ value: 'continue', label: 'Перейти к утверждениям о младшем брате или сестре' }] },
  ...makeQuestions(youngerItems, 'younger'),
  { code: 'test_2419_intro_older', text: 'Форма для оценки отношения к старшему брату или старшей сестре. Если бы от тебя зависело, то ты…', type: 'single', required: false, options: [{ value: 'continue', label: 'Перейти к утверждениям о старшем брате или сестре' }] },
  ...makeQuestions(olderItems, 'older'),
];

export const instrument: SeedSection = {
  code: 'test_2419',
  title: 'Шкала соперничества между детьми',
  description: 'Шкала А. И. Баркан оценивает детскую ревность и соперничество в отношениях с братом или сестрой: отдельно отношение старшего ребёнка к младшему и младшего к старшему. Предназначена для детей дошкольного, младшего и среднего школьного возраста; помогает автору опроса исследовать принятие и поддержку сиблинга в семье.',
  categoryIds: ['parenting'],
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 1,
  scales: [
    { key: 'jealousy_younger', label: 'Ревность к младшему сиблингу', items: Array.from({ length: 10 }, (_, i) => i + 1), reverseItems: [], aggregation: 'count-option', optionValue: 'no' },
    { key: 'jealousy_older', label: 'Ревность к старшему сиблингу', items: Array.from({ length: 10 }, (_, i) => i + 12), reverseItems: [], aggregation: 'count-option', optionValue: 'no' },
  ],
};

const validationCases: ValidationCase[] = [
  { title: 'Все ответы «Да»', answers: Object.fromEntries(Array.from({ length: 20 }, (_, i) => [String(i + 1), 'yes'])), expected: { jealousy_younger: 0, jealousy_older: 0 } },
  { title: 'Все ответы «Нет»', answers: Object.fromEntries(Array.from({ length: 20 }, (_, i) => [String(i + 1), 'no'])), expected: { jealousy_younger: 10, jealousy_older: 10 } },
  { title: 'Проверка подсчёта формы младшего ребёнка', answers: Object.fromEntries(Array.from({ length: 20 }, (_, i) => [String(i + 1), i < 7 ? 'no' : 'yes'])), expected: { jealousy_younger: 7, jealousy_older: 0 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['parenting'],
  scoringConfig,
  validationCases,
  formulaVersion: 'barkan-sibling-rivalry-ru-v1',
};
