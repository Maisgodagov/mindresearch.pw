import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const poles: [string, string][] = [
  ['Добрый', 'Злой'],
  ['Общительный', 'Замкнутый'],
  ['Уверенный в себе', 'Неуверенный в себе'],
  ['Раздражительный', 'Спокойный'],
  ['Неоткровенный', 'Откровенный'],
  ['Нерешительный', 'Решительный'],
  ['Понимающий других', 'Не понимающий других'],
  ['Смелый', 'Робкий'],
  ['Симпатичный', 'Несимпатичный'],
  ['Нуждающийся в поддержке других', 'Самодостаточный'],
  ['Импульсивный', 'Уравновешенный'],
  ['Подчиняющийся', 'Доминирующий'],
  ['Умный', 'Глупый'],
  ['Активный', 'Пассивный'],
  ['Целеустремлённый', 'Беспорядочный'],
];
const positions = [
  'Полностью выражено первое качество',
  'В основном выражено первое качество',
  'Скорее выражено первое качество',
  'Оба качества выражены одинаково',
  'Скорее выражено второе качество',
  'В основном выражено второе качество',
  'Полностью выражено второе качество',
];

const questions: SeedSection['questions'] = poles.map(([left, right], index) => ({
  code: `test_1747_${index + 1}`,
  text: `Для пары «${left} — ${right}» выберите сочетание позиции «Реального Я» (каковы вы сейчас) и «Идеального Я» (каким вы хотели бы быть). Сначала указана позиция Реального Я, затем Идеального Я.`,
  type: 'single',
  required: true,
  options: Array.from({ length: 49 }, (_, pair) => {
    const real = Math.floor(pair / 7) + 1;
    const ideal = pair % 7 + 1;
    return { value: `${real},${ideal}`, label: `Реальное Я: ${positions[real - 1]}; Идеальное Я: ${positions[ideal - 1]}` };
  }),
}));

export const instrument: SeedSection = {
  code: 'test_1747',
  title: 'Тест для исследования самооценки (модификация Л. П. Пономаренко)',
  description: 'Подростковая методика на основе семантического дифференциала оценивает представление о «Реальном Я» и желаемом «Идеальном Я» по 15 полярным характеристикам личности. Сопоставление профилей показывает расхождение между текущим и желаемым самоописанием; предназначена для исследования самооценки подростков.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 90,
  scales: [{
    key: 'selfEsteemDiscrepancy',
    label: 'Сумма расхождений между «Реальным Я» и «Идеальным Я»',
    items: Array.from({ length: 15 }, (_, i) => i + 1),
    reverseItems: [],
    aggregation: 'sum',
    itemScores: Object.fromEntries(Array.from({ length: 15 }, (_, i) => [i + 1, Object.fromEntries(
      Array.from({ length: 49 }, (_, pair) => {
        const real = Math.floor(pair / 7) + 1;
        const ideal = pair % 7 + 1;
        return [`${real},${ideal}`, Math.abs(real - ideal)];
      }),
    )])),
  }],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная сверка: все 15 позиций совпадают',
    answers: Object.fromEntries(Array.from({ length: 15 }, (_, i) => [String(i + 1), `${i + 1},${i + 1}`])),
    expected: { selfEsteemDiscrepancy: 0 },
  },
  {
    title: 'Ручная сверка: позиции 1 и 7 по каждой паре дают разницу 6',
    answers: Object.fromEntries(Array.from({ length: 15 }, (_, i) => [String(i + 1), '1,7'])),
    expected: { selfEsteemDiscrepancy: 90 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'ponomarenko-self-esteem-semantic-differential-1999-15pairs-absolute-gap-sum-v1',
};
