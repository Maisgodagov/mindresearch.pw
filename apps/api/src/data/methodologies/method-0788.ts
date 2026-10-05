import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Совершенно не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Скорее не согласен' },
  { value: '4', label: 'Не знаю, нечто среднее' },
  { value: '5', label: 'Скорее согласен' },
  { value: '6', label: 'Согласен' },
  { value: '7', label: 'Полностью согласен' },
];

const items = [
  'Я думаю, что контролирую свои финансовые дела больше, чем другие люди.',
  'Я трачу большое количество времени в поисках выгодной сделки.',
  'Я постоянно переоцениваю все свои вложения.',
  'Деньги могут помочь в принятии вас другими людьми.',
  'Много денег – признак успеха.',
  'Вы получаете уважение других людей, когда у вас много денег.',
  'В общем-то, мне нравится рассказывать людям, насколько я обеспечен(а).',
  'Я использую деньги, чтобы убедить людей что-то для меня сделать.',
  'Я признаю, что покупаю вещи, чтобы произвести впечатление на других.',
  'Мысли о деньгах вызывают у меня беспокойство.',
  'Я очень сомневаюсь в принятии решений, касающихся денег.',
  'Я беспокоюсь о своих личных финансах и занимаю в отношении них оборонительную позицию.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_818_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_818',
  title: 'Новая шкала монетарного поведения (ШМП, NMBQ)',
  description: 'Русскоязычная адаптация для взрослых оценивает четыре аспекта отношения к деньгам: финансовую одержимость и контроль финансов, значимость денег для принятия и уважения, использование денег для влияния на людей и финансовую тревожность при принятии решений. Профиль субшкал помогает описать повседневные денежные установки и поведение.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'financial_obsession', label: 'Финансовая одержимость', items: [1, 2, 3], reverseItems: [], aggregation: 'mean' },
    { key: 'money_respect', label: 'Значимость денег для уважения в обществе', items: [4, 5, 6], reverseItems: [], aggregation: 'mean' },
    { key: 'money_influence', label: 'Использование денег как инструмента влияния на людей', items: [7, 8, 9], reverseItems: [], aggregation: 'mean' },
    { key: 'financial_anxiety', label: 'Финансовая тревожность', items: [10, 11, 12], reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: ответы 1, 2 и 3 в каждой последовательной триаде дают средние 2, 5 и 7',
    answers: { '1': 1, '2': 2, '3': 3, '4': 5, '5': 5, '6': 5, '7': 7, '8': 7, '9': 7, '10': 1, '11': 2, '12': 3 },
    expected: { financial_obsession: 2, money_respect: 5, money_influence: 7, financial_anxiety: 2 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'nmbq-ru-nestik-gagarina-2022-v1',
};

