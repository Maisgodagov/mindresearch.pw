import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const responseOptions = [
  { value: '1', label: 'Абсолютно неверно' },
  { value: '2', label: 'Едва ли это верно' },
  { value: '3', label: 'Скорее всего верно' },
  { value: '4', label: 'Совершенно верно' },
];

const items = [
  'Если я как следует постараюсь, то я всегда найду решение даже сложным проблемам.',
  'Если мне что-либо мешает, то я всё же нахожу пути достижения своей цели.',
  'Мне довольно просто удается достичь своих целей.',
  'В неожиданных ситуациях я всегда знаю, как я должен себя вести.',
  'При непредвиденно возникающих трудностях я верю, что смогу с ними справиться.',
  'Если я приложу достаточно усилий, то смогу справиться с большинством проблем.',
  'Я готов к любым трудностям, поскольку полагаюсь на собственные способности.',
  'Если передо мной встает какая-либо проблема, то я обычно нахожу несколько вариантов её решения.',
  'Я могу что-либо придумать даже в безвыходных на первый взгляд ситуациях.',
  'Я обычно способен держать ситуацию под контролем.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2237_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: responseOptions,
}));

export const instrument: SeedSection = {
  code: 'test_2237',
  title: 'Шкала общей самоэффективности (GSE), русская адаптация',
  description: 'Методика измеряет обобщённую уверенность человека в способности справляться с трудностями и достигать целей в разных жизненных ситуациях. Десять утверждений охватывают настойчивость, поиск решений, поведение в неожиданных обстоятельствах и ощущение контроля. Русская адаптация В. Г. Ромека подходит для исследовательских опросов взрослых респондентов; она даёт единый показатель общей самоэффективности.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 4,
  scales: [
    { key: 'generalSelfEfficacy', label: 'Общая самоэффективность', items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: ответы 1–4 по кругу; сумма десяти оценок равна 25',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), (index % 4) + 1])),
    expected: { generalSelfEfficacy: 25 },
  },
];

export const methodology: MethodologyRegistration = {
  categoryIds: ['self-efficacy'],
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'gse-schwarzer-jerusalem-romek-1996-russian-v1',
};
