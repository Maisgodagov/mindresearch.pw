import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Фактор совсем не влияет' },
  { value: '2', label: 'Фактор незначительно влияет' },
  { value: '3', label: 'Фактор иногда влияет' },
  { value: '4', label: 'Фактор часто влияет' },
  { value: '5', label: 'Фактор очень часто влияет' },
];

const items = [
  'Непонимание цели приема препаратов',
  'Необходимость постоянного приема препаратов',
  'Отсутствие видимого эффекта от лечения',
  'Неудобная схема применения препаратов',
  'Опасение развития побочных эффектов от приема препаратов',
  'Большой объем общего количества применяемых лекарственных препаратов',
  'Частая смена препаратов',
  'Возможность развития привыкания к препаратам',
  'Высокая цена препарата',
  'Сложность получения врачебной консультации',
  'Забывчивость',
  'Хорошее самочувствие',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2494_${index + 1}`,
  text: `Вам рекомендован регулярный прием лекарственных средств. Может ли фактор «${text}» привести к тому, что Вы откажетесь от назначенной терапии?`,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2494',
  title: 'Шкала факторов приверженности терапии',
  description: 'Опросник оценивает, насколько 12 модифицируемых факторов могут снижать приверженность лекарственной терапии: понимание лечения, его эффект и режим, побочные эффекты, нагрузку и стоимость препаратов, доступность консультации, забывчивость и самочувствие. Помогает клиницисту или исследователю увидеть индивидуальные барьеры и обсудить способы поддержки приверженности; опубликованная апробация проводилась у взрослых пациентов после острого коронарного синдрома.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [{
    key: 'adherence',
    label: 'Преобразованный общий балл приверженности терапии',
    items: Array.from({ length: 12 }, (_, index) => index + 1),
    reverseItems: [],
    aggregation: 'formula',
    formula: 'S = 60 - Ts, где Ts — сумма оценок всех 12 факторов; диапазон, следующий из пунктов и формулы, 0–48',
  }],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручной расчёт: все факторы оценены в 1, сумма Ts = 12',
    answers: Object.fromEntries(Array.from({ length: 12 }, (_, index) => [String(index + 1), 1])),
    expected: { adherence: 48 },
  },
  {
    title: 'Ручной расчёт по примеру статьи: десять оценок 1, затем 3 и 4; Ts = 17',
    answers: Object.fromEntries(Array.from({ length: 12 }, (_, index) => [String(index + 1), index === 10 ? 3 : index === 11 ? 4 : 1])),
    expected: { adherence: 43 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['clinical-health'],
  scoringConfig,
  validationCases,
  formulaVersion: 'isakov-kholkina-zinkevich-sfpt-2020-12items-60-minus-sum-v1',
};
