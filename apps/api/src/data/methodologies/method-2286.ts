import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'Совсем нет' },
  { value: '1', label: 'Иногда' },
  { value: '2', label: 'Часто' },
  { value: '3', label: 'Очень часто' },
];
const historyOptions = [
  { value: '0', label: 'Никогда' },
  { value: '1', label: 'Однажды' },
  { value: '2', label: '2–3 раза' },
  { value: '3', label: 'Много раз' },
];

const prompts = [
  'Боялись ли вы того, что могли умереть?',
  'Вы когда-нибудь думали о том, что было бы лучше, если бы вы умерли?',
  'Считаете ли вы, что это замечательно, что вы живы?',
  'Чувствовали ли вы, что жизнь не стоит того, чтобы жить?',
  'Задумывались ли вы о том, чтобы причинить себе вред?',
  'Часто ли вы думали о том, что могли бы совершить суицид, если бы представился удобный случай?',
  'Строили ли вы планы о том, каким способом можно было бы закончить свою жизнь, то есть совершить суицид?',
  'Я размышлял(-а) о суициде, но знаю, что не сделаю этого.',
  'Вы наслаждаетесь своей жизнью?',
  'Ощущаете ли вы, что устали от жизни?',
  'На протяжении всей своей жизни вы когда-либо осознанно причиняли себе вред каким-либо способом?',
  'На протяжении всей своей жизни вы когда-либо совершали попытку суицида?',
];

const questions: SeedSection['questions'] = prompts.map((text, index) => ({
  code: `test_2304_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: index >= 10 ? historyOptions : options,
}));

export const instrument: SeedSection = {
  code: 'test_2304',
  title: 'Шкала оценки суицидального риска (RASS)',
  description: 'Краткая самоотчётная RASS оценивает суицидально связанные мысли, намерения и планы, отношение к жизни, а также историю самоповреждения и попыток суицида. Предназначена для предварительной оценки у людей из общей и клинической популяции; результат даёт дополнительную информацию для комплексной оценки и сам по себе не предсказывает поведение и не является диагнозом.',
  questions,
};

// Published item-specific percentile weights from the original RASS scoring table.
const itemScores: Record<number, Record<string, number>> = {
  1: { '0': 0, '1': 60, '2': 90, '3': 100 },
  2: { '0': 0, '1': 85, '2': 95, '3': 100 },
  3: { '0': 95, '1': 90, '2': 75, '3': 0 },
  4: { '0': 0, '1': 75, '2': 90, '3': 100 },
  5: { '0': 0, '1': 95, '2': 100, '3': 100 },
  6: { '0': 0, '1': 95, '2': 100, '3': 100 },
  7: { '0': 0, '1': 95, '2': 100, '3': 100 },
  8: { '0': 0, '1': 95, '2': 100, '3': 100 },
  9: { '0': 100, '1': 85, '2': 40, '3': 0 },
  10: { '0': 0, '1': 45, '2': 80, '3': 95 },
  11: { '0': 0, '1': 95, '2': 100, '3': 100 },
  12: { '0': 0, '1': 100, '2': 100, '3': 100 },
};
const allItems = Array.from({ length: 12 }, (_, index) => index + 1);
const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 3,
  scales: [
    { key: 'intention', label: 'Намерение', items: [5, 6, 7, 8], reverseItems: [], itemScores, aggregation: 'sum' },
    { key: 'life', label: 'Отношение к жизни', items: [2, 3, 4, 9, 10], reverseItems: [], itemScores, aggregation: 'sum' },
    { key: 'history', label: 'История поведения', items: [11, 12], reverseItems: [], itemScores, aggregation: 'sum' },
    { key: 'total', label: 'Общий индекс RASS', items: allItems, reverseItems: [], itemScores, aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: все ответы «совсем нет/никогда»; веса по опубликованной таблице',
    answers: Object.fromEntries(allItems.map(item => [String(item), '0'])),
    expected: { intention: 0, life: 140, history: 0, total: 140 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['clinical-s-risk'],
  scoringConfig,
  validationCases,
  formulaVersion: 'rass-fountoulakis-2012-percentile-weights-smirnova-2024-ru-v1',
};
