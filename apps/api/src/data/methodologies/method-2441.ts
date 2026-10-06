import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Абсолютно не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Скорее не согласен' },
  { value: '4', label: 'Ни согласен, ни не согласен' },
  { value: '5', label: 'Скорее согласен' },
  { value: '6', label: 'Согласен' },
  { value: '7', label: 'Полностью согласен' },
];

const items = [
  'Я рад, когда могу помочь другим людям.',
  'Для меня важно взаимодействовать с другими людьми.',
  'Мне важно идти своим путём.',
  'Мне нравится преодолевать препятствия.',
  'Мне нравится провоцировать.',
  'Мне нравятся соревнования, где можно получить награду.',
  'Мне нравится помогать людям осваиваться в новых ситуациях.',
  'Мне нравится быть частью команды.',
  'Я часто следую своему любопытству.',
  'Для меня важно всегда доводить задания до конца.',
  'Мне нравится ставить под сомнение устоявшиеся правила.',
  'Награды — сильный мотиватор для меня.',
  'Мне нравится делиться своими знаниями.',
  'Для меня важно чувствовать себя частью сообщества.',
  'Мне нравится пробовать новое.',
  'Мне сложно бросить задачу, пока я не нашёл решение.',
  'Я считаю себя бунтарём.',
  'Для меня важна отдача от вложенных усилий.',
  'Для меня важно благополучие других.',
  'Мне нравятся групповые активности.',
  'Для меня важно быть независимым.',
  'Мне нравится справляться со сложными задачами.',
  'Мне не нравится следовать правилам.',
  'Если награда достаточно ценна, я готов прилагать усилия.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2459_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2459',
  title: 'Шкала типов пользователей геймифицированных систем Hexad (24 пункта, русская версия psytests.org, 2026)',
  description: 'Шкала оценивает выраженность шести мотивационных предпочтений пользователей геймифицированных цифровых систем: помощь и вклад в общее дело, социальное взаимодействие, автономию и исследование, достижение мастерства, внешние награды и стремление менять правила. Подходит для описания предпочтений пользователей цифровых продуктов и для выбора игровых элементов, согласующихся с этими предпочтениями; версия содержит 24 пункта и предназначена для пользователей, а не только для опытных игроков.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'philanthropist', label: 'Филантроп', items: [1, 7, 13, 19], reverseItems: [], aggregation: 'sum' },
    { key: 'socialiser', label: 'Социальщик', items: [2, 8, 14, 20], reverseItems: [], aggregation: 'sum' },
    { key: 'free_spirit', label: 'Свободный дух', items: [3, 9, 15, 21], reverseItems: [], aggregation: 'sum' },
    { key: 'achiever', label: 'Достигатор', items: [4, 10, 16, 22], reverseItems: [], aggregation: 'sum' },
    { key: 'disruptor', label: 'Бунтарь', items: [5, 11, 17, 23], reverseItems: [], aggregation: 'sum' },
    { key: 'player', label: 'Игрок, ориентированный на награды', items: [6, 12, 18, 24], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: ответы 1 по всем пунктам дают минимум 4 на каждой подшкале',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), '1'])),
    expected: { philanthropist: 4, socialiser: 4, free_spirit: 4, achiever: 4, disruptor: 4, player: 4 },
  },
  {
    title: 'Ручная проверка: ответы 7 по всем пунктам дают максимум 28 на каждой подшкале',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), '7'])),
    expected: { philanthropist: 28, socialiser: 28, free_spirit: 28, achiever: 28, disruptor: 28, player: 28 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['cyberpsychology'],
  scoringConfig,
  validationCases,
  formulaVersion: 'hexad-24-psytests-ru-2026-four-item-sums-v1',
};
