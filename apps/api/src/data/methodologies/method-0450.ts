import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '4', label: 'Очень трудно' },
  { value: '3', label: 'Трудно' },
  { value: '2', label: 'Легко' },
  { value: '1', label: 'Очень легко' },
];

const items = [
  'Заводить друзей',
  'Есть продукты, которые ты любишь',
  'Учиться в школе',
  'Жить в этом климате',
  'Пользоваться транспортом',
  'Выполнять требования учителей',
  'Добиваться понимания от других людей',
  'Делать покупки',
  'Понимать шутки и юмор',
  'Соблюдать нормы своей религии',
  'Общаться с одноклассниками',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_486_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_486',
  title: 'Краткая шкала социокультурной дезадаптации',
  description: 'Шкала оценивает субъективные трудности детей школьного возраста, переехавших в новую страну, в повседневной социокультурной адаптации. Она охватывает общение и отношения со сверстниками, учебу и взаимодействие с учителями, бытовую самостоятельность, климат, питание, юмор и соблюдение религиозных норм; предназначена для школьников-мигрантов от 11 лет в русскоязычной версии 2022 года.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 4,
  scales: [
    { key: 'sociocultural_maladjustment', label: 'Социокультурная дезадаптация', items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: все ситуации очень легкие дают минимальную сумму',
    answers: { '1': 1, '2': 1, '3': 1, '4': 1, '5': 1, '6': 1, '7': 1, '8': 1, '9': 1, '10': 1, '11': 1 },
    expected: { sociocultural_maladjustment: 11 },
  },
  {
    title: 'Ручная проверка: все ситуации очень трудные дают максимальную сумму',
    answers: { '1': 4, '2': 4, '3': 4, '4': 4, '5': 4, '6': 4, '7': 4, '8': 4, '9': 4, '10': 4, '11': 4 },
    expected: { sociocultural_maladjustment: 44 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'khukhlaev-chibisova-tkachenko-kssd-2022-11-item-sum-4-to-1-v1',
};
