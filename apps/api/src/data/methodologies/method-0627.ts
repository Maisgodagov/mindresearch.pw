import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const words = [
  'Азарт', 'Активность', 'Внимательность', 'Дисциплина', 'Доход', 'Запросы', 'Знания',
  'Компетентность', 'Кризис', 'Лень', 'Ловкость', 'Мастерство', 'Медлительность', 'Надежность',
  'Наивность', 'Начинающий', 'Независимость', 'Неопытность', 'Образованность', 'Обучающийся',
  'Общение', 'Обязанности', 'Опыт', 'Ответственность', 'Ошибки', 'Переоценка своих возможностей',
  'Подготовка', 'Поддержка', 'Похвала', 'Преданность делу', 'Претензии', 'Признание', 'Проба',
  'Промахи', 'Радость', 'Разноплановость', 'Растерянность', 'Самолюбие', 'Самостоятельность', 'Скука',
  'Совершенствование', 'Сравнение', 'Старания', 'Творчество', 'Тревога', 'Труд', 'Уважение',
  'Уверенность', 'Удача', 'Удовлетворенность', 'Ум', 'Умения', 'Усердие', 'Успешность', 'Усталость',
  'Хобби', 'Цель', 'Экзамен', 'Энтузиазм', 'Эффективность',
];

const professional = new Set([
  'Азарт', 'Активность', 'Внимательность', 'Дисциплина', 'Знания', 'Компетентность', 'Ловкость',
  'Мастерство', 'Надежность', 'Независимость', 'Образованность', 'Опыт', 'Ответственность',
  'Преданность делу', 'Признание', 'Радость', 'Самостоятельность', 'Совершенствование', 'Творчество',
  'Труд', 'Уважение', 'Уверенность', 'Удача', 'Удовлетворенность', 'Ум', 'Умения', 'Успешность',
  'Цель', 'Энтузиазм', 'Эффективность',
]);
const professionalItems = words.flatMap((word, index) => professional.has(word) ? [index + 1] : []);
const nonprofessionalItems = words.flatMap((word, index) => !professional.has(word) ? [index + 1] : []);

const questions: SeedSection['questions'] = words.map((text, index) => ({
  code: `test_658_${index + 1}`,
  text,
  type: 'multiple',
  required: false,
  options: [{ value: 'selected', label: 'Относится ко мне' }],
}));

export const instrument: SeedSection = {
  code: 'test_658',
  title: 'Методика исследования профессиональной идентичности (МИПИ)',
  description: 'МИПИ Л. Б. Шнейдер оценивает выраженность профессиональной идентичности по самоописанию через ассоциации, связанные с профессиональным и непрофессиональным образом. Методика охватывает представления о компетентности, опыте, самостоятельности и вовлечённости в дело, а также признаки неопытности, сомнений и трудностей; подходит для исследования профессионального самоопределения и идентичности у людей, соотносящих себя с профессиональной сферой.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 1,
  scales: [
    { key: 'professional_count', label: 'Выборы профессиональной категории (A)', items: professionalItems, reverseItems: [], aggregation: 'count-option', optionValue: 'selected' },
    { key: 'nonprofessional_count', label: 'Выборы непрофессиональной категории (B)', items: nonprofessionalItems, reverseItems: [], aggregation: 'count-option', optionValue: 'selected' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Выбрано одно слово профессиональной категории и одно непрофессиональной',
    answers: Object.fromEntries(words.map((_, index) => [String(index + 1), professional.has(words[index]) || words[index] === 'Доход' ? 'selected' : ''])),
    expected: { professional_count: 1, nonprofessional_count: 1 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'shneider-mipi-76-words-professional-share-2007-v1',
};
