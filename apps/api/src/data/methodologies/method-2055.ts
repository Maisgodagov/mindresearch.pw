import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const responseOptions = [
  { value: '1', label: 'Не подходит совсем (1–3)' },
  { value: '2', label: 'Подходит в некоторой мере (4–6)' },
  { value: '3', label: 'Очень подходит (7–9)' },
];

const statements = [
  'Я чувствую себя полностью самим(ой) собой, когда я нахожусь со своим(ей) партнером(шей)',
  'Я делюсь своими самыми тайными мыслями с моим(ей) партнером(шей)',
  'Я открываю самые сокровенные чувства своему(ей) партнеру(ше)',
  'Я открыто делюсь своими мыслями и чувствами о других людях со своим(ей) партнером(шей)',
  'Я избегаю обсуждать некоторые темы со своим(ей) партнером(шей)',
  'Я сознательно скрываю свое истинное мнение о некоторых вещах, чтобы не расстраивать своего(ю) партнера(шу)',
  'Когда время от времени я сообщаю недостоверную информацию о себе, я пытаюсь произвести впечатление на своего(ю) партнера(шу)',
  'Нет таких тем, которые были бы для меня запрещенными в общении с моим(ей) партнером(шей)',
  'Я не боюсь открывать самые глубокие части своей личности, общаясь с моим(ей) партнером(шей)',
  'Я знаю недостаточно о некоторых вещах в жизни моего(й) партнера(ши)',
];

const questions: SeedSection['questions'] = statements.map((text, index) => ({
  code: `test_2069_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: responseOptions,
}));

export const instrument: SeedSection = {
  code: 'test_2069',
  title: 'Шкала аутентичности в отношениях (ШАО), краткая версия для романтических партнеров',
  description: 'Краткая шкала оценивает аутентичность в романтических отношениях по двум аспектам: принятию рисков интимности (открытость, уязвимость и самораскрытие) и неприемлемости лжи и обмана. Подходит для взрослых, оценивающих отношения со своим романтическим партнером; российская психометрическая проверка подтвердила структуру и надежность именно для контекста партнеров.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 9,
  scales: [
    { key: 'intimacy_risk_acceptance', label: 'Принятие рисков интимности', items: [1, 2, 3, 4, 8, 9], reverseItems: [], aggregation: 'sum', itemScores: Object.fromEntries([1, 2, 3, 4, 8, 9].map(item => [item, { '1': 1, '2': 4, '3': 7 }])) },
    { key: 'unacceptability_of_deceit', label: 'Неприемлемость лжи и обмана', items: [5, 6, 7, 10], reverseItems: [5, 6, 7, 10], aggregation: 'sum', itemScores: Object.fromEntries([5, 6, 7, 10].map(item => [item, { '1': 9, '2': 6, '3': 3 }])) },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: крайние ответы 1; обратные пункты преобразуются как 10 − N',
    answers: Object.fromEntries(Array.from({ length: 10 }, (_, index) => [String(index + 1), '1'])),
    expected: { intimacy_risk_acceptance: 6, unacceptability_of_deceit: 36 },
  },
  {
    title: 'Ручная проверка: крайние ответы 3; обратные пункты преобразуются как 10 − N',
    answers: Object.fromEntries(Array.from({ length: 10 }, (_, index) => [String(index + 1), '3'])),
    expected: { intimacy_risk_acceptance: 18, unacceptability_of_deceit: 4 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'airs-short-russian-borisova-nartova-bochaver-2024-v1',
};
