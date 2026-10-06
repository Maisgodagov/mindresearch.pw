import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Категорически не согласен' },
  { value: '2', label: 'Скорее не согласен' },
  { value: '3', label: 'Затрудняюсь ответить' },
  { value: '4', label: 'Скорее согласен' },
  { value: '5', label: 'Полностью согласен' },
];

const items = [
  'Я знаю, какие медицинские ресурсы доступны в интернете',
  'Я знаю, где найти полезные медицинские ресурсы в интернете',
  'Я знаю, как найти полезные медицинские ресурсы в интернете',
  'Я знаю, как использовать интернет, чтобы ответить на свои вопросы о здоровье',
  'Я знаю, как использовать медицинскую информацию, которую я нахожу в интернете, чтобы помочь себе',
  'У меня есть навыки, необходимые для оценки медицинских ресурсов, которые я нахожу в интернете',
  'Я могу отличить высококачественные медицинские ресурсы в интернете от некачественных',
  'Я чувствую уверенность в использовании информации из интернета для принятия медицинских решений',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2241_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2241',
  title: 'Шкала онлайн-грамотности в вопросах информации о здоровье (eHEALS), русскоязычная версия',
  description: 'Русскоязычная адаптация eHEALS оценивает воспринимаемые знания, уверенность и навыки поиска, оценки и применения медицинской информации из интернета. Восемь пунктов охватывают доступные онлайн-ресурсы, поиск полезной информации, её оценку и использование при принятии решений о здоровье. Подходит для опросов русскоязычных респондентов от 12 лет; показатель отражает самооценку онлайн-грамотности, а не объективную проверку навыков.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'onlineHealthLiteracy', label: 'Онлайн-грамотность в вопросах информации о здоровье', items: [1, 2, 3, 4, 5, 6, 7, 8], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  { title: 'Ручная проверка: все ответы «категорически не согласен»', answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])), expected: { onlineHealthLiteracy: 8 } },
  { title: 'Ручная проверка: все ответы «полностью согласен»', answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 5])), expected: { onlineHealthLiteracy: 40 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['clinical-somatic'],
  scoringConfig,
  validationCases,
  formulaVersion: 'eheals-ru-maksimenko-zolotareva-2024-sum-8-v1',
};
