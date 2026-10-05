import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Никогда не появляется' },
  { value: '2', label: 'Редко появляется' },
  { value: '3', label: 'Появляется в половине случаев' },
  { value: '4', label: 'Обычно появляется' },
  { value: '5', label: 'Всегда появляется' },
];

const itemTexts = [
  'Сейчас меня вырвет.',
  'Я потеряю сознание.',
  'У меня, наверное, опухоль мозга.',
  'У меня будет сердечный приступ.',
  'Я задохнусь.',
  'Я поведу себя глупо.',
  'Я ослепну.',
  'Я не смогу себя контролировать.',
  'Я кому-нибудь наврежу.',
  'У меня случится удар.',
  'Я схожу с ума.',
  'Сейчас я закричу.',
  'Я наговорю глупостей и буду странно выражаться.',
  'Страх парализует меня.',
];

const questions: SeedSection['questions'] = [
  ...itemTexts.map((text, index) => ({
    code: `test_872_${index + 1}`,
    text,
    type: 'single' as const,
    required: true,
    options,
  })),
  {
    code: 'test_872_15',
    text: 'Другие мысли (пожалуйста, опишите их и оцените).',
    type: 'text',
    required: false,
  },
];

export const instrument: SeedSection = {
  code: 'test_872',
  title: 'Опросник агорафобических когниций (ACQ)',
  description: 'ACQ оценивает частоту катастрофических мыслей о физических последствиях тревоги и потере контроля, включая опасения социально-поведенческих последствий. Подходит для самоотчётной оценки таких мыслей у взрослых с тревожными и паническими переживаниями; результат описывает выраженность когниций и не является диагнозом.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    {
      key: 'total',
      label: 'Средняя частота агорафобических катастрофических мыслей',
      items: Array.from({ length: 14 }, (_, index) => index + 1),
      reverseItems: [],
      aggregation: 'mean',
    },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все четырнадцать оцениваемых мыслей получают среднее 3',
    answers: Object.fromEntries(Array.from({ length: 14 }, (_, index) => [String(index + 1), 3])),
    expected: { total: 3 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'acq-chambless-1984-leahy-ru-2017-mean14-v1',
};
