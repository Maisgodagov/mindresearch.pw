import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const responseOptions = [
  { value: '1', label: 'Совершенно неверно' },
  { value: '2', label: 'Неверно' },
  { value: '3', label: 'Скорее неверно' },
  { value: '4', label: 'Нечто среднее' },
  { value: '5', label: 'Скорее верно' },
  { value: '6', label: 'Верно' },
  { value: '7', label: 'Совершенно верно' },
];

const itemTexts = [
  'Я стараюсь расслабиться, отдохнуть.',
  'Я стараюсь научиться чему-то, что-то узнать или лучше понять.',
  'Я стараюсь поступать в соответствии с моими убеждениями.',
  'Я стараюсь получать удовольствие.',
  'Я стараюсь в чем-то достичь совершенства, своего идеала.',
  'Я стараюсь наслаждаться жизнью.',
  'Я стараюсь не слишком напрягаться.',
  'Я стараюсь воплотить в жизнь то лучшее, на что я способен.',
  'Я стараюсь веселиться.',
  'Я стараюсь делать что-то хорошее для других людей или для мира в целом.',
  'Я стараюсь жить с комфортом.',
];

const questions: SeedSection['questions'] = itemTexts.map((text, index) => ({
  code: `test_2104_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: responseOptions,
}));

export const instrument: SeedSection = {
  code: 'test_2104',
  title: 'Шкала гедонических и эвдемонических мотивов деятельности, HEMA-R',
  description: 'HEMA-R оценивает мотивы, с которыми человек обычно подходит к своей деятельности: эвдемонические стремления к развитию, убеждениям и вкладу в мир, а также гедонистические мотивы удовольствия и комфорта. Русскоязычная адаптация Субаши и Осина включает отдельные показатели эвдемонии, гедонистического удовольствия и гедонистического комфорта; она подходит для изучения типичных мотивов деятельности русскоязычных респондентов и может быть адаптирована исследователем к ситуативному контексту.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'eudaimonic', label: 'Эвдемонические мотивы', items: [2, 3, 5, 8, 10], reverseItems: [], weights: {}, aggregation: 'mean' },
    { key: 'hedonicPleasure', label: 'Мотивы гедонистического удовольствия', items: [4, 6, 9], reverseItems: [], weights: {}, aggregation: 'mean' },
    { key: 'hedonicComfort', label: 'Мотивы гедонистического комфорта', items: [1, 7, 11], reverseItems: [], weights: {}, aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: минимальные ответы дают минимум каждой шкалы',
    answers: Object.fromEntries(itemTexts.map((_, index) => [String(index + 1), 1])),
    expected: { eudaimonic: 1, hedonicPleasure: 1, hedonicComfort: 1 },
  },
  {
    title: 'Ручная проверка ключа и среднего: ответы 1..7 по порядку',
    answers: Object.fromEntries(itemTexts.map((_, index) => [String(index + 1), index + 1])),
    expected: { eudaimonic: 5.6, hedonicPleasure: 7, hedonicComfort: 19 / 3 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'hema-r-ru-subasi-osin-2024-three-factor-means-v1',
};
