import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Совершенно не согласен' },
  { value: '2', label: 'Скорее не согласен' },
  { value: '3', label: 'Ни то ни другое' },
  { value: '4', label: 'Скорее согласен' },
  { value: '5', label: 'Совершенно согласен' },
];

const items = [
  'Если книга или статья интересны, мне не важно, насколько они сложны для прочтения.',
  'Я не представляю свою жизнь без чтения.',
  'Иногда мои друзья удивляются тому, как много я читаю.',
  'Мы с моими друзьями любим обмениваться книгами и статьями, которые нам понравились.',
  'Мне очень важно уделять время чтению.',
  'По сравнению с другими моими занятиями, чтение для меня более важно.',
  'Я прочитаю информацию из источника задолго до наступления дедлайна, если она понадобится мне для решения какой-либо задачи.',
  'Результатом эффективности моего чтения является моя успешность в работе (успеваемость в университете).',
  'Мне кажется, что, когда я читаю, я подаю хороший пример для подражания.',
  'Я быстро читаю.',
  'Чтение наделяет мою жизнь смыслом.',
  'Мне не нравится читать техническую литературу.',
  'Мне нравится читать сложные для понимания книги или статьи.',
  'Мне не нравится читать материалы со сложной терминологией.',
  'Я читаю всю рекомендованную литературу по работе или к занятиям в университете.',
  'Я уверен(а), что могу понять сложные книги или статьи.',
  'Я хороший читатель.',
  'Я читаю для того, чтобы повысить свою успеваемость в университете или успешность в работе.',
];

const reverseItems = [12, 14];
const questionSet: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2211_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2211',
  title: 'Шкала мотивации к чтению у взрослых (русскоязычная адаптация)',
  description: 'Методика оценивает привычную мотивацию взрослых к чтению: насколько чтение стало частью самоощущения, уверенность и готовность справляться с трудностями чтения, а также использование чтения для успеха в работе или учёбе. Подходит для исследовательских и практических опросов взрослых; общая оценка в русскоязычной адаптации условна, поэтому полезнее рассматривать три подшкалы отдельно.',
  questions: questionSet,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'self', label: 'Чтение как часть себя', items: [2, 3, 4, 5, 6, 9, 10, 11], reverseItems: [], aggregation: 'mean' },
    { key: 'efficacy', label: 'Эффективность чтения', items: [1, 12, 13, 14, 16, 17], reverseItems, aggregation: 'mean' },
    { key: 'success', label: 'Успешность в других областях жизни', items: [7, 8, 15, 18], reverseItems: [], aggregation: 'mean' },
    { key: 'total', label: 'Общая мотивация к чтению (условный показатель)', items: Array.from({ length: 18 }, (_, i) => i + 1), reverseItems, aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: согласие со всеми утверждениями; два обратных пересчитаны',
    answers: Object.fromEntries(items.map((_, i) => [String(i + 1), 5])),
    expected: { self: 5, efficacy: 4, success: 5, total: 4.777778 },
  },
  {
    title: 'Ручная проверка: полностью несогласен со всеми утверждениями; два обратных пересчитаны',
    answers: Object.fromEntries(items.map((_, i) => [String(i + 1), 1])),
    expected: { self: 1, efficacy: 2, success: 1, total: 1.222222 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'arms-ru-vasileva-tikhonova-2024-v1',
};
