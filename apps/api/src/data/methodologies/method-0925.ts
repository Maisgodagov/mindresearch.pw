import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Совершенно не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Не уверен' },
  { value: '4', label: 'Согласен' },
  { value: '5', label: 'Полностью согласен' },
];

const items = [
  'Я погрузился с головой во взаимодействие с чат-ботом.',
  'Взаимодействуя с чат-ботом, я не заметил, как пролетело время.',
  'Я был полностью поглощен взаимодействием с чат-ботом.',
  'Я был разочарован взаимодействием с чат-ботом.',
  'Чат-бот показался мне запутанным в использовании.',
  'Взаимодействие с чат-ботом было утомительным.',
  'Интерфейс чат-бота был притягательным.',
  'Чат-бот выглядел эстетически привлекательно.',
  'Взаимодействие с чат-ботом было приятным.',
  'Взаимодействие с чат-ботом дало тот результат, который был мне нужен.',
  'Опыт взаимодействия с чат-ботом был для меня полезным.',
  'Мне было интересно, когда я взаимодействовал с чат-ботом.',
];
const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_955_${index + 1}`, text, type: 'single', required: true, options,
}));

export const instrument: SeedSection = {
  code: 'test_955',
  title: 'Опросник для измерения пользовательской вовлеченности (UES), русская адаптация для чат-бота',
  description: 'Оценивает вовлеченность пользователя во взаимодействие с чат-ботом по четырём аспектам: погружение, трудности взаимодействия, привлекательность интерфейса и позитивный опыт взаимодействия. Русская 12-пунктовая краткая адаптация предназначена для оценки опыта взаимодействия с чат-ботами на основе генеративного ИИ у русскоязычных пользователей.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1, max: 5,
  scales: [
    { key: 'immersion', label: 'Вовлеченность (погружение)', items: [1, 2, 3], reverseItems: [], aggregation: 'mean' },
    { key: 'interaction_difficulties', label: 'Трудности взаимодействия', items: [4, 5, 6], reverseItems: [], aggregation: 'mean' },
    { key: 'interface_appeal', label: 'Привлекательность интерфейса', items: [7, 8, 9], reverseItems: [], aggregation: 'mean' },
    { key: 'positive_experience', label: 'Позитивный опыт взаимодействия', items: [10, 11, 12], reverseItems: [], aggregation: 'mean' },
    { key: 'overall_engagement', label: 'Общая пользовательская вовлеченность', items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], reverseItems: [], aggregation: 'mean' },
  ],
};

const allAnswers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
export const validationCases: ValidationCase[] = [
  { title: 'Все ответы — 1', answers: allAnswers(1), expected: { immersion: 1, interaction_difficulties: 1, interface_appeal: 1, positive_experience: 1, overall_engagement: 1 } },
  { title: 'Все ответы — 5', answers: allAnswers(5), expected: { immersion: 5, interaction_difficulties: 5, interface_appeal: 5, positive_experience: 5, overall_engagement: 5 } },
];

export const methodology: MethodologyRegistration = {
  instrument, scoringConfig, validationCases,
  formulaVersion: 'ues-ru-chatbot-12-voronin-rafikova-2025-v1',
};