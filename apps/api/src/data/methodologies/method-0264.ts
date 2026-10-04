import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Совершенно неверно' },
  { value: '2', label: 'Пожалуй, неверно' },
  { value: '3', label: 'Пожалуй, верно' },
  { value: '4', label: 'Совершенно верно' },
];

const items = [
  'Жизнь кажется мне бессмысленной и пустой.',
  'Я разочаровался в ценностях, которые еще недавно считал самыми главными в своей жизни.',
  'Мне не удается осуществить свои жизненные цели.',
  'Я с трудом понимаю, что действительно важно в жизни, а что совсем неважно.',
  'Реализую совсем не те ценности, которые составляют смысл моей жизни.',
  'Мне не хватает времени, чтобы заняться действительно важными делами.',
  'Ощущаю внутреннюю опустошенность.',
  'Жизнь в соответствии с когда-то поставленными целями в моей ситуации невозможна.',
  'Меня преследует чувство, что я не сделал в жизни что-то очень важное.',
  'Многие дела и обязанности, которые я вынужден выполнять, абсолютно мне безразличны.',
  'Сомневаюсь, действительно ли мои жизненные ценности и цели столь важны.',
  'За последние месяцы нисколько не продвинулся в осуществлении своих жизненных планов.',
  'В моей жизни отсутствуют такие ценности, которые я на самом деле высоко ценю.',
  'Я уже утратил интерес к когда-то выбранным целям.',
  'Мои ценности и идеалы кажутся мне неосуществимыми.',
  'До сих пор не знаю, чего хочу от жизни.',
  'Ценности, которые я ставил превыше всего в своей жизни, не принесли мне удовлетворения.',
  'Чувствую, что у меня недостаточно сил и энергии для реализации своего жизненного замысла.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_296_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_296',
  title: 'Дифференциальный опросник смысложизненного кризиса (СЖК-Д)',
  description: 'Опросник К. В. Карпинского (2008) оценивает выраженность трёх разновидностей смысложизненного кризиса: бессмысленности, смыслоутраты и нереализованности смысла жизни; также рассчитывается общий показатель. Подходит для оценки переживаний взрослых респондентов в контексте психологического исследования; сам по себе результат не является диагнозом.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 4,
  scales: [
    { key: 'meaninglessness_crisis', label: 'Кризис бессмысленности', items: [1, 4, 7, 10, 13, 16], reverseItems: [], aggregation: 'sum' },
    { key: 'meaning_loss_crisis', label: 'Кризис смыслоутраты', items: [2, 5, 8, 11, 14, 17], reverseItems: [], aggregation: 'sum' },
    { key: 'meaning_unrealization_crisis', label: 'Кризис нереализованности смысла жизни', items: [3, 6, 9, 12, 15, 18], reverseItems: [], aggregation: 'sum' },
    { key: 'overall_crisis', label: 'Общий уровень смысложизненного кризиса', items: Array.from({ length: 18 }, (_, i) => i + 1), reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы минимальны: каждый показатель равен числу входящих в него пунктов',
    answers: Object.fromEntries(Array.from({ length: 18 }, (_, index) => [String(index + 1), 1])),
    expected: { meaninglessness_crisis: 6, meaning_loss_crisis: 6, meaning_unrealization_crisis: 6, overall_crisis: 18 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'karpinsky-szhk-d-2008-18items-four-point-sums-v1',
};
