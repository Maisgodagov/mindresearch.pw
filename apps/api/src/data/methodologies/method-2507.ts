import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Совсем не почувствовал' },
  { value: '2', label: 'Почти не почувствовал' },
  { value: '3', label: 'Средне' },
  { value: '4', label: 'Сильно' },
  { value: '5', label: 'Очень сильно' },
];

const itemTexts = [
  'Я почувствовал их красоту.',
  'Заставили меня задуматься.',
  'Порадовали меня.',
  'Успокоили меня.',
  'Пробудили любопытство.',
  'Понравились мне.',
  'Заинтриговали меня.',
  'Вызвали чудесные ощущения.',
  'Вдохнули в меня жизнь.',
  'Вызвали множество мыслей.',
  'Ошеломили меня.',
  'Показались мне безобразными.',
  'Я почувствовал глубокий смысл.',
  'Растрогали меня.',
  'Навеяли на меня тоску.',
  'Зарядили меня энергией.',
  'Вызвали раздражение.',
  'Зачаровали меня.',
  'Навеяли на меня скуку.',
  'Расслабили меня.',
  'Я почувствовал озарение.',
  'Позабавили меня.',
  'Навеяли на меня грусть.',
  'Сбили меня с толку.',
  'Разозлили меня.',
  'Пробудили сентиментальные чувства.',
  'Обеспокоили меня.',
  'Вызвали ностальгию.',
  'Удивили меня.',
  'Вызвали гнетущие чувства.',
  'Вызвали возвышенные чувства.',
  'Воодушевили меня.',
  'Оставили меня равнодушным.',
  'Впечатлили меня.',
  'Показались мне безвкусными.',
  'Тронули меня.',
  'Почувствовал себя растерянным.',
  'Вызвали интерес.',
  'Сделали меня счастливым.',
  'Я почувствовал благоговение и трепет.',
  'Пробудили желание действовать.',
  'Развеселили меня.',
];

const questions: SeedSection['questions'] = itemTexts.map((text, index) => ({
  code: `test_2525_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2525',
  title: 'Шкала эстетических эмоций (ЭстЭм)',
  description: 'Русскоязычная версия Шкалы эстетических эмоций оценивает интенсивность переживаний в ответ на конкретный эстетический стимул или частоту таких переживаний в рамках длительного события. Пункты охватывают негативные и прототипические эстетические эмоции, познавательные переживания, оживление, ностальгию и расслабление, развлечение и грусть. Подходит авторам опросов для изучения реакции русскоязычных взрослых на произведения искусства и другие эстетически значимые стимулы; опубликованная российская апробация проведена преимущественно на молодой московской выборке.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'negative_emotions', label: 'Негативные эмоции', items: [12, 35, 24, 37, 17, 25, 19, 33, 27, 30], reverseItems: [], aggregation: 'mean' },
    { key: 'prototypical_emotions', label: 'Прототипические эстетические эмоции', items: [14, 36, 11, 29, 7, 37, 1, 6, 31, 40], reverseItems: [], aggregation: 'mean' },
    { key: 'epistemic_emotions', label: 'Эпистемические эмоции', items: [2, 10, 5, 38, 13, 21], reverseItems: [], aggregation: 'mean' },
    { key: 'revitalization', label: 'Оживление', items: [16, 41, 9, 32, 8, 18], reverseItems: [], aggregation: 'mean' },
    { key: 'nostalgia_relaxation', label: 'Ностальгия / Расслабление', items: [26, 28, 4, 20], reverseItems: [], aggregation: 'mean' },
    { key: 'entertainment', label: 'Развлечение', items: [3, 39, 22, 42], reverseItems: [], aggregation: 'mean' },
    { key: 'sadness', label: 'Грусть', items: [15, 23], reverseItems: [], aggregation: 'mean' },
  ],
};

const allAnswers = Object.fromEntries(itemTexts.map((_, index) => [String(index + 1), 3]));
const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: средний ответ по всем пунктам шкал даёт среднее 3',
    answers: allAnswers,
    expected: {
      negative_emotions: 3,
      prototypical_emotions: 3,
      epistemic_emotions: 3,
      revitalization: 3,
      nostalgia_relaxation: 3,
      entertainment: 3,
      sadness: 3,
    },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['trait-cognitive'],
  scoringConfig,
  validationCases,
  formulaVersion: 'shestova-aesthetic-emotions-42item-seven-scales-mean-v1',
};
