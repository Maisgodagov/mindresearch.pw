import type { SeedSection } from '../types.js';
import type { ConfigurableScoring, ValidationCase } from '../scoring/configurable.js';

const options = [
  { value: '1', label: '1 — Нет' },
  { value: '2', label: '2 — Скорее нет, чем да' },
  { value: '3', label: '3 — Ни то, ни другое' },
  { value: '4', label: '4 — Скорее да, чем нет' },
  { value: '5', label: '5 — Да' },
];

const items = [
  'В эмоциональном плане мужчины и женщины мало различаются друг от друга.',
  'Нормально, когда в политике мало женщин.',
  'Мужчины и женщины должны быть заботливыми, с достойным поведением.',
  'В эмоциональном плане мужчины и женщины различаются очень сильно.',
  'Размер семьи определяет отец.',
  'Мальчики и девочки могут плакать, но ни тем, ни другим нельзя драться.',
  'Мужчины должны быть уверенными в себе и амбициозными, женщины также могут быть такими.',
  'Нормально, когда в политике много женщин.',
  'Количество детей в семье определяет мать.',
  'Отцы обучают детей делам, а матери — эмоциям.',
];

const allItems = Array.from({ length: 10 }, (_, index) => index + 1);
const answers = (value: number) => Object.fromEntries(allItems.map(item => [String(item), value]));

export const genderPersonalityTypeTitovaRuInstrument: SeedSection = {
  code: 'test_56',
  title: 'Опросник гендерного типа личности (О. И. Титова, 2024)',
  description: 'Русскоязычный авторский опросник из 10 пунктов. Автоматически рассчитываются четыре шкальные суммы и два индекса по формулам публикации; типологическая категория не присваивается из-за противоречия в опубликованных порогах.',
  questions: items.map((text, index) => ({ code: `test_56_${index + 1}`, text, type: 'single', required: true, options })),
};

export const genderPersonalityTypeTitovaRuScoring: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'familyRoles', label: 'Отношение к роли отца и матери в семье', items: [5, 9, 10], reverseItems: [], aggregation: 'sum' },
    { key: 'emotions', label: 'Отношение к эмоциям мужчин и женщин', items: [1, 4], reverseItems: [1], aggregation: 'sum' },
    { key: 'womenInPolitics', label: 'Отношение к женщинам в политике', items: [2, 8], reverseItems: [2], aggregation: 'sum' },
    { key: 'normativeExpectations', label: 'Нормативные ожидания к мужчинам и женщинам', items: [3, 6, 7], reverseItems: [], aggregation: 'sum' },
    { key: 'genderSimilarityIndex', label: 'Индекс сходства мужчин и женщин', items: [1, 3, 4, 6, 7, 10], reverseItems: [], weights: { 1: 1, 3: 1, 4: -1, 6: 1, 7: -1, 10: -1 }, aggregation: 'sum' },
    { key: 'womenSocialStatusIndex', label: 'Индекс социального статуса женщин', items: [2, 5, 8, 9], reverseItems: [], weights: { 2: -1, 5: -1, 8: 1, 9: 1 }, aggregation: 'sum' },
  ],
};

export const genderPersonalityTypeTitovaRuValidationCases: ValidationCase[] = [
  { title: 'Все ответы — «Нет»', answers: answers(1), expected: { familyRoles: 3, emotions: 6, womenInPolitics: 6, normativeExpectations: 3, genderSimilarityIndex: 0, womenSocialStatusIndex: 0 } },
  { title: 'Все ответы — «Да»', answers: answers(5), expected: { familyRoles: 15, emotions: 6, womenInPolitics: 6, normativeExpectations: 15, genderSimilarityIndex: 0, womenSocialStatusIndex: 0 } },
  { title: 'Смешанный ручной контроль', answers: { '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 1, '7': 2, '8': 5, '9': 4, '10': 3 }, expected: { familyRoles: 12, emotions: 9, womenInPolitics: 9, normativeExpectations: 6, genderSimilarityIndex: -4, womenSocialStatusIndex: 2 } },
];
