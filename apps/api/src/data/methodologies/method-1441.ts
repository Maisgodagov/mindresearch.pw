import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const items = [
  'Я чувствую, что мой дом — это часть меня.',
  'Мой дом — лучшее место заниматься тем, что мне нравится.',
  'Мой дом — это особенное место для меня.',
  'Ни одно другое место не может сравниться с моим домом.',
  'Мой дом и я очень похожи друг на друга.',
  'Я получаю большее удовлетворение, находясь в собственном доме, нежели в других местах.',
  'Я очень привязан(а) к своему дому.',
  'То, чем я занимаюсь дома, важнее того, что я делаю в других местах.',
  'Видящие мой дом могут узнать обо мне многое.',
  'Занимаясь любимыми делами дома, я наслаждаюсь ими не меньше, чем если бы делал(а) это где-то еще.',
  'Мой дом значит очень много для меня.',
  'Я бы не хотел(а) делать в других местах то, чем занимаюсь дома.',
  'По образу жизни и мировоззрению я похож(а) на тех, кто живет в моем доме.',
  'Я готов(а) вкладывать силы и душу в дом, где я живу.',
];

const options = [
  { value: '1', label: 'Совершенно не согласен' },
  { value: '2', label: 'Скорее не согласен' },
  { value: '3', label: 'Трудно ответить' },
  { value: '4', label: 'Скорее согласен' },
  { value: '5', label: 'Совершенно согласен' },
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1469_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1469',
  title: 'Опросник «Привязанность к дому»',
  description: 'Опросник оценивает общую эмоциональную и смысловую связь человека с домом: переживание близости, идентификации, личной значимости и предпочтения домашнего пространства. Одношкальная версия подходит для изучения отношения взрослых и старших подростков к своему жилью и его содержанию; показатель отражает субъективную привязанность к дому, а не качество жилища или диагностическую категорию.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'homeAttachment', label: 'Общая привязанность к дому', items: Array.from({ length: 14 }, (_, index) => index + 1), reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная сверка: все ответы 1 дают среднее 1',
    answers: Object.fromEntries(Array.from({ length: 14 }, (_, index) => [String(index + 1), 1])),
    expected: { homeAttachment: 1 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'home-attachment-14item-mean-v1',
};
