import type { SeedSection } from '../types.js';
import type { ConfigurableScoring, ValidationCase } from '../scoring/configurable.js';

const items = [
  'Вы думали когда-нибудь о том, чтобы уменьшить количество употребляемого алкоголя (наркотических веществ)?',
  'Испытываете ли Вы раздражение, когда люди критикуют Вас за пьянство (употребление наркотиков)?',
  'Вы испытывали когда-нибудь чувство вины по поводу чрезмерного употребления алкоголя (наркотиков)?',
  'Вы когда-нибудь употребляли алкоголь (наркотические вещества) для поднятия тонуса утром или с похмелья?',
];

const answers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));

export const cageAidRuInstrument: SeedSection = {
  code: 'test_60',
  title: 'Опросник CAGE-AID (русский перевод А. Ю. Егорова)',
  description: 'Русская четырёхпунктовая форма CAGE-AID, адаптирующая вопросы CAGE для алкоголя и наркотических веществ. Скрининговый опросник не устанавливает диагноз.',
  questions: items.map((text, index) => ({
    code: `test_60_${index + 1}`,
    text,
    type: 'single',
    required: true,
    options: [{ value: '1', label: 'Да' }, { value: '0', label: 'Нет' }],
  })),
};

export const cageAidRuScoring: ConfigurableScoring = {
  min: 0,
  max: 1,
  scales: [{ key: 'total', label: 'Общее число положительных ответов', items: [1, 2, 3, 4], reverseItems: [], aggregation: 'sum' }],
};

export const cageAidRuValidationCases: ValidationCase[] = [
  { title: 'Все ответы — нет', answers: answers(0), expected: { total: 0 } },
  { title: 'Все ответы — да', answers: answers(1), expected: { total: 4 } },
  { title: 'Два положительных ответа', answers: { '1': 1, '2': 0, '3': 1, '4': 0 }, expected: { total: 2 } },
];
