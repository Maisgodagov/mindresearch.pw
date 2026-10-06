import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '5', label: 'Все время' },
  { value: '4', label: 'Большую часть времени' },
  { value: '3', label: 'Половину времени' },
  { value: '2', label: 'Иногда' },
  { value: '1', label: 'Никогда' },
];

const items = [
  'Я люблю себя.',
  'Я плохо к себе отношусь.',
  'Я горжусь собой.',
  'Я чувствую себя беспомощным.',
  'Я уверен в себе.',
  'Лучше бы я не появился на свет.',
  'Я награжден своими положительными качествами.',
  'Я чувствую, что не достигну своей мечты.',
  'Я считаю, что я безусловно хороший.',
  'Я думаю, что другие не любят меня.',
  'Мне легко ценить других людей.',
  'Я бы хотел, чтобы некоторые люди умерли.',
  'Другие люди в основном хорошие.',
  'Меня раздражают другие люди.',
  'Большинству людей можно доверять.',
  'Я не доверяю людям.',
  'Люди могут делать хорошую работу.',
  'Я с подозрением отношусь к намерениям других людей.',
  'Я с нетерпением жду встречи с другими людьми.',
  'Я нетерпелив к чужим ошибкам.',
];

const reverseItems = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2145_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2145',
  title: 'Шкала жизненной позиции',
  description: 'Шкала оценивает базовые убеждения о ценности себя и других людей в рамках транзактного анализа. Две подшкалы — «Я» и «Ты» — охватывают положительное или отрицательное отношение к себе и доверие, принятие либо раздражение в отношении других. Русская адаптация предназначена для взрослых респондентов и описывает четыре сочетания жизненной позиции.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'i', label: 'Жизненная позиция по отношению к себе («Я»)', items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], reverseItems, aggregation: 'sum' },
    { key: 'you', label: 'Жизненная позиция по отношению к другим («Ты»)', items: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20], reverseItems, aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: позитивные убеждения всегда, негативные никогда дают максимумы',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), reverseItems.includes(index + 1) ? 1 : 5])),
    expected: { i: 50, you: 50 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'lps-boholst-fedotov-namestnikova-2021-ru-v1',
};
