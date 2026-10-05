import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const scaleOptions = Array.from({ length: 10 }, (_, index) => ({
  value: String(index + 1),
  label: String(index + 1),
}));

const prompts = [
  'Высокие цены (на транспорт, продукты, одежду).',
  'Внезапно испортившаяся погода, дождь, снег.',
  'Машина, которая обрызгала вас грязью.',
  'Строгий, несправедливый начальник (преподаватель, родитель).',
  'Правительство, депутаты, администрация.',
  'Излишне серьезное отношение к жизни, учебе, работе.',
  'Стеснительность, робость, застенчивость.',
  'Страх перед будущим, мысли о возможных неприятностях и проблемах.',
  'Плохой, беспокойный сон.',
  'Пессимизм, тенденция отмечать в жизни в основном негативные черты.',
  'Учащенное сердцебиение, боли в сердце.',
  'Затрудненное дыхание.',
  'Проблемы с желудочно-кишечным трактом.',
  'Напряжение или дрожание мышц.',
  'Головные боли, повышенная утомляемость.',
  'Алкоголь.',
  'Сигареты.',
  'Телевизор.',
  'Вкусная еда.',
  'Агрессия (выплеснуть зло на другого человека).',
  'Сон, отдых, смена деятельности.',
  'Общение с друзьями или любимым человеком.',
  'Физическая активность (бег, плавание, футбол, ролики, лыжи и т. д.).',
  'Анализ своих действий, поиск других вариантов.',
  'Изменение своего поведения в данной ситуации.',
];

const questions: SeedSection['questions'] = prompts.map((text, index) => ({
  code: `test_1818_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: scaleOptions,
}));

export const instrument: SeedSection = {
  code: 'test_1818',
  title: 'Тест на стрессоустойчивость (Ю. В. Щербатых)',
  description: 'Методика оценивает стрессочувствительность как обратный показатель стрессоустойчивости. Она охватывает реакцию на повседневные стрессоры, личностные особенности, телесные проявления стресса и деструктивные и конструктивные способы совладания. Подходит для ориентировочной самооценки взрослых; результаты не являются диагнозом.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 10,
  scales: [
    { key: 'uncontrollable_stressors', label: 'Реакция на неконтролируемые обстоятельства', items: [1, 2, 3, 4, 5], reverseItems: [], aggregation: 'sum' },
    { key: 'personal_stress_factors', label: 'Личностные стрессовые факторы', items: [6, 7, 8, 9, 10], reverseItems: [], aggregation: 'sum' },
    { key: 'somatic_manifestations', label: 'Телесные проявления стресса', items: [11, 12, 13, 14, 15], reverseItems: [], aggregation: 'sum' },
    { key: 'destructive_coping', label: 'Деструктивные способы совладания', items: [16, 17, 18, 19, 20], reverseItems: [], aggregation: 'sum' },
    { key: 'constructive_coping', label: 'Конструктивные способы совладания', items: [21, 22, 23, 24, 25], reverseItems: [], aggregation: 'sum' },
    { key: 'baseline_stress_sensitivity', label: 'Базовая стрессочувствительность', items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], reverseItems: [], aggregation: 'sum' },
    { key: 'dynamic_stress_sensitivity', label: 'Динамическая стрессочувствительность', items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25], reverseItems: [21, 22, 23, 24, 25], aggregation: 'formula', formula: 'sum(items 1-20) - sum(items 21-25)' },
  ],
};

const allAnswers = (value: number) => Object.fromEntries(prompts.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы минимальны',
    answers: allAnswers(1),
    expected: { uncontrollable_stressors: 5, personal_stress_factors: 5, somatic_manifestations: 5, destructive_coping: 5, constructive_coping: 5, baseline_stress_sensitivity: 20, dynamic_stress_sensitivity: 15 },
  },
  {
    title: 'Все ответы максимальны',
    answers: allAnswers(10),
    expected: { uncontrollable_stressors: 50, personal_stress_factors: 50, somatic_manifestations: 50, destructive_coping: 50, constructive_coping: 50, baseline_stress_sensitivity: 200, dynamic_stress_sensitivity: 150 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'shcherbatykh-stress-sensitivity-25-v1',
};
