import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  'Совсем нет',
  'Немного',
  'В некоторой степени',
  'В значительной мере',
  'В максимальной степени',
].map((label, index) => ({ value: String(index), label }));

const items = [
  'Я спас множество вещей, которые хотели выкинуть.',
  'Я перепроверяю всё чаще, чем это необходимо',
  'Меня расстраивает, когда предметы расставлены неправильно.',
  'Я чувствую необходимость считать, когда делаю что-то.',
  'Мне трудно прикоснуться к предмету, если я знаю, что его трогали незнакомцы или определенные люди.',
  'Мне трудно контролировать свои собственные мысли.',
  'Я собираю вещи, которые мне не нужны.',
  'Я постоянно проверяю двери, окна, выдвижные ящики и так далее.',
  'Меня расстраивает, когда я расставил вещи в определенном порядке, а другие люди их передвигают.',
  'Я чувствую, что должен повторять определенные числа.',
  'Иногда мне приходится мыться или приводить себя в порядок просто потому, что я чувствую себя загрязненным.',
  'Меня расстраивают неприятные мысли, которые приходят мне в голову против моей воли.',
  'Я избегаю выбрасывать вещи, потому что боюсь, что они могут понадобиться мне позже.',
  'Я постоянно перепроверяю краны и выключатели после того, как выключу газ, воду или свет.',
  'Мне нужно, чтобы все вещи были расставлены определенным образом.',
  'Для меня числа могут быть хорошими и плохими.',
  'Я мою руки чаще и дольше, чем это необходимо.',
  'У меня часто бывают гадкие мысли и мне трудно избавиться от них.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1091_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1091',
  title: 'Опросник обсессивно-компульсивных симптомов OCI-R',
  description: 'Краткий самоопросник оценивает выраженность дистресса, связанного с обсессивно-компульсивными проявлениями за последний месяц. Охватывает мытьё, проверки, упорядочивание, навязчивые мысли, накопительство и мысленную нейтрализацию; подходит для скрининга взрослых и исследовательского отслеживания симптомов, но сам по себе не устанавливает диагноз.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 4,
  scales: [
    { key: 'hoarding', label: 'Накопительство', items: [1, 7, 13], reverseItems: [], aggregation: 'sum' },
    { key: 'checking', label: 'Проверки', items: [2, 8, 14], reverseItems: [], aggregation: 'sum' },
    { key: 'ordering', label: 'Упорядочивание', items: [3, 9, 15], reverseItems: [], aggregation: 'sum' },
    { key: 'neutralizing', label: 'Мысленная нейтрализация', items: [4, 10, 16], reverseItems: [], aggregation: 'sum' },
    { key: 'washing', label: 'Мытьё', items: [5, 11, 17], reverseItems: [], aggregation: 'sum' },
    { key: 'obsessing', label: 'Навязчивые мысли', items: [6, 12, 18], reverseItems: [], aggregation: 'sum' },
    { key: 'total', label: 'Общий балл дистресса', items: Array.from({ length: 18 }, (_, index) => index + 1), reverseItems: [], aggregation: 'sum' },
  ],
};

const allAnswers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Все ответы соответствуют «Совсем нет»', answers: allAnswers(0), expected: { hoarding: 0, checking: 0, ordering: 0, neutralizing: 0, washing: 0, obsessing: 0, total: 0 } },
  { title: 'Все ответы соответствуют «В максимальной степени»', answers: allAnswers(4), expected: { hoarding: 12, checking: 12, ordering: 12, neutralizing: 12, washing: 12, obsessing: 12, total: 72 } },
  { title: 'Ручная сверка: профиль [1,2,3] даёт накопительство 6, проверки 0 и общий балл 6', answers: { ...allAnswers(0), '1': 1, '7': 2, '13': 3 }, expected: { hoarding: 6, checking: 0, ordering: 0, neutralizing: 0, washing: 0, obsessing: 0, total: 6 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'oci-r-foa-2002-psytests-ru-2024-v1',
};
