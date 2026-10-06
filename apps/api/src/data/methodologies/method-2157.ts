import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'Совсем нет' },
  { value: '1', label: 'В незначительной степени' },
  { value: '2', label: 'В умеренной степени' },
  { value: '3', label: 'В значительной степени' },
  { value: '4', label: 'Все время' },
];

const items = [
  'Я постоянно беспокоюсь о том, закончится ли боль.',
  'Я чувствую, что не могу продолжать.',
  'Это ужасно, и я думаю, что лучше уже никогда не будет.',
  'Это ужасно, и я чувствую, что это переполняет меня.',
  'Я чувствую, что не могу больше терпеть.',
  'Я боюсь, что боль усилится.',
  'Я постоянно думаю о других болезненных ситуациях.',
  'Я очень хочу, чтобы боль прекратилась.',
  'Я не могу выбросить из головы мысли о боли.',
  'Я постоянно думаю о том, как сильно мне больно.',
  'Я постоянно думаю о том, как сильно хочу, чтобы боль прекратилась.',
  'Я ничего не могу сделать, чтобы уменьшить интенсивность боли.',
  'Я боюсь, что может произойти что-то серьезное.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2171_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2171',
  title: 'Шкала катастрофизации боли (PCS), русская адаптация',
  description: 'Шкала оценивает катастрофические мысли и чувства, связанные с болью: мысленное зацикливание на ней, преувеличение ее угрозы и ощущение беспомощности. Подходит для взрослых респондентов при оценке отношения к последним или наиболее ярким болезненным ощущениям; русская адаптация Радчиковой и коллег проверялась на русскоязычной выборке.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 4,
  scales: [
    { key: 'rumination', label: 'Мысленная жвачка', items: [8, 9, 10, 11], reverseItems: [], aggregation: 'sum' },
    { key: 'magnification', label: 'Преувеличение', items: [6, 7, 13], reverseItems: [], aggregation: 'sum' },
    { key: 'helplessness', label: 'Безнадежность', items: [1, 2, 3, 4, 5, 12], reverseItems: [], aggregation: 'sum' },
    { key: 'total', label: 'Общий балл катастрофизации боли', items: Array.from({ length: 13 }, (_, i) => i + 1), reverseItems: [], aggregation: 'sum' },
  ],
};

const allAnswers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Все ответы «Совсем нет»', answers: allAnswers(0), expected: { rumination: 0, magnification: 0, helplessness: 0, total: 0 } },
  { title: 'Все ответы «Все время»', answers: allAnswers(4), expected: { rumination: 16, magnification: 12, helplessness: 24, total: 52 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'pcs-ru-radchikova-2020-v1',
};
