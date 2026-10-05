import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const supportOptions = [
  { value: '1', label: 'Редко' },
  { value: '2', label: 'Иногда' },
  { value: '3', label: 'Довольно часто' },
  { value: '4', label: 'Часто' },
  { value: '5', label: 'Очень часто' },
];

const controlOptions = [
  { value: '0', label: 'Нет' },
  { value: '1', label: 'Не знаю' },
  { value: '2', label: 'Да' },
];

const questions: SeedSection['questions'] = [
  {
    code: 'test_1324_1',
    text: 'Когда ты пользуешься Интернетом, как часто твои родители делают что-либо из нижеперечисленных действий? Объясняют, как безопасно пользоваться Интернетом.',
    type: 'single', required: true, options: supportOptions,
  },
  {
    code: 'test_1324_2',
    text: 'Когда ты пользуешься Интернетом, как часто твои родители делают что-либо из нижеперечисленных действий? Помогают, когда ты не можешь сделать или найти что-то в Интернете.',
    type: 'single', required: true, options: supportOptions,
  },
  {
    code: 'test_1324_3',
    text: 'Когда ты пользуешься Интернетом, как часто твои родители делают что-либо из нижеперечисленных действий? Объясняют тебе, почему некоторые материалы в Интернете являются хорошими или плохими.',
    type: 'single', required: true, options: supportOptions,
  },
  {
    code: 'test_1324_4',
    text: 'Когда ты пользуешься Интернетом, как часто твои родители делают что-либо из нижеперечисленных действий? Помогают, когда что-то беспокоит тебя в Интернете.',
    type: 'single', required: true, options: supportOptions,
  },
  {
    code: 'test_1324_5',
    text: 'Поступают ли твои родители следующим образом? Используют функцию «родительского контроля» или другие способы блокирования или фильтрации различного контента.',
    type: 'single', required: true, options: controlOptions,
  },
  {
    code: 'test_1324_6',
    text: 'Поступают ли твои родители следующим образом? Используют функцию «родительского контроля» или другие способы отслеживания контента, который ты просматриваешь или какие приложения используешь.',
    type: 'single', required: true, options: controlOptions,
  },
  {
    code: 'test_1324_7',
    text: 'Поступают ли твои родители следующим образом? Устанавливают правила, определяющие, сколько и когда ты можешь пользоваться Интернетом.',
    type: 'single', required: true, options: controlOptions,
  },
];

export const instrument: SeedSection = {
  code: 'test_1324',
  title: 'Опросник цифровой родительской медиации',
  description: 'Опросник для школьников описывает участие родителей в цифровой активности ребёнка по двум независимым аспектам: поддержке (информационная и эмоциональная помощь, объяснение интернет-контента) и контролю (фильтрация и отслеживание контента, правила пользования Интернетом). Помогает исследователю сопоставить поддерживающие и ограничивающие практики родителей; русская адаптация проверена на школьниках 13–15 лет.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 5,
  scales: [
    { key: 'parental_support', label: 'Родительская поддержка', items: [1, 2, 3, 4], reverseItems: [], aggregation: 'sum' },
    { key: 'parental_control', label: 'Родительский контроль', items: [5, 6, 7], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы минимальны: проверка суммы поддержки и контроля',
    answers: { '1': 1, '2': 1, '3': 1, '4': 1, '5': 0, '6': 0, '7': 0 },
    expected: { parental_support: 4, parental_control: 0 },
  },
  {
    title: 'Все ответы максимальны: проверка суммы поддержки и контроля',
    answers: { '1': 5, '2': 5, '3': 5, '4': 5, '5': 2, '6': 2, '7': 2 },
    expected: { parental_support: 20, parental_control: 6 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'rudnova-kornienko-digital-parental-mediation-2023-v1',
};
