import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const items = [
  'Трудности в учебе.',
  'Неудовлетворительные отношения со сверстниками.',
  'Конфликтные отношения с преподавателями.',
  'Неудовлетворённость романтическими отношениями.',
  'Постоянные финансовые затруднения.',
  'Отсутствие поддержки от членов семьи.',
  'Угроза жизни и здоровью.',
  'Стремительно меняющийся мир.',
  'Поток негативных новостей.',
  'В современном мире трудно определить, где правда, а где – ложь.',
  'Климатические изменения и природные катаклизмы.',
  'Трудности построения профессиональных планов в условиях неопределенности.',
  'Сложно понять, кто враги, а кто – друзья.',
  'Возрастающая неопределённость будущего.',
];

const options = [
  { value: '1', label: 'Отсутствие стресса' },
  { value: '2', label: 'Небольшой стресс' },
  { value: '3', label: 'Значительный стресс' },
  { value: '4', label: 'Чрезмерный стресс' },
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1693_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1693',
  title: 'Стресс субъективной и объективной неопределенности (ССОН)',
  description: 'Опросник оценивает воспринимаемый стресс в юношеском возрасте, разделяя стресс, связанный с личными жизненными обстоятельствами и отношениями, и стресс от глобальных общественных и природных факторов неопределенности. Автору опроса он помогает сопоставить эти два источника переживаемого стресса и получить общий показатель.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 4,
  scales: [
    { key: 'subjective_uncertainty', label: 'Стресс субъективной неопределенности', items: [1, 2, 3, 4, 5, 6, 7], reverseItems: [], aggregation: 'sum' },
    { key: 'objective_uncertainty', label: 'Стресс объективной неопределенности', items: [8, 9, 10, 11, 12, 13, 14], reverseItems: [], aggregation: 'sum' },
    { key: 'total', label: 'Общий уровень стресса неопределенности', items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Минимум по всем пунктам',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { subjective_uncertainty: 7, objective_uncertainty: 7, total: 14 },
  },
  {
    title: 'Максимум по всем пунктам',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 4])),
    expected: { subjective_uncertainty: 28, objective_uncertainty: 28, total: 56 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'sson-morosanova-potanina-pashchenko-2024-v1',
};
