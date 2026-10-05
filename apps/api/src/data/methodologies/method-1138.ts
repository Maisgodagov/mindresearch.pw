import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const items = [
  'Мои болезненные переживания, мысли и воспоминания затрудняют для меня жить той жизнью, которой я хочу.',
  'Я боюсь своих чувств.',
  'Я переживаю о том, что не могу контролировать свои мысли и чувства.',
  'Болезненные воспоминания не дают мне жить полноценной жизнью.',
  'Эмоции — это источник проблем в моей жизни.',
  'Кажется, что большинство людей справляются со своей жизнью лучше, чем я.',
  'Переживания сбивают меня с пути к успеху.',
];

const options = [
  { value: '1', label: 'Никогда' },
  { value: '2', label: 'Очень редко' },
  { value: '3', label: 'Редко' },
  { value: '4', label: 'Иногда' },
  { value: '5', label: 'Часто' },
  { value: '6', label: 'Почти всегда' },
  { value: '7', label: 'Всегда' },
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1168_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1168',
  title: 'Опросник принятия и действий-II (AAQ-II)',
  description: 'Однофакторная версия AAQ-II оценивает психологическую ригидность и экспериментальное избегание — насколько болезненные мысли, чувства и воспоминания связаны с ограничениями в повседневной и ценностно направленной жизни. Пункты охватывают страх чувств, переживание недостатка контроля, влияние болезненных воспоминаний и тревог на полноценную жизнь и успех. Подходит для самоотчётной оценки взрослых и старших подростков; это показатель психологического процесса, а не диагностический тест.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'inflexibility', label: 'Психологическая ригидность / экспериментальное избегание', items: [1, 2, 3, 4, 5, 6, 7], reverseItems: [], aggregation: 'sum' },
  ],
};

const answers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Ручная проверка: все ответы «Никогда» дают минимальную сумму', answers: answers(1), expected: { inflexibility: 7 } },
  { title: 'Ручная проверка: все ответы «Всегда» дают максимальную сумму', answers: answers(7), expected: { inflexibility: 49 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'aaq-ii-russian-acbs-7-item-sum-v1',
};
