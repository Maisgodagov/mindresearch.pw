import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Никогда' },
  { value: '2', label: 'Иногда' },
  { value: '3', label: 'Часто' },
  { value: '4', label: 'Всегда' },
];

const items = [
  'О будущих событиях.',
  'О том, насколько уставшим/сонным вы себя чувствуете.',
  'О произошедшем за день.',
  'О том, насколько напряжённым/тревожным вы себя чувствуете.',
  'О том, насколько бодрым вы себя чувствуете.',
  'О том, сколько сейчас времени.',
  'О мелочах.',
  'О том, что не можете остановить вертящиеся в голове мысли.',
  'О том, сколько вы уже не спите.',
  'О вашем здоровье.',
  'О способах заставить себя уснуть.',
  'О вещах, которые вы должны сделать завтра.',
  'О том, насколько вам жарко/холодно.',
  'О вашей работе/обязанностях.',
  'О том, насколько расстроенным/раздражённым вы себя чувствуете.',
  'О том, насколько темно/светло в комнате.',
  'О шуме, который вы слышите.',
  'О том, что будете бодрствовать всю ночь.',
  'Картины и образы событий.',
  'О последствиях бессонной ночи.',
  'О вашей личной жизни.',
  'Что думать слишком много — это проблема.',
  'О прошедших событиях.',
  'О том, насколько вы плохо спите.',
  'О том, что может помочь вам заснуть.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1236_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1236',
  title: 'Опросник содержания мыслей перед сном Глазго (GCTI; русская адаптация Е. И. Рассказовой)',
  description: 'Опросник оценивает содержание и частоту когнитивной активности, которая мешает засыпанию: повседневные заботы и планы, размышления о сне и бодрствовании, самонаблюдение за состоянием и реакции на телесные ощущения и окружающую среду. Предназначен для взрослых при исследовании предсонных мыслей, особенно в контексте инсомнии; профиль и суммарный балл могут помочь описать когнитивные факторы затруднённого засыпания и учитывать их при планировании психологической помощи.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 4,
  scales: [{
    key: 'total',
    label: 'Суммарная частота мыслей перед сном',
    items: Array.from({ length: 25 }, (_, index) => index + 1),
    reverseItems: [],
    aggregation: 'sum',
  }],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы «Никогда»: минимум суммарного балла',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { total: 25 },
  },
  {
    title: 'Все ответы «Всегда»: максимум суммарного балла',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 4])),
    expected: { total: 100 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'glasgow-content-thoughts-inventory-rasskazova-2008-total-1to4-v1',
};
