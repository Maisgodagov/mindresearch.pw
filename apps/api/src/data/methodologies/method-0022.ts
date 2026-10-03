import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const yesNo = [
  { value: '1', label: 'Да' },
  { value: '0', label: 'Нет' },
];

const items = [
  'Мне требовалось меньше времени на сон.',
  'Я стал менее застенчивым и «закомплексованным».',
  'Я много говорил.',
  'Я много шутил и каламбурил.',
  'Я легко отвлекался.',
  'У меня мысли перескакивали с одного на другое.',
  'Я раздражал и утомлял окружающих.',
  'Настроение у меня было приподнятым и оптимистичным.',
];

const weights = [4.72, 2.49, 1.95, 2.37, 2.61, 3.49, 2.06, 2.36];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_67_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: yesNo,
}));

export const instrument: SeedSection = {
  code: 'test_67',
  title: 'Шкала HCL-8',
  description: "Краткий скрининг выявляет в анамнезе периоды необычно повышенного или раздражительного настроения и другие проявления гипомании. Баллы служат поводом для дальнейшей оценки специалистом и сами по себе не устанавливают диагноз.",
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 1,
  scales: [
    { key: 'weighted', label: 'Взвешенная сумма', items: [1, 2, 3, 4, 5, 6, 7, 8], reverseItems: [], weights: Object.fromEntries(weights.map((weight, index) => [index + 1, weight])), aggregation: 'sum' },
    { key: 'simple', label: 'Простая сумма ответов «Да»', items: [1, 2, 3, 4, 5, 6, 7, 8], reverseItems: [], aggregation: 'sum' },
  ],
};

const allAnswers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Все ответы «Нет»', answers: allAnswers(0), expected: { weighted: 0, simple: 0 } },
  { title: 'Все ответы «Да»', answers: allAnswers(1), expected: { weighted: 22.05, simple: 8 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'hcl-8-ru-mosolov-2015-v1',
};
