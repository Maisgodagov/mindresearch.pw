import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const responseOptions = [
  { value: '1', label: 'Совершенно не беспокоюсь' },
  { value: '2', label: 'Немного беспокоюсь' },
  { value: '3', label: 'Беспокоюсь' },
  { value: '4', label: 'Очень беспокоюсь' },
  { value: '5', label: 'Чрезвычайно беспокоюсь' },
];

const items = [
  'Нервная дрожь',
  'Буду выглядеть глупым/ой',
  'Люди будут смеяться',
  'Покраснею',
  'Люди проигнорируют меня',
  'Люди будут глазеть на меня',
  'Буду нервничать и дергаться',
  'Проблемы с качеством голоса',
  'Покажусь некомпетентным',
  'Буду говорить несвязно',
  'Потеряю контроль',
  'Не справлюсь должным образом',
  'Буду напряжен(а)',
  'Покажусь странным(ой)',
  'Люди буду глумиться',
  'Покажусь уродливым(ой)',
  'Покажусь слабым(ой)',
  'Люди отвергнут меня',
  'Вспотею',
  'Пустота и туман в голове',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1253_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: responseOptions,
}));

export const instrument: SeedSection = {
  code: 'test_1253',
  title: 'Опросник социальной тревожности (ASC), русскоязычная версия',
  description: 'Опросник оценивает субъективное беспокойство о предполагаемых негативных исходах сложных социальных ситуаций. Он охватывает страх негативной оценки и отвержения, заметных признаков тревоги, потери контроля и социальной неловкости; русскоязычная версия подходит для описательной оценки у взрослых и неклинических выборок, а клинические нормы русской адаптации не установлены.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'total', label: 'Общий балл социальной тревожности', items: Array.from({ length: 20 }, (_, i) => i + 1), reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы «Совершенно не беспокоюсь»: вручную проверенная сумма 20 × 1',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { total: 20 },
  },
  {
    title: 'Все ответы «Чрезвычайно беспокоюсь»: вручную проверенная сумма 20 × 5',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 5])),
    expected: { total: 100 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'asc-telch-2004-ru-hse-spb-v1',
};
