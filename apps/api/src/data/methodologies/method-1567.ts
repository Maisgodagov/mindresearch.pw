import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const answers = [
  'Очень слабая выраженность качества',
  'Слабая выраженность качества',
  'Средняя выраженность качества',
  'Высокая выраженность качества',
  'Очень высокая выраженность качества',
].map((label, index) => ({ value: String(index + 1), label }));

const items = [
  'Преобладают положительные эмоции и спокойное настроение.',
  'Хорошее физическое самочувствие в целом.',
  'В целом положительное представление о себе, хотя вижу и свои минусы.',
  'Здоровый и разнообразный образ жизни.',
  'Преимущественная опора на себя в жизни, а не на внешние обстоятельства.',
  'Гибкость в управлении своими эмоциями и действиями.',
  'Чувство меры в своих желаниях, притязаниях и действиях.',
  'Принятие двойственности Мира, наличия в нем и приятных, и угрожающих для жизни сторон.',
  'Стремление к достаточно высоким, но не к максимальным достижениям.',
  'Реалистичность представлений и желаний.',
  'Умеренная выраженность большинства черт темперамента и характера.',
  'Удовлетворенность жизнью в целом.',
  'Удовлетворенность отношениями в семье.',
  'Удовлетворенность отношениями с друзьями.',
  'Удовлетворенность отношениями на работе (в учебной группе).',
  'Открытость познанию нового, творческая деятельность.',
  'Доброжелательность к людям.',
  'Чувство красоты природы.',
  'Ориентация на общечеловеческие ценности поиска истины, добра, красоты и гармоничной жизни.',
  'Умение экономно расходовать свою жизненную энергию.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1584_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: answers,
}));

export const instrument: SeedSection = {
  code: 'test_1584',
  title: 'Самооценка гармоничности личности (СГЛ)',
  description: 'Экспресс-методика О. И. Моткова оценивает самооценку общей гармоничности личности по четырём аспектам: оптимальное функционирование, умеренность желаний и черт характера, удовлетворённость собой, отношениями и жизнью, мудрость и духовность. Подходит для респондентов старше 14 лет; авторы опросов могут использовать общий средний показатель и профиль четырёх аспектов для описания субъективно оцениваемых ресурсов и областей личностной гармонии.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'optimal_functioning', label: 'Оптимальное функционирование', items: [1, 2, 4, 5, 6], reverseItems: [], aggregation: 'mean' },
    { key: 'moderation', label: 'Умеренность желаний и черт характера', items: [7, 9, 10, 11, 20], reverseItems: [], aggregation: 'mean' },
    { key: 'satisfaction', label: 'Удовлетворённость собой, отношениями и жизнью в целом', items: [3, 12, 13, 14, 15], reverseItems: [], aggregation: 'mean' },
    { key: 'wisdom_spirituality', label: 'Мудрость и духовность', items: [8, 16, 17, 18, 19], reverseItems: [], aggregation: 'mean' },
    { key: 'sgl', label: 'Общая самооценка гармоничности личности (СГЛ)', items: Array.from({ length: 20 }, (_, index) => index + 1), reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы на минимальной выраженности дают 1,00 по каждой шкале',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { optimal_functioning: 1, moderation: 1, satisfaction: 1, wisdom_spirituality: 1, sgl: 1 },
  },
  {
    title: 'Ручной смешанный пример по ключу: ОФ 1–5, Ум 2–5, Уд 3–4, МД 4–3',
    answers: Object.fromEntries([3, 4, 5, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3].map((value, index) => [String(index + 1), value])),
    expected: { optimal_functioning: 3.2, moderation: 3.4, satisfaction: 2.8, wisdom_spirituality: 2.6, sgl: 3 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'sgl-motkov-2022-ru-v1',
};
