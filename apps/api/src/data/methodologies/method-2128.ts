import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const frequencyOptions = [
  { value: '1', label: 'Никогда' },
  { value: '2', label: 'Иногда' },
  { value: '3', label: 'Часто' },
  { value: '4', label: 'Очень часто' },
  { value: '5', label: 'Всегда' },
];

const agreementOptions = [
  { value: '1', label: 'Абсолютно не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Не уверен, нечто среднее' },
  { value: '4', label: 'Согласен' },
  { value: '5', label: 'Абсолютно согласен' },
];

const statements = [
  'Я испытываю душевную боль.',
  'У меня щемит внутри',
  'Моя душевная боль хуже любой физической боли.',
  'От этой боли хочется кричать.',
  'Из-за этой боли я живу как во тьме.',
  'Я не понимаю, почему я страдаю.',
  'Психологически я чувствую себя ужасно.',
  'Я испытываю боль из-за внутреннего чувства пустоты.',
  'У меня болит душа.',
  'Я не могу больше терпеть эту боль.',
  'Из-за этой боли моё состояние невыносимо.',
  'Из-за этой боли я словно разваливаюсь.',
  'Моя душевная боль влияет на всё, что я делаю.',
];

const questions: SeedSection['questions'] = statements.map((text, index) => ({
  code: `test_2142_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: index < 9 ? frequencyOptions : agreementOptions,
}));

const instrument: SeedSection = {
  code: 'test_2142',
  title: 'Шкала душевной боли Р. Холдена (PAS-13), русскоязычная адаптация Чистопольской и соавторов',
  description: 'Шкала оценивает выраженность субъективной душевной (психологической) боли, включая частоту характерных переживаний и их тяжесть/переносимость. Подходит для исследовательского и клинического описания психологического дистресса у русскоязычных взрослых и старших подростков; балл служит дополнительной информацией для специалиста, а не самостоятельным прогнозом суицида или диагнозом.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [{
    key: 'psychache',
    label: 'Душевная боль',
    items: Array.from({ length: 13 }, (_, index) => index + 1),
    reverseItems: [],
    aggregation: 'sum',
  }],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка суммы: минимальные ответы дают 13',
    answers: Object.fromEntries(Array.from({ length: 13 }, (_, index) => [String(index + 1), 1])),
    expected: { psychache: 13 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'holden-psychache-chistopolskaya-2017-sum-v1',
};
