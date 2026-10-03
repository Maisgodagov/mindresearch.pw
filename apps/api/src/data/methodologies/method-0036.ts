import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const answers = [
  'Совсем нет',
  'Немного',
  'Умеренно',
  'Сильно',
  'Очень сильно',
].map((label, index) => ({ value: String(index), label }));

const items = [
  '…неконтролируемые вспышки гнева',
  '…ощущение, что трудно начать что-то делать',
  '…чувство чрезмерного беспокойства',
  '…ощущение, что вы слишком эмоционально уязвимы',
  '…ощущение, что другие наблюдают или говорят о вас',
  '…чувство тревоги и взволнованности',
  '…ощущение тяжести в руках и ногах',
  '…ощущение нервозности, когда вы предоставлены сами себе',
  '…чувство одиночества, даже когда вы с кем-то находитесь',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_75_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: answers,
}));

export const instrument: SeedSection = {
  code: 'test_75',
  title: 'Симптоматический опросник SCL-K-9',
  description: "Краткая симптоматическая шкала оценивает выраженность общего психологического неблагополучия за последнюю неделю, включая эмоциональные и соматические жалобы. Результат предназначен для скрининговой оценки текущего состояния и не заменяет диагностику.",
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 4,
  scales: [
    {
      key: 'gsi',
      label: 'Общий показатель психопатологии',
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      reverseItems: [],
      aggregation: 'sum',
    },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы «Совсем нет» дают нулевой показатель',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 0])),
    expected: { gsi: 0 },
  },
  {
    title: 'Все ответы «Очень сильно» дают максимальную сумму 36',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 4])),
    expected: { gsi: 36 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'scl-k-9-zolotareva-2023-ru-v1',
};
