import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'Никогда' },
  { value: '1', label: 'Иногда' },
  { value: '2', label: 'Часто' },
  { value: '3', label: 'Всегда' },
];

const items = [
  'Я чувствую грусть и пустоту.',
  'Я волнуюсь, когда думаю, что сделал что-то плохо.',
  'Мне было бы страшно быть одному дома.',
  'Ничто больше меня не радует.',
  'Я переживаю, что с кем-нибудь из моих родных может случиться что-то ужасное.',
  'Мне страшно находиться в многолюдных местах (например, торговые центры, кинотеатры, автобусы, многолюдные игровые площадки).',
  'Я беспокоюсь о том, что другие люди думают обо мне.',
  'У меня проблемы со сном.',
  'Мне страшно спать одному.',
  'У меня проблемы с аппетитом.',
  'У меня бывают неожиданные головокружения и обмороки без причины.',
  'Мне приходится делать некоторые вещи снова и снова (например, мыть руки, убирать или ставить вещи в определенном порядке).',
  'Мне не хватает энергии.',
  'Я начинаю неожиданно трястись или дрожать без причины.',
  'Я не могу ясно думать.',
  'Я чувствую себя бесполезным.',
  'Мне нужно думать об особых вещах (например, цифры или слова), чтобы предотвратить плохие события.',
  'Я думаю о смерти.',
  'Я чувствую, что не хочу двигаться.',
  'Я беспокоюсь, что начну бояться без причины.',
  'Я очень устал.',
  'Я переживаю, что выставлю себя на посмешище перед людьми.',
  'Мне нужно делать вещи в правильном порядке, чтобы предотвратить плохие события.',
  'Я чувствую беспокойство.',
  'Я беспокоюсь, что со мной случится что-то плохое.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2464_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2464',
  title: 'Шкала тревоги и депрессии у детей, RCADS-25 (детская форма)',
  description: 'Короткая детская форма RCADS-25 оценивает частоту симптомов тревоги и депрессии у детей и подростков 8–18 лет. Пункты охватывают тревожные переживания и телесные проявления, а также настроение, сон, аппетит, энергию и другие депрессивные симптомы; автор опроса может получить отдельные суммарные показатели тревоги и депрессии и их общий балл.',
  categoryIds: ['mood-anxiety', 'mood-depression'],
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 3,
  scales: [
    { key: 'depression', label: 'Депрессия (10 пунктов)', items: [1, 4, 8, 10, 13, 15, 16, 19, 21, 24], reverseItems: [], aggregation: 'sum' },
    { key: 'anxiety', label: 'Тревога (15 пунктов)', items: [2, 3, 5, 6, 7, 9, 11, 12, 14, 17, 18, 20, 22, 23, 25], reverseItems: [], aggregation: 'sum' },
    { key: 'total', label: 'Тревога и депрессия (25 пунктов)', items: Array.from({ length: 25 }, (_, index) => index + 1), reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: ответы «Никогда» дают нулевые суммы',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 0])),
    expected: { depression: 0, anxiety: 0, total: 0 },
  },
  {
    title: 'Ручная проверка: ответы «Иногда» дают по одному баллу на пункт',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { depression: 10, anxiety: 15, total: 25 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'rcads-25-ebesutani-2012-child-ru-sum-v1',
};
