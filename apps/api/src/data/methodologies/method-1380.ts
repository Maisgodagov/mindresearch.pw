import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '2', label: 'В очень большой степени' },
  { value: '1', label: 'В большой степени' },
  { value: '0', label: 'Средняя' },
  { value: '-1', label: 'В небольшой степени' },
  { value: '-2', label: 'Совсем нет' },
];

const items = [
  'Потребность в стабильности',
  'Потребность в законе, порядке',
  'Потребность в предсказуемости событий',
  'Потребность в надежной работе со стабильным заработком',
  'Потребность быть любимым, желанным',
  'Потребность быть защищенным от опасностей и враждебного мира',
  'Потребность в защищенности от реальных чрезвычайных обстоятельств (война, общественные беспорядки)',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1408_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1408',
  title: 'Оценка удовлетворенности потребности в безопасности',
  description: 'Авторский опросник О. Ю. Зотовой оценивает субъективную удовлетворенность потребности в социально-психологической безопасности по семи аспектам: стабильность, закон и порядок, предсказуемость событий, надежность работы и дохода, близкие отношения, защищенность от опасностей и защищенность от чрезвычайных обстоятельств. Русский вариант предназначен для взрослых респондентов; опубликованная авторская выборка охватывала возраст 18–55 лет.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: -2,
  max: 2,
  scales: [
    { key: 'security_need_satisfaction', label: 'Удовлетворенность потребности в безопасности', items: [1, 2, 3, 4, 5, 6, 7], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы «Средняя»: нулевая суммарная оценка',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 0])),
    expected: { security_need_satisfaction: 0 },
  },
  {
    title: 'Все ответы «В очень большой степени»: верхняя граница +14',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 2])),
    expected: { security_need_satisfaction: 14 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'zotova-security-need-satisfaction-2011-ru-v1',
};
