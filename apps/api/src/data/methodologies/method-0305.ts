import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const optionLabels = [
  'Противоречит моим ценностям',
  'Не важно',
  'Важно',
  'Очень важно',
  'Имеет первостепенное значение',
];
const options = optionLabels.map((label, index) => ({ value: String(index + 1), label }));

const values = [
  ['Этика', 'Играть честно, с уважением к спортивной этике'],
  ['Здоровье', 'Быть здоровым'],
  ['Совершенство', 'Добиться совершенства в спорте'],
  ['Воспитание', 'Хорошие манеры и воспитание'],
  ['Радость', 'Получать удовольствие и радость в спорте'],
  ['Командная работа', 'Работать в команде'],
  ['Упорство', 'Проявлять самоотверженность и целеустремленность'],
  ['Правила', 'Соблюдать правила спорта'],
  ['Уважение', 'Проявлять уважение к себе и к другим участникам соревнований'],
  ['Смелость', 'Проявлять смелость и кураж'],
  ['Солидарность', 'Чувство общности и солидарности'],
] as const;

const questions: SeedSection['questions'] = values.map(([, text], index) => ({
  code: `test_337_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_337',
  title: 'Измерение ценностей «Духа спорта» (SOS), русская версия',
  description: 'Методика описывает субъективную важность 11 ценностей спортивного участия, связанных с этикой и честной игрой, здоровьем, совершенствованием, воспитанием, радостью, командной работой, упорством, правилами, уважением, смелостью и солидарностью. Подходит для опросов спортсменов и изучения ценностных приоритетов в соревновательном спорте; каждая ценность оценивается отдельно.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 9,
  scales: values.map(([label], index) => ({
    key: `v${index + 1}`,
    label,
    items: [index + 1],
    reverseItems: [],
    aggregation: 'sum',
  })),
};

const validationCases: ValidationCase[] = [
  {
    title: 'Минимальная оценка по каждой отдельной ценности',
    answers: Object.fromEntries(values.map((_, index) => [String(index + 1), 1])),
    expected: Object.fromEntries(values.map((_, index) => [`v${index + 1}`, 1])),
  },
  {
    title: 'Максимальная оценка по каждой отдельной ценности',
    answers: Object.fromEntries(values.map((_, index) => [String(index + 1), 9])),
    expected: Object.fromEntries(values.map((_, index) => [`v${index + 1}`, 9])),
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'sos-bochaver-2023-nine-point-individual-values-v1',
};
