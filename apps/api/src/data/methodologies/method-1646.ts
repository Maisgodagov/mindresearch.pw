import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const idealSigns = ['+', '-', '+', '+', '-', '+', '+', '+', '-', '+', '+', '+', '-', '+', '-', '-', '-', '+', '+', '-', '-', '+', '+', '+'];

const statements = [
  'Педагог умеет точно предсказать результат моей работы.',
  'Мне трудно ладить с педагогом.',
  'Педагог — справедливый человек.',
  'Педагог умело помогает мне преодолевать трудности.',
  'Педагогу явно не хватает чуткости.',
  'Мнение педагога для меня является важным.',
  'Педагог тщательно планирует работу с нами.',
  'Я вполне доволен педагогом.',
  'Педагог недостаточно требователен ко мне.',
  'Педагог всегда может дать разумный совет.',
  'Я полностью доверяю педагогу.',
  'Оценка педагога очень важна для меня.',
  'Педагог в основном работает по шаблону.',
  'Работать с педагогом — одно удовольствие.',
  'Педагог уделяет мне мало внимания.',
  'Педагог не учитывает моих индивидуальных особенностей.',
  'Педагог плохо чувствует моё настроение.',
  'Педагог всегда выслушивает моё мнение.',
  'У меня нет сомнений в правильности методов и средств, которые применяет педагог.',
  'Я не стану делиться своими мыслями с педагогом.',
  'Педагог постоянно указывает мне на мои ошибки.',
  'Педагог хорошо знает мои слабые и сильные стороны.',
  'Я хотел бы быть похожим на педагога.',
  'У нас с педагогом сложились деловые отношения.',
];

const options = [
  { value: '+', label: 'Согласен' },
  { value: '-', label: 'Не согласен' },
];

const questions: SeedSection['questions'] = statements.map((text, index) => ({
  code: `test_1663_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1663',
  title: 'Степень развития компонентов педагогического взаимодействия',
  description: 'Методика предназначена для школьников и оценивает воспринимаемое качество взаимодействия ученика с педагогом. Она охватывает когнитивный, эмоциональный и поведенческо-волевой компоненты отношений и помогает автору опроса увидеть сильные стороны и возможные трудности взаимодействия в конкретной паре «ученик — педагог».',
  questions,
};

const componentItems = {
  cognitive: [1, 4, 7, 10, 11, 12, 13, 16, 19, 22],
  emotional: [2, 5, 8, 11, 14, 15, 16, 17, 20],
  behavioralVolitional: [3, 6, 9, 12, 13, 14, 15, 18, 19, 20, 21, 24],
};

const itemScores = (items: number[]) => Object.fromEntries(items.map(item => [
  item,
  { '+': idealSigns[item - 1] === '+' ? 1 : 0, '-': idealSigns[item - 1] === '-' ? 1 : 0 },
])) as Record<number, Record<string, number>>;

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 1,
  scales: [
    { key: 'cognitive', label: 'Когнитивный компонент', items: componentItems.cognitive, reverseItems: componentItems.cognitive.filter(item => idealSigns[item - 1] === '-'), itemScores: itemScores(componentItems.cognitive), aggregation: 'mean' },
    { key: 'emotional', label: 'Эмоциональный компонент', items: componentItems.emotional, reverseItems: componentItems.emotional.filter(item => idealSigns[item - 1] === '-'), itemScores: itemScores(componentItems.emotional), aggregation: 'mean' },
    { key: 'behavioralVolitional', label: 'Поведенческо-волевой компонент', items: componentItems.behavioralVolitional, reverseItems: componentItems.behavioralVolitional.filter(item => idealSigns[item - 1] === '-'), itemScores: itemScores(componentItems.behavioralVolitional), aggregation: 'mean' },
  ],
};

const idealAnswers = Object.fromEntries(idealSigns.map((sign, index) => [String(index + 1), sign]));
const contraryAnswers = Object.fromEntries(idealSigns.map((sign, index) => [String(index + 1), sign === '+' ? '-' : '+']));

const validationCases: ValidationCase[] = [
  { title: 'Совпадение со всеми идеальными знаками', answers: idealAnswers, expected: { cognitive: 1, emotional: 1, behavioralVolitional: 1 } },
  { title: 'Несовпадение со всеми идеальными знаками', answers: contraryAnswers, expected: { cognitive: 0, emotional: 0, behavioralVolitional: 0 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'baiborodova-pedagogical-interaction-24item-component-match-mean-v1',
};
