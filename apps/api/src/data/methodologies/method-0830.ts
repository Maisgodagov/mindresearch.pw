import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const answerOptions = [
  { value: '1', label: 'Да' },
  { value: '0', label: 'Нет' },
];

const itemTexts = [
  'Возникало ли у Вас ощущение того, что Вам следует сократить употребление спиртных напитков?',
  'Вызывало ли у Вас чувство раздражения, если кто-то из окружающих (друзья, родственники) говорил Вам о необходимости сократить употребление спиртных напитков?',
  'Испытывали ли Вы чувство вины, связанное с употреблением спиртных напитков?',
  'Возникало ли у Вас желание принять спиртное, как только Вы просыпались после имевшего место употребления алкогольных напитков?',
];

export const instrument: SeedSection = {
  code: 'test_860',
  title: 'Опросник CAGE (адаптация А. Е. Успенского)',
  description: 'Краткий четырёхпунктовый скрининговый опросник выявляет признаки проблемного употребления алкоголя: желание сократить употребление, раздражение из-за замечаний окружающих, чувство вины и утреннее желание выпить после употребления алкоголя. Русская адаптация А. Е. Успенского предназначена для скрининга взрослых пациентов, в частности в общемедицинской практике; результат служит поводом для дальнейшей клинической оценки, а не самостоятельным диагнозом.',
  questions: itemTexts.map((text, index) => ({
    code: `test_860_${index + 1}`,
    text,
    type: 'single',
    required: true,
    options: answerOptions,
  })),
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 1,
  scales: [{
    key: 'total',
    label: 'Суммарный балл CAGE',
    items: [1, 2, 3, 4],
    reverseItems: [],
    aggregation: 'sum',
  }],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы отрицательные: 0 баллов',
    answers: { '1': 0, '2': 0, '3': 0, '4': 0 },
    expected: { total: 0 },
  },
  {
    title: 'Три утвердительных ответа: 3 балла',
    answers: { '1': 1, '2': 1, '3': 1, '4': 0 },
    expected: { total: 3 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'cage-uspensky-1994-russian-v1',
};
