import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'Почти никогда (менее 5 % времени/случаев)' },
  { value: '1', label: 'Иногда (менее 25 % времени/случаев)' },
  { value: '2', label: 'Часто (менее 50 % времени/случаев)' },
  { value: '3', label: 'Чаще всего (более 50 % времени/случаев)' },
  { value: '4', label: 'Почти всегда (более 95 % времени/случаев)' },
];

const items = [
  'Самостоятельно замечает, когда другому человеку нужна помощь и пытается как-то помочь',
  'Стремится научиться делать самостоятельно всё, что возможно',
  'Интересуется другими людьми',
  'Любит браться за сложные для себя дела',
  'Пытается успокоить другого человека, если тот расстроен',
  'Использует свой опыт адекватно текущей ситуации',
  'Самостоятельно решает конфликты с другими детьми',
  'Легко адаптируется в новых ситуациях',
  'Проявляет упорство при неудачах',
  'Легко вовлекается во взаимодействие',
  'Помогает другому человеку, когда тот просит о помощи',
  'Ищет общения',
  'Любит делать что-то новое',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2192_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

const instrument: SeedSection = {
  code: 'test_2192',
  title: 'Шкала личностной зрелости ребенка (короткая версия)',
  description: 'Опросник для оценки общего личностного развития детей раннего и дошкольного возраста 2–7 лет по наблюдаемым проявлениям самостоятельности, общения, адаптации, настойчивости и просоциального поведения. Короткая версия содержит 13 утверждений; предназначена для заполнения взрослым, хорошо знающим ребенка.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 4,
  scales: [
    { key: 'total', label: 'Личностная зрелость ребенка (сумма)', items: Array.from({ length: 13 }, (_, i) => i + 1), reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: минимальная оценка по всем 13 пунктам',
    answers: Object.fromEntries(Array.from({ length: 13 }, (_, i) => [String(i + 1), 0])),
    expected: { total: 0 },
  },
  {
    title: 'Ручная проверка: максимальная оценка по всем 13 пунктам',
    answers: Object.fromEntries(Array.from({ length: 13 }, (_, i) => [String(i + 1), 4])),
    expected: { total: 52 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'lzreb-short-13-sum-0-4-v1',
};
