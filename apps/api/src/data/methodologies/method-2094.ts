import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Полностью не согласен' },
  { value: '2', label: 'Скорее не согласен' },
  { value: '3', label: 'Нечто среднее' },
  { value: '4', label: 'Скорее согласен' },
  { value: '5', label: 'Полностью согласен' },
];
const items = [
  'Как правило, я ставлю какую-то цель, но потом меняю ее на какую-то другую.',
  'Я могу без иронии назвать себя «тружеником».',
  'Новые идеи и новые проекты иногда уводят меня в сторону от прежних.',
  'Я добивался целей, ради которых работал много месяцев.',
  'Каждые несколько месяцев я начинаю интересоваться какими-то новыми делами.',
  'Обычно я продолжал решать стоящую задачу после неудачных попыток.',
  'Мои интересы меняются год от года.',
  'Неудачи обычно останавливают меня.',
  'Какая-то определенная идея владеет мной короткое время, а потом я теряю интерес к ней.',
  'Я не в ладах с проектами, которые тянутся много месяцев, например, больше года.',
  'Я заканчиваю всё, что начинаю.',
  'В работе я упорен.',
];
const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2108_${index + 1}`, text, type: 'single', required: true, options,
}));
export const instrument: SeedSection = {
  code: 'test_2108',
  title: 'Шкала Грит (русская версия, 12 пунктов)',
  description: 'Русская 12-пунктовая версия шкалы Грит оценивает настойчивость в достижении долгосрочных целей по двум аспектам: устойчивости интересов и настойчивости усилий. Вариант адаптирован Тюменевой, Кузьминой и Кардановой и исследован на российских школьниках 9-х классов; его можно использовать в исследовательских опросах подростков для описания этих двух связанных, но отдельных характеристик.',
  questions,
};
const allItems = Array.from({ length: 12 }, (_, index) => index + 1);
export const scoringConfig: ConfigurableScoring = {
  min: 1, max: 5,
  scales: [
    { key: 'interest_consistency', label: 'Устойчивость интересов', items: [1, 3, 5, 7, 9, 10, 8], reverseItems: [1, 3, 5, 7, 9, 10, 8], aggregation: 'mean' },
    { key: 'effort_perseverance', label: 'Настойчивость усилий', items: [2, 4, 6, 11, 12], reverseItems: [], aggregation: 'mean' },
    { key: 'grit_total', label: 'Общий средний балл', items: allItems, reverseItems: [1, 3, 5, 7, 8, 9, 10], aggregation: 'mean' },
  ],
};
const validationCases: ValidationCase[] = [
  { title: 'Ручная проверка: все ответы «Полностью не согласен»', answers: Object.fromEntries(allItems.map(item => [String(item), 1])), expected: { interest_consistency: 5, effort_perseverance: 1, grit_total: 7 / 3 } },
  { title: 'Ручная проверка: все ответы «Полностью согласен»', answers: Object.fromEntries(allItems.map(item => [String(item), 5])), expected: { interest_consistency: 1, effort_perseverance: 5, grit_total: 11 / 3 } },
];
export const methodology: MethodologyRegistration = {
  instrument, scoringConfig, validationCases,
  formulaVersion: 'grit-ru-tyumeneva-kuzmina-kardanova-2014-v1',
};