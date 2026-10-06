import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'совершенно неверно' },
  { value: '2', label: 'неверно' },
  { value: '3', label: 'скорее неверно' },
  { value: '4', label: 'скорее верно' },
  { value: '5', label: 'верно' },
  { value: '6', label: 'совершенно верно' },
];

const items = [
  'Дети — это главная ценность в жизни взрослого человека',
  'Чтобы стать по-настоящему зрелым, человек должен вырастить ребенка',
  'Жизнь без детей лишена смысла',
  'Человек не может достичь полной самореализации без опыта материнства или отцовства',
  'Наличие детей — обязательное условие жизненного успеха для взрослого человека',
  'Ничто не приносит столько удовольствия и счастья, как материнство или отцовство',
  'Рождение и воспитание детей — это самая важная жизненная задача взрослого',
  'Только с появлением собственных детей человек становится по-настоящему состоятельным и преуспевающим в жизни',
  'Тот, кто не оставил после себя потомство, прожил свою жизнь зря',
  'Отказаться от рождения детей — значит лишить себя жизненной перспективы',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2502_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2502',
  title: 'Шкала ценностного отношения к детям',
  description: 'Одномерная шкала для взрослых, включая людей с детьми и без детей; оценивает, насколько ребенок или дети представлены как самостоятельная жизненная ценность — как источник смысла, зрелости, самореализации, успеха и жизненной перспективы. Подходит авторам опросов, изучающим ценностное отношение к детям и родительские установки.',
  categoryIds: ['parenting'],
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 6,
  scales: [{
    key: 'value_of_children',
    label: 'Ценностное отношение к детям',
    items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    reverseItems: [],
    aggregation: 'sum',
    weights: { 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1, 8: 1, 9: 1, 10: 1 },
  }],
};

const validationCases: ValidationCase[] = [
  { title: 'Минимальные ответы', answers: Object.fromEntries(items.map((_, index) => [String(index + 1), '1'])), expected: { value_of_children: 0 } },
  { title: 'Максимальные ответы', answers: Object.fromEntries(items.map((_, index) => [String(index + 1), '6'])), expected: { value_of_children: 50 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'karpinski-value-of-children-scale-2024-final-10items-v1',
};
