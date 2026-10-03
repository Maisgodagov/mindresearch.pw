import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const blocks = [
  { stimulus: 'ЛЕС', options: [['Поляна', 'beauty'], ['Муравейник', 'knowledge'], ['Заповедник', 'care'], ['Дрова', 'utility'], ['Песок', null]] },
  { stimulus: 'ЛОСЬ', options: [['Следы', 'knowledge'], ['Лесник', 'care'], ['Трофей', 'utility'], ['Камни', null], ['Рога', 'beauty']] },
  { stimulus: 'ТРАВА', options: [['Роса', 'beauty'], ['Стебель', 'knowledge'], ['Поливать', 'care'], ['Силос', 'utility'], ['Кора', null]] },
  { stimulus: 'МЕДВЕДЬ', options: [['Хозяин', 'beauty'], ['Малина', 'knowledge'], ['Редкий', 'care'], ['Шкура', 'utility'], ['Берлога', null]] },
  { stimulus: 'БОЛОТО', options: [['Головастик', 'knowledge'], ['Заказник', 'care'], ['Торф', 'utility'], ['Яблоки', null], ['Туман', 'beauty']] },
  { stimulus: 'УТКА', options: [['Запрет', 'care'], ['Жаркое', 'utility'], ['Рассвет', 'beauty'], ['Ветка', null], ['Кольцевание', 'knowledge']] },
  { stimulus: 'РЫБА', options: [['Жабры', 'knowledge'], ['Серебристая', 'beauty'], ['Нерестилище', 'care'], ['Жарить', 'utility'], ['Перо', null]] },
  { stimulus: 'САД', options: [['Цветущий', 'beauty'], ['Опыление', 'knowledge'], ['Ухаживать', 'care'], ['Урожай', 'utility'], ['Паутина', null]] },
  { stimulus: 'ОЗЕРО', options: [['Улов', 'utility'], ['Шерсть', null], ['Острова', 'beauty'], ['Моллюск', 'knowledge'], ['Очищать', 'care']] },
  { stimulus: 'ДЕРЕВО', options: [['Осень', 'beauty'], ['Кольца', 'knowledge'], ['Вырастить', 'care'], ['Мебель', 'utility'], ['Сено', null]] },
  { stimulus: 'БОБР', options: [['Ловкий', 'beauty'], ['Резцы', 'knowledge'], ['Расселение', 'care'], ['Шуба', 'utility'], ['Грибы', null]] },
  { stimulus: 'ПРИРОДА', options: [['Красота', 'beauty'], ['Изучение', 'knowledge'], ['Охрана', 'care'], ['Польза', 'utility']] },
] as const;

const scaleMeta = [
  { key: 'beauty', label: 'Эстетическая установка (природа как объект красоты)' },
  { key: 'knowledge', label: 'Когнитивная установка (природа как объект изучения)' },
  { key: 'care', label: 'Этическая установка (природа как объект охраны)' },
  { key: 'utility', label: 'Прагматическая установка (природа как объект пользы)' },
] as const;

const questions: SeedSection['questions'] = blocks.map((block, index) => ({
  code: `test_154_${index + 1}`,
  text: block.stimulus,
  type: 'single',
  required: true,
  options: block.options.map(([label], optionIndex) => ({ value: String(optionIndex + 1), label })),
}));

export const instrument: SeedSection = {
  code: 'test_154',
  title: 'Вербальная ассоциативная методика ЭЗОП',
  description: "Методика изучает отношение человека к природе по эстетическому, познавательному, этическому и прагматическому направлениям. Вербальные ассоциации используются для описания того, видит ли респондент в природе красоту, объект познания, ценность, требующую охраны, или источник пользы.",
  questions,
};

const indices = blocks.map((block) => block.options.reduce<Record<string, number[]>>((acc, option, optionIndex) => {
  const [, scale] = option;
  if (scale) (acc[scale] ??= []).push(optionIndex + 1);
  return acc;
}, {}));

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: scaleMeta.map(({ key, label }) => ({
    key,
    label,
    items: blocks.map((_, index) => index + 1),
    reverseItems: [],
    aggregation: 'sum',
    weights: Object.fromEntries(indices.flatMap((item, index) => item[key] ? [[index + 1, 1]] : [])),
  })),
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: эстетические ответы по всем пунктам; отвлекающие ответы дают ноль',
    answers: { '1': 1, '2': 5, '3': 1, '4': 1, '5': 5, '6': 3, '7': 2, '8': 1, '9': 3, '10': 1, '11': 1, '12': 1 },
    expected: { beauty: 12, knowledge: 0, care: 0, utility: 0 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'deryabo-yasvin-ezop-12-category-counts-trash-zero-v1',
};
