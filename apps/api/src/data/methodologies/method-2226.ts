import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'никогда' },
  { value: '2', label: 'редко' },
  { value: '3', label: 'иногда' },
  { value: '4', label: 'часто' },
  { value: '5', label: 'всегда' },
];

const items = [
  'Как часто вы ищете медицинскую информацию в Интернете?',
  'Как часто вы пользуетесь медицинскими приложениями?',
  'Сталкиваясь с проблемами со здоровьем, вы активно ищете информацию, связанную со здоровьем?',
  'Всегда ли вы обращаете внимание на информацию, связанную со здоровьем, в Интернете?',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2242_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

const instrument: SeedSection = {
  code: 'test_2242',
  title: 'Шкала онлайн-поиска информации о здоровье (OHISS)',
  description: 'Однофакторная шкала оценивает частоту поиска информации о здоровье в Интернете и использования медицинских приложений, в том числе при проблемах со здоровьем и при встрече с медицинской информацией онлайн. Русскоязычная адаптация предназначена для русскоязычных респондентов; показатель помогает авторам исследований описывать интенсивность онлайн-поиска информации о здоровье.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [{ key: 'onlineHealthSeeking', label: 'Онлайн-поиск информации о здоровье', items: [1, 2, 3, 4], reverseItems: [], aggregation: 'sum' }],
};

const validationCases: ValidationCase[] = [
  { title: 'Все ответы — никогда', answers: { '1': 1, '2': 1, '3': 1, '4': 1 }, expected: { onlineHealthSeeking: 4 } },
  { title: 'Ручная проверка: 1 + 2 + 3 + 4', answers: { '1': 1, '2': 2, '3': 3, '4': 4 }, expected: { onlineHealthSeeking: 10 } },
  { title: 'Все ответы — всегда', answers: { '1': 5, '2': 5, '3': 5, '4': 5 }, expected: { onlineHealthSeeking: 20 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['clinical-somatic'],
  scoringConfig,
  validationCases,
  formulaVersion: 'ohiss-ru-maksimenko-zolotareva-2024-v1',
};
