import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Никогда (ни разу)' },
  { value: '2', label: 'Редко' },
  { value: '3', label: 'Иногда' },
  { value: '4', label: 'Часто' },
  { value: '5', label: 'Всегда (все время)' },
];

const items = [
  'Вы думали, что в Вашем теле есть какие-то серьезные нарушения?',
  'Вы беспокоились о своем здоровье?',
  'Вам было трудно поверить врачу, когда он говорил Вам, что беспокоиться не о чем?',
  'Вы беспокоились о том, что у Вас может быть серьезное заболевание?',
  'Вас тревожили боли или дискомфорт в теле?',
  'Если Вам сообщали о чьей-то болезни, беспокоились ли Вы о том, что заболеете ею сами?',
  'Вы понимали, что Вас беспокоит множество различных симптомов?',
  'Вас беспокоили повторяющиеся мысли о возможном заболевании, от которых было трудно избавиться?',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_374_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_374',
  title: 'Индекс Уитли, WI-8 (русскоязычная адаптация)',
  description: 'Краткая шкала оценивает общую выраженность тревоги о здоровье: опасения серьезного заболевания, беспокойство о здоровье и телесных симптомах, недоверие к успокоительным заверениям врача и повторяющиеся мысли о болезни. Русскоязычная адаптация предназначена для оценки общей популяции; клинические выводы требуют отдельной профессиональной оценки.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'total', label: 'Общий показатель тревоги о здоровье', items: [1, 2, 3, 4, 5, 6, 7, 8], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: все ответы «Никогда» дают минимальную сумму',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { total: 8 },
  },
  {
    title: 'Ручная проверка: ответы 1–5 дают сумму 23',
    answers: { '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 1, '7': 2, '8': 5 },
    expected: { total: 23 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'whiteley-index-8-ru-zolotareva-2025-v1',
};
