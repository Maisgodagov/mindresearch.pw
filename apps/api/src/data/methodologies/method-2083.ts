import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Никогда' },
  { value: '2', label: 'Редко' },
  { value: '3', label: 'Временами' },
  { value: '4', label: 'Часто' },
  { value: '5', label: 'Очень часто' },
];

const items = [
  'Я чувствовал себя эмоционально онемевшим — неспособным полноценно испытывать чувства и эмоции',
  'У меня учащалось сердцебиение, когда я думал о работе с клиентами',
  'Мне казалось, что я проживаю травматическую ситуацию, пережитую моим клиентом',
  'У меня были проблемы со сном',
  'Мысли о будущем вызывали у меня растерянность',
  'Меня расстраивали напоминания о работе с клиентами',
  'Я почти не испытывал желания общаться с другими людьми',
  'Я чувствовал беспокойство',
  'Я был менее активен, чем обычно',
  'Я, не желая того, думал о своей работе с клиентами',
  'Мне было сложно концентрироваться',
  'Я избегал людей, мест или вещей, напоминавших мне о работе с клиентами',
  'Мне снились тревожные сны о работе с клиентами',
  'Мне хотелось избежать работы с некоторыми клиентами',
  'Я легко раздражался',
  'Мне казалось, что случится что-то плохое',
  'Я замечал пробелы в воспоминаниях о клиентских сессиях',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2097_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2097',
  title: 'Шкала вторичного травматического стресса (STSS), русскоязычная версия',
  description: 'Шкала оценивает частоту симптомов вторичного травматического стресса у специалистов, косвенно сталкивающихся с травматическим опытом клиентов или пациентов. Охватывает симптомы вторжения, избегания и гипервозбуждения за последние семь дней; русскоязычная версия опубликована и валидирована на выборке специалистов помогающих профессий, работающих с детьми с ОВЗ и инвалидностью и их семьями.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'intrusion', label: 'Симптомы вторжения', items: [2, 3, 6, 10, 13], reverseItems: [], aggregation: 'sum' },
    { key: 'avoidance', label: 'Симптомы избегания', items: [1, 5, 7, 9, 12, 14, 17], reverseItems: [], aggregation: 'sum' },
    { key: 'arousal', label: 'Симптомы гипервозбуждения', items: [4, 8, 11, 15, 16], reverseItems: [], aggregation: 'sum' },
    { key: 'total', label: 'Общий показатель вторичного травматического стресса', items: Array.from({ length: 17 }, (_, index) => index + 1), reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: все ответы «Никогда» дают нулевую сумму после центрирования шкалы 1–5',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { intrusion: 5, avoidance: 7, arousal: 5, total: 17 },
  },
  {
    title: 'Ручная проверка: ответ «Часто» на пункт 2 и «Никогда» на остальные',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), index === 1 ? 4 : 1])),
    expected: { intrusion: 8, avoidance: 7, arousal: 5, total: 20 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'stss-kazennaya-zolotareva-2025-ru-v1',
};
