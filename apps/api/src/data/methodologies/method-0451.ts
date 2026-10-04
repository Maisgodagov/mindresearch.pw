import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const responseOptions = [
  { value: '1', label: 'Совсем не характеризует меня' },
  { value: '2', label: 'Слегка характеризует меня' },
  { value: '3', label: 'Умеренно характеризует меня' },
  { value: '4', label: 'В большой степени характеризует меня' },
  { value: '5', label: 'Полностью характеризует меня' },
];

const items = [
  'Меня волнует мнение других людей обо мне, даже если я знаю, что оно не имеет особого значения.',
  'Я переживаю, если знаю, что обо мне составили неблагоприятное впечатление.',
  'Я очень переживаю из-за того, что окружающие могут заметить мои недостатки.',
  'Я беспокоюсь о том, какое произвожу впечатление на окружающих.',
  'Я боюсь того, что окружающие могут относиться ко мне с неодобрением.',
  'Я боюсь, что ко мне могут придраться.',
  'Я озабочен (-а) тем, какое мнение обо мне составили окружающие.',
  'Когда я с кем-нибудь разговариваю, я не перестаю думать о том, какое впечатление я произвожу на своего собеседника.',
  'Я всегда думаю о том, какое впечатление я произвожу на других людей.',
  'Если я знаю, что кто-то меня оценивает, я начинаю волноваться.',
  'Иногда мне кажется, что я слишком сильно озабочен тем, что обо мне думают окружающие.',
  'Я часто беспокоюсь о том, что могу сказать или сделать что-то неправильно.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_487_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: responseOptions,
}));

export const instrument: SeedSection = {
  code: 'test_487',
  title: 'Краткая шкала страха негативной оценки (BFNE)',
  description: 'Шкала оценивает выраженность страха негативной оценки окружающих — беспокойство о чужом мнении, ожидание неодобрения и критики, а также озабоченность впечатлением, производимым на других. Русская адаптация предназначена для взрослых; опубликованная апробация проведена на выборке 18–35 лет. Может использоваться в исследованиях социальной тревожности как оценка этого отдельного компонента, а не как самостоятельный диагноз.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'total', label: 'Страх негативной оценки', items: Array.from({ length: 12 }, (_, i) => i + 1), reverseItems: [], aggregation: 'sum' },
  ],
};

const answers = (value: number) => Object.fromEntries(items.map((_, i) => [String(i + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Все ответы минимальные', answers: answers(1), expected: { total: 12 } },
  { title: 'Все ответы максимальные', answers: answers(5), expected: { total: 60 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'bfne-ru-grigorieva-enikolopov-2016-v1',
};
