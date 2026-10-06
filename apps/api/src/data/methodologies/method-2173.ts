import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'Никогда' },
  { value: '1', label: 'Редко' },
  { value: '2', label: 'Иногда' },
  { value: '3', label: 'Часто' },
  { value: '4', label: 'Очень часто' },
];

const statements = [
  'Я думаю, что мои физические симптомы являются признаками серьезного заболевания',
  'Я сильно беспокоюсь о своем здоровье',
  'Мои проблемы со здоровьем мешают мне в повседневной жизни',
  'Я убежден, что мои симптомы серьезны',
  'Мне бывает страшно из-за моих симптомов',
  'Мое физическое недомогание занимает меня большую часть дня',
  'Другие говорят мне, что мои физические проблемы несерьезны',
  'Я беспокоюсь, что мое физическое недомогание никогда не прекратится',
  'Заботы о своем здоровье отнимают у меня энергию',
  'Я думаю, что врачи не воспринимают всерьез мое физическое недомогание',
  'Я беспокоюсь, что мои физические симптомы будут мешать мне в будущем',
  'Из-за физического недомогания я плохо сосредотачиваюсь на других вещах',
];

const questions: SeedSection['questions'] = statements.map((statement, index) => ({
  code: `test_2187_${index + 1}`,
  text: statement,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2187',
  title: 'Шкала критерия В соматического симптоматического расстройства (SSD-12), русскоязычная версия',
  description: 'SSD-12 оценивает чрезмерные когнитивные, эмоциональные и поведенческие реакции, связанные с физическими симптомами и здоровьем. Три субшкалы отражают убеждения и интерпретации симптомов, тревогу и страх по поводу них, а также влияние обеспокоенности здоровьем на повседневное поведение; русскоязычная версия адаптирована для общей популяции и может помогать исследовать психологический компонент соматизации.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 4,
  scales: [
    { key: 'cognitive', label: 'Когнитивные аспекты соматизации', items: [1, 4, 7, 10], reverseItems: [], aggregation: 'sum' },
    { key: 'emotional', label: 'Эмоциональные аспекты соматизации', items: [2, 5, 8, 11], reverseItems: [], aggregation: 'sum' },
    { key: 'behavioral', label: 'Поведенческие аспекты соматизации', items: [3, 6, 9, 12], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная сверка по ключу: ответы 0–11 дают когнитивную 18, эмоциональную 26 и поведенческую 22',
    answers: Object.fromEntries(Array.from({ length: 12 }, (_, index) => [String(index + 1), index])),
    expected: { cognitive: 18, emotional: 26, behavioral: 22 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'ssd-12-zolotareva-ru-2024-v1',
};
