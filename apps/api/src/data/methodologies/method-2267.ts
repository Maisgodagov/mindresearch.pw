import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const responseOptions = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
];

const items = [
  'Насколько хорошо партнер соответствует вашим потребностям?',
  'В целом насколько вы удовлетворены вашими взаимоотношениями с партнером?',
  'Насколько близки ваши отношения к идеальным?',
  'Как часто вы жалеете о том, что вступили в эти отношения?',
  'В какой мере ваши взаимоотношения соответствуют тому, что вы от них ожидали?',
  'Насколько сильно вы любите своего партнера?',
  'Как много проблем в ваших отношениях?',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2285_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: responseOptions,
}));

export const instrument: SeedSection = {
  code: 'test_2285',
  title: 'Шкала оценки отношений (RAS), русскоязычная версия Сычёва',
  description: 'Однофакторная шкала оценивает общую удовлетворённость взрослых супружескими и другими близкими отношениями. Семь пунктов охватывают соответствие партнёра потребностям и ожиданиям, общую удовлетворённость, близость к идеалу, сожаление о вступлении в отношения, любовь и проблемы; итоговый средний балл помогает автору опроса сравнивать субъективное качество отношений без нормативной или диагностической интерпретации.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'relationshipSatisfaction', label: 'Удовлетворённость отношениями (среднее)', items: [1, 2, 3, 4, 5, 6, 7], reverseItems: [4, 7], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  { title: 'Все ответы максимальны; реверсивные пункты инвертируются', answers: { '1': 5, '2': 5, '3': 5, '4': 5, '5': 5, '6': 5, '7': 5 }, expected: { relationshipSatisfaction: 23 / 7 } },
];

export const methodology: MethodologyRegistration = {
  categoryIds: ['close-dynamics'],
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'ras-sychev-2016-v1',
};
