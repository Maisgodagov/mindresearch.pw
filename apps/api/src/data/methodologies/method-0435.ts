import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const answers = [
  'Полностью не согласен',
  'Частично не согласен',
  'Трудно сказать',
  'Частично согласен',
  'Совершенно согласен',
].map((label, index) => ({ value: String(index + 1), label }));

// Russian adaptation; order follows the Russian paper form. Scale membership
// is stated in the original SD4 appendix and was cross-checked against this form.
const items = [
  'Делиться своими секретами с другими людьми неразумно.',
  'Люди считают меня прирожденным лидером.',
  'Люди часто говорят, что я неуправляемый.',
  'Мне нравится наблюдать за потасовкой, дракой.',
  'Нужно сделать всё, чтобы влиятельные люди были на твоей стороне.',
  'У меня уникальный талант убеждать людей.',
  'Я склонен сомневаться в авторитетах и нарушать их правила.',
  'Я люблю жестокие фильмы и видеоигры.',
  'Следует избегать открытого конфликта с другими людьми, так как они могут быть полезны в будущем.',
  'В компаниях без меня скучно.',
  'Я участвовал в большем количестве склок, заварушек, чем большинство людей моего возраста и пола.',
  'Забавно наблюдать, когда идиоты садятся в лужу.',
  'Если хочешь добиться своего, лучше держаться в тени.',
  'Я знаю, что я особенный, потому что другие постоянно говорят мне об этом.',
  'Я склонен сначала делать, а потом думать.',
  'Мне нравится смотреть жестокие виды спорта.',
  'Планирование необходимо, чтобы использовать ситуацию в свою пользу.',
  'У меня есть уникальные качества.',
  'У меня бывали неприятности с законом.',
  'Некоторые люди заслуживают страданий.',
  'Лесть — хороший способ привлечь людей на свою сторону.',
  'Скорее всего я добьюсь славы и признания в какой-то области.',
  'Иногда я попадаю в опасные ситуации.',
  'Я писал обидные вещи в социальных сетях ради забавы.',
  'Мне нравится, когда срабатывает хитрый план.',
  'Мне нравится показывать себя в выгодном свете при любом удобном случае.',
  'Любой, кто встанет у меня на пути, пожалеет об этом.',
  'Я знаю, как причинить боль только одними словами.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_471_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: answers,
}));

export const instrument: SeedSection = {
  code: 'test_471',
  title: 'Короткий опросник Тёмной тетрады (SD4), русская адаптация',
  description: 'Опросник оценивает четыре неклинические социально-аверсивные черты личности: макиавеллизм, грандиозный нарциссизм, психопатию и садизм. Семь пунктов на каждую шкалу охватывают манипулятивную стратегичность, чувство исключительности и самопрезентацию, импульсивность и конфликтность, а также удовольствие от чужих страданий. Подходит для исследовательских опросов взрослых и иных неклинических выборок; показатели описывают выраженность черт и сами по себе не являются клиническим диагнозом.',
  questions,
};

const machiavellianism = [1, 5, 9, 13, 17, 21, 25];
const narcissism = [2, 6, 10, 14, 18, 22, 26];
const psychopathy = [3, 7, 11, 15, 19, 23, 27];
const sadism = [4, 8, 12, 16, 20, 24, 28];

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'machiavellianism', label: 'Макиавеллизм', items: machiavellianism, reverseItems: [], aggregation: 'mean' },
    { key: 'narcissism', label: 'Нарциссизм', items: narcissism, reverseItems: [], aggregation: 'mean' },
    { key: 'psychopathy', label: 'Психопатия', items: psychopathy, reverseItems: [], aggregation: 'mean' },
    { key: 'sadism', label: 'Садизм', items: sadism, reverseItems: [], aggregation: 'mean' },
  ],
};

// Manually checked: all answers at 1 yield means 1; all at 5 yield means 5.
const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы «Полностью не согласен»: минимальные средние по четырём шкалам',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { machiavellianism: 1, narcissism: 1, psychopathy: 1, sadism: 1 },
  },
  {
    title: 'Все ответы «Совершенно согласен»: максимальные средние по четырём шкалам',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 5])),
    expected: { machiavellianism: 5, narcissism: 5, psychopathy: 5, sadism: 5 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'sd4-kornienko-vyazovkina-gornostaev-2022-ru-v1',
};
