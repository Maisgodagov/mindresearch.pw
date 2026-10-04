import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const responseOptions = Array.from({ length: 10 }, (_, index) => ({
  value: String(index + 1),
  label: String(index + 1),
}));

const items = [
  'Я чувствую, что искренне увлечен/а этим',
  'Я готов/а работать над собой ради достижения этого',
  'Когда я представляю себе результат, это вдохновляет меня',
  'Я готов/а проявлять настойчивость для достижения этого',
  'Я готов/а к трудностям, которые могут возникнуть на моем пути',
  'Я думаю, что эти действия должны привести к чему-то хорошему',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_606_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: responseOptions,
}));

export const instrument: SeedSection = {
  code: 'test_606',
  title: 'Методика диагностики эмоционально-волевой вовлеченности в цель',
  description: 'Оценивает эмоциональную значимость и волевую поддержку конкретной личной цели: увлеченность и вдохновение, готовность работать над собой, проявлять настойчивость и преодолевать трудности. Подходит для исследований целей и целевой мотивации; показатель рассчитывается отдельно для каждой цели и, при оценке нескольких целей, как средний индивидуальный индекс.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 10,
  scales: [
    { key: 'goal_engagement', label: 'Эмоционально-волевая вовлеченность в цель', items: [1, 2, 3, 4, 5, 6], reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  { title: 'Средний балл по одной цели', answers: { '1': 8, '2': 7, '3': 9, '4': 6, '5': 8, '6': 10 }, expected: { goal_engagement: 8 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'dimidov-rumyantseva-goal-engagement-2025-v1',
};
