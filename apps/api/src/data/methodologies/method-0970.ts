import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '100', label: 'Никогда' },
  { value: '75', label: 'Почти никогда' },
  { value: '50', label: 'Иногда' },
  { value: '25', label: 'Часто' },
  { value: '0', label: 'Почти всегда' },
];

const itemTexts = [
  'Мне было трудно пройти пешком более одной остановки',
  'Мне было трудно бегать',
  'Мне было трудно играть в спортивные игры и делать зарядку',
  'Мне было трудно поднимать тяжелые вещи',
  'Мне было трудно самостоятельно принимать ванну или душ',
  'Мне было трудно выполнять обязанности по дому',
  'Меня беспокоила боль',
  'У меня было мало сил',
  'Мне бывало страшно',
  'Мне бывало грустно',
  'Я был разозлен чем-либо',
  'Я плохо спал',
  'Я переживал о том, что может случиться',
  'Мне было трудно общаться с другими детьми',
  'Другие дети не хотели со мной дружить',
  'Другие дети дразнили меня',
  'Я не умел делать то, что умеют мои ровесники',
  'Мне было трудно, играя с другими детьми, чувствовать себя наравне с ними',
  'Мне было трудно быть внимательным на уроках',
  'Я был забывчив',
  'Мне было трудно справляться со школьными заданиями',
  'Я пропускал школу потому, что плохо себя чувствовал',
  'Я пропускал школу потому, что мне надо было ехать к врачу или в больницу',
];

export const instrument: SeedSection = {
  code: 'test_1000',
  title: 'Опросник качества жизни детей PedsQL 4.0 Generic Core Scales, детская форма 8–12 лет',
  description: 'Опросник оценивает связанное со здоровьем качество жизни детей 8–12 лет по физическому, эмоциональному и социальному функционированию, а также функционированию в школе. Он помогает автору опроса получить профиль ограничений и благополучия ребенка в повседневной активности, переживаниях, отношениях со сверстниками и учебе; доступны отдельные параллельные возрастные и родительские формы.',
  questions: itemTexts.map((text, index) => ({
    code: `test_1000_${index + 1}`,
    text: `${index < 8 ? 'Мое здоровье и уровень активности' : index < 13 ? 'Мои ощущения' : index < 18 ? 'Как я общаюсь с другими' : 'О школе'}. За последний месяц: ${text.toLowerCase()}`,
    type: 'single',
    required: true,
    options,
  })),
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 100,
  scales: [
    { key: 'physical', label: 'Физическое функционирование', items: [1,2,3,4,5,6,7,8], reverseItems: [], aggregation: 'mean' },
    { key: 'emotional', label: 'Эмоциональное функционирование', items: [9,10,11,12,13], reverseItems: [], aggregation: 'mean' },
    { key: 'social', label: 'Социальное функционирование', items: [14,15,16,17,18], reverseItems: [], aggregation: 'mean' },
    { key: 'school', label: 'Школьное функционирование', items: [19,20,21,22,23], reverseItems: [], aggregation: 'mean' },
  ],
};

const answers = (value: number) => Object.fromEntries(itemTexts.map((_, index) => [String(index + 1), value]));
export const validationCases: ValidationCase[] = [
  { title: 'Все ответы «Никогда»: все шкалы равны 100', answers: answers(100), expected: { physical: 100, emotional: 100, social: 100, school: 100 } },
  { title: 'Все ответы «Почти всегда»: все шкалы равны 0', answers: answers(0), expected: { physical: 0, emotional: 0, social: 0, school: 0 } },
  { title: 'Ручная проверка: по одному частому ответу в физической шкале; среднее 90.625', answers: { ...answers(100), '1': 25 }, expected: { physical: 90.625, emotional: 100, social: 100, school: 100 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'pedsql-4-gcs-russian-child-8-12-v1',
};
