import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

// Answers encode the original symmetric 3–2–1–1–2–3 mark from left to right.
// itemScores reproduce the article's asymmetric 1–6 polarity coding exactly.
const responseMarks = [3, 2, 1, 1, 2, 3];
const options = responseMarks.map((mark, index) => ({ value: String(index + 1), label: String(mark) }));

const pairs: [string, string][] = [
  ['Пассивная', 'Активная'],
  ['Возбуждающая', 'Расслабляющая'],
  ['Равнодушная', 'Отзывчивая'],
  ['Обратимая', 'Безвозвратная'],
  ['Избавляющая', 'Уничтожающая'],
  ['Сильная', 'Слабая'],
  ['Легкая', 'Трудная'],
  ['Логичная', 'Иррациональная'],
  ['Беспроигрышная', 'Проигрышная'],
  ['Энергичная', 'Вялая'],
  ['Безнадежная', 'Обнадеживающая'],
  ['Оптимистичная', 'Пессимистичная'],
  ['Жестокая', 'Добрая'],
  ['Желанная', 'Невыносимая'],
  ['Веселая', 'Грустная'],
  ['Очевидная', 'Таинственная'],
  ['Непонятная', 'Понятная'],
  ['Значимая', 'Незначимая'],
  ['Личная', 'Публичная'],
  ['Разрешимая', 'Неразрешимая'],
  ['Изменчивая', 'Устойчивая'],
  ['Преодолимая', 'Тупиковая'],
  ['Сложная', 'Простая'],
  ['Добровольная', 'Вынужденная'],
  ['Контролируемая', 'Неконтролируемая'],
  ['Безопасная', 'Угрожающая'],
  ['Острая', 'Мягкая'],
  ['Приятная', 'Ужасная'],
  ['Смертельная', 'Жизнеутверждающая'],
  ['Близкая', 'Далекая'],
  ['Дружественная', 'Враждебная'],
  ['Освобождающая', 'Сковывающая'],
  ['Пустая', 'Информативная'],
  ['Принимающая', 'Отвергающая'],
  ['Глубокая', 'Поверхностная'],
  ['Определенная', 'Неопределенная'],
  ['Уникальная', 'Обычная'],
  ['Нормальная', 'Отклоняющаяся от нормы'],
  ['Однозначная', 'Многозначная'],
];

// The published key skips item 35 (excluded from factor analysis); item 36 onward
// therefore maps to the same-numbered prompt plus one.
const keyItemForPrompt = (prompt: number) => prompt <= 34 ? prompt : prompt + 1;

const leftLowKeyItems = new Set([1, 3, 11, 13, 17, 27, 29, 33]);
const itemScores = Object.fromEntries(pairs.map((_, index) => {
  const item = index + 1;
  const keyItem = keyItemForPrompt(item);
  // Key coding table explicitly provides the polarity of each retained item.
  // Left is the low pole for these key numbers; all other keyed items are reversed.
  const leftIsLow = leftLowKeyItems.has(keyItem);
  return [item, Object.fromEntries(options.map((option, optionIndex) => [
    option.value,
    (leftIsLow ? 1 : 6) + (leftIsLow ? 1 : -1) * responseMarks[optionIndex],
  ]))];
}));

const questions: SeedSection['questions'] = pairs.map(([left, right], index) => ({
  code: `test_1589_${index + 1}`,
  text: `${left} — ${right}`,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1589',
  title: 'Семантический дифференциал жизненной ситуации (СДЖС)',
  description: 'Методика описывает субъективное когнитивное и эмоциональное восприятие взрослым своей целостной жизненной ситуации. Восемь аспектов охватывают владение ситуацией, эмоциональное переживание, позитивные ожидания, обыденность, разрешимость, личную включенность и веру в преодолимость, энергетический заряд и понимание. Подходит авторам опросов для исследования того, как взрослые воспринимают обычные и трудные жизненные ситуации; опубликованная апробация проводилась на взрослых.',
  questions,
};

const promptForKeyItem = (keyItem: number) => keyItem <= 34 ? keyItem : keyItem - 1;
const scale = (key: string, label: string, keyItems: number[]) => {
  const items = keyItems.map(promptForKeyItem);
  return ({
  key,
  label,
  items,
  reverseItems: [] as number[],
  itemScores: Object.fromEntries(items.map(item => [item, itemScores[item]])),
  aggregation: 'mean' as const,
  });
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 6,
  scales: [
    scale('control', 'Владение ситуацией', [5, 6, 8, 10, 15, 22, 25, 26, 31, 32, 34]),
    scale('emotion', 'Эмоциональное переживание ситуации', [12, 14, 18, 22, 24, 28, 29, 30, 34]),
    scale('expectations', 'Позитивные ожидания от ситуации', [1, 3, 11, 13, 29, 33]),
    scale('ordinariness', 'Обыденность и повседневность ситуации', [21, 23, 27, 38]),
    scale('resolvability', 'Разрешимость ситуации', [7, 9, 20, 24, 36]),
    scale('involvement', 'Личная включенность и вера в преодолимость ситуации', [19, 22, 36]),
    scale('energy', 'Энергетический заряд ситуации', [2, 8]),
    scale('understanding', 'Уровень понимания ситуации', [16, 17, 39, 40]),
  ],
};

const expectedAtLowMark = {
  control: 3, emotion: 28 / 9, expectations: 4, ordinariness: 3.25,
  resolvability: 3, involvement: 3, energy: 3, understanding: 3.25,
};
const validationCases: ValidationCase[] = [
  {
    title: 'Все отметки у левого полюса: проверка полярности и средних по ключу',
    answers: Object.fromEntries(pairs.map((_, index) => [String(index + 1), '3'])),
    expected: expectedAtLowMark,
  },
  {
    title: 'Все отметки у правого полюса: обратная проверка кодировки и ключа',
    answers: Object.fromEntries(pairs.map((_, index) => [String(index + 1), '6'])),
    expected: {
      control: 0, emotion: 7 / 9, expectations: 7, ordinariness: 1.75,
      resolvability: 0, involvement: 0, energy: 0, understanding: 1.75,
    },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'sdjs-alexandrova-dermanova-2018-39items-polarity-mean-v1',
};
