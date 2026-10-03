import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const labels = ['мгновенно', 'недолго', 'средне', 'долго', 'очень долго'];
const optionsByItem = [
  labels,
  ['очень долгий', 'долгий', 'средний', 'короткий', 'очень короткий'],
  ['нет', 'редко', 'не часто', 'часто', 'очень часто'],
  ['отлично', 'хорошо', 'средне', 'плохо', 'очень плохо'],
  ['нет', 'временами', 'умеренно', 'часто', 'множественные и тревожные'],
  ['отлично', 'хорошо', 'средне', 'плохо', 'очень плохо'],
];
const prompts = [
  'Время засыпания:',
  'Продолжительность сна:',
  'Количество ночных пробуждений:',
  'Качество сна:',
  'Количество сновидений:',
  'Качество утреннего пробуждения (утреннее самочувствие):',
];
const questions: SeedSection['questions'] = prompts.map((text, index) => ({
  code: `test_111_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: optionsByItem[index].map((label, optionIndex) => ({ value: String(5 - optionIndex), label })),
}));

export const instrument: SeedSection = {
  code: 'test_111',
  title: 'Анкета качества сна',
  description: "Анкета субъективной оценки сна описывает качество и отдельные характеристики сна, например засыпание, непрерывность и ощущение восстановления. Профиль помогает выявить жалобы, которые могут требовать дополнительного внимания.",
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [{
    key: 'total',
    label: 'Сумма баллов по шести характеристикам сна',
    items: [1, 2, 3, 4, 5, 6],
    reverseItems: [],
    aggregation: 'sum',
  }],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: по первому варианту каждого пункта получается 30 баллов',
    answers: { '1': 5, '2': 5, '3': 5, '4': 5, '5': 5, '6': 5 },
    expected: { total: 30 },
  },
  {
    title: 'Ручная проверка: по последнему варианту каждого пункта получается 6 баллов',
    answers: { '1': 1, '2': 1, '3': 1, '4': 1, '5': 1, '6': 1 },
    expected: { total: 6 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'levin-subjective-sleep-characteristics-1995-ru-v1',
};
