import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const responseOptions = [
  { value: '1', label: 'Совсем неверно' },
  { value: '2', label: 'Немного неверно' },
  { value: '3', label: 'В меру верно' },
  { value: '4', label: 'Совершенно верно' },
  { value: '5', label: 'Чрезвычайно верно' },
];

const itemTexts = [
  'Когда рядом со мной кто-то кашляет, я тоже начинаю кашлять.',
  'Я не выношу дыма, смога или загрязняющих веществ в воздухе.',
  'Я часто ощущаю различные процессы, происходящие в моем теле.',
  'Если на моем теле появляется синяк, он остается заметным в течение длительного времени.',
  'Внезапные громкие звуки способны сильно встревожить меня.',
  'Иногда я слышу свой пульс или сердцебиение в ушах.',
  'Я ненавижу, когда слишком жарко или слишком холодно.',
  'У меня быстро возникают голодные боли в животе.',
  'Даже такая мелочь, как заноза или укус насекомого, действительно меня тревожит.',
  'Я плохо переношу боль.',
];

const questions: SeedSection['questions'] = itemTexts.map((text, index) => ({
  code: `test_2418_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: responseOptions,
}));

export const instrument: SeedSection = {
  code: 'test_2418',
  title: 'Шкала соматосенсорной амплификации (SSAS), русскоязычная версия',
  description: 'SSAS оценивает склонность переживать телесные ощущения как интенсивные, неприятные и тревожные. Пункты охватывают внимание к внутренним ощущениям, реакцию на обычные телесные и внешние стимулы, боль, температуру и голод. Русскоязычная адаптация А. А. Золотаревой предназначена для эмпирических исследований общей русскоязычной популяции; опубликованная клиническая валидизация пока ограничена.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'somatosensory_amplification', label: 'Соматосенсорная амплификация (сумма)', items: Array.from({ length: 10 }, (_, index) => index + 1), reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: все десять ответов по 1 дают сумму 10',
    answers: Object.fromEntries(Array.from({ length: 10 }, (_, index) => [String(index + 1), 1])),
    expected: { somatosensory_amplification: 10 },
  },
  {
    title: 'Ручная проверка: все десять ответов по 5 дают сумму 50',
    answers: Object.fromEntries(Array.from({ length: 10 }, (_, index) => [String(index + 1), 5])),
    expected: { somatosensory_amplification: 50 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument: { ...instrument, categoryIds: ['clinical-somatic'] },
  categoryIds: ['clinical-somatic'],
  scoringConfig,
  validationCases,
  formulaVersion: 'ssas-zolotareva-ru-2024-v1',
};
