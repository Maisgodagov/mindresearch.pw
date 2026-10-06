import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'Никогда' },
  { value: '1', label: 'Почти никогда — несколько раз в год или реже' },
  { value: '2', label: 'Редко — раз в месяц или реже' },
  { value: '3', label: 'Иногда — несколько раз в месяц' },
  { value: '4', label: 'Часто — раз в неделю' },
  { value: '5', label: 'Очень часто — несколько раз в неделю' },
  { value: '6', label: 'Всегда — каждый день' },
];

const items = [
  'Во время работы меня переполняет энергия.',
  'Моя работа целенаправленна и осмысленна.',
  'Когда я работаю, время пролетает незаметно.',
  'Во время работы я испытываю прилив сил и энергии.',
  'Я полон энтузиазма в отношении своей работы.',
  'Во время работы я забываю обо всем окружающем.',
  'Моя работа вдохновляет меня.',
  'Проснувшись утром, я радуюсь тому, что пойду на работу.',
  'Я счастлив, когда интенсивно работаю.',
  'Я горжусь своей работой.',
  'Я ухожу в работу с головой.',
  'Могу работать в течение длительного времени без перерывов.',
  'Работа ставит передо мной сложные и интересные задачи.',
  'Я позволяю работе «уносить» меня.',
  'В работе я очень настойчив и не отвлекаюсь на постороннее.',
  'Мне трудно отложить работу в сторону.',
  'Я продолжаю работать даже тогда, когда дела идут плохо.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2003_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2003',
  title: 'Утрехтская шкала увлеченности работой (UWES-17)',
  description: 'UWES-17 оценивает устойчивое позитивное состояние, связанное с работой, по трём аспектам: энергичность и настойчивость, энтузиазм и значимость работы, а также поглощённость рабочей деятельностью. Подходит для опросов работающих взрослых; помогает автору опроса описать вовлечённость как общий показатель и по отдельным составляющим.',
  questions,
};

const vigor = [1, 4, 8, 12, 15, 17];
const dedication = [2, 5, 7, 10, 13];
const absorption = [3, 6, 9, 11, 14, 16];

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 6,
  scales: [
    { key: 'vigor', label: 'Энергичность', items: vigor, reverseItems: [], aggregation: 'mean' },
    { key: 'dedication', label: 'Преданность работе', items: dedication, reverseItems: [], aggregation: 'mean' },
    { key: 'absorption', label: 'Поглощённость', items: absorption, reverseItems: [], aggregation: 'mean' },
    { key: 'total', label: 'Общая увлечённость работой', items: Array.from({ length: 17 }, (_, i) => i + 1), reverseItems: [], aggregation: 'mean' },
  ],
};

const allAnswers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Ручная проверка: все ответы «Никогда»', answers: allAnswers(0), expected: { vigor: 0, dedication: 0, absorption: 0, total: 0 } },
  { title: 'Ручная проверка: все ответы «Каждый день»', answers: allAnswers(6), expected: { vigor: 6, dedication: 6, absorption: 6, total: 6 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'uwes-17-kutuzova-2006-psytests-frequency-means-v1',
};
