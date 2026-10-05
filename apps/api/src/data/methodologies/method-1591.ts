import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const responseOptions = [
  { value: '1', label: 'Абсолютно не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Частично не согласен' },
  { value: '4', label: 'Нейтрален' },
  { value: '5', label: 'Частично согласен' },
  { value: '6', label: 'Согласен' },
  { value: '7', label: 'Абсолютно согласен' },
];

const itemTexts = [
  'Часто данные о безопасности вакцин сфабрикованы.',
  'Скрывается факт, что вакцинация детей вредит здоровью.',
  'Фармацевтические компании скрывают информацию об опасности вакцин.',
  'Нас обманывают насчет эффективности вакцин.',
  'Эффективность вакцин часто преувеличена.',
  'Нас обманывают, говоря, что вакцины безопасны.',
  'Фармацевтические компании, врачи и правительство скрывают вероятность развития аутизма в результате вакцинации.',
];

const questions: SeedSection['questions'] = itemTexts.map((text, index) => ({
  code: `test_1608_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: responseOptions,
}));

export const instrument: SeedSection = {
  code: 'test_1608',
  title: 'Склонность верить в теории заговора относительно вакцинации (СКОВ; VCBS)',
  description: 'Одномерная шкала выраженности конспирологических представлений о вакцинации: убеждений о сокрытии или искажении данных о безопасности и эффективности вакцин, вреде вакцинации детей и связи вакцинации с аутизмом. Русская адаптация предназначена для взрослых респондентов; опубликованная российская валидизация проводилась преимущественно на студентах вузов, поэтому перенос на другие группы требует осторожности.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    {
      key: 'vaccineConspiracyBeliefs',
      label: 'Конспирологические представления о вакцинации (СКОВ)',
      items: Array.from({ length: 7 }, (_, index) => index + 1),
      reverseItems: [],
      aggregation: 'mean',
    },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная сверка: ответы 1–7 по порядку дают среднее 4',
    answers: { '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7 },
    expected: { vaccineConspiracyBeliefs: 4 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'vcbs-shapiro-2016-uglнова-2021-7item-7point-mean-v1',
};
