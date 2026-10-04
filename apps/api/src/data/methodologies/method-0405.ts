import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const descriptors = [
  ['Неформальная', 'Формальная'],
  ['Неопределенная', 'Определенная'],
  ['Нестандартная, нетипичная', 'Стандартная, типичная'],
  ['Новая, неизвестная', 'Известная'],
  ['Неконтролируемая', 'Контролируемая'],
  ['Неожиданная, внезапная', 'Ожидаемая'],
  ['Непрогнозируемая', 'Прогнозируемая'],
  ['Стрессогенная', 'Нестрессогенная'],
  ['Сложная', 'Простая'],
  ['Трудная', 'Легкая'],
  ['Неприятная', 'Приятная'],
  ['Опасная', 'Неопасная'],
  ['Наличие риска', 'Отсутствие риска'],
  ['Незначимая', 'Значимая'],
  ['Препятствует самореализации', 'Способствует самореализации'],
  ['Неравные позиции участников', 'Равные позиции участников'],
  ['Лидерство другого', 'Личное лидерство'],
] as const;
const items: SeedSection['questions'] = descriptors.map(([left, right], index) => ({
  code: `test_441_${index + 1}`,
  text: `Оцените конкретную стрессовую ситуацию по шкале от «${left}» до «${right}».`,
  type: 'single',
  required: true,
  options: Array.from({ length: 7 }, (_, i) => {
    const score = i - 3;
    return { value: String(score), label: String(score) };
  }),
}));
const factorItems = [
  { key: 'normativity', label: 'Нормативность', items: [1, 2, 3, 4] },
  { key: 'control', label: 'Контроль', items: [5, 6, 7] },
  { key: 'stressogenicity', label: 'Стрессогенность', items: [8, 9, 10, 11] },
  { key: 'threat', label: 'Угроза', items: [12, 13] },
  { key: 'significance', label: 'Значимость', items: [14, 15] },
  { key: 'leadership', label: 'Лидерство', items: [16, 17] },
];
export const instrument: SeedSection = {
  code: 'test_441',
  title: 'Когнитивная оценка стрессовой ситуации',
  description: 'Методика А. Ю. Маленовой оценивает субъективное восприятие конкретной стрессовой ситуации по шести аспектам: нормативности, контролю, стрессогенности, угрозе, значимости и лидерству. Она подходит для ситуационного профилирования взрослых и студентов; исходный бланк иллюстрирует применение на экзаменационной ситуации. Результаты помогают автору опроса описать, какие свойства ситуации воспринимаются как преобладающие.',
  questions: items,
};
export const scoringConfig: ConfigurableScoring = {
  min: -3,
  max: 3,
  scales: factorItems.map(({ key, label, items: scaleItems }) => ({
    key, label, items: scaleItems, reverseItems: [], aggregation: 'mean' as const,
  })),
};
const validationCases: ValidationCase[] = [
  {
    title: 'Проверка фактора нормативности: левый полюс, центр и правый полюс',
    answers: { '1': -3, '2': 0, '3': 3, '4': 0, '5': -3, '6': 0, '7': 3, '8': -3, '9': 0, '10': 3, '11': 0, '12': -3, '13': 3, '14': -3, '15': 3, '16': 0, '17': 0 },
    expected: { normativity: 0, control: 0, stressogenicity: 0, threat: 0, significance: 0, leadership: 0 },
  },
  {
    title: 'Контроль: все ответы на левом полюсе дают среднее −3',
    answers: Object.fromEntries(descriptors.map((_, i) => [String(i + 1), -3])),
    expected: { normativity: -3, control: -3, stressogenicity: -3, threat: -3, significance: -3, leadership: -3 },
  },
];
export const methodology: MethodologyRegistration = {
  instrument, scoringConfig, validationCases,
  formulaVersion: 'malenova-cognitive-appraisal-stress-situation-17-items-six-factor-means-7point-v1',
};
