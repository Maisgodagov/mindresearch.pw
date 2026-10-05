import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const optionLabels = ['вариант а', 'вариант б', 'вариант в'];
const items: [string, string][] = [
  ['Каково общее эмоциональное состояние ребенка чаще всего?', 'угрюм, подавлен'],
  ['Как ребенок адаптируется к новым условиям?', 'трудно'],
  ['Как часто проявляет ребенок агрессивные формы поведения (кусается, дерется, жестоко обращается с игрушками и др.)?', 'часто'],
  ['Проявляет ли ребенок эмоции в неадекватных ситуациях (смеется, когда рассказывают грустную историю, и др.)?', 'часто'],
  ['Проявляет ли ребенок сочувствие, сопереживание сверстникам, героям сказок и др.?', 'никогда'],
  ['Как ребенок общается со сверстниками?', 'почти не общается, замкнут в себе'],
  ['Как общается ребенок с воспитателями и другими взрослыми?', 'скованно, пассивно'],
  ['Характерна ли для ребенка боязнь незнакомых предметов, чрезмерная осторожность?', 'часто'],
  ['Как часто ребенок проявляет капризы, упрямство?', 'часто'],
  ['Характерны ли для ребенка следующие проявления: замкнутость, тревожность?', 'да'],
  ['Способен ли ребенок управлять своими эмоциями?', 'никогда'],
  ['Характерны ли для ребенка следующие вегетативные проявления: покраснение кожи, потливость, плохой сон и аппетит, энурез (недержание мочи), скованность движений и др.?', 'часто, почти всегда'],
];
const questions: SeedSection['questions'] = items.map(([text], index) => ({
  code: `test_1351_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: optionLabels.map((label, optionIndex) => ({ value: String(optionIndex), label })),
}));

export const instrument: SeedSection = {
  code: 'test_1351',
  title: 'Опросный лист эмоционального состояния ребенка (Н. Артюхина, А. М. Щетинина)',
  description: 'Опросный лист предназначен для взрослого, хорошо знающего дошкольника 3–7 лет, и помогает оценить общее эмоциональное благополучие по проявлениям настроения, адаптации, агрессии, эмоциональной адекватности и эмпатии, общения со сверстниками и взрослыми, тревожности, саморегуляции и вегетативных признаков.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 2,
  scales: [{
    key: 'emotional_wellbeing',
    label: 'Общий показатель эмоционального неблагополучия',
    items: Array.from({ length: 12 }, (_, index) => index + 1),
    reverseItems: [],
    aggregation: 'sum',
  }],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: все ответы а соответствуют 0 баллам, эмоциональное благополучие',
    answers: Object.fromEntries(Array.from({ length: 12 }, (_, index) => [String(index + 1), '0'])),
    expected: { emotional_wellbeing: 0 },
  },
  {
    title: 'Ручная проверка: все ответы в соответствуют 2 баллам, эмоциональное неблагополучие',
    answers: Object.fromEntries(Array.from({ length: 12 }, (_, index) => [String(index + 1), '2'])),
    expected: { emotional_wellbeing: 24 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'artyukhina-shchetinina-emotional-state-child-2000-a0-b1-v2',
};
