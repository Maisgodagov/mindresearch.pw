import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const responseOptions = [
  { value: '1', label: 'Полностью согласен' },
  { value: '2', label: 'Скорее согласен' },
  { value: '3', label: 'Не уверен' },
  { value: '4', label: 'Скорее не согласен' },
  { value: '5', label: 'Полностью не согласен' },
];

const items = [
  'Справедливо ли утверждение о том, что отказ от веры есть причина проблем нашего общества?',
  'В современном мире вера нуждается в защите?',
  'Искренно верующий человек всегда будет Вашим другом?',
  'Следует ли считать положения веры выше закона?',
  'В наше время следует ли ограждать молодежь от искажений религии?',
  'С верующим человеком Вам легче общаться, чем с неверующим?',
  'Считаете ли Вы, что спасти общество может только религия?',
  'Считаете необходимым бороться с современным искажением религии?',
  'Мысли верующего человека Вам проще понять, чем неверующего?',
  'Полагаете ли Вы, что верующий должен быть примером для неверующих людей?',
  'Полагаете ли Вы, что верующий должен защищать веру от современных искажений?',
  'Должна ли современная культура быть связана с религией?',
  'Только верующие люди способны спасти наше общество?',
  'Сейчас оберегать веру должен каждый верующий человек?',
  'Основу общества составляют верующие люди?',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1545_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: responseOptions,
}));

export const instrument: SeedSection = {
  code: 'test_1545',
  title: 'Риск религиозной радикализации',
  description: 'Опросник К. В. Злоказова оценивает у молодых людей 16–30 лет субъективные представления о религии и верующих как предпосылки религиозной радикализации. Он охватывает установки на усиление роли религии в обществе (клерикализация), защиту веры от внешнего влияния (ксенофобия) и предпочтение верующих неверующим (дискриминация); предназначен для исследовательского изучения этих установок.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'clericalization', label: 'Клерикализация', items: [1, 4, 7, 10, 13], reverseItems: [], aggregation: 'sum' },
    { key: 'xenophobia', label: 'Ксенофобия', items: [2, 5, 8, 11, 14], reverseItems: [], aggregation: 'sum' },
    { key: 'discrimination', label: 'Дискриминация', items: [3, 6, 9, 12, 15], reverseItems: [], aggregation: 'sum' },
    { key: 'total', label: 'Общий показатель', items: Array.from({ length: 15 }, (_, index) => index + 1), reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Полное согласие: минимальные суммы по всем шкалам',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { clericalization: 5, xenophobia: 5, discrimination: 5, total: 15 },
  },
  {
    title: 'Полное несогласие: максимальные суммы по всем шкалам',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 5])),
    expected: { clericalization: 25, xenophobia: 25, discrimination: 25, total: 75 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'zlokazov-religious-radicalization-2023-15item-v1',
};
