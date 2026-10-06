import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Совсем не согласен' },
  { value: '2', label: 'Скорее не согласен, чем согласен' },
  { value: '3', label: 'Скорее согласен, чем не согласен' },
  { value: '4', label: 'Совсем согласен' },
];

const items = [
  'Я часто теряю чувство юмора в трудной ситуации.',
  'Я часто обнаруживаю, что мои проблемы значительно уменьшаются, когда я стараюсь найти что-то смешное в них.',
  'Я обычно стараюсь сказать что-то смешное, когда я в напряженной ситуации.',
  'Вряд ли чувство юмора способно облегчить мою жизнь.',
  'Я часто чувствую, что если бы возникла ситуация, плакать мне или смеяться, то я бы лучше смеялся.',
  'Обычно я могу найти над чем посмеяться или пошутить, даже в трудных ситуациях.',
  'Благодаря опыту я знаю, что юмор — это часто очень эффективный способ справляться с проблемами.',
];

const reverseItems = [1, 4];
const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2413_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2413',
  title: 'Шкала совладания с помощью юмора (CHS)',
  description: 'Русскоязычная адаптация CHS оценивает, насколько человек использует юмор для совладания со стрессом: сохраняет ли чувство юмора в трудностях, находит ли смешное в проблемах и прибегает ли к шуткам в напряжённых ситуациях. Адаптация Артемьевой изучалась на студентах; результат описывает выраженность такого способа совладания, а не диагноз.',
  categoryIds: ['regulation-coping'],
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 4,
  scales: [
    { key: 'total', label: 'Совладание с помощью юмора', items: [1, 2, 3, 4, 5, 6, 7], reverseItems, aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: минимальный итог при ответах против ключа',
    answers: { '1': 4, '2': 1, '3': 1, '4': 4, '5': 1, '6': 1, '7': 1 },
    expected: { total: 7 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'chs-artemyeva-2011-reverse-1-4-v1',
};
