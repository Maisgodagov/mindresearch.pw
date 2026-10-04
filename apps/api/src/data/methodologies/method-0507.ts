import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '4', label: 'полностью согласен' },
  { value: '3', label: 'согласен' },
  { value: '2', label: 'не согласен' },
  { value: '1', label: 'категорически не согласен' },
];

const items = [
  'Мне было бы интересно поработать в коллективе, где есть представители разных возрастов',
  'Мне было бы трудно сработаться с людьми гораздо старше меня',
  'Люди среднего и старшего возраста плохо понимают реалии жизни молодых людей, поэтому мне было бы сложно с ними работать',
  'Иногда мне сложно находить общий язык с людьми других поколений',
  'Общаясь с людьми старшего поколения, я узнаю много о жизни',
  'Мне кажется, что люди старшего возраста способны передать жизненный опыт молодежи',
  'Я, в целом, нахожу общий язык с людьми старшего поколения',
  'Иногда мне кажется, что я и люди старшего возраста говорим на разных языках',
  'Я бы хотел, чтобы среди моих друзей и знакомых были люди старшего поколения',
  'Я считаю, что для молодежи необходимо общение с представителями старших поколений',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_542_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

const instrument: SeedSection = {
  code: 'test_542',
  title: 'Межпоколенные социальные отношения-I (МПСО-I), версия для молодежи',
  description: 'Опросник оценивает отношение молодежи к представителям старших поколений по двум аспектам: межпоколенный диалог (ценность опыта старших, общий язык и польза общения) и межпоколенное взаимодействие (готовность к совместной работе и включению старших в круг общения). Авторская версия разработана для молодежи; психометрическая проверка проводилась на студентах 17–20 лет.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 4,
  scales: [
    { key: 'dialogue', label: 'Межпоколенный диалог (МПД)', items: [4, 5, 6, 7, 8, 10], reverseItems: [4, 8], aggregation: 'sum' },
    { key: 'interaction', label: 'Межпоколенное взаимодействие (МПВз)', items: [1, 2, 3, 9], reverseItems: [3], aggregation: 'sum' },
  ],
};

const allAnswers = (answer: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), answer]));
const validationCases: ValidationCase[] = [
  { title: 'Полностью согласен со всеми утверждениями', answers: allAnswers(4), expected: { dialogue: 20, interaction: 11 } },
  { title: 'Категорически не согласен со всеми утверждениями', answers: allAnswers(1), expected: { dialogue: 11, interaction: 16 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'mpso-i-youth-petrash-strizhitskaya-2020-v1',
};
