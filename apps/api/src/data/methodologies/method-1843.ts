import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const tables = [
  ['Комфортные условия жизни', 'Свобода передвижения и поступков', 'Интересная работа', 'Дети', 'Забота о семье и близких', 'Ваше влияние и авторитет', 'Порядок и благополучие в обществе', 'Верность своим моральным принципам'],
  ['Общение с друзьями и интересными людьми', 'Здоровье', 'Творчество', 'Занятия спортом', 'Самоуважение', 'Любовь', 'Красота и гармония окружающего мира', 'Готовность поддержать другого человека'],
  ['Безопасность родственников', 'Ваша страна и ее роль в мире', 'Отдых и развлечения', 'Образование и культура', 'Справедливость в отношениях между людьми', 'Вкусное и здоровое питание', 'Внешняя привлекательность', 'Привязанность и уважение к Вам других людей'],
  ['Счастливая семейная жизнь', 'Получение новой информации', 'Возможность реализации своих способностей', 'Уверенность в завтрашнем дне', 'Помощь другу', 'Традиции и культура Вашего народа', 'Хорошая одежда', 'Личная безопасность'],
];

const valueItems = tables.flatMap((table) => table);
const questions: SeedSection['questions'] = valueItems.map((text, index) => ({
  code: `test_1860_${index + 1}`,
  text,
  type: 'number',
  required: true,
  validation: { min: 1, max: 8, integer: true },
}));

// The source form prints four rows of eight candidate values and asks for an
// individual rank beside each. Keep all eight rank choices available in every
// row; the source instruction defines the ranking procedure, including using
// each rank once within a row.
const rankOptions = Array.from({ length: 8 }, (_, index) => ({ value: String(index + 1), label: String(index + 1) }));
questions.forEach((question, index) => {
  question.type = 'single';
  question.options = rankOptions;
  question.text = `Таблица ${Math.floor(index / 8) + 1}. ${question.text}`;
});

const keys = [
  { key: 'vitality', label: 'Витальная мотивация', positions: [2, 4, 6, 7] },
  { key: 'cognition', label: 'Познавательная мотивация', positions: [3, 1, 4, 2] },
  { key: 'reproduction', label: 'Репродуктивная мотивация', positions: [4, 6, 7, 1] },
  { key: 'self_realization', label: 'Мотивация самореализации', positions: [6, 3, 2, 3] },
  { key: 'morality', label: 'Нравственная мотивация', positions: [7, 7, 5, 6] },
  { key: 'altruism', label: 'Альтруистическая мотивация', positions: [5, 8, 1, 5] },
  { key: 'self_protection', label: 'Мотивация защиты «Я»', positions: [8, 5, 8, 4] },
  { key: 'self_preservation', label: 'Мотивация самосохранения', positions: [1, 2, 3, 8] },
];

const averageRank = (positions: number[]) => positions.reduce((sum, position, table) => sum + position, 0) / positions.length;
const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 8,
  scales: keys.map((scale) => ({
    key: scale.key,
    label: scale.label,
    items: scale.positions.map((position, table) => table * 8 + position),
    reverseItems: [],
    aggregation: 'mean',
  })),
};

// In each of the four matrices, rank 1 is the highest importance. This
// hand-checked case follows the article's printed mapping of matrix positions.
const oneThroughEight = Object.fromEntries(valueItems.map((_, index) => [String(index + 1), index % 8 + 1]));
const validationCases: ValidationCase[] = [
  {
    title: 'Ранги 1–8 в каждой матрице соответствуют позициям печатного ключа',
    answers: oneThroughEight,
    expected: Object.fromEntries(keys.map((scale) => [scale.key, averageRank(scale.positions)])),
  },
];

export const instrument: SeedSection = {
  code: 'test_1860',
  title: 'Тест системного профиля мотивации, М-тест',
  description: 'Методика Рыжова и Смоловской оценивает мотивационно-ценностную сферу личности: профиль восьми видов мотивации (витальной, познавательной, репродуктивной, самореализации, нравственной, альтруистической, защиты «Я» и самосохранения), структуру ведущих ценностей и согласованность повторного ранжирования. Описанная авторами версия предназначена для психологического исследования взрослых; валидизационная выборка публикации включала студентов московских вузов.',
  questions,
};

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'ryzhov-smolovskaya-m-test-2018-v1',
};
