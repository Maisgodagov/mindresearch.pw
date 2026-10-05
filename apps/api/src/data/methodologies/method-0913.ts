import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const yesNo = [
  { value: 'yes', label: 'Да' },
  { value: 'no', label: 'Нет' },
];

const severity = [
  { value: '1', label: 'Нет' },
  { value: '2', label: 'Средне, особо не вызывает' },
  { value: '3', label: 'Вызывает, но не сильно, все под контролем' },
  { value: '4', label: 'Сильно' },
  { value: '5', label: 'Очень сильно' },
];

const questions: SeedSection['questions'] = [
  { code: 'test_943_1', text: 'Обеспокоены ли Вы своей внешностью или какой-то частью вашего тела, которую вы считаете непривлекательной?', type: 'single', required: true, options: yesNo },
  { code: 'test_943_2', text: 'Если да, то эта проблема Вас беспокоит? То есть Вы много думаете о ней, и Вам трудно перестать думать о ней?', type: 'single', required: true, options: yesNo },
  { code: 'test_943_3', text: 'Какие это проблемы? Какая часть тела Вам не нравится? Что именно Вас в ней не устраивает?', type: 'text', required: false },
  { code: 'test_943_4', text: 'Какое влияние имеет Ваша обеспокоенность на Вашу жизнь?', type: 'text', required: false },
  { code: 'test_943_5', text: 'Вызывает ли Ваш дефект у Вас огорчение, страдание, боль?', type: 'single', required: true, options: severity },
  { code: 'test_943_6', text: 'Вызывает ли Ваш дефект нарушения в социальной, профессиональной жизни или других важных аспектах жизни?', type: 'single', required: true, options: severity },
  { code: 'test_943_7', text: 'Мешает ли Ваш дефект в значительной степени в социальных отношениях?', type: 'single', required: true, options: yesNo },
  { code: 'test_943_8', text: 'Если да, то как?', type: 'text', required: false },
  { code: 'test_943_9', text: 'Мешает ли Вам Ваш дефект в учебе, в работе, в повседневной жизни?', type: 'single', required: true, options: yesNo },
  { code: 'test_943_10', text: 'Есть ли вещи, которых Вы избегаете из-за Вашего дефекта?', type: 'single', required: true, options: yesNo },
];

export const instrument: SeedSection = {
  code: 'test_943',
  title: 'Опросник дисморфофобии BDDQ-DV (русская версия)',
  description: 'Скрининговая русская версия BDDQ-DV оценивает тревогу и чрезмерную озабоченность собственной внешностью, включая эмоциональный дистресс, влияние переживаний на социальную, профессиональную и повседневную жизнь, избегание и обращение за помощью. Русская версия опубликована для исследовательского скрининга среди женщин разных возрастных групп; результат не является диагнозом.',
  questions,
};

// In the published BDDQ-DV rule, either of the two 1–5 impairment items at 3 or above is a positive screen.
export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'distress', label: 'Дистресс из-за предполагаемого дефекта', items: [5], reverseItems: [], aggregation: 'sum' },
    { key: 'life_impairment', label: 'Нарушение повседневного функционирования', items: [6], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  { title: 'Пороговый пример: оба оцениваемых пункта ниже порога', answers: { '5': '2', '6': '2' }, expected: { distress: 2, life_impairment: 2 } },
  { title: 'Пороговый пример: пункт о нарушении жизни достигает порога', answers: { '5': '2', '6': '3' }, expected: { distress: 2, life_impairment: 3 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'bddq-dv-khramtsova-2022-psytests-ru-v1',
};
