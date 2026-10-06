import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Абсолютно не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Согласен' },
  { value: '4', label: 'Полностью согласен' },
];

const items = [
  'Я вполне доволен(а) тем, как складывается моя карьера.',
  'Мне кажется, что я пока еще не сумел(а) достичь профессионального успеха.',
  'В настоящее время моя профессиональная жизнь близка к той, о которой я мечтал(а).',
  'В целом я удовлетворен(а) своими достижениями в профессии.',
  'Если бы представилась такая возможность, я бы совершенно по-другому построил(а) свою профессиональную карьеру.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2482_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

const instrument: SeedSection = {
  code: 'test_2482',
  title: 'Шкала удовлетворенности карьерой (К. В. Карпинский, Т. В. Гижук)',
  description: 'Одномерная шкала оценивает субъективную удовлетворенность целостным профессиональным путем: переживание карьерных достижений и их соответствия личным стремлениям. Пять утверждений охватывают общую оценку хода карьеры, профессионального успеха, близости профессиональной жизни к желаемой и удовлетворенности достижениями. Разработана для работающих взрослых; авторская апробация проводилась на занятых респондентах со стажем не менее шести месяцев. Может помочь автору опроса измерить субъективный карьерный успех отдельно от внешних показателей вроде должности и оплаты.',
  categoryIds: ['work'],
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 4,
  scales: [
    { key: 'career_satisfaction', label: 'Удовлетворенность карьерой', items: [1, 2, 3, 4, 5], reverseItems: [2, 5], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручной контроль: ответы 4, 1, 3, 4, 2 дают 18 после инверсии пунктов 2 и 5',
    answers: { '1': 4, '2': 1, '3': 3, '4': 4, '5': 2 },
    expected: { career_satisfaction: 18 },
  },
  {
    title: 'Минимум удовлетворенности: согласие с негативными и несогласие с позитивными утверждениями',
    answers: { '1': 1, '2': 4, '3': 1, '4': 1, '5': 4 },
    expected: { career_satisfaction: 5 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['work'],
  scoringConfig,
  validationCases,
  formulaVersion: 'karpinski-gizhuk-career-satisfaction-2016-sum-4point-v1',
};

