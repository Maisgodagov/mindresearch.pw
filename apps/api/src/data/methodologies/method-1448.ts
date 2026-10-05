import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Абсолютно неверно' },
  { value: '2', label: 'Едва ли это верно' },
  { value: '3', label: 'Скорее всего, верно' },
  { value: '4', label: 'Совершенно верно' },
];

const items = [
  'Я тщательно обдумываю долгосрочные цели',
  'Я чувствую личную ответственность за происходящее вокруг меня',
  'Ответственность за мою жизнь лежит только на мне',
  'Я действую согласно своим ценностным установкам',
  'Мною движет чувство личностного предназначения',
  'Я способен самостоятельно выбирать способ действия',
  'Я прикладываю усилия к выполнению того, что способен контролировать',
  'Впереди у меня масса возможностей',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1476_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1476',
  title: 'Шкала «Проактивные аттитюды» Р. Шварцера, русскоязычная адаптация А. А. Бехтер (2022)',
  description: 'Однофакторная шкала оценивает проактивную установку на будущее: ответственность за собственную жизнь и происходящее вокруг, ориентацию на долгосрочные цели, ценностную направленность, самостоятельность выбора и ожидание возможностей. Русская адаптация предназначена для исследовательского применения у взрослых 16–55 лет; помогает описать общий уровень проактивных аттитюдов, но сама по себе не устанавливает диагноз.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 4,
  scales: [{ key: 'proactive_attitudes', label: 'Проактивные аттитюды', items: [1, 2, 3, 4, 5, 6, 7, 8], reverseItems: [], aggregation: 'sum' }],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: все ответы минимальные',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { proactive_attitudes: 8 },
  },
  {
    title: 'Ручная проверка: все ответы максимальные',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 4])),
    expected: { proactive_attitudes: 32 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'schwarzer-proactive-attitudes-behkter-ru-8-sum-v1',
};
