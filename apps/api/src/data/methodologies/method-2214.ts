import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Совершенно не согласен' },
  { value: '2', label: 'Скорее не согласен' },
  { value: '3', label: 'И согласен, и не согласен' },
  { value: '4', label: 'Скорее согласен' },
  { value: '5', label: 'Полностью согласен' },
];

const items = [
  'Мне не нравятся вопросы, на которые можно правильно ответить по-разному.',
  'Стихи, содержащие противоречия, меня раздражают.',
  'Мне нравятся истории с героями, которые ведут себя последовательно.',
  'Мне не нравятся расплывчатые и импрессионистические изображения.',
  'Мне не нравится работать над задачей, если нельзя получить ясный и однозначный ответ.',
  'Меня раздражает слушать человека, который никак не может принять решение.',
  'Я терпеть не могу, когда не удаётся сразу решить задачу.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2230_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

const instrument: SeedSection = {
  code: 'test_2230',
  title: 'Краткая шкала нетерпимости к неоднозначности (SAIS-7)',
  description: 'Однофакторная краткая шкала оценивает общую склонность негативно реагировать на неоднозначность: неприятие вопросов с несколькими корректными ответами, противоречивого содержания, непоследовательности, расплывчатости и нерешённых задач. Русская адаптация опубликована для русскоязычной выборки взрослых; полезна авторам исследований индивидуальных различий и реакций на неоднозначные ситуации.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [{ key: 'intolerance', label: 'Нетерпимость к неоднозначности', items: [1, 2, 3, 4, 5, 6, 7], reverseItems: [], aggregation: 'mean' }],
};

const validationCases: ValidationCase[] = [
  { title: 'Все ответы — 1', answers: { '1': 1, '2': 1, '3': 1, '4': 1, '5': 1, '6': 1, '7': 1 }, expected: { intolerance: 1 } },
  { title: 'Все ответы — 5', answers: { '1': 5, '2': 5, '3': 5, '4': 5, '5': 5, '6': 5, '7': 5 }, expected: { intolerance: 5 } },
  { title: 'Ручная проверка: 1, 2, 3, 4, 5, 1, 5', answers: { '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 1, '7': 5 }, expected: { intolerance: 3 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['regulation-uncertainty'],
  scoringConfig,
  validationCases,
  formulaVersion: 'sais-7-ru-zabelina-2026-v1',
};
