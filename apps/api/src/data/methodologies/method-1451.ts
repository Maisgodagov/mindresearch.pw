import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const prompts = [
  'Охотно ли вы беретесь за подготовку занятий по новой теме, не имеющей типовой разработки?',
  'Легко ли вам отказаться от приемов воздействия на учащихся, которые вы успешно применяли раньше?',
  'Быстро ли вы перестали с сожалением вспоминать о прошедших школьных и студенческих годах обучения, став преподавателем?',
  'Решительно ли вы отказываетесь от стандартного поведения в различных жизненных ситуациях?',
  'Умеете ли вы дать безошибочную характеристику своим учащимся, разделив их на сильных и слабых по умственным способностям и нравственным качествам?',
  'Легко ли вам отказаться от того, что уже однажды было принято вами как непреложная истина?',
  'Быстро ли вы привыкаете к новым условиям работы?',
  'Считаете ли вы, что некоторые ваши привычки и взгляды мешают вам в работе?',
  'Можете ли вы легко найти общий язык с любым учащимся?',
  'Считаете ли вы, что лучше быть авторитетным преподавателем, чем просто любимым?',
  'Часто ли ваши неудачи в работе объясняются объективными причинами?',
  'Часто ли вы ощущаете недостаток времени для выполнения всех своих обязанностей?',
  'Считаете ли вы, что учащиеся должны постоянно находиться под вашим контролем?',
  'Часто ли вы прибегаете к поощрениям и наказаниям, не учитывая индивидуальные особенности учащихся?',
];

const yesScores = [1, 0, 0, 0, 2, 1, 1, 0, 1, 1, 0, 0, 0, 1];
const noScores = [0, 1, 1, 2, 0, 0, 0, 2, 0, 0, 2, 1, 2, 0];

const questions: SeedSection['questions'] = prompts.map((text, index) => ({
  code: `test_1479_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: [
    { value: 'yes', label: 'Да' },
    { value: 'no', label: 'Нет' },
  ],
}));

export const instrument: SeedSection = {
  code: 'test_1479',
  title: 'Проверьте, какой вы преподаватель (М. И. Станкин)',
  description: 'Краткая самооценка профессиональной педагогической грамотности преподавателя. Пункты затрагивают гибкость и самостоятельность в выборе способов работы, наблюдательность и объективность в оценке учащихся, а также отношение к контролю, времени и причинам рабочих неудач. Версия предназначена для взрослых преподавателей, работающих с учащимися; это ориентир для профессиональной рефлексии, а не аттестационная оценка.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 2,
  scales: [
    { key: 'professional_pedagogical_gramotnost', label: 'Самооценка педагогической грамотности', items: prompts.map((_, index) => index + 1), itemScores: Object.fromEntries(prompts.map((_, index) => [String(index + 1), { yes: yesScores[index], no: noScores[index] }])), aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  { title: 'Ручная сверка: все ответы «да»', answers: Object.fromEntries(prompts.map((_, index) => [String(index + 1), 'yes'])), expected: { professional_pedagogical_gramotnost: 7 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'stankin-professional-abilities-1998-14item-binary-weight-key-v1',
};
