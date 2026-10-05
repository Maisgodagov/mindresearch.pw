import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const responseOptions = [
  { value: '1', label: 'Совсем нет' },
  { value: '2', label: 'Немного' },
  { value: '3', label: 'Умеренно' },
  { value: '4', label: 'Сильно' },
  { value: '5', label: 'Очень сильно' },
];

const itemTexts = [
  'Меня беспокоит, что другие люди думают о моей внешности',
  'Я переживаю, если знаю, что кто-то оценивает мой внешний вид',
  'Я беспокоюсь, что люди увидят недостатки в моей внешности',
  'Когда я знакомлюсь с новыми людьми, мне интересно, что они подумают о моей внешности',
  'Я боюсь, что другие люди заметят мои физические недостатки',
  'Я думаю, что мнение других людей о моей внешности слишком важно для меня',
];

const questions: SeedSection['questions'] = itemTexts.map((text, index) => ({
  code: `test_1688_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: responseOptions,
}));

const instrument: SeedSection = {
  code: 'test_1688',
  title: 'Страх негативной оценки внешности (СНОВ; FNAES)',
  description: 'Однофакторная шкала измеряет выраженность страха и тревоги из-за предполагаемой негативной оценки собственной внешности окружающими. Пункты охватывают беспокойство о мнении других, оценивании внешнего вида и замечании физических недостатков; русская адаптация Разваляевой и Польской предназначена для исследовательского применения у русскоязычных респондентов (адаптация проверялась на выборке 16–48 лет).',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 6,
  max: 30,
  scales: [{
    key: 'fnaesTotal',
    label: 'Суммарный балл СНОВ',
    items: [1, 2, 3, 4, 5, 6],
    reverseItems: [],
    aggregation: 'sum',
  }],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: все ответы «Умеренно» (3), сумма шести пунктов',
    answers: { '1': 3, '2': 3, '3': 3, '4': 3, '5': 3, '6': 3 },
    expected: { fnaesTotal: 18 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'fnaes-lundgren-2004-ru-razvalyaeva-polskaya-2020-six-item-sum-v1',
};
