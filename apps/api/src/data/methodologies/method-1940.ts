import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '3', label: 'Безусловно да' },
  { value: '2', label: 'Пожалуй, да' },
  { value: '1', label: 'Пожалуй, нет' },
  { value: '0', label: 'Безусловно нет' },
];

const items = [
  'Если бы единственным способом достигнуть идеальной фигуры была бы липосакция, то при наличии возможности, я бы ее сделал(а).',
  'Если бы у меня была возможность сделать операцию по коррекции внешности, я бы сделал(а) это.',
  'Я чувствую дискомфорт, если моя одежда не выглядит идеально.',
  'Я трачу много времени на приведение себя в порядок.',
  'У меня очень высокие требования к своему внешнему виду.',
  'Мне важно, чтобы мои волосы были в идеальном состоянии.',
  'В социальных сетях я часто и подолгу рассматриваю фотографии других людей и сравниваю себя с ними.',
  'У меня портится настроение, если на фотографиях знакомых в социальных сетях я вижу кого-то сильно похудевшим и спортивным.',
  'Я часто критикую и ругаю себя за отступление от планов по поддержанию идеальной физической формы.',
  'Если я прибавляю в весе, то подолгу переживаю из-за этого и ругаю себя.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1956_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1956',
  title: 'Трехфакторная шкала физического перфекционизма',
  description: 'Измеряет перфекционизм, связанный с требованиями к внешности: стремление исправлять воспринимаемые несовершенства, высокие стандарты и фиксацию внимания на внешнем виде, а также неблагоприятные сравнения и руминирование. Факторная модель версии 2020 года подтверждена для женской выборки; результаты мужской выборки этой модели не соответствовали.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 3,
  scales: [
    { key: 'surgery', label: 'Использование пластической хирургии как способа коррекции несовершенств', items: [1, 2], reverseItems: [], aggregation: 'sum' },
    { key: 'standards', label: 'Высокие стандарты внешнего вида и фиксация внимания на нем', items: [3, 4, 5, 6], reverseItems: [], aggregation: 'sum' },
    { key: 'comparisons', label: 'Склонность к неблагоприятным социальным сравнениям и руминированию на тему внешности', items: [7, 8, 9, 10], reverseItems: [], aggregation: 'sum' },
  ],
};

const allAnswers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), String(value)]));
const validationCases: ValidationCase[] = [
  { title: 'Все ответы «Безусловно нет»', answers: allAnswers(0), expected: { surgery: 0, standards: 0, comparisons: 0 } },
  { title: 'Все ответы «Безусловно да»', answers: allAnswers(3), expected: { surgery: 6, standards: 12, comparisons: 12 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'kholmogorova-rakhmanina-physical-perfectionism-3factor-2020-v1',
};
