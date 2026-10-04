import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const answerOptions = [
  { value: '5', label: 'Всегда' },
  { value: '4', label: 'Очень часто' },
  { value: '3', label: 'Довольно часто' },
  { value: '2', label: 'Иногда' },
  { value: '1', label: 'Редко' },
  { value: '0', label: 'Никогда' },
];

const items = [
  'Мой малыш обычно улыбается мне.',
  'Мой малыш делает меня раздраженной.',
  'Мой малыш любит что-либо делать вместе со мной.',
  'Мой малыш “разговаривает” со мной.',
  'Мой малыш вызывает у меня нервозность.',
  'Мой малыш любит быть со мной.',
  'Мой малыш требует слишком много внимания.',
  'Мой малыш обычно смеется.',
  'Мой малыш обычно капризный.',
  'Мой малыш доминирует надо мной.',
  'Мой малыш любит радовать меня.',
  'Мой малыш плачет без видимой причины.',
  'Мой малыш проявляет ко мне привязанность.',
  'Мой малыш делает меня беспокойной.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_535_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: answerOptions,
}));

export const instrument: SeedSection = {
  code: 'test_535',
  title: 'Материнская оценка объектных отношений (MORS-SF)',
  description: 'Краткая версия MORS-SF описывает восприятие матерью младенца и ранних отношений с ним по двум аспектам: теплоте ребёнка по отношению к матери и переживанию его поведения как вторгающегося или чрезмерно требовательного. Подходит для матерей младенцев примерно от нескольких недель до одного года; профиль может быть полезен для исследований раннего взаимодействия и перинатальной практики.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 5,
  scales: [
    { key: 'warmth', label: 'Теплота', items: [1, 3, 4, 6, 8, 11, 13], reverseItems: [], aggregation: 'sum' },
    { key: 'invasion', label: 'Вторжение', items: [2, 5, 7, 9, 10, 12, 14], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: всегда по пунктам теплоты и никогда по пунктам вторжения',
    answers: { '1': 5, '2': 0, '3': 5, '4': 5, '5': 0, '6': 5, '7': 0, '8': 5, '9': 0, '10': 0, '11': 5, '12': 0, '13': 5, '14': 0 },
    expected: { warmth: 35, invasion: 0 },
  },
  {
    title: 'Ручная проверка: никогда по пунктам теплоты и всегда по пунктам вторжения',
    answers: { '1': 0, '2': 5, '3': 0, '4': 0, '5': 5, '6': 0, '7': 5, '8': 0, '9': 5, '10': 5, '11': 0, '12': 5, '13': 0, '14': 5 },
    expected: { warmth: 0, invasion: 35 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'mors-sf-oates-gervai-2018-psytests-ru-v1',
};
