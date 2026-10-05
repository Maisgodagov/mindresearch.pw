import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const answers = [
  { value: 'a', label: 'Завышенная' },
  { value: 'b', label: 'Заниженная' },
  { value: 'c', label: 'Соответствующая' },
];

const items = [
  'Как вы оцениваете свои возможности при достижении целей?',
  'Вы знаете, какой у вас характер?',
  'Вы всегда знаете, чего хотите?',
  'Вы знаете свои эмоции (темперамент)?',
  'Вы знаете, что необходимо для того, чтобы быть психологически устойчивой личностью?',
  'Вы считаете себя уравновешенным?',
  'Вы считаете себя стойким в противостоянии трудностям?',
  'Вы можете сопротивляться навязываемым вам решениям, мнениям, взглядам?',
  'Вас легко вывести из равновесия?',
  'У вас всегда стабильное настроение?',
  'Вы можете регулировать свое поведение в экстремальных ситуациях?',
  'Вы проявляете сейчас социальную активность?',
  'Какова сейчас ваша работоспособность?',
  'Вы умеете регулировать внутриличностный конфликт?',
  'Вы умеете решать конфликты со сверстниками и взрослыми?',
];

const optionLabels = [
  ['Завышенная', 'Заниженная', 'Соответствующая'],
  ['Нет', 'Частично', 'Да'],
  ['Нет', 'Иногда', 'Всегда'],
  ['Нет', 'Иногда', 'Да'],
  ['Нет', 'Частично', 'Да'],
  ['Нет', 'Частично', 'Да'],
  ['Нет', 'Частично', 'Да'],
  ['Нет', 'Частично', 'Да'],
  ['Да', 'Возможно', 'Нет'],
  ['Нет', 'Иногда', 'Да'],
  ['Нет', 'Частично', 'Да'],
  ['Низкая', 'Средняя', 'Высокая'],
  ['Низкая', 'Средняя', 'Высокая'],
  ['Нет', 'С трудом', 'Да'],
  ['Нет', 'Частично', 'Да'],
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1506_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: answers.map((answer, optionIndex) => ({ ...answer, label: optionLabels[index][optionIndex] })),
}));

export const instrument: SeedSection = {
  code: 'test_1506',
  title: 'Определение психологической устойчивости личности (ПУЛ)',
  description: 'Опросник оценивает психологическую устойчивость учащихся старших классов и студентов через понимание себя, стойкость и уравновешенность, сопротивляемость внешнему давлению, саморегуляцию, социальную активность, работоспособность и разрешение конфликтов. Профиль может помочь автору опроса описать эти стороны личностного ресурса в образовательном контексте.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 1,
  scales: [{
    key: 'psychological_resilience',
    label: 'Психологическая устойчивость личности',
    items: items.map((_, index) => index + 1),
    reverseItems: [],
    itemScores: Object.fromEntries(items.map((_, index) => [index + 1, { a: 0, b: 0.5, c: 1 }])),
    aggregation: 'sum',
  }],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы A дают 0 баллов',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 'a'])),
    expected: { psychological_resilience: 0 },
  },
  {
    title: 'Все ответы C дают максимальные 15 баллов',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 'c'])),
    expected: { psychological_resilience: 15 },
  },
  {
    title: 'Проверка кодирования: A, B и C дают 0, 0,5 и 1 балл',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), ['a', 'b', 'c'][index % 3]])),
    expected: { psychological_resilience: 7.5 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'pul-miniyarov-shinyaev-2011-students-v1',
};
