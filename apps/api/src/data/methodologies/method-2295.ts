import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'Совершенно неверно' },
  { value: '1', label: 'Неверно' },
  { value: '2', label: 'В некоторой степени' },
  { value: '3', label: 'Верно' },
  { value: '4', label: 'Совершенно верно' },
];

const items = [
  'Я много думал о том, что мои друзья сплетничают обо мне.',
  'Я часто слышал, что люди вели речь обо мне.',
  'Меня расстраивало то, что друзья и коллеги критически меня осуждали.',
  'Определенно, люди смеялись надо мной за моей спиной.',
  'Я много думал о том, что люди меня избегают.',
  'Люди делали мне какие-то намеки.',
  'Я был уверен, что определенные люди не являлись теми, кем кажутся.',
  'Меня расстраивало, что люди разговаривали обо мне за моей спиной.',
  'Некоторые люди имели на меня зуб.',
  'Люди хотели, чтобы я почувствовал угрозу, и для этого смотрели на меня в упор.',
  'Я был уверен, что люди делали что-то, чтобы докучать мне.',
  'Я был убежден, что существует заговор против меня.',
  'Я был уверен, что кто-то хочет мне навредить.',
  'Я не мог отделаться от мыслей, что люди хотят сбить меня с толку.',
  'Я был огорчен тем, что меня преследовали.',
  'Мне было трудно перестать думать о том, что люди хотят, чтобы мне было плохо.',
  'Люди специально были настроены враждебно против меня.',
  'Я испытывал злость от того, что кто-то хочет причинить мне вред.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2313_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2313',
  title: 'Шкала параноидальных мыслей (R-GPTS), русская версия',
  description: 'R-GPTS оценивает выраженность параноидных мыслей у людей из клинических и неклинических групп. Восемь пунктов относятся к идеям отношения — восприятию разговоров, намёков и поведения окружающих как относящихся к себе; десять — к идеям преследования, ожиданию намеренного вреда и связанным с этим переживаниям. Результаты дают раздельные показатели по этим аспектам за последний месяц и предназначены для исследовательской или профессиональной оценки, а не для самостоятельной диагностики.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 4,
  scales: [
    { key: 'reference', label: 'Идеи отношения', items: [1, 2, 3, 4, 5, 6, 7, 8], reverseItems: [], aggregation: 'sum' },
    { key: 'persecution', label: 'Идеи преследования', items: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18], reverseItems: [], aggregation: 'sum' },
  ],
};

const allAnswers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Все пункты отмечены как совершенно неверные', answers: allAnswers(0), expected: { reference: 0, persecution: 0 } },
  { title: 'Все пункты отмечены как совершенно верные', answers: allAnswers(4), expected: { reference: 32, persecution: 40 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['clinical-schizotypy'],
  scoringConfig,
  validationCases,
  formulaVersion: 'r-gpts-freeman-loe-2021-ru-psytests-0-4-subscale-sums-v1',
};
