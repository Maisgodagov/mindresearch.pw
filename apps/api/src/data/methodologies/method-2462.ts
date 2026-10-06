import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Определенно не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'До определенной степени не согласен' },
  { value: '4', label: 'Ни то, ни другое' },
  { value: '5', label: 'До определенной степени согласен' },
  { value: '6', label: 'Согласен' },
  { value: '7', label: 'Определенно согласен' },
];

const items = [
  'В целом моя жизнь близка к идеалу.',
  'Условия моей жизни прекрасные.',
  'Я удовлетворен жизнью.',
  'К настоящему моменту я уже получил от жизни всё, чего хотел.',
  'Если я мог прожить жизнь заново, то не изменил бы почти ничего.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2480_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

const instrument: SeedSection = {
  code: 'test_2480',
  title: 'Шкала удовлетворенности жизнью (SWLS), русскоязычная версия Елшанского и соавторов',
  description: 'SWLS оценивает общую когнитивную удовлетворенность жизнью — насколько человек в целом оценивает свою жизнь как соответствующую ожиданиям. Пять утверждений охватывают глобальную оценку жизни, её условий, удовлетворенность, достигнутое и ретроспективную оценку. Русский текст этой регистрации — версия Елшанского и соавторов; её исследовали на русскоязычных участниках 17–66 лет, включая студентов, преподавателей и работающих взрослых.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [{
    key: 'total',
    label: 'Общая удовлетворенность жизнью (SWLS)',
    items: [1, 2, 3, 4, 5],
    reverseItems: [],
    aggregation: 'sum',
  }],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: минимальные ответы дают сумму 5',
    answers: { '1': 1, '2': 1, '3': 1, '4': 1, '5': 1 },
    expected: { total: 5 },
  },
  {
    title: 'Ручная проверка: ответы 1–5 дают сумму 15',
    answers: { '1': 1, '2': 2, '3': 3, '4': 4, '5': 5 },
    expected: { total: 15 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['meaning-satisfaction'],
  scoringConfig,
  validationCases,
  formulaVersion: 'swls-yelshansky-et-al-2015-direct-sum-v1',
};
