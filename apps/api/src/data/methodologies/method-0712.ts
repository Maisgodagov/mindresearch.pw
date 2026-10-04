import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const responseLabels = [
  'Никогда',
  'Изредка',
  'Иногда',
  'Довольно часто',
  'Почти всегда',
].map((label, index) => ({ value: String(index), label }));

const itemTexts = [
  'Я стараюсь делать так, чтобы другим было со мной комфортно.',
  'Я могу выразить цель простыми словами и указать, что люди должны делать.',
  'Я способствую тому, что другие начинают думать по-новому.',
  'Я помогаю другим развиваться.',
  'Я говорю другим, что нужно сделать, чтобы они были вознаграждены за свою работу.',
  'Я удовлетворён, когда люди делают всё в соответствии с согласованными стандартами.',
  'Я стремлюсь к тому, чтобы другие продолжали работать так же, как всегда.',
  'Люди верят в меня.',
  'Я показываю людям привлекательность результата, который мы должны достичь.',
  'Я помогаю другим увидеть новые способы решения задач.',
  'Я говорю людям, что думаю об их работе.',
  'Я стремлюсь к тому, чтобы люди получили признание или награды, когда достигают своих целей.',
  'Пока всё работает, я не пытаюсь что-то менять.',
  'Я не вмешиваюсь в то, как работают другие люди.',
  'Люди гордятся тем, что работают со мной.',
  'Я помогаю другим найти смысл в их работе.',
  'Я помогаю другим осмыслить идеи, о которых они ранее не спрашивали.',
  'Я проявляю личное внимание к тем, кого другие отвергают.',
  'Я обращаю внимание на то, что другие могут получить за свои достижения.',
  'Я показываю другим стандарты, которые они должны знать, чтобы выполнять свою работу.',
  'Я не прошу достигать большего, чем абсолютно необходимо.',
];

const questions: SeedSection['questions'] = itemTexts.map((text, index) => ({
  code: `test_743_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: responseLabels,
}));

export const instrument: SeedSection = {
  code: 'test_743',
  title: 'Многофакторный опросник лидерства, краткая форма MLQ-6S',
  description: 'Краткая форма MLQ-6S оценивает частоту лидерского поведения по семи факторам: идеализированное влияние, вдохновляющая мотивация, интеллектуальная стимуляция, индивидуальный подход, условное вознаграждение, управление по отклонениям и попустительское лидерство. Она помогает автору опроса описывать профиль поведения руководителя и использовать его для учебной обратной связи и тренинговой самооценки взрослых руководителей; это отдельная краткая форма, не полная коммерческая MLQ-5X.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 4,
  scales: [
    { key: 'idealized_influence', label: 'Идеализированное влияние', items: [1, 8, 15], reverseItems: [], aggregation: 'sum' },
    { key: 'inspirational_motivation', label: 'Вдохновляющая мотивация', items: [2, 9, 16], reverseItems: [], aggregation: 'sum' },
    { key: 'intellectual_stimulation', label: 'Интеллектуальная стимуляция', items: [3, 10, 17], reverseItems: [], aggregation: 'sum' },
    { key: 'individualized_consideration', label: 'Индивидуальный подход', items: [4, 11, 18], reverseItems: [], aggregation: 'sum' },
    { key: 'contingent_reward', label: 'Условное вознаграждение', items: [5, 12, 19], reverseItems: [], aggregation: 'sum' },
    { key: 'management_by_exception', label: 'Управление по отклонениям', items: [6, 13, 20], reverseItems: [], aggregation: 'sum' },
    { key: 'laissez_faire', label: 'Попустительское лидерство', items: [7, 14, 21], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная сверка: ответы 0–20 по порядку дают факторные суммы 23, 27, 18, 21, 24, 15, 18',
    answers: Object.fromEntries(Array.from({ length: 21 }, (_, index) => [String(index + 1), index % 5])),
    expected: {
      idealized_influence: 23,
      inspirational_motivation: 27,
      intellectual_stimulation: 18,
      individualized_consideration: 21,
      contingent_reward: 24,
      management_by_exception: 15,
      laissez_faire: 18,
    },
  },
  {
    title: 'Граничная сверка: все ответы равны нулю',
    answers: Object.fromEntries(Array.from({ length: 21 }, (_, index) => [String(index + 1), 0])),
    expected: {
      idealized_influence: 0,
      inspirational_motivation: 0,
      intellectual_stimulation: 0,
      individualized_consideration: 0,
      contingent_reward: 0,
      management_by_exception: 0,
      laissez_faire: 0,
    },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'bass-avolio-mlq-6s-russian-psytests-factor-sums-v1',
};
