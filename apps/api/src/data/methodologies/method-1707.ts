import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const frequency = [
  { value: '0', label: 'Никогда' },
  { value: '1', label: 'Раз в месяц или реже' },
  { value: '2', label: '2-4 раза в месяц' },
  { value: '3', label: '2-3 раза в неделю' },
  { value: '4', label: '4 раза в неделю и чаще' },
];
const frequencyPastYear = [
  { value: '0', label: 'Никогда' },
  { value: '1', label: 'Реже одного раза в месяц' },
  { value: '2', label: 'Ежемесячно' },
  { value: '3', label: 'Еженедельно' },
  { value: '4', label: 'Ежедневно или почти ежедневно' },
];
const standardDrinks = [
  { value: '0', label: '1-2 стандартные порции' },
  { value: '1', label: '3-4 стандартные порции' },
  { value: '2', label: '5-6 стандартных порций' },
  { value: '3', label: '7-9 стандартных порций' },
  { value: '4', label: '10 стандартных порций и больше' },
];
const injury = [
  { value: '0', label: 'Никогда' },
  { value: '2', label: 'Да, более 12 месяцев назад' },
  { value: '4', label: 'Да, в течение последних 12 месяцев' },
];

const questionData: { text: string; options: typeof frequency }[] = [
  { text: 'Как часто вы употребляете алкогольные напитки?', options: frequency },
  { text: 'Сколько алкогольных напитков (стандартных порций) вы употребляете в типичный день, когда выпиваете? Одна стандартная порция содержит 10 граммов этилового спирта.', options: standardDrinks },
  { text: 'Как часто вы употребляете как минимум 1.5 л пива, или как минимум 180 мл крепкого алкоголя, или как минимум бутылку вина или шампанского (750 мл) в течение 24 часов?', options: frequencyPastYear },
  { text: 'Как часто за последние 12 месяцев вы не могли остановиться, начав употреблять алкогольные напитки?', options: frequencyPastYear },
  { text: 'Как часто за последние 12 месяцев из-за выпивки вы не сделали то, что от вас обычно ожидалось?', options: frequencyPastYear },
  { text: 'Как часто за последние 12 месяцев вам необходимо было выпить утром, чтобы прийти в себя после выпивки (опохмелиться)?', options: frequencyPastYear },
  { text: 'Как часто за последние 12 месяцев вы испытывали чувство вины или сожаления после выпивки?', options: frequencyPastYear },
  { text: 'Как часто за последние 12 месяцев вы были неспособны вспомнить, что было накануне, из-за того, что вы выпивали?', options: frequencyPastYear },
  { text: 'Являлось ли ваше употребление алкогольных напитков причиной травмы у вас или у других людей?', options: injury },
  { text: 'Случалось ли, что ваш близкий человек или родственник, друг или врач беспокоился насчет употребления вами алкоголя или советовал выпивать меньше?', options: injury },
];

const questions: SeedSection['questions'] = questionData.map(({ text, options }, index) => ({
  code: `test_1724_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1724',
  title: 'Тест AUDIT для выявления расстройств, обусловленных употреблением алкоголя (RUS-AUDIT)',
  description: 'RUS-AUDIT — скрининговая версия ВОЗ, адаптированная и валидированная для Российской Федерации. Она оценивает частоту и объём употребления алкоголя, эпизоды употребления больших объёмов, признаки утраты контроля и последствия для повседневного функционирования и здоровья. Предназначена для скрининга взрослых пациентов в первичной медико-санитарной помощи и поддержки кратких вмешательств; результат не является диагнозом.',
  questions,
};

const itemScores: Record<number, Record<string, number>> = Object.fromEntries(
  Array.from({ length: 10 }, (_, index) => {
    const item = index + 1;
    const answers = questionData[item - 1].options;
    return [item, Object.fromEntries(answers.map(option => [option.value, Number(option.value)]))];
  }),
);

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 4,
  scales: [{
    key: 'total',
    label: 'Суммарный балл RUS-AUDIT',
    items: Array.from({ length: 10 }, (_, index) => index + 1),
    reverseItems: [],
    aggregation: 'sum',
    itemScores,
  }],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная сверка: все ответы с нулевым баллом',
    answers: Object.fromEntries(Array.from({ length: 10 }, (_, index) => [String(index + 1), '0'])),
    expected: { total: 0 },
  },
  {
    title: 'Ручная сверка: максимальные баллы всех 10 пунктов',
    answers: Object.fromEntries(Array.from({ length: 10 }, (_, index) => [String(index + 1), index >= 8 ? '4' : '4'])),
    expected: { total: 40 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'rus-audit-who-russian-validation-2021-v1',
};
