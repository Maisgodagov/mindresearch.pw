import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const entitlementOptions = [
  'Абсолютно не согласен',
  'Не согласен',
  'Согласен',
  'Абсолютно согласен',
].map((label, index) => ({ value: String(index + 1), label }));

const conscientiousnessOptions = [
  'Никогда',
  'Редко',
  'Иногда',
  'Часто',
  'Всегда',
].map((label, index) => ({ value: String(index), label }));

const items = [
  'Я считаю, что это обязанность моих родителей – оплачивать мои ежедневные нужды.',
  'Мои родители должны давать мне карманные деньги.',
  'Я думаю, что родители должны оплатить мою покупку, даже если они не считают ее важной или необходимой.',
  'Я считаю, что мои родители должны платить за мое обучение в колледже/университете.',
  'Я заслуживаю получать все вещи, которые хочу.',
  'Я считаю, что мои родители должны помогать мне получать вещи, которые я хочу.',
  'Я помогаю родителям экономить средства за счет своей бережливости и скромности.',
  'Когда мои родители покупают мне вещи, я пытаюсь «отплатить», помогая им.',
  'Я осторожен, когда трачу деньги моих родителей.',
  'Я чувствую личную ответственность, когда трачу деньги моих родителей.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2540_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: index < 6 ? entitlementOptions : conscientiousnessOptions,
}));

export const instrument: SeedSection = {
  code: 'test_2540',
  title: 'Шкалы отношения подростков к деньгам',
  description: 'Десятипунктовая версия для подростков оценивает два аспекта отношения к деньгам: ожидание финансового обеспечения и поддержки со стороны родителей (финансовые права) и финансовую осознанность — бережливость, взаимность и личную ответственность при расходовании родительских денег. Полезна автору опроса для изучения экономической социализации подростков; русскоязычная апробация описана для старших подростков 13–17 лет.',
  categoryIds: ['social-attitude'],
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 4,
  scales: [
    { key: 'financial_entitlement', label: 'Финансовые права (ожидание обеспечения)', items: [1, 2, 3, 4, 5, 6], reverseItems: [], aggregation: 'mean', itemScores: { 1: { '1': 1, '2': 2, '3': 3, '4': 4 }, 2: { '1': 1, '2': 2, '3': 3, '4': 4 }, 3: { '1': 1, '2': 2, '3': 3, '4': 4 }, 4: { '1': 1, '2': 2, '3': 3, '4': 4 }, 5: { '1': 1, '2': 2, '3': 3, '4': 4 }, 6: { '1': 1, '2': 2, '3': 3, '4': 4 } } },
    { key: 'financial_conscientiousness', label: 'Финансовая осознанность', items: [7, 8, 9, 10], reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: минимальные ответы дают минимумы обеих шкал',
    answers: { '1': '1', '2': '1', '3': '1', '4': '1', '5': '1', '6': '1', '7': '0', '8': '0', '9': '0', '10': '0' },
    expected: { financial_entitlement: 1, financial_conscientiousness: 0 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'beutler-gudmunson-amas-ru-10-v1',
};
