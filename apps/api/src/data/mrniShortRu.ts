import type { SeedSection } from '../types.js';
import type { ConfigurableScoring, ValidationCase } from '../scoring/configurable.js';

const options = [
  { value: '1', label: '1 — Совершенно не согласен(на)' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
  { value: '6', label: '6' },
  { value: '7', label: '7 — Совершенно согласен(на)' },
];

const items = [
  'Все гей-клубы должны быть закрыты.',
  'Мальчики должны играть в солдатиков и трансформеров, а не в куклы.',
  'Мужчины должны быть в состоянии сделать ремонт в доме.',
  'Мужчины должны быть в состоянии починить любую вещь в доме.',
  'Мужчины должны смотреть боевики, а не читать любовные романы.',
  'Мужчины должны всегда хотеть секса.',
  'Мальчики должны играть в машинки, а не в куклы.',
  'Мужчина не должен отказываться от секса.',
  'Мужчина всегда должен быть «боссом».',
  'Мужчина должен устанавливать порядки в семье.',
  'Даже если мужчина расстроен, он не должен это показывать.',
  'Следует поощрять мальчиков, которые показывают свою физическую силу.',
  'Если у мужчины ломается машина, он должен знать, как её починить.',
  'Гомосексуалам следует запретить вести преподавательскую деятельность.',
  'Мужчина не должен подавать виду, если кто-то его обидел.',
  'Мужчина должен быть всегда готов заняться сексом.',
  'В напряжённых ситуациях мужчины должны быть настойчивыми.',
  'Юноши должны стремиться стать физически сильными, даже если они маленького роста.',
  'По лицу мужчины никогда не должно быть понятно, что он чувствует.',
  'В денежных вопросах последнее слово должно быть за мужчиной.',
  'Обидно обнаружить, что известный спортсмен — гей.',
];

export const mrniShortRuInstrument: SeedSection = {
  code: 'test_54',
  title: 'Краткая русскоязычная версия опросника «Нормы мужской роли», MRNI-R-SF',
  description: '21-пунктовая краткая версия, проверенная на русскоязычной выборке. Оценивает поддержку традиционной маскулинной идеологии; общий показатель — среднее ответов по всем пунктам (1–7), без пороговых категорий.',
  questions: items.map((text, index) => ({ code: `test_54_${index + 1}`, text, type: 'single', required: true, options })),
};

export const mrniShortRuScoring: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [{ key: 'traditionalIdeology', label: 'Поддержка традиционной маскулинной идеологии', items: Array.from({ length: 21 }, (_, index) => index + 1), reverseItems: [], aggregation: 'mean' }],
};

export const mrniShortRuValidationCases: ValidationCase[] = [
  { title: 'Минимальный показатель', answers: Object.fromEntries(Array.from({ length: 21 }, (_, index) => [String(index + 1), 1])), expected: { traditionalIdeology: 1 } },
  { title: 'Максимальный показатель', answers: Object.fromEntries(Array.from({ length: 21 }, (_, index) => [String(index + 1), 7])), expected: { traditionalIdeology: 7 } },
  { title: 'Смешанный протокол', answers: Object.fromEntries(Array.from({ length: 21 }, (_, index) => [String(index + 1), index % 7 + 1])), expected: { traditionalIdeology: 4 } },
];
