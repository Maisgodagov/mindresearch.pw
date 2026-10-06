import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const responseOptions = [
  { value: '1', label: 'Никогда' },
  { value: '2', label: 'Редко' },
  { value: '3', label: 'Иногда' },
  { value: '4', label: 'Часто' },
  { value: '5', label: 'Всегда' },
];

const items = [
  'За последние 4 недели как часто вы чувствовали усталость без причины?',
  'За последние 4 недели как часто вы нервничали?',
  'За последние 4 недели как часто вы нервничали настолько, что ничего не могло вас успокоить?',
  'За последние 4 недели как часто вы ощущали безысходность?',
  'За последние 4 недели как часто вы были беспокойны или суетливы?',
  'За последние 4 недели как часто вы были беспокойны настолько, что не могли усидеть на месте?',
  'За последние 4 недели как часто вы чувствовали себя подавленным?',
  'За последние 4 недели как часто вы чувствовали себя подавленным настолько, что ничего не могло вас приободрить?',
  'За последние 4 недели как часто вы чувствовали, что всё даётся с трудом?',
  'За последние 4 недели как часто вы ощущали свою никчемность?',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2353_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: responseOptions,
}));

const instrument: SeedSection = {
  code: 'test_2353',
  title: 'Шкала психологического дистресса Кесслера, K10',
  description: 'Русскоязычная версия K10 оценивает выраженность неспецифического психологического дистресса за последние четыре недели по эмоциональным и связанным с тревогой переживаниям. Краткий суммарный показатель подходит исследователям и специалистам для скрининговой оценки русскоязычных взрослых; он не является самостоятельным диагнозом.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'total', label: 'Общий показатель психологического дистресса', items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы «Никогда»: сумма минимальных баллов 10',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { total: 10 },
  },
  {
    title: 'Все ответы «Всегда»: сумма максимальных баллов 50',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 5])),
    expected: { total: 50 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['clinical-general'],
  scoringConfig,
  validationCases,
  formulaVersion: 'kessler-k10-ru-kislitsyn-2025-1to5-sum-v1',
};
