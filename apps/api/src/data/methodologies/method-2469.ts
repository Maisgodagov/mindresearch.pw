import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Признак присутствует' },
  { value: '0', label: 'Признак отсутствует' },
];

const items = [
  'Мужской пол.',
  'Возраст: 15–24 года или старше 65 лет.',
  'Депрессия.',
  'Психоз.',
  'Злоупотребление алкоголем и психоактивными веществами.',
  'Суицидальные попытки в прошлом.',
  'Наличие суицидального плана.',
  'Семейное положение: холост, разведен, вдовец.',
  'Утрата значимых личностных и социальных связей.',
  'Тяжелое соматическое заболевание.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2487_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2487',
  title: 'Шкала ургентной оценки суицидального риска (SAD PERSONS)',
  description: 'Клиническая скрининговая шкала для структурированной оценки десяти демографических и клинических факторов суицидального риска у пациента. Предназначена для первичной ургентной оценки специалистом; результат дополняет, но не заменяет всестороннюю клиническую оценку.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 1,
  scales: [{
    key: 'total_risk_factors',
    label: 'Суммарная оценка факторов риска',
    items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    reverseItems: [],
    aggregation: 'sum',
  }],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все признаки отсутствуют: сумма равна нулю',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), '0'])),
    expected: { total_risk_factors: 0 },
  },
  {
    title: 'Все признаки присутствуют: сумма равна десяти',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), '1'])),
    expected: { total_risk_factors: 10 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['clinical-s-risk'],
  scoringConfig,
  validationCases,
  formulaVersion: 'sad-persons-patterson-ru-guideline-2021-v1',
};
