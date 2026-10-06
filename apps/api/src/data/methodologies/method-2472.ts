import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

// Ответы задаются как положение между левым и правым полюсами: 1–5 слева направо.
const options = [
  { value: '1', label: 'Выраженно левый полюс' },
  { value: '2', label: 'Умеренно левый полюс' },
  { value: '3', label: 'Среднее положение' },
  { value: '4', label: 'Умеренно правый полюс' },
  { value: '5', label: 'Выраженно правый полюс' },
];

const itemPairs: [string, string][] = [
  ['Инициативный', 'Безынициативный'],
  ['Вялый', 'Энергичный'],
  ['Независимый', 'Зависимый'],
  ['Замкнутый', 'Общительный'],
  ['Трудолюбивый', 'Ленивый'],
  ['Недоволен собой', 'Доволен собой'],
  ['Решительный', 'Нерешительный'],
  ['Несчастливый', 'Счастливый'],
  ['Уверенный', 'Неуверенный'],
  ['Неуспешный', 'Успешный'],
  ['Неодинокий', 'Одинокий'],
  ['Робкий', 'Смелый'],
  ['Волевой', 'Слабохарактерный'],
  ['Тревожный', 'Спокойный'],
  ['Миролюбивые', 'Агрессивные'],
  ['Безответственные', 'Ответственные'],
  ['Тактичные', 'Бестактные'],
  ['Двуличные', 'Искренние'],
  ['Добрые', 'Злые'],
  ['Корыстные', 'Бескорыстные'],
  ['Заслуживают доверие', 'Не заслуживают доверия'],
  ['Ненадежные', 'Надежные'],
  ['Справедливые', 'Несправедливые'],
  ['Нетерпимые', 'Терпимые'],
  ['Честные', 'Нечестные'],
  ['Опасные', 'Неопасные'],
  ['Принимающие', 'Отвергающие'],
  ['Черствые', 'Чуткие'],
  ['Гармоничный', 'Беспорядочный'],
  ['Грязный', 'Чистый'],
  ['Правдивый', 'Лживый'],
  ['Мрачный', 'Светлый'],
  ['Позитивный', 'Негативный'],
  ['Ненадежный', 'Надежный'],
  ['Понятный', 'Непонятный'],
  ['Несвободный', 'Свободный'],
  ['Справедливый', 'Несправедливый'],
  ['Нестабильный', 'Стабильный'],
  ['Безопасный', 'Опасный'],
  ['Отвергающий', 'Принимающий'],
  ['Помогающий', 'Препятствующий'],
  ['Угрожающий', 'Дружелюбный'],
];

const groupForItem = (item: number) => item <= 14 ? 'Я сам' : item <= 28 ? 'Другие люди' : 'Мир вокруг';
const questions: SeedSection['questions'] = itemPairs.map(([left, right], index) => ({
  code: `test_2490_${index + 1}`,
  text: `${groupForItem(index + 1)}: ${left} — ${right}`,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2490',
  title: 'Шкала устойчивости к источникам стресса (ШУИС)',
  description: 'ШУИС оценивает устойчивость к стрессу через восприятие трёх потенциальных источников напряжения: собственной личности, других людей и окружающего мира. Три частных показателя помогают увидеть, в какой сфере оценки чаще становятся стрессогенными; общий показатель суммирует сопротивляемость этим источникам. Авторская стандартизация и апробация описаны на студентах гуманитарных специальностей 18–35 лет; при использовании с другими группами результаты следует рассматривать с учётом этого ограничения.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'self', label: 'Я сам', items: Array.from({ length: 14 }, (_, i) => i + 1), reverseItems: [1, 3, 5, 7, 9, 11, 13], aggregation: 'sum' },
    { key: 'other_people', label: 'Другие люди', items: Array.from({ length: 14 }, (_, i) => i + 15), reverseItems: [15, 17, 19, 21, 23, 25, 27], aggregation: 'sum' },
    { key: 'world', label: 'Мир вокруг', items: Array.from({ length: 14 }, (_, i) => i + 29), reverseItems: [29, 31, 33, 35, 37, 39, 41], aggregation: 'sum' },
    { key: 'overall', label: 'Общая устойчивость к стрессу', items: Array.from({ length: 42 }, (_, i) => i + 1), reverseItems: Array.from({ length: 21 }, (_, i) => i * 2 + 1), aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: центральная отметка по всем полюсам даёт 42 по каждой подшкале и 126 в общей шкале',
    answers: Object.fromEntries(itemPairs.map((_, index) => [String(index + 1), 3])),
    expected: { self: 42, other_people: 42, world: 42, overall: 126 },
  },
  {
    title: 'Ручная проверка направления ключа: левый ответ 1 на нечётном пункте и правый ответ 5 на чётном дают по 5 баллов',
    answers: Object.fromEntries(itemPairs.map((_, index) => [String(index + 1), (index + 1) % 2 ? 1 : 5])),
    expected: { self: 70, other_people: 70, world: 70, overall: 210 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['mood-stress'],
  scoringConfig,
  validationCases,
  formulaVersion: 'raspopin-shuis-2012-42items-reverse-odd-sum-v1',
};
