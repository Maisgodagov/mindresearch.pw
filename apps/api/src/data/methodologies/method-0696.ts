import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Совершенно не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Скорее не согласен' },
  { value: '4', label: 'Что-то среднее' },
  { value: '5', label: 'Скорее согласен' },
  { value: '6', label: 'Согласен' },
  { value: '7', label: 'Полностью согласен' },
];

const items = [
  'Когда мне нужна помощь, рядом со мной есть важный для меня человек.',
  'У меня есть важный для меня человек, с которым я делю радости и горести.',
  'Моя семья и вправду пытается помочь мне.',
  'Я получаю необходимую мне эмоциональную помощь и поддержку от моей семьи.',
  'У меня есть важный для меня человек, который по-настоящему меня утешает.',
  'Мои друзья по-настоящему пытаются помочь мне.',
  'Я могу рассчитывать на друзей, когда дела идут плохо.',
  'Я могу обсуждать свои проблемы с семьёй.',
  'У меня есть друзья, с которыми я могу разделить свои радости и горести.',
  'В моей жизни есть особый человек, которому небезразличны мои чувства.',
  'Моя семья готова помочь мне в принятии решений.',
  'Я могу обсуждать свои проблемы с друзьями.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_727_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_727',
  title: 'Многомерная шкала восприятия социальной поддержки (MSPSS)',
  description: 'MSPSS измеряет субъективно воспринимаемую доступность социальной поддержки из трёх источников: значимого для человека близкого, семьи и друзей. Пункты охватывают эмоциональную поддержку, готовность помочь, возможность делиться переживаниями и обращаться за советом; эта русская редакция подходит для взрослых респондентов и воспроизводит опубликованный русскоязычный бланк.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'significant_other', label: 'Поддержка значимого человека', items: [1, 2, 5, 10], reverseItems: [], aggregation: 'mean' },
    { key: 'family', label: 'Поддержка семьи', items: [3, 4, 8, 11], reverseItems: [], aggregation: 'mean' },
    { key: 'friends', label: 'Поддержка друзей', items: [6, 7, 9, 12], reverseItems: [], aggregation: 'mean' },
    { key: 'total', label: 'Общий показатель воспринимаемой поддержки', items: items.map((_, index) => index + 1), reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы минимальные',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { significant_other: 1, family: 1, friends: 1, total: 1 },
  },
  {
    title: 'Все ответы максимальные',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 7])),
    expected: { significant_other: 7, family: 7, friends: 7, total: 7 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'mspss-zimet-russian-psytests-1988-v1',
};
