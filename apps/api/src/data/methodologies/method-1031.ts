import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Никогда' },
  { value: '2', label: 'Редко' },
  { value: '3', label: 'Иногда' },
  { value: '4', label: 'Часто' },
  { value: '5', label: 'Очень часто' },
];

const items = [
  'Неаккуратные, неряшливые',
  'Сверх аккуратные',
  'Излишне веселые, склонные смеяться по каждому поводу',
  'Обидчивые',
  'Сверх общительные, назойливые',
  'Необщительные, замкнутые',
  'Агрессивные, враждебно настроенные',
  'Излишне миролюбивые, иногда трусливые',
  'Стремящиеся везде проявлять инициативу',
  'Пассивные, безучастные к делам',
  'Очень умные, высокомерные',
  'Люди недалекого ума, медленно соображающие',
  'Сверх ответственные, пунктуальные',
  'Безответственные, склонные откладывать дела «на потом»',
  'Стремящиеся вам понравиться, влезть в доверие',
  'Не желающие с вами контактировать, отчужденные',
  'Импульсивные, не сидящие ни минуты на месте',
  '«Заторможенные», медлительные',
  'Эмоционально чувствительные и впечатлительные',
  'Черствые, себялюбивые, эгоисты',
  'Чрезмерно трудолюбивые',
  'Лентяи',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1061_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1061',
  title: 'Опросник на выявление раздражительности к людям',
  description: 'Методика оценивает частоту раздражения в ответ на 22 характеристики и типа поведения окружающих: от агрессивности и неряшливости до замкнутости, медлительности и чрезмерной активности. Она помогает автору опроса изучать индивидуальные источники раздражения и связанные с принятием других людей трудности; исходная исследовательская версия разработана для студентов — будущих специалистов психолого-педагогического сопровождения.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'irritability', label: 'Частота раздражения по характеристикам людей', items: Array.from({ length: 22 }, (_, index) => index + 1), reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка по ключу: «никогда» означает 1 балл за каждый из 22 пунктов',
    answers: Object.fromEntries(Array.from({ length: 22 }, (_, index) => [String(index + 1), 1])),
    expected: { irritability: 22 },
  },
  {
    title: 'Ручная проверка порога статьи: ответы 1–3 относятся к низкой выраженности, 4–5 — к высокой',
    answers: Object.fromEntries(Array.from({ length: 22 }, (_, index) => [String(index + 1), index === 0 ? 4 : 3])),
    expected: { irritability: 67 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'maralov-sitarov-irritability-to-people-22item-5point-sum-dichotomy-4-5-v1',
};
