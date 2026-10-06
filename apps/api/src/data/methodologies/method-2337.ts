import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Да, согласен' },
  { value: '2', label: 'Скорее согласен' },
  { value: '3', label: 'Скорее не согласен' },
  { value: '4', label: 'Нет, не согласен' },
];

const items = [
  'Пожалуй, я человек нервный.',
  'Я очень беспокоюсь о своей работе.',
  'Я часто ощущаю нервное напряжение.',
  'Моя повседневная деятельность вызывает большое напряжение.',
  'Общаясь с людьми, я часто ощущаю нервное напряжение.',
  'К концу дня я совершенно истощён физически и психически.',
  'В моей семье часто возникают напряжённые отношения.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2355_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2355',
  title: 'Шкала психологического стресса Ридера',
  description: 'Краткая русская адаптация шкалы Ридера оценивает субъективное психоэмоциональное напряжение в настоящий момент: нервозность, беспокойство о работе, напряжение в повседневной деятельности и общении, истощение и напряжённость семейных отношений. Подходит для экспресс-оценки взрослых респондентов и изучения динамики стресса; отдельные источники стресса она подробно не диагностирует.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 4,
  scales: [
    { key: 'psychological_stress', label: 'Средний балл психологического стресса', items: [1, 2, 3, 4, 5, 6, 7], reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Вручную проверено: все ответы «Да, согласен» дают среднее 1',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { psychological_stress: 1 },
  },
  {
    title: 'Вручную проверено: последовательные ответы от 1 до 4 дают среднее 2.5',
    answers: { '1': 1, '2': 2, '3': 3, '4': 4, '5': 1, '6': 2, '7': 3 },
    expected: { psychological_stress: 16 / 7 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['mood-stress'],
  scoringConfig,
  validationCases,
  formulaVersion: 'reeder-stress-inventory-kopina-ru-7item-mean-v1',
};
