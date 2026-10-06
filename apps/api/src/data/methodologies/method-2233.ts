import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Совершенно не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Скорее не согласен' },
  { value: '4', label: 'Не уверен' },
  { value: '5', label: 'Скорее согласен' },
  { value: '6', label: 'Согласен' },
  { value: '7', label: 'Совершенно согласен' },
];

const prompts = [
  'Одни группы людей лучше, чем другие.',
  'Одни группы людей должны иметь больше возможностей в жизни, чем другие.',
  'Одни группы не должны доминировать над другими.',
  'Чтобы преуспеть в жизни, иногда необходимо игнорировать интересы других групп.',
  'Хорошо, когда существует равенство между разными группами людей.',
  'Если бы некоторые группы людей «знали свое место», в обществе было бы меньше проблем.',
  'Если мы будем относиться к разным группам людей как к равным, в нашем обществе станет меньше проблем.',
  'Группы с низким статусом должны «знать свое место».',
  'Равенство между группами идет на благо обществу.',
  'Мы должны делать все, что в наших силах, чтобы разные группы имели равные условия жизни.',
];

const instrument: SeedSection = {
  code: 'test_2251',
  title: 'Шкала ориентации на социальное доминирование (короткая русскоязычная версия)',
  description: 'Короткая русскоязычная версия измеряет одобрение групповой иерархии и неравенства между социальными группами. Она охватывает два связанных аспекта: доминирование одних групп над другими и антиэгалитаризм (неприятие равенства). Предназначена для исследовательских опросов среди взрослых; конкретная межгрупповая область зависит от формулировки контекста в исследовании.',
  questions: prompts.map((text, index) => ({ code: `test_2251_${index + 1}`, text, type: 'single', required: true, options })),
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'dominance', label: 'Доминирование', items: [1, 2, 4, 6, 8], reverseItems: [], aggregation: 'mean' },
    { key: 'anti_egalitarianism', label: 'Антиэгалитаризм', items: [3, 5, 7, 9, 10], reverseItems: [3, 5, 7, 9, 10], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Проверка ключа: прямые пункты 7, обратные пункты 1',
    answers: Object.fromEntries(Array.from({ length: 10 }, (_, i) => [String(i + 1), i === 2 || i === 4 || i === 6 || i === 8 || i === 9 ? '1' : '7'])),
    expected: { dominance: 7, anti_egalitarianism: 7 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['social-attitude'],
  scoringConfig,
  validationCases,
  formulaVersion: 'gulevich-agadullina-khukhlaev-sdo-short-general-v1',
};
