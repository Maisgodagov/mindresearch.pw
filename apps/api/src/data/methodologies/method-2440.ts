import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Совершенно не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Скорее не согласен' },
  { value: '4', label: 'Трудно сказать' },
  { value: '5', label: 'Скорее согласен' },
  { value: '6', label: 'Согласен' },
  { value: '7', label: 'Совершенно согласен' },
];

const items = [
  'Я опасаюсь, что проблемы, с которыми я сейчас сталкиваюсь, останутся еще надолго.',
  'Меня ужасает мысль о том, что я могу когда-то столкнуться с жизненными кризисами и трудностями.',
  'Я боюсь того, что в будущем моя жизнь изменится к худшему.',
  'Я опасаюсь, что изменения политической и экономической ситуации поставят под угрозу мое будущее.',
  'Меня беспокоит мысль о том, что в будущем я не смогу реализовать свои цели.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2458_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2458',
  title: 'Шкала темного будущего (Dark Future Scale), русская адаптация Т. А. Нестика',
  description: 'Краткая скрининговая шкала измеряет тревогу по поводу будущего: опасения длительности текущих проблем, будущих кризисов, ухудшения личной жизни, политических и экономических угроз и невозможности достичь целей. Русская адаптация Т. А. Нестика (2018), пять пунктов; предназначена для описания выраженности тревожных ожиданий у взрослых респондентов, а не для постановки диагноза.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  // The Russian form labels choices 1–7; the source scoring uses 0–6.
  min: 1,
  max: 7,
  scales: [
    {
      key: 'future_anxiety',
      label: 'Тревога по поводу будущего',
      items: [1, 2, 3, 4, 5],
      reverseItems: [],
      itemScores: {
        1: { '1': 0, '2': 1, '3': 2, '4': 3, '5': 4, '6': 5, '7': 6 },
        2: { '1': 0, '2': 1, '3': 2, '4': 3, '5': 4, '6': 5, '7': 6 },
        3: { '1': 0, '2': 1, '3': 2, '4': 3, '5': 4, '6': 5, '7': 6 },
        4: { '1': 0, '2': 1, '3': 2, '4': 3, '5': 4, '6': 5, '7': 6 },
        5: { '1': 0, '2': 1, '3': 2, '4': 3, '5': 4, '6': 5, '7': 6 },
      },
      aggregation: 'sum',
    },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: пять ответов «Совершенно не согласен» дают 0 исходных баллов',
    answers: { '1': 1, '2': 1, '3': 1, '4': 1, '5': 1 },
    expected: { future_anxiety: 0 },
  },
  {
    title: 'Ручная проверка: пять ответов «Совершенно согласен» дают 30 исходных баллов',
    answers: { '1': 7, '2': 7, '3': 7, '4': 7, '5': 7 },
    expected: { future_anxiety: 30 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['mood-anxiety'],
  scoringConfig,
  validationCases,
  formulaVersion: 'dark-future-scale-ru-nestik-2018-recode-0-6-v1',
};
