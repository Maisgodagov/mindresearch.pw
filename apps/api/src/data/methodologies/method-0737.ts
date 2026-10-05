import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [1, 2, 3, 4, 5, 6, 7].map(value => ({ value: String(value), label: String(value) }));
const items = [
  'Лично мне она нравится.',
  'Эта профессия важна и значима для меня.',
  'Мне будет стыдно, если я этого не сделаю.',
  'На этом настаивают близкие.',
  'Я не знаю, почему выбираю эту профессию.',
  'Я считаю ее интересной.',
  'Эта профессия соответствует моим ценностям.',
  'Я буду считать себя неудачником, если не сделаю этого.',
  'Близкие склоняют меня к этому выбору.',
  'На самом деле я не знаю, чем хочу заниматься.',
  'Я нахожу ее увлекательной.',
  'В этой профессии я нахожу большой смысл.',
  'Если я этого не сделаю, то буду чувствовать себя виноватым.',
  'Так захотели родители.',
  'Мне все равно, какую профессию выбрать.',
];
const groups = [
  { key: 'intrinsic', label: 'Внутренняя мотивация', items: [1, 6, 11] },
  { key: 'identified', label: 'Идентифицированная мотивация', items: [2, 7, 12] },
  { key: 'introjected', label: 'Интроецированная мотивация', items: [3, 8, 13] },
  { key: 'external', label: 'Экстернальная мотивация', items: [4, 9, 14] },
  { key: 'amotivation', label: 'Амотивация', items: [5, 10, 15] },
];
const reverseItems = [3, 4, 5, 8, 9, 10, 13, 14, 15];
const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_767_${index + 1}`,
  text: `Я собираюсь выбрать эту профессию потому, что… ${text}`,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_767',
  title: 'Мотивация выбора профессии (МВП)',
  description: 'Опросник оценивает мотивацию выбора профессии у старшеклассников: внутренний интерес и личную значимость выбора, давление близких и внутреннее чувство долга, а также амотивацию. Профиль пяти типов мотивации и индекс автономии помогают автору опроса понять, насколько выбор опирается на собственный интерес и ценности подростка или на внешнее давление и отсутствие ясных причин.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    ...groups.map(group => ({ key: group.key, label: group.label, items: group.items, reverseItems: [], aggregation: 'mean' as const })),
    { key: 'autonomyIndex', label: 'Индекс автономии', items: Array.from({ length: 15 }, (_, index) => index + 1), reverseItems, aggregation: 'mean' },
  ],
};

const allAnswers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Все оценки максимальны', answers: allAnswers(7), expected: { intrinsic: 7, identified: 7, introjected: 7, external: 7, amotivation: 7, autonomyIndex: 4.6 } },
  { title: 'Все оценки минимальны', answers: allAnswers(1), expected: { intrinsic: 1, identified: 1, introjected: 1, external: 1, amotivation: 1, autonomyIndex: 3.4 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'mvp-sychev-gordeeva-2026-v1',
};
