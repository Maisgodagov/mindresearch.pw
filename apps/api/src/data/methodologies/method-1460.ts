import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const answers = [
  'Совершенно не верно',
  'Не верно',
  'Скорее не верно',
  'Нечто среднее',
  'Скорее верно',
  'Верно',
  'Совершенно верно',
].map((label, index) => ({ value: String(index + 1), label }));

const items = [
  'В моей будущей профессиональной деятельности меня ждёт много возможностей.',
  'Мне кажется, что в моём профессиональном будущем у меня будет много новых целей.',
  'Моя будущая профессиональная деятельность полна возможностей.',
  'Бо́льшая часть моей трудовой жизни у меня в будущем.',
  'Моё профессиональное будущее кажется мне бесконечным.',
  'В своей будущей профессиональной жизни я смогу сделать всё, что захочу.',
  'В своей профессиональной жизни у меня будет много времени, чтобы реализовать новые планы.',
  'Я чувствую, что моя профессиональная карьера подходит к концу.',
  'Возможности в моём профессиональном будущем ограничены.',
  'Чем старше я становлюсь, тем больше я начинаю понимать, что время в профессии ограничено.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1488_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: answers,
}));

export const instrument: SeedSection = {
  code: 'test_1488',
  title: 'Профессиональная временная перспектива будущего (OFTP)',
  description: 'Русскоязычная версия OFTP оценивает, как работающие люди воспринимают своё будущее в профессиональной жизни. Три аспекта — фокусирование на возможностях, оставшееся время и фокусирование на ограничениях — помогают автору опроса изучать, видит ли человек в своей карьере открытые возможности или временные и профессиональные ограничения.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    {
      key: 'focus_on_opportunities',
      label: 'Фокусирование на возможностях',
      items: [1, 2, 3],
      reverseItems: [],
      aggregation: 'mean',
    },
    {
      key: 'remaining_time',
      label: 'Оставшееся время',
      items: [5, 6, 7],
      reverseItems: [],
      aggregation: 'mean',
    },
    {
      key: 'focus_on_limitations',
      label: 'Фокусирование на ограничениях',
      items: [8, 9, 10],
      reverseItems: [],
      aggregation: 'mean',
    },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Равные ответы 1 на всех пунктах дают средний балл 1 по каждой шкале',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: {
      focus_on_opportunities: 1,
      remaining_time: 1,
      focus_on_limitations: 1,
    },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'oftp-bazarov-paramuzov-2019-10item-7point-means-v1',
};
