import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const items = [
  'Через какое время после пробуждения Вы выкуриваете первую сигарету?',
  'Трудно ли Вам воздержаться от курения в местах, где курение запрещено?',
  'От какой сигареты Вам было бы труднее всего отказаться?',
  'Сколько сигарет в день Вы выкуриваете?',
  'Курите ли Вы чаще в первые часы после пробуждения, чем в течение остального дня?',
  'Курите ли Вы, если настолько больны, что вынуждены оставаться в постели большую часть дня?',
];

const responseLabels = [
  ['В течение 5 минут', 'Через 6–30 минут', 'Через 31–60 минут', 'Позже чем через 60 минут'],
  ['Да', 'Нет'],
  ['Первая утром', 'Любая другая'],
  ['10 или меньше', '11–20', '21–30', '31 или больше'],
  ['Да', 'Нет'],
  ['Да', 'Нет'],
];

const scoreKeys = [
  ['3', '2', '1', '0'],
  ['1', '0'],
  ['1', '0'],
  ['0', '1', '2', '3'],
  ['1', '0'],
  ['1', '0'],
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1879_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: responseLabels[index].map((label, optionIndex) => ({ value: scoreKeys[index][optionIndex], label })),
}));

export const instrument: SeedSection = {
  code: 'test_1879',
  title: 'Тест Фагерстрема на никотиновую зависимость (FTND)',
  description: 'Шесть пунктов оценивают выраженность физической зависимости от никотина, связанной с курением сигарет: скорость первой сигареты после пробуждения, трудность воздержания, наиболее значимую сигарету, суточное потребление и курение утром или во время болезни. Версия предназначена для взрослых курильщиков сигарет и даёт суммарный показатель для скрининговой и клинической оценки, но сама по себе не устанавливает диагноз.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 3,
  scales: [{
    key: 'ftnd_total',
    label: 'Суммарный балл FTND',
    items: [1, 2, 3, 4, 5, 6],
    reverseItems: [],
    itemScores: Object.fromEntries(scoreKeys.map((scores, index) => [String(index + 1), Object.fromEntries(scores.map((score) => [score, Number(score)]))])),
    aggregation: 'sum',
  }],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная сверка: ответы дают максимальную сумму 10',
    answers: { '1': '3', '2': '1', '3': '1', '4': '3', '5': '1', '6': '1' },
    expected: { ftnd_total: 10 },
  },
  {
    title: 'Ручная сверка: ответы дают минимальную сумму 0',
    answers: { '1': '0', '2': '0', '3': '0', '4': '0', '5': '0', '6': '0' },
    expected: { ftnd_total: 0 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'ftnd-heatherton-1991-ru-psytests-2023-v1',
};
