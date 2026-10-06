import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '4', label: 'Совершенно согласен' },
  { value: '3', label: 'Скорее согласен, чем не согласен' },
  { value: '2', label: 'Скорее не согласен, чем согласен' },
  { value: '1', label: 'Совершенно не согласен' },
];

const statements = [
  'Я провел много времени, стараясь узнать как можно больше о своей этнической группе, о ее истории, традициях, обычаях.',
  'Я активен в организациях или социальных группах, которые включают преимущественно членов моей этнической группы.',
  'Я очень хорошо знаю свое этническое происхождение и понимаю, что оно значит для меня.',
  'Я много думаю о том, как этническая принадлежность повлияет на мою жизнь.',
  'Я рад, что принадлежу к своей этнической группе.',
  'Я четко чувствую связь со своей этнической группой.',
  'Я хорошо понимаю, что значит для меня моя этническая принадлежность.',
  'Для того чтобы узнать побольше о своей этнической группе, я говорил о ней со многими людьми.',
  'Я горжусь своей этнической группой.',
  'Я соблюдаю традиции своей этнической группы.',
  'Я чувствую сильную привязанность к своей этнической группе.',
  'Я хорошо отношусь к своему этническому происхождению.',
];

const questions: SeedSection['questions'] = statements.map((text, index) => ({
  code: `test_2572_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

const instrument: SeedSection = {
  code: 'test_2572',
  title: 'Этническая идентичность (MEIM)',
  description: 'Русская адаптация сокращенной многогрупповой методики MEIM оценивает выраженность этнической идентичности через когнитивное исследование своей этнической группы и аффективную связь с ней. Подходит для опросов молодежи и взрослых, относящих себя к различным этническим группам; позволяет сравнивать общий показатель и два компонента идентичности.',
  categoryIds: ['social-culture'],
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 4,
  scales: [
    { key: 'ethnic_identity', label: 'Общий показатель этнической идентичности', items: Array.from({ length: 12 }, (_, i) => i + 1), reverseItems: [], aggregation: 'mean' },
    { key: 'cognitive', label: 'Когнитивный компонент', items: [1, 2, 4, 8, 10], reverseItems: [], aggregation: 'mean' },
    { key: 'affective', label: 'Аффективный компонент', items: [3, 5, 6, 7, 9, 11, 12], reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: все ответы «Совершенно согласен» дают максимум по всем шкалам',
    answers: Object.fromEntries(Array.from({ length: 12 }, (_, i) => [String(i + 1), 4])),
    expected: { ethnic_identity: 4, cognitive: 4, affective: 4 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'phinney-roberts-meim-arbitailo-2006-v1',
};
