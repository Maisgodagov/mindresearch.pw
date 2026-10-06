import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Полностью не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Нейтрально' },
  { value: '4', label: 'Согласен' },
  { value: '5', label: 'Полностью согласен' },
];

const items = [
  'Я побеждаю других людей.',
  'Я явно превосхожу других.',
  'Я самый лучший.',
  'Я усердно работаю.',
  'Я явно улучшаю личные достижения.',
  'Я превосхожу своих соперников.',
  'Я достигаю цели.',
  'Я преодолеваю трудности.',
  'Я достигаю личных целей.',
  'Я побеждаю.',
  'Я демонстрирую другим свое превосходство.',
  'Я делаю все, что в моих силах.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2091_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2091',
  title: 'Шкала восприятия успеха (POSQ), взрослая русскоязычная адаптация',
  description: 'Методика измеряет две спортивные мотивационные ориентации: на себя (успех через превосходство и сравнение с другими) и на задачу (успех через усилия, достижение целей и личное улучшение). Предназначена для оценки восприятия успеха спортсменами; опубликованная русскоязычная адаптация проверялась на спортсменах юношеского возраста и студентах-спортсменах 17–21 года, занимающихся индивидуальными и командными видами спорта. Профиль может помочь автору опроса описать, какие основания успеха преобладают у респондентов.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'ego', label: 'Ориентация на себя', items: [1, 2, 3, 6, 10, 11], reverseItems: [], aggregation: 'sum' },
    { key: 'task', label: 'Ориентация на задачу', items: [4, 5, 7, 8, 9, 12], reverseItems: [], aggregation: 'sum' },
  ],
};

const answers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Минимальные ответы по всем пунктам', answers: answers(1), expected: { ego: 6, task: 6 } },
  { title: 'Максимальные ответы по всем пунктам', answers: answers(5), expected: { ego: 30, task: 30 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'posq-gorskaya-bosenko-starostenko-2015-v1',
};
