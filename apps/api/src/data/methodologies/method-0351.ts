import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'Редко' },
  { value: '1', label: 'Иногда' },
  { value: '2', label: 'Регулярно' },
  { value: '3', label: 'Часто' },
  { value: '4', label: 'Всегда' },
];

const items = [
  'Мне удавалось планировать мою работу так, чтобы закончить вовремя',
  'Я помнил, какого результата работы мне нужно достигнуть',
  'Я смог расставить приоритеты',
  'Я смог выполнить работу эффективно',
  'Я хорошо распределял время',
  'Я по собственной инициативе брался за новые задачи, как только справлялся со старыми',
  'Я брал на себя сложные и интересные задания, когда они были доступны',
  'Я занимался совершенствованием своих профессиональных знаний',
  'Я занимался совершенствованием своих профессиональных навыков',
  'Я предлагал креативные решения новых задач',
  'Я брал на себя дополнительные обязанности',
  'Я постоянно искал новые сложные и интересные задачи в моей работе',
  'Я активно участвовал в собраниях и/или совещаниях',
  'На работе я жаловался на мелкие проблемы, связанные с профессиональной деятельностью',
  'Я придавал проблемам на работе большую значимость, чем они имели на самом деле',
  'Я фокусировался на негативных аспектах ситуации на работе, вместо позитивных',
  'Я обсуждал с коллегами негативные аспекты моей работы',
  'Я обсуждал с людьми не из моей организации негативные аспекты моей работы',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_382_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_382',
  title: 'Индивидуальное выполнение работы (IWPQ)',
  description: 'Русскоязычная адаптация IWPQ оценивает субъективную частоту рабочего поведения за последние три месяца по трём аспектам: выполнение задач, контекстное поведение (инициативность и дополнительные вклады) и контрпродуктивное поведение. Подходит для самооценки работников разных профессий и описания поведенческих характеристик; результаты отражают самоотчёт, а не объективную производительность.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 4,
  scales: [
    { key: 'taskPerformance', label: 'Выполнение задач', items: [1, 2, 3, 4, 5], reverseItems: [], aggregation: 'mean' },
    { key: 'contextualPerformance', label: 'Контекст выполнения задач', items: [6, 7, 8, 9, 10, 11, 12, 13], reverseItems: [], aggregation: 'mean' },
    { key: 'counterproductiveBehavior', label: 'Контрпродуктивное поведение', items: [14, 15, 16, 17, 18], reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  { title: 'Все ответы «Редко»', answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 0])), expected: { taskPerformance: 0, contextualPerformance: 0, counterproductiveBehavior: 0 } },
  { title: 'Проверка шкал: ответы 0–4 по порядку', answers: Object.fromEntries(items.map((_, index) => [String(index + 1), index % 5])), expected: { taskPerformance: 2, contextualPerformance: 1.5, counterproductiveBehavior: 2 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'iwpq-ru-rudnova-kornienko-2022-v1',
};
