import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Совершенно не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Затрудняюсь ответить' },
  { value: '4', label: 'Согласен' },
  { value: '5', label: 'Полностью согласен' },
];

const items = [
  'Я счастлив в роли родителя.',
  'Для меня практически не существует того, что я бы не смог сделать для своего ребенка (детей), в случае необходимости.',
  'Забота о ребёнке (детях) иногда требует больше времени и сил, чем я могу им дать.',
  'Иногда я беспокоюсь, достаточно ли я делаю для своего ребенка (детей).',
  'Я ощущаю близость со своим ребёнком (детьми).',
  'Я наслаждаюсь временем, проведенным со своим ребёнком (детьми).',
  'Мой ребенок (дети) является важным источником любви для меня.',
  'Рождение ребенка (детей) дает мне более уверенный и оптимистичный взгляд на будущее.',
  'Основной источник стресса в моей жизни – это мой ребёнок (дети).',
  'Появление ребёнка (детей) оставляет мало времени и свободы действий в моей жизни.',
  'Наличие ребенка (детей) является финансовым бременем.',
  'Мне сложно совмещать разные обязанности из-за моего ребёнка (детей).',
  'Поведение моего ребенка (детей) часто меня смущает или вызывает стресс.',
  'Если бы мне дали второй шанс, возможно, я бы решил не иметь ребенка (детей).',
  'Я чувствую себя подавленным ответственностью быть родителем.',
  'Рождение ребёнка (детей) означает для меня отсутствие выбора и слишком мало контроля над моей жизнью.',
  'Как родитель, я удовлетворен.',
  'Дети – источник моей радости.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2373_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2373',
  title: 'Шкала родительского стресса (PSS), русскоязычная версия',
  description: 'Шкала PSS оценивает воспринимаемый стресс, связанный с родительской ролью, учитывая требования и ограничения родительства, потерю контроля, удовлетворённость и позитивные переживания близости, радости и вознаграждения. Эта 18-пунктовая русскоязычная версия предназначена для родителей; профиль помогает автору опроса описать как напряжение и нагрузку, так и ресурсные стороны родительского опыта.',
  questions,
};

const reverseItems = [1, 2, 5, 6, 7, 8, 17, 18];

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'parentalStressors', label: 'Родительские стрессоры', items: [3, 9, 11, 10, 12, 16], reverseItems: [], aggregation: 'sum' },
    { key: 'parentalReward', label: 'Родительское вознаграждение (обратный счёт: родительский ущерб)', items: [1, 5, 6, 7, 8], reverseItems: [1, 5, 6, 7, 8], aggregation: 'sum' },
    { key: 'lossOfControl', label: 'Потеря контроля', items: [10, 12, 15, 16], reverseItems: [], aggregation: 'sum' },
    { key: 'parentalDissatisfaction', label: 'Родительская неудовлетворённость', items: [14, 17, 18], reverseItems: [17, 18], aggregation: 'sum' },
    { key: 'total', label: 'Общий родительский стресс', items: Array.from({ length: 18 }, (_, index) => index + 1), reverseItems, aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  { title: 'Ручной расчёт: все ответы «совершенно не согласен»', answers: Object.fromEntries(items.map((_, index) => [String(index + 1), '1'])), expected: { parentalStressors: 6, parentalReward: 20, lossOfControl: 4, parentalDissatisfaction: 11, total: 50 } },
  { title: 'Ручной расчёт: все ответы «полностью согласен»', answers: Object.fromEntries(items.map((_, index) => [String(index + 1), '5'])), expected: { parentalStressors: 30, parentalReward: 0, lossOfControl: 20, parentalDissatisfaction: 7, total: 58 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['parenting'],
  scoringConfig,
  validationCases,
  formulaVersion: 'berry-jones-1995-misiyuk-tikhonova-2022-v1',
};
