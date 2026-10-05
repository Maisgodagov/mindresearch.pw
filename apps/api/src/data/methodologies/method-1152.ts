import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Никогда' },
  { value: '2', label: 'Иногда' },
  { value: '3', label: 'Часто' },
  { value: '4', label: 'Всегда' },
];

const items = [
  'Повторно использовать пластиковые пакеты для новых покупок и/или других целей',
  'По возможности избегать использования бытовой химии',
  'Отключать компьютер или телевизор от сети, когда они не используются',
  'Стараться принимать душ как можно быстрее, чтобы ограничить использование воды',
  'Откладывать бумажные отходы, чтобы эта макулатура могла потом быть переработана',
  'Следить, чтобы искусственное освещение было выключено, если в помещении и без него достаточно светло',
  'Использовать стиральную машину только тогда, когда она полностью загружена',
  'Передвигаться на небольшие расстояния (около 1–2 км) пешком, а не ехать на транспорте',
  'При чистке зубов следить, чтобы вода не бежала напрасно',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1182_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1182',
  title: 'Опросник-самоотчет проэкологического поведения в быту',
  description: 'Методика оценивает частоту повседневных действий, снижающих воздействие на окружающую среду: повторное использование пакетов, сокращение бытовой химии, экономию электроэнергии и воды, обращение с макулатурой и выбор пешего передвижения. Русскоязычная адаптация из 9 пунктов подходит для взрослых; формулировки доступны также старшеклассникам.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 4,
  scales: [
    { key: 'proEnvironmentalBehavior', label: 'Проэкологическое поведение в быту', items: [1, 2, 3, 4, 5, 6, 7, 8, 9], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все действия выполняются редко: сумма равна 18',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 2])),
    expected: { proEnvironmentalBehavior: 18 },
  },
  {
    title: 'Все действия выполняются всегда: максимальная сумма 36',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 4])),
    expected: { proEnvironmentalBehavior: 36 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'kryazh-andronnikova-household-proenvironmental-behavior-9-v1',
};
