import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '-3', label: 'Резко отрицательный эффект' },
  { value: '-2', label: 'Отрицательный эффект' },
  { value: '-1', label: 'Лёгкий отрицательный эффект' },
  { value: '0', label: 'Не влияет' },
  { value: '1', label: 'Лёгкий положительный эффект' },
  { value: '2', label: 'Положительный эффект' },
  { value: '3', label: 'Резко положительный эффект' },
];

const statements = [
  'Мои чувства собственного достоинства и самоуважения.',
  'Моя состоятельность как женщины, женственность.',
  'Отношения с лицами моего пола.',
  'Отношения с лицами противоположного пола.',
  'Когда я встречаю новых людей.',
  'На работе (учёбе).',
  'Отношения с друзьями.',
  'Отношения с членами моей семьи.',
  'Моё настроение каждый день.',
  'Моя удовлетворённость жизнью.',
  'Моя состоятельность как сексуального партнёра.',
  'Моя удовлетворённость сексуальной жизнью.',
  'Возможность контролировать, что и сколько я ем.',
  'Моя способность контролировать свой вес.',
  'Моя физическая активность.',
  'Желание сделать то, что может привлечь внимание к моей внешности.',
  'Мой ежедневный уход за собой (одеться, подготовиться к предстоящему дню).',
  'Насколько уверенно я чувствую себя в повседневной жизни.',
  'Насколько я счастлива в повседневной жизни.',
];

const questions: SeedSection['questions'] = statements.map((statement, index) => ({
  code: `test_163_${index + 1}`,
  text: statement,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_163',
  title: 'Влияние образа тела на качество жизни (BIQLI), адаптация Баранской и Татауровой',
  description: 'Оцените, какое влияние образ Вашего тела оказывает на каждую из 19 сфер жизни: от резко отрицательного до резко положительного. Русская версия содержит формулировки от первого лица женщины.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: -3,
  max: 3,
  scales: [
    { key: 'overall_impact', label: 'Общее влияние образа тела на качество жизни', items: Array.from({ length: 19 }, (_, i) => i + 1), reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: нейтральный ответ по всем 19 пунктам даёт среднее 0',
    answers: Object.fromEntries(Array.from({ length: 19 }, (_, index) => [String(index + 1), 0])),
    expected: { overall_impact: 0 },
  },
  {
    title: 'Ручная проверка: все ответы +3 дают среднее +3',
    answers: Object.fromEntries(Array.from({ length: 19 }, (_, index) => [String(index + 1), 3])),
    expected: { overall_impact: 3 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'biqli-baranskaya-tataurova-19-item-mean-minus3-plus3-v1',
};
