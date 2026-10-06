import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Совершенно не удовлетворен(а)' },
  { value: '2', label: 'Скорее не удовлетворен(а), чем удовлетворен(а)' },
  { value: '3', label: 'Чем-то удовлетворен(а), а чем-то нет' },
  { value: '4', label: 'Скорее удовлетворен(а), чем не удовлетворен(а)' },
  { value: '5', label: 'Полностью удовлетворен(а)' },
];

const items = [
  'Успех в жизни (достижение жизненных целей)',
  'Личная свобода',
  'Материальное положение',
  'Жилищные условия',
  'Работа',
  'Положение в обществе',
  'Финансовое положение (доходы)',
  'Деловые качества',
  'Отношения в семье',
  'Отношения с родственниками',
  'Качество питания',
  'Личная жизнь',
  'Медицинское обслуживание',
  'Отношения с друзьями',
  'Отношения с соседями',
  'Отношения с коллегами по работе',
  'Условия отдыха, досуга',
  'Экология среды проживания',
  'Личный автотранспорт',
  'Здоровье',
  'Личная безопасность',
  'Качество образования',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2481_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

const instrument: SeedSection = {
  code: 'test_2481',
  title: 'Шкала удовлетворенности жизнью (SLS) Хащенко—Барановой',
  description: 'Методика оценивает удовлетворенность жизнью по отдельным значимым аспектам и в целом. Она охватывает личные потребности и достижения, семью и межличностные отношения, безопасность, здоровье и социально-экономические условия. Подходит для русскоязычных взрослых и молодежи в исследовательских опросах, где важно увидеть профиль удовлетворенности и общий индекс; баллы описывают субъективную оценку, а не диагноз.',
  categoryIds: ['meaning-satisfaction'],
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'overall', label: 'Общий индекс удовлетворенности', items: Array.from({ length: 22 }, (_, i) => i + 1), reverseItems: [], aggregation: 'sum' },
    { key: 'family', label: 'Семья', items: [9, 10], reverseItems: [], aggregation: 'sum' },
    { key: 'relationships', label: 'Межличностные отношения', items: [14, 15, 16], reverseItems: [], aggregation: 'sum' },
    { key: 'personalNeeds', label: 'Персональные потребности', items: [1, 2, 5, 8, 12], reverseItems: [], aggregation: 'sum' },
    { key: 'personalSafety', label: 'Личная безопасность', items: [13, 20, 21], reverseItems: [], aggregation: 'sum' },
    { key: 'socioeconomic', label: 'Социально-экономические условия', items: [3, 4, 6, 7, 11, 17, 18, 19, 22], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все аспекты оценены минимально',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { overall: 22, family: 2, relationships: 3, personalNeeds: 5, personalSafety: 3, socioeconomic: 9 },
  },
  {
    title: 'Все аспекты оценены максимально',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 5])),
    expected: { overall: 110, family: 10, relationships: 15, personalNeeds: 25, personalSafety: 15, socioeconomic: 45 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'sls-khashchenko-baranova-2004-22item-5point-v1',
};
