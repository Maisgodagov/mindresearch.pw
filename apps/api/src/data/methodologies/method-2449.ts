import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const items = [
  'Я беспокоюсь, что робот будет отвечать невпопад в ходе беседы.',
  'Меня беспокоит то, как робот будет действовать.',
  'Меня беспокоит, что робот не сможет гибко переключаться с одной темы разговора на другую.',
  'Я бы беспокоился, что роботы не умеют понимать сложные темы разговора.',
  'Меня беспокоит, как я должен разговаривать с роботом.',
  'Я переживаю, что не смогу понять намерения робота.',
  'Я беспокоился бы о том, поймет ли робот, что я ему сказал.',
  'Меня беспокоит, какой силой обладает робот.',
  'Меня тревожит, что ответить роботу, если он со мной заговорит.',
  'Скорость движения роботов меня пугает.',
  'Я беспокоюсь, смогу ли я понять, о чем говорит робот.',
];

const responseOptions = [
  { value: '1', label: 'Полностью не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Скорее не согласен' },
  { value: '4', label: 'Ни то, ни другое' },
  { value: '5', label: 'Скорее согласен' },
  { value: '6', label: 'Согласен' },
  { value: '7', label: 'Полностью согласен' },
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2467_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: responseOptions,
}));

export const instrument: SeedSection = {
  code: 'test_2467',
  title: 'Шкала тревоги по отношению к роботам (RAS), русскоязычная адаптация 2025 года',
  description: 'Шкала измеряет тревогу в ситуации потенциального взаимодействия с роботом по трём аспектам: оценка коммуникативных возможностей и поведения робота, а также уверенность человека в собственных возможностях общаться с роботом. Русскоязычная адаптация опубликована и проверена на выборке студентов-медиков и медицинских работников; автору опроса она помогает изучить эмоциональные барьеры взаимодействия человека с роботизированными системами в исследовательских контекстах.',
  categoryIds: ['cyberpsychology'],
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'own_communication', label: 'Тревога по отношению к собственным возможностям в коммуникации с роботом', items: [5, 9, 11], reverseItems: [], aggregation: 'sum' },
    { key: 'robot_behavior', label: 'Тревога по поводу поведенческих характеристик робота', items: [2, 6, 8, 10], reverseItems: [], aggregation: 'sum' },
    { key: 'robot_communication', label: 'Тревога по отношению к коммуникативным возможностям робота', items: [1, 3, 4, 7], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationAnswers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Все ответы — минимальное согласие', answers: validationAnswers(1), expected: { own_communication: 3, robot_behavior: 4, robot_communication: 4 } },
  { title: 'Все ответы — максимальное согласие', answers: validationAnswers(7), expected: { own_communication: 21, robot_behavior: 28, robot_communication: 28 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'ras-ru-akmaev-kornienko-2025-v1',
};
