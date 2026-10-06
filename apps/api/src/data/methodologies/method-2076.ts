import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Совершенно не согласен(-а)' },
  { value: '2', label: 'Скорее не согласен(-а)' },
  { value: '3', label: 'В чем-то согласен(-на), в чем-то нет' },
  { value: '4', label: 'Скорее согласен(-а)' },
  { value: '5', label: 'Полностью согласен(-а)' },
  { value: 'skip', label: 'Затрудняюсь ответить/отказываюсь отвечать' },
];

const statements = [
  'В этой компании сотрудники стремятся продвинуться вверх по карьере, подсиживая других',
  'В этой компании всегда есть влиятельная группа людей, которым никто и никогда не осмелится «перейти дорогу»',
  'В этой компании вес сотрудника определяется не занимаемой им должностью, а тем, приближен ли он/она к влиятельным людям',
  'В этой компании есть такие сотрудники, которые могут не подчиняться общим для всех требованиям, для них всегда будет сделано исключение',
  'В этой компании лучший способ поведения – не противоречить руководству',
  'В этой компании лучше «не раскачивать лодку»',
  'В этой компании иногда проще промолчать, чем противостоять системе',
  'В этой компании говорить другим то, что они хотят услышать, порой лучше, чем сказать правду',
  'В этой компании безопаснее действовать, как вам говорят, а не проявлять инициативу',
  'В этой компании ни одна из выплаченных мне премий не соответствовала официальной политике компании в отношении оплаты труда',
  'Декларируемая политика повышений и оплаты труда этой компании не имеет никакого отношения к тому, как это происходит на самом деле',
  'В этой компании никакие официальные нормы и положения не принимаются в расчет, когда речь идет о продвижении и оплате труда',
  'В этой компании повышения мало связаны с достижениями и деловыми качествами, потому что они происходят по политическим мотивам',
];

const questions: SeedSection['questions'] = statements.map((text, index) => ({
  code: `test_2090_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2090',
  title: 'Шкала восприятия организационной политики (POPS), русскоязычная сокращенная версия',
  description: 'Методика оценивает, насколько сотрудники воспринимают организационную среду как политизированную и ориентированную на личные интересы. Она охватывает общее политическое поведение, соглашательство ради продвижения и воспринимаемую политизированность оплаты труда и карьерных повышений. Русскоязычная 13-пунктная версия подходит для опросов работающих взрослых об организации, в которой они сейчас работают.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'gpb', label: 'Общее политическое поведение (GPB)', items: [1, 2, 3, 4], reverseItems: [], aggregation: 'formula', formula: 'mean(valid numeric answers among items 1-4); omit skip responses' },
    { key: 'ga2ga', label: 'Соглашательство (GA2GA)', items: [5, 6, 7, 8, 9], reverseItems: [], aggregation: 'formula', formula: 'mean(valid numeric answers among items 5-9); omit skip responses' },
    { key: 'p_pp', label: 'Политика оплаты труда и карьерного продвижения (P_PP)', items: [10, 11, 12, 13], reverseItems: [], aggregation: 'formula', formula: 'mean(valid numeric answers among items 10-13); omit skip responses' },
    { key: 'pops', label: 'Итоговая шкала POPS', items: [], reverseItems: [], aggregation: 'formula', formula: 'gpb + ga2ga + p_pp' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: единицы во всех пунктах дают минимальные средние и итог 3',
    answers: Object.fromEntries(Array.from({ length: 13 }, (_, index) => [String(index + 1), 1])),
    expected: { gpb: 1, ga2ga: 1, p_pp: 1, pops: 3 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'pops-mararitsa-et-al-2024-ru-short-13-item-means-sum-v1',
};
