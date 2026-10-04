import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const anxietyOptions = [
  { value: '3', label: 'Все время' },
  { value: '2', label: 'Часто' },
  { value: '1', label: 'Время от времени, иногда' },
  { value: '0', label: 'Совсем не испытываю' },
];

const depressionItems = [
  {
    text: 'То, что приносило мне большое удовольствие, и сейчас вызывает у меня такое же чувство',
    options: [
      { value: '0', label: 'Определенно, это так' },
      { value: '1', label: 'Наверное, это так' },
      { value: '2', label: 'Лишь в очень малой степени это так' },
      { value: '3', label: 'Это совсем не так' },
    ],
  },
  {
    text: 'Я не слежу за своей внешностью',
    options: [
      { value: '3', label: 'Определенно это так' },
      { value: '2', label: 'Я не уделяю этому столько времени, сколько нужно' },
      { value: '1', label: 'Может быть, я стал меньше уделять этому внимания' },
      { value: '0', label: 'Я слежу за собой так же, как и раньше' },
    ],
  },
  {
    text: 'Я способен рассмеяться и увидеть в том или ином событии смешное',
    options: [
      { value: '0', label: 'Определенно, это так' },
      { value: '1', label: 'Наверное, это так' },
      { value: '2', label: 'Лишь в очень малой степени это так' },
      { value: '3', label: 'Совсем не способен' },
    ],
  },
  {
    text: 'Я считаю, что мои дела (занятия, увлечения) могут принести мне чувство удовлетворения',
    options: [
      { value: '0', label: 'Точно так, как и обычно' },
      { value: '1', label: 'Да, но не в той степени, как раньше' },
      { value: '2', label: 'Значительно меньше, чем раньше' },
      { value: '3', label: 'Совсем так не считаю' },
    ],
  },
  {
    text: 'Я чувствую себя бодрым',
    options: [
      { value: '3', label: 'Совсем не чувствую' },
      { value: '2', label: 'Очень редко' },
      { value: '1', label: 'Иногда' },
      { value: '0', label: 'Практически все время' },
    ],
  },
  {
    text: 'Я могу получить удовольствие от хорошей книги, фильма, радио- или телепрограммы',
    options: [
      { value: '0', label: 'Часто' },
      { value: '1', label: 'Иногда' },
      { value: '2', label: 'Редко' },
      { value: '3', label: 'Очень редко' },
    ],
  },
  {
    text: 'Мне кажется, что я стал все делать очень медленно',
    options: [
      { value: '3', label: 'Практически все время' },
      { value: '2', label: 'Часто' },
      { value: '1', label: 'Иногда' },
      { value: '0', label: 'Совсем нет' },
    ],
  },
];

const anxietyItems = [
  'Я испытываю напряжение, мне не по себе',
  'Мне страшно. Кажется, будто что-то ужасное может вот-вот случиться',
  'Беспокойные мысли крутятся у меня в голове',
  'Я легко могу сесть и расслабиться',
  'Я испытываю внутреннее напряжение или дрожь',
  'У меня бывает внезапное чувство паники',
  'Я испытываю неусидчивость, словно мне постоянно нужно двигаться',
];

const anxietyResponseOptions = [
  [
    { value: '3', label: 'Все время' }, { value: '2', label: 'Часто' },
    { value: '1', label: 'Время от времени, иногда' }, { value: '0', label: 'Совсем не испытываю' },
  ],
  [
    { value: '3', label: 'Определенно это так, и страх очень сильный' },
    { value: '2', label: 'Да, это так, но страх не очень сильный' },
    { value: '1', label: 'Иногда, но это меня не беспокоит' }, { value: '0', label: 'Совсем не испытываю' },
  ],
  [
    { value: '3', label: 'Постоянно' }, { value: '2', label: 'Большую часть времени' },
    { value: '1', label: 'Время от времени' }, { value: '0', label: 'Только иногда' },
  ],
  [
    { value: '0', label: 'Определенно, это так' }, { value: '1', label: 'Наверное, это так' },
    { value: '2', label: 'Лишь изредка это так' }, { value: '3', label: 'Совсем не могу' },
  ],
  [
    { value: '0', label: 'Совсем не испытываю' }, { value: '1', label: 'Иногда' },
    { value: '2', label: 'Часто' }, { value: '3', label: 'Очень часто' },
  ],
  [
    { value: '3', label: 'Действительно, очень часто' }, { value: '2', label: 'Довольно часто' },
    { value: '1', label: 'Не так уж часто' }, { value: '0', label: 'Совсем не бывает' },
  ],
  [
    { value: '3', label: 'Определенно, это так' }, { value: '2', label: 'Наверное, это так' },
    { value: '1', label: 'Лишь в очень малой степени это так' }, { value: '0', label: 'Совсем не испытываю' },
  ],
];

const questionItems = [
  ...anxietyItems.map((text, index) => ({ text, options: anxietyResponseOptions[index] })),
  ...depressionItems,
];

const questions: SeedSection['questions'] = questionItems.map((item, index) => ({
  code: `test_204_${index + 1}`,
  text: item.text,
  type: 'single',
  required: true,
  options: item.options,
}));

export const instrument: SeedSection = {
  code: 'test_204',
  title: 'Госпитальная шкала тревоги и депрессии (HADS)',
  description: 'Скрининговая методика для раздельной оценки выраженности тревоги и депрессивных проявлений по двум семипунктовым подшкалам. Охватывает эмоциональное напряжение, страхи, беспокойство и панику, а также удовольствие, бодрость, интерес к занятиям и темп повседневной активности. Предназначена для применения в общемедицинской практике у взрослых пациентов; результаты помогают заметить эмоциональный дистресс, но сами по себе не устанавливают диагноз.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 3,
  scales: [
    {
      key: 'anxiety',
      label: 'Тревога (HADS-A)',
      items: [1, 2, 3, 4, 5, 6, 7],
      reverseItems: [],
      aggregation: 'sum',
    },
    {
      key: 'depression',
      label: 'Депрессия (HADS-D)',
      items: [8, 9, 10, 11, 12, 13, 14],
      reverseItems: [],
      aggregation: 'sum',
    },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все пункты получают 0 по опубликованному ключу',
    answers: Object.fromEntries(Array.from({ length: 14 }, (_, index) => [String(index + 1), 0])),
    expected: { anxiety: 0, depression: 0 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'hads-zigmond-snaith-1983-russian-clinical-form-v1',
};
