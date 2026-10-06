import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = Array.from({ length: 11 }, (_, value) => ({
  value: String(value),
  label: `${value * 10}%${value === 0 ? ' — могу только догадываться' : value === 10 ? ' — полная уверенность' : ''}`,
}));

const items = [
  'Насколько вы уверены в том, что сможете предсказать, как он(она) будут себя вести в той или иной ситуации?',
  'Насколько вы уверены в своей оценке того, насколько вы ему(ей) симпатичны?',
  'Насколько точно вы сможете определить, что для него(нее) действительно важно в жизни, а что — нет?',
  'Насколько точно вы можете спрогнозировать его(ее) мнение по тому или иному вопросу?',
  'Насколько точно вы можете предвидеть его(ее) эмоциональную реакцию или чувства?',
  'Насколько хорошо вы чувствуете и понимаете то, как он(она) относится к себе?',
  'Насколько хорошо вы его/ее знаете?',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2477_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2477',
  title: 'Шкала уверенности в проактивной атрибуции (CL7)',
  description: 'Одномерная шкала оценивает субъективную уверенность человека в способности предсказывать поведение, мнения, эмоции и самоотношение собеседника, а также понимать, насколько он ему симпатичен. Русская адаптация CL7 подходит для исследований межличностного общения со взрослыми; результат отражает уверенность в социальной перцепции, а не фактическую точность понимания другого.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 10,
  scales: [{ key: 'total', label: 'Уверенность в проактивной атрибуции', items: [1, 2, 3, 4, 5, 6, 7], reverseItems: [], aggregation: 'mean' }],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Вручную проверено: ответы 0, 1, 2, 3, 4, 5, 6 дают среднее 3',
    answers: { '1': 0, '2': 1, '3': 2, '4': 3, '5': 4, '6': 5, '7': 6 },
    expected: { total: 3 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['social-functioning'],
  scoringConfig,
  validationCases,
  formulaVersion: 'clatterbuck-attributional-confidence-scale-cl7-ru-2025-mean-0-10-v1',
};
