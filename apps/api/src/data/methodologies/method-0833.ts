import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const answers = [
  { value: '1', label: 'Совсем не похоже' },
  { value: '2', label: 'Скорее не похоже' },
  { value: '3', label: 'Нечто среднее' },
  { value: '4', label: 'Скорее похоже' },
  { value: '5', label: 'Очень похоже' },
];

const items = [
  'Когда со мной происходит что-то хорошее, мне есть с кем поделиться хорошими новостями.',
  'Я довожу до конца то, что начал.',
  'Я с оптимизмом смотрю в будущее.',
  'Я счастлив.',
  'Когда я чем-то занят, я так сильно увлекаюсь, что теряю счет времени.',
  'Мне часто бывает весело.',
  'Я полностью погружаюсь в то, что делаю.',
  'Я люблю жизнь.',
  'Я делаю мои домашние задания до конца.',
  'Когда у меня проблемы, мне есть, к кому обратиться.',
  'Я так погружаюсь в деятельность, что забываю обо всем остальном.',
  'Когда я учусь чему-то новому, я забываю, сколько прошло времени.',
  'В смутные времена я надеюсь на хорошее.',
  'В моей жизни есть люди, которые искренне беспокоятся обо мне.',
  'Я думаю, что со мной произойдет что-нибудь хорошее.',
  'У меня есть друзья, которые мне правда очень дороги.',
  'Если я планирую что-нибудь сделать, я буду придерживаться этого плана.',
  'Я верю, что всё образуется, как бы сложно ни было.',
  'Я трудолюбивый человек.',
  'Я веселый человек.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_863_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: answers,
}));

export const instrument: SeedSection = {
  code: 'test_863',
  title: 'Опросник благополучия подростков EPOCH (русскоязычная версия)',
  description: '20-пунктовый опросник оценивает психологическое благополучие подростков по пяти аспектам: вовлеченность в деятельность, упорство, оптимизм, взаимосвязь с другими людьми и счастье. Подходит для исследований и практической работы с подростками; русская версия проверена на выборке 13–16-летних школьников.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'engagement', label: 'Вовлеченность', items: [5, 7, 11, 12], reverseItems: [], aggregation: 'sum' },
    { key: 'perseverance', label: 'Упорство', items: [2, 9, 17, 19], reverseItems: [], aggregation: 'sum' },
    { key: 'optimism', label: 'Оптимизм', items: [3, 13, 15, 18], reverseItems: [], aggregation: 'sum' },
    { key: 'connectedness', label: 'Взаимосвязь', items: [1, 10, 14, 16], reverseItems: [], aggregation: 'sum' },
    { key: 'happiness', label: 'Счастье', items: [4, 6, 8, 20], reverseItems: [], aggregation: 'sum' },
    { key: 'wellbeing', label: 'Интегральный показатель благополучия', items: Array.from({ length: 20 }, (_, index) => index + 1), reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: минимальные ответы по всем пунктам',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { engagement: 4, perseverance: 4, optimism: 4, connectedness: 4, happiness: 4, wellbeing: 20 },
  },
  {
    title: 'Ручная проверка: максимальные ответы по всем пунктам',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 5])),
    expected: { engagement: 20, perseverance: 20, optimism: 20, connectedness: 20, happiness: 20, wellbeing: 100 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'epoch-ru-volkova-volkova-2025-20-item-sum-v1',
};
