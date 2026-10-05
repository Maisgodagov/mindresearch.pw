import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Полностью не согласен' },
  { value: '2', label: 'Скорее не согласен' },
  { value: '3', label: 'Не знаю' },
  { value: '4', label: 'Скорее согласен' },
  { value: '5', label: 'Полностью согласен' },
];

const items = [
  'Преподаватели не понимают образ жизни молодёжи',
  'Задания, которые мне приходится делать, слишком сложные',
  'Посещение университета напоминает мне о моих психологических проблемах',
  'Бывает, что новшества, которые пытаются применить в образовании, идут ему на вред',
  'Я сталкивался с трудностями, связанными с тем, что обучение в университете отличается от обучения в школе',
  'Страх не сдать предметы заставляет меня нервничать',
  'Мои ожидания от учебного процесса были совсем иными',
  'Учёба провоцирует во мне болезненные воспоминания из детства',
  'Моя учебная программа (предметы, их количество) выстроена не лучшим образом',
  'Преподаватели или их руководство придумывают весьма сомнительные новые способы обучения',
  'Я испытываю стресс из-за экзаменов и контрольных работ',
  'Мне трудно сосредоточиться и уделять достаточно времени учёбе из-за внешних факторов',
  'Я чувствую себя подверженным негативным воздействиям со стороны университетской среды',
  'Бывает, что определённые предметы кажутся мне бесполезными',
  'Бывает, что преподаватели не уважают меня',
  'Бывает, что в рамках моего обучения преподаватели весьма неудачно применяют новые и инновационные методы обучения',
  'Мне трудно выполнять задания из-за того, что преподаватель просит выполнить их непривычным мне способом',
  'Бывает, что преподаватели аргументируют свою правоту своим высоким статусом, и мне это не нравится',
  'В процессе обучения бывали такие ситуации, которые задевали меня «за живое» и вызывали обиду, гнев или другие негативные эмоции',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_995_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_995',
  title: 'Опросник исследования выраженности детерминант сопротивления обучению',
  description: 'Методика С. М. Якушина оценивает выраженность факторов образовательной среды, способных вызывать сопротивление обучению у студентов вузов. Охватывает смысловые барьеры учения, триггеры психологических травм, академическую тревожность, несоответствие академическим ожиданиям и чрезмерную субъективную трудность обучения; предназначена для исследования студентов высших учебных заведений в оптимизированной 19-пунктовой версии.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'meaning_barrier', label: 'Смысловые барьеры учения', items: [1, 4, 10, 15, 16, 18], reverseItems: [], aggregation: 'sum' },
    { key: 'trauma_triggers', label: 'Триггеры психологических травм', items: [3, 8, 13, 19], reverseItems: [], aggregation: 'sum' },
    { key: 'academic_anxiety', label: 'Академическая тревожность', items: [6, 11], reverseItems: [], aggregation: 'sum' },
    { key: 'expectation_mismatch', label: 'Несоответствие академическим ожиданиям', items: [7, 9, 14], reverseItems: [], aggregation: 'sum' },
    { key: 'subjective_difficulty', label: 'Чрезмерная субъективная трудность обучения', items: [2, 5, 12, 17], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная сверка: минимальное согласие даёт минимальные суммы по всем факторам',
    answers: Object.fromEntries(Array.from({ length: 19 }, (_, index) => [String(index + 1), 1])),
    expected: { meaning_barrier: 6, trauma_triggers: 4, academic_anxiety: 2, expectation_mismatch: 3, subjective_difficulty: 4 },
  },
  {
    title: 'Ручная сверка: максимальное согласие даёт максимальные суммы по всем факторам',
    answers: Object.fromEntries(Array.from({ length: 19 }, (_, index) => [String(index + 1), 5])),
    expected: { meaning_barrier: 30, trauma_triggers: 20, academic_anxiety: 10, expectation_mismatch: 15, subjective_difficulty: 20 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'yakushin-learning-resistance-determinants-optimized-19-likert5-sum-v1',
};
