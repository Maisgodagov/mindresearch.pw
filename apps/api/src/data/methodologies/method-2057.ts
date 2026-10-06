import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const answers = [
  { value: '1', label: 'Полностью не согласен' },
  { value: '2', label: 'Скорее не согласен' },
  { value: '3', label: 'Нейтрален' },
  { value: '4', label: 'Скорее согласен' },
  { value: '5', label: 'Полностью согласен' },
];

const items = [
  'Когда я прилагаю усилия, то обычно добиваюсь успеха.',
  'Иногда я чувствую себя подавленным.',
  'Я успешно выполняю задачи.',
  'Иногда, когда я терплю неудачу, чувствую себя бесполезным.',
  'В целом я удовлетворен(а) собой.',
  'Иногда я чувствую, что не управляю своей работой.',
  'То, что со мной случается и случится, — это дело моих собственных рук.',
  'Я полон(а) сомнений относительно моей компетенции.',
  'Я способен(на) справиться с большинством моих проблем.',
  'Бывают моменты, когда для меня всё выглядит довольно мрачно и безнадежно.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2071_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: answers,
}));

export const instrument: SeedSection = {
  code: 'test_2071',
  title: 'Шкала базового самооценивания (CSES), русскоязычная версия',
  description: 'Десятипунктная русскоязычная версия оценивает общее базовое самооценивание как ресурс проактивного поведения. Позитивная и негативная субшкалы охватывают переживание собственной компетентности и эффективности, контроля над событиями, общей удовлетворенности собой и эмоциональной устойчивости. Адаптирована и проверена на взрослых работниках организаций; полезна авторам опросов об общих личностных ресурсах и их связи с рабочим поведением.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'positive', label: 'Позитивное базовое самооценивание', items: [1, 3, 5, 7, 9], reverseItems: [], aggregation: 'sum' },
    { key: 'negative', label: 'Негативное базовое самооценивание (после реверсирования)', items: [2, 4, 6, 8, 10], reverseItems: [2, 4, 6, 8, 10], aggregation: 'sum' },
    { key: 'total', label: 'Общее базовое самооценивание', items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], reverseItems: [2, 4, 6, 8, 10], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка ключа: ответы 5 на прямые и 1 на обратные пункты',
    answers: { '1': 5, '2': 1, '3': 5, '4': 1, '5': 5, '6': 1, '7': 5, '8': 1, '9': 5, '10': 1 },
    expected: { positive: 25, negative: 25, total: 50 },
  },
  {
    title: 'Ручная проверка ключа: ответы 1 на прямые и 5 на обратные пункты',
    answers: { '1': 1, '2': 5, '3': 1, '4': 5, '5': 1, '6': 5, '7': 1, '8': 5, '9': 1, '10': 5 },
    expected: { positive: 5, negative: 5, total: 10 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'cses-ru-manchev-lepekhin-ilina-2022-v1',
};
