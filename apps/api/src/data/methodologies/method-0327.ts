import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Не знаю' },
];

const items = [
  'С возрастом многое мне кажется лучше, чем я ожидал раньше.',
  'Жизнь принесла мне больше разочарований, чем большинству людей, которых я знаю.',
  'Сейчас самый мрачный период в моей жизни.',
  'Моя жизнь могла бы быть счастливее, чем есть.',
  'Сейчас я почти так же счастлив, как и в то время, когда был моложе.',
  'Большинство дел, которыми мне приходится заниматься, скучные и неинтересные.',
  'Сейчас я переживаю лучшие годы в моей жизни.',
  'Я считаю, что в будущем меня ожидают интересные и приятные дела.',
  'К своим делам и занятиям я испытываю такой же интерес, как и раньше.',
  'С возрастом я всё больше ощущаю какую-то усталость.',
  'Ощущение возраста не беспокоит меня.',
  'Когда я оглядываюсь на свою жизнь, я испытываю чувство удовлетворения.',
  'Я не изменил бы свою прошлую жизнь, даже если бы имел такую возможность.',
  'По сравнению с другими людьми моего возраста я сделал массу глупостей в своей жизни.',
  'Я выгляжу лучше, чем большинство других людей моего возраста.',
  'У меня есть некоторые планы, которые я намереваюсь осуществить в ближайшее время.',
  'Оглядываясь на прошлое, могу сказать, что я многое упустил в своей жизни.',
  'Я слишком часто, по сравнению с другими людьми, нахожусь в подавленном настроении.',
  'Я получил довольно много из того, что ожидал от жизни.',
  'Что бы ни говорили, а с возрастом большинство людей становится хуже, а не лучше.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_359_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_359',
  title: 'Индекс жизненной удовлетворенности (ИЖУ, LSIA; адаптация Н. В. Паниной)',
  description: 'ИЖУ оценивает общее психологическое состояние, субъективный психологический комфорт и социально-психологическую адаптированность. Помимо суммарного индекса, профиль охватывает интерес к жизни, последовательность в достижении целей, согласованность поставленных и достигнутых целей, положительную оценку себя и своих поступков, а также общий фон настроения. Русская адаптация Н. В. Паниной; опубликованный бланк рассчитан на оценку жизненной удовлетворённости взрослого человека.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 3,
  scales: [
    { key: 'total', label: 'Общий индекс жизненной удовлетворённости', items: Array.from({ length: 20 }, (_, i) => i + 1), reverseItems: [], weights: { 1: 0.5 }, aggregation: 'sum' },
    { key: 'interest', label: 'Интерес к жизни', items: [1, 6, 9, 11], reverseItems: [1, 6], weights: { 1: 0.5 }, aggregation: 'sum' },
    { key: 'goal_persistence', label: 'Последовательность в достижении целей', items: [8, 13, 16, 17], reverseItems: [17], aggregation: 'sum' },
    { key: 'goal_attainment', label: 'Согласованность поставленных и достигнутых целей', items: [2, 4, 5, 19], reverseItems: [2, 4], aggregation: 'sum' },
    { key: 'self_evaluation', label: 'Положительная оценка себя и собственных поступков', items: [12, 14, 15, 20], reverseItems: [14, 20], aggregation: 'sum' },
    { key: 'mood', label: 'Общий фон настроения', items: [3, 7, 10, 18], reverseItems: [3, 10, 18], aggregation: 'sum' },
  ],
};

// Answers are 1=agree, 2=disagree, 3=don't know. Ordinary key points are 0/2/1;
// the source's exceptional item 1 is 0/1/1. A 0.5 weight after reverse scoring maps
// item 1 responses 1,2,3 to 0,1,1 exactly.
const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы «Не знаю» (ручная сверка по ключу)',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 3])),
    expected: { total: 19.5, interest: 3.5, goal_persistence: 4, goal_attainment: 4, self_evaluation: 4, mood: 4 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'lsia-panina-1993-v1',
};
