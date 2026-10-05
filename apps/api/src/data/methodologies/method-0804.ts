import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Совершенно согласен' },
  { value: '2', label: 'Согласен' },
  { value: '3', label: 'Не согласен' },
  { value: '4', label: 'Совершенно не согласен' },
];

const items = [
  'Я всегда нахожу новые и интересные аспекты в своей работе.',
  'Бывает, я чувствую себя усталым еще до того, как приеду на работу.',
  'Я всё чаще говорю о своей работе в негативном ключе.',
  'После работы мне требуется больше, чем раньше, времени, чтобы отдохнуть и «прийти в себя».',
  'Я очень хорошо справляюсь с давлением, которое оказывает на меня моя работа.',
  'В последнее время я меньше думаю о своей работе и выполняю ее механически.',
  'Я считаю свою работу сложной, но интересной.',
  'На протяжении рабочего дня я часто чувствую эмоциональное истощение.',
  'Со временем работа, подобная моей, может привести к отчужденности.',
  'После работы у меня остается достаточно энергии для досуга.',
  'Иногда я чувствую отвращение к моей работе.',
  'После работы я, как правило, чувствую себя изношенным и утомленным.',
  'Только такую работу я и могу для себя представить.',
  'Как правило, я очень хорошо справляюсь с объемом своей работы.',
  'Моя работа всё больше и больше меня увлекает.',
  'Во время работы я, как правило, чувствую себя энергичным.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_834_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_834',
  title: 'Ольденбургский опросник профессионального выгорания (OLBI)',
  description: 'Полная 16-пунктовая русскоязычная версия OLBI оценивает профессиональное выгорание по двум аспектам: отстраненности от работы и истощенности. Позитивно сформулированные пункты отражают противоположные полюса — идентификацию с работой и энергичность. Подходит для оценки состояния работающих взрослых; русская адаптация А. Ю. Смирновой предлагает полную версию прежде всего для кросс-культурных сравнений.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 4,
  scales: [
    { key: 'disengagement', label: 'Отстраненность — идентификация', items: [1, 3, 6, 7, 9, 11, 13, 15], reverseItems: [3, 6, 9, 11], aggregation: 'sum' },
    { key: 'exhaustion', label: 'Истощенность — энергичность', items: [2, 4, 5, 8, 10, 12, 14, 16], reverseItems: [2, 4, 8, 12], aggregation: 'sum' },
  ],
};

const responseSet = (values: number[]) => Object.fromEntries(values.map((value, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: все ответы «Совершенно согласен»; реверсивные пункты меняются на 4',
    answers: responseSet(Array(16).fill(1)),
    expected: { disengagement: 20, exhaustion: 20 },
  },
  {
    title: 'Ручная проверка: последовательно ответы 1–4; проверка обеих шкал и реверсивных пунктов',
    answers: responseSet([1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4]),
    expected: { disengagement: 22, exhaustion: 22 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'olbi-ru-smirnova-2017-full-v1',
};
