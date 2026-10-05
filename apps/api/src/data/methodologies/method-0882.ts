import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Полностью не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Скорее не согласен' },
  { value: '4', label: 'Скорее согласен' },
  { value: '5', label: 'Согласен' },
  { value: '6', label: 'Полностью согласен' },
];

const texts = [
  'Я чувствую, что учеба в школе подавляет меня',
  'Мне не хватает желания учиться в школе, я часто думаю о том, чтобы бросить учебу',
  'У меня часто есть ощущение, что в школе у меня что-то не так',
  'Я часто плохо сплю из-за вещей, которые связаны с занятиями в школе',
  'Я чувствую, что у меня исчезает интерес к учебе в школе',
  'Я постоянно задаюсь вопросом, имеет ли моя учеба в школе какой-то смысл',
  'Мысли об учебе беспокоят меня даже в свободное от учебы время',
  'Раньше у меня были более высокие ожидания от моей учебы в школе, чем сейчас',
  'Мои отношения с родителями или друзьями портятся из-за того, что происходит в школе',
];

const questions: SeedSection['questions'] = texts.map((text, index) => ({
  code: `test_912_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_912',
  title: 'Опросник выгорания школьников (ОВШ; SBI), русская адаптация',
  description: 'Опросник оценивает выгорание в учебной деятельности школьников по трём аспектам: истощение, цинизм по отношению к учебе и чувство несоответствия. Подходит для исследований школьного благополучия учащихся; русская адаптация проверялась на российской выборке школьников 10–18 лет.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 6,
  scales: [
    { key: 'exhaustion', label: 'Истощение', items: [1, 4, 7, 9], reverseItems: [], aggregation: 'sum' },
    { key: 'cynicism', label: 'Цинизм', items: [2, 5, 6], reverseItems: [], aggregation: 'sum' },
    { key: 'inadequacy', label: 'Чувство несоответствия', items: [3, 8], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: все ответы «Полностью не согласен» дают минимумы шкал',
    answers: Object.fromEntries(Array.from({ length: 9 }, (_, index) => [String(index + 1), 1])),
    expected: { exhaustion: 4, cynicism: 3, inadequacy: 2 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'sbi-ru-bochaver-mikhaylova-2023-v1',
};
