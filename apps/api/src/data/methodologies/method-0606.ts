import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const answerOptions = [
  { value: '4', label: 'Всегда' },
  { value: '3', label: 'Почти всегда' },
  { value: '2', label: 'Иногда' },
  { value: '1', label: 'Очень редко' },
  { value: '0', label: 'Никогда' },
];

const items = [
  'Стараюсь слушаться во всем своих учителей и родителей.',
  'Считаю, что всегда надо чем-то отличаться от других.',
  'За что бы я ни взялся — добиваюсь успеха.',
  'Я умею прощать.',
  'Я стремлюсь поступать так же, как и все мои товарищи,',
  'Мне хочется быть впереди других в любом деле.',
  'Я становлюсь упрямым, когда уверен, что я прав.',
  'Считаю, что делать людям добро — это главное в жизни.',
  'Стараюсь поступать так, чтобы меня хвалили окружающие.',
  'Общаюсь с товарищами, отстаиваю свое мнение.',
  'Если я что-то задумал, то обязательно сделаю.',
  'Мне нравится помогать другим.',
  'Мне хочется, чтобы со мной все дружили.',
  'Если мне не нравятся люди, то я не буду с ними общаться.',
  'Стремлюсь всегда побеждать и выигрывать.',
  'Переживаю неприятности других, как свои.',
  'Стремлюсь не ссориться с товарищами.',
  'Стараюсь доказать свою правоту, даже если с моим мнением не согласны окружающие.',
  'Если я берусь за дело, то обязательно доведу его до конца.',
  'Стараюсь защищать тех, кого обижают.',
];

const scaleItems = {
  socialAdaptation: [1, 5, 9, 13, 17],
  autonomy: [2, 6, 10, 14, 18],
  socialActivity: [3, 7, 11, 15, 19],
  humanisticNorms: [4, 8, 12, 16, 20],
};

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_637_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: answerOptions,
}));

export const instrument: SeedSection = {
  code: 'test_637',
  title: 'Методика изучения социализированности личности учащегося',
  description: 'Методика М. И. Рожкова оценивает у учащихся социальную адаптированность, автономность, социальную активность и приверженность гуманистическим нормам жизнедеятельности. Подходит для изучения социальных качеств школьников; показатели каждой сферы рассчитываются отдельно.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 4,
  scales: [
    { key: 'socialAdaptation', label: 'Социальная адаптированность', items: scaleItems.socialAdaptation, reverseItems: [], aggregation: 'mean' },
    { key: 'autonomy', label: 'Автономность', items: scaleItems.autonomy, reverseItems: [], aggregation: 'mean' },
    { key: 'socialActivity', label: 'Социальная активность', items: scaleItems.socialActivity, reverseItems: [], aggregation: 'mean' },
    { key: 'humanisticNorms', label: 'Приверженность гуманистическим нормам жизнедеятельности (нравственность)', items: scaleItems.humanisticNorms, reverseItems: [], aggregation: 'mean' },
  ],
};

const allAnswers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы «Никогда»',
    answers: allAnswers(0),
    expected: { socialAdaptation: 0, autonomy: 0, socialActivity: 0, humanisticNorms: 0 },
  },
  {
    title: 'Все ответы «Всегда»',
    answers: allAnswers(4),
    expected: { socialAdaptation: 4, autonomy: 4, socialActivity: 4, humanisticNorms: 4 },
  },
  {
    title: 'Ручная проверка распределения пунктов: максимальная адаптированность и минимальные остальные шкалы',
    answers: { ...allAnswers(0), '1': 4, '5': 4, '9': 4, '13': 4, '17': 4 },
    expected: { socialAdaptation: 4, autonomy: 0, socialActivity: 0, humanisticNorms: 0 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'rozhkov-socialization-student-2001-v1',
};
