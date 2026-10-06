import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const responseOptions = [
  { value: '0', label: 'Абсолютно согласен' },
  { value: '1', label: 'Согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Категорически не согласен' },
];

const items = [
  'Я могу насладиться любимой теле- или радиопрограммой',
  'Мне доставляет удовольствие провести время с моей семьей и близкими друзьями',
  'Я с радостью занимаюсь своим хобби и развлекаюсь',
  'Я получаю удовольствие от любимых блюд',
  'Мне приятно принимать теплую ванну или освежающий душ',
  'Я получаю удовольствие от аромата цветов и/или запаха свежего морского бриза, и/или свежеприготовленного хлеба',
  'Мне приятно видеть улыбки других людей',
  'Мне приятно выглядеть достойно, когда я привожу себя в порядок («нарядился»)',
  'Я получаю удовольствие от чтения книг, журналов или газет',
  'Мне доставляет удовольствие чашечка чая или кофе, или моего любимого напитка',
  'Я могу получить удовольствие от простых вещей, таких как солнечный день, телефонный звонок от друга',
  'Я могу насладиться прекрасным пейзажем или видом',
  'Мне приятно помогать другим',
  'Мне приятно, чтобы меня похвалили',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2273_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: responseOptions,
}));

export const instrument: SeedSection = {
  code: 'test_2273',
  title: 'Шкала оценки ангедонии Снайта—Гамильтона (SHAPS)',
  description: 'SHAPS оценивает способность испытывать удовольствие в настоящее время по четырём областям: интересы и занятия, социальное взаимодействие, сенсорные переживания, еда и напитки. Опросник включает 14 приятных ситуаций и подходит для оценки гедонического тона у взрослых, в том числе в клиническом контексте депрессивных состояний; результат помогает автору опроса количественно описать выраженность ангедонии, но сам по себе не устанавливает диагноз.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 3,
  scales: [
    { key: 'anhedonia', label: 'Ангедония (суммарный балл SHAPS)', items: Array.from({ length: 14 }, (_, index) => index + 1), reverseItems: [], aggregation: 'sum', itemScores: Object.fromEntries(Array.from({ length: 14 }, (_, index) => [index + 1, { '0': 0, '1': 0, '2': 1, '3': 1 }])) },
  ],
};

const validationCases: ValidationCase[] = [
  { title: 'Согласие со всеми утверждениями: минимальный балл', answers: Object.fromEntries(items.map((_, index) => [String(index + 1), '0'])), expected: { anhedonia: 0 } },
  { title: 'Несогласие со всеми утверждениями: максимальный балл', answers: Object.fromEntries(items.map((_, index) => [String(index + 1), '3'])), expected: { anhedonia: 14 } },
];

export const methodology: MethodologyRegistration = {
  categoryIds: ['mood-depression'],
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'shaps-snaith-hamilton-1995-ru-form-four-way-dichotomous-sum-v1',
};
