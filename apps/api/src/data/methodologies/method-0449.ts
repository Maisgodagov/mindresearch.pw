import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const responseOptions = [
  { value: '1', label: 'Очень сложно' },
  { value: '2', label: 'Сложно' },
  { value: '3', label: 'Немного сложно' },
  { value: '4', label: 'Средне' },
  { value: '5', label: 'Относительно легко' },
  { value: '6', label: 'Легко' },
  { value: '7', label: 'Очень легко' },
];

const items = [
  'Климату (температуре, количеству осадков, влажности).',
  'Природной среде (растениям и животным, загрязнению окружающей среды, пейзажам).',
  'Социальной среде (размеру сообщества, темпу жизни, шуму).',
  'Образу жизни (гигиене, особенностям сна, ощущению безопасности).',
  'Удобствам (передвижению на местности, использованию общественного транспорта, совершению покупок).',
  'Еде и приёмам пищи (какую еду едят, как принимают пищу, времени принятия пищи).',
  'Семейной жизни (насколько близки члены семьи, сколько времени семья проводит вместе).',
  'Социальным нормам (как вести себя на публике, стилю одежды, что люди считают смешным).',
  'Ценностям и убеждениям (что люди думают о религии и политике, что люди считают правильным или неправильным).',
  'Людям (насколько дружелюбны люди, насколько люди напряжены или расслаблены, как относятся к иностранцам).',
  'Друзьям (как заводить друзей, количество социальных взаимодействий, что люди делают, чтобы развлечься и расслабиться).',
  'Языку (изучению языка, пониманию людей, пониманию вас другими людьми).',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_485_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: responseOptions,
}));

const instrument: SeedSection = {
  code: 'test_485',
  title: 'Краткая шкала социокультурной адаптации (BSAS), русскоязычная версия',
  description: 'BSAS оценивает, насколько легко человеку адаптироваться к повседневным социальным и культурным условиям жизни в новой стране. Шкала охватывает климат и природную среду, быт и практические задачи, питание, семейную жизнь, социальные нормы, ценности, взаимодействие с людьми и язык. Подходит для изучения опыта мигрантов и других людей, живущих в новой культурной среде; регистрация использует русскоязычную версию Ооки и Вачкова (2022).',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'socioculturalAdaptation', label: 'Социокультурная адаптация', items: Array.from({ length: 12 }, (_, i) => i + 1), reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы «Очень сложно»: минимальная сумма',
    answers: Object.fromEntries(Array.from({ length: 12 }, (_, i) => [String(i + 1), 1])),
    expected: { socioculturalAdaptation: 12 },
  },
  {
    title: 'Все ответы «Очень легко»: максимальная сумма',
    answers: Object.fromEntries(Array.from({ length: 12 }, (_, i) => [String(i + 1), 7])),
    expected: { socioculturalAdaptation: 84 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'demes-geeraert-bsas-ohki-vachkov-2022-12item-sum-7point-v1',
};
