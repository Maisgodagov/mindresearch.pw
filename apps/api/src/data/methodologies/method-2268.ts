import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const answers = [
  'Абсолютно не согласен(-на)',
  'Не согласен(-на)',
  'Скорее не согласен(-на)',
  'Скорее согласен(-на)',
  'Согласен(-на)',
  'Абсолютно согласен(-на)',
].map((label, index) => ({ value: String(index + 1), label }));

const items = [
  'После вакцинации я чувствую себя в безопасности',
  'Я полагаюсь на вакцины для защиты от серьезных инфекций',
  'После вакцинации у меня возникает ощущение защищенности',
  'Хотя большинство вакцин кажутся безопасными, от них могут возникать проблемы, о которых пока ничего не известно',
  'Вакцины могут служить причиной непредвиденных проблем у детей',
  'Меня беспокоят неизвестные долгосрочные последствия вакцинации',
  'Вакцины приносят больше денег фармакологическим компаниям, чем пользы обычным людям',
  'Власти пропагандируют вакцинацию ради извлечения финансовой выгоды, а не ради заботы о здоровье людей',
  'Программы вакцинации — это сплошное надувательство, большой обман',
  'Естественный иммунитет действует дольше, чем иммунитет, полученный с помощью вакцинации',
  'Самая лучшая защита — естественный контакт с вирусами и бактериями',
  'Взаимодействие с заболеваниями естественным путем безопаснее для иммунной системы, чем вакцинация',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2286_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: answers,
}));

export const instrument: SeedSection = {
  code: 'test_2286',
  title: 'Шкала оценки отношения к вакцинации (VAX)',
  description: 'Русскоязычная взрослая версия VAX оценивает общее отношение к вакцинации как медицинскому вмешательству: недоверие к ее защитному эффекту, тревогу о неизвестных долгосрочных последствиях, подозрения в доминировании коммерческих интересов и предпочтение естественного иммунитета. Подходит авторам опросов об общественном здоровье и установках к вакцинации разных видов; результат описывает выраженность негативных установок, а не медицинские противопоказания или индивидуальный диагноз.',
  categoryIds: ['clinical-health'],
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 6,
  scales: [
    { key: 'vax_total', label: 'Общее негативное отношение к вакцинации', items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], reverseItems: [1, 2, 3], aggregation: 'mean' },
    { key: 'vax_benefit_mistrust', label: 'Недоверие к основному эффекту вакцинации', items: [1, 2, 3], reverseItems: [1, 2, 3], aggregation: 'mean' },
    { key: 'vax_long_term_worry', label: 'Беспокойство по поводу неизвестных долгосрочных эффектов', items: [4, 5, 6], reverseItems: [], aggregation: 'mean' },
    { key: 'vax_commercial_concerns', label: 'Беспокойство о доминировании коммерческих интересов', items: [7, 8, 9], reverseItems: [], aggregation: 'mean' },
    { key: 'vax_natural_immunity', label: 'Предпочтение естественного иммунитета', items: [10, 11, 12], reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Минимальное согласие после реверса первых трёх пунктов',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { vax_total: 2.25, vax_benefit_mistrust: 6, vax_long_term_worry: 1, vax_commercial_concerns: 1, vax_natural_immunity: 1 },
  },
  {
    title: 'Максимальное согласие после реверса первых трёх пунктов',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 6])),
    expected: { vax_total: 4.75, vax_benefit_mistrust: 1, vax_long_term_worry: 6, vax_commercial_concerns: 6, vax_natural_immunity: 6 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'vax-syromiatnikova-mararitsa-artemenko-2025-ru-v1',
};
