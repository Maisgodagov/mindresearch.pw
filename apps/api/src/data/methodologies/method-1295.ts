import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'Никогда' },
  { value: '1', label: 'Редко' },
  { value: '2', label: 'Иногда' },
  { value: '3', label: 'Часто' },
  { value: '4', label: 'Всегда' },
];

const items = [
  'Я чувствую себя усталым и неотдохнувшим, когда просыпаюсь.',
  'Я чувствую напряжение/скованность и боль в мышцах.',
  'У меня бывают приступы тревожности.',
  'Я скриплю зубами или стискиваю их.',
  'У меня проблемы со стулом (диарея и/или запор).',
  'Мне нужна помощь в обычной бытовой жизни.',
  'Я чувствителен к яркому свету.',
  'Я очень быстро устаю от физической активности.',
  'Я чувствую боль по всему телу.',
  'У меня головные боли.',
  'Я чувствую дискомфорт в мочевом пузыре и/или жжение при мочеиспускании.',
  'Я плохо сплю.',
  'Мне сложно сконцентрироваться.',
  'У меня проблемы с кожей (сухость, зуд, высыпания).',
  'Стресс усиливает мои соматические симптомы.',
  'Я чувствую грусть или подавленность.',
  'У меня мало сил.',
  'У меня напряжены мышцы шеи и плеч.',
  'У меня боли в челюсти.',
  'Некоторые запахи, например духов, вызывают у меня головокружение и тошноту.',
  'Мне приходится часто мочиться.',
  'У меня дискомфорт в ногах и «синдром беспокойных ног», когда я ночью пытаюсь уснуть.',
  'У меня сложности с запоминанием.',
  'В детстве я перенес(ла) травму.',
  'У меня боль в тазовой области.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1323_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1323',
  title: 'Опросник центральной сенситизации, CSI-R (часть А)',
  description: 'CSI-R оценивает выраженность симптомов, ассоциированных с центральной сенситизацией: боль и мышечное напряжение, утомляемость и сон, сенсорную чувствительность, когнитивные и эмоциональные проявления, а также другие соматические жалобы. Русскоязычная версия валидирована для клинического применения у взрослых с хроническими болевыми синдромами; результаты помогают описывать симптомную нагрузку и её динамику, но сами по себе не устанавливают диагноз.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 4,
  scales: [
    { key: 'total', label: 'Общий балл CSI-R, часть А', items: Array.from({ length: 25 }, (_, index) => index + 1), reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  { title: 'Вручную проверено: все ответы «Никогда» дают ноль', answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 0])), expected: { total: 0 } },
  { title: 'Вручную проверено: все ответы «Всегда» дают 100', answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 4])), expected: { total: 100 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'csi-r-ru-esin-2020-part-a-sum-0-4-v1',
};
