import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Совершенно не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Согласен' },
  { value: '4', label: 'Совершенно согласен' },
];

const items = [
  'Я часто думаю о плохих событиях, которые когда-то произошли со мной',
  'Я так расстраиваюсь из-за ссор моих близких, что кажется «все кончено»',
  'Когда со мной случается что-то плохое, я все время в мыслях возвращаюсь к этому, переживая сильные негативные эмоции',
  'Я не могу забыть ту боль, которую мне причинили другие',
  'Когда я в отчаянии, мне сложно разобраться в своих чувствах и в том, что на уме у других',
  'Временами меня охватывает такое отчаяние, что я готов на все самое худшее',
  'Мне сложно понимать эмоции других людей и как они на самом деле ко мне относятся',
  'Нельзя предугадать, какую реакцию вызовут твои слова',
  'Я всегда готов к самому плохому',
  'Не то что других людей, я и себя толком понять не могу',
  'Чаще всего я не могу понять свои чувства',
  'Когда я переживаю сильные эмоции, то плохо контролирую себя',
  'Алкоголь неплохо помогает мне избавиться от хандры',
  'Когда я очень расстроен, то способен совершить что-то ужасное',
  'Если я расстроен, то долго не могу выйти из этого состояния',
  'Когда очень плохо на душе, я могу причинить себе физическую боль',
  'Я не всегда понимаю, что чувствую',
  'Временами эмоции так переполняют меня, что я могу наделать глупостей',
  'Плохое настроение у меня может длиться неделями и месяцами',
  'Близкие упрекают меня в бесчувствии',
  'Иногда я не знаю, как справиться со своими эмоциями',
  'Иногда, чтобы справиться со своими эмоциями, мне нужно выпить какое-нибудь лекарство',
  'В отчаянии я могу оставаться днями и неделями',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1340_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1340',
  title: 'Опросник эмоциональной дисрегуляции',
  description: 'Самоотчётная методика для исследовательской оценки трёх форм нарушений эмоциональной регуляции: руминации, избегания переживаний и трудностей ментализации (понимания собственных и чужих эмоций). Разработана и исследовалась на старших школьниках, студентах и работающих взрослых; опубликованные данные относятся к возрасту 15–45 лет. Может помочь автору опроса описать эти низкоадаптивные способы обращения с эмоциями; сама по себе не предназначена для самостоятельной диагностики.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 4,
  scales: [
    { key: 'rumination', label: 'Руминация', items: [1, 2, 3, 4, 9, 15, 19, 23], reverseItems: [], aggregation: 'sum' },
    { key: 'avoidance', label: 'Избегание', items: [6, 13, 14, 16, 18, 22], reverseItems: [], aggregation: 'sum' },
    { key: 'mentalization_difficulties', label: 'Трудности ментализации', items: [5, 7, 8, 10, 11, 12, 17, 20, 21], reverseItems: [], aggregation: 'sum' },
  ],
};

const allAnswers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Все ответы «Совершенно не согласен»', answers: allAnswers(1), expected: { rumination: 8, avoidance: 6, mentalization_difficulties: 9 } },
  { title: 'Все ответы «Совершенно согласен»', answers: allAnswers(4), expected: { rumination: 32, avoidance: 24, mentalization_difficulties: 36 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'oedis-polskaya-razvalyaeva-2017-ru-v1',
};
