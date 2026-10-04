import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const responseOptions = [
  { value: '1', label: 'Да' },
  { value: '0', label: 'Нет' },
];

const items = [
  'Неспособность расслабиться (напряженность).',
  'Раздражение и плохое настроение.',
  'Вторжение в сознание неприятных образов или воспоминаний об инциденте.',
  'Рассеянность, плохое сосредоточение внимания.',
  'Сильная грусть, печаль.',
  'Сильная усталость, недостаток энергии.',
  'Потрясение или паника.',
  'Стремление избегать всего, что напоминает об инциденте или травмирующем событии.',
  'Трудности засыпания, ухудшение сна.',
  'Снижение интереса к жизни, к привычной деятельности, в том числе – профессиональной.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_488_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: responseOptions,
}));

export const instrument: SeedSection = {
  code: 'test_488',
  title: 'Краткая шкала тревоги, депрессии и ПТСР (Котенёв)',
  description: 'Краткий скрининговый опросник выявляет выраженность тревожно-депрессивных и связанных с травматизацией состояний после критического инцидента или психической травмы. Охватывает напряжение, раздражительность и настроение, навязчивые воспоминания, концентрацию, усталость, избегание, сон и снижение интереса. Русская версия И. О. Котенева подходит для первичного скрининга взрослых, в том числе сотрудников, выполнявших служебные или боевые задачи в особых условиях; результат не является диагнозом.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 1,
  scales: [
    { key: 'affirmative_count', label: 'Количество утвердительных ответов «Да»', items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: четыре ответа «Да» — порог не превышен',
    answers: { '1': 1, '2': 1, '3': 1, '4': 1, '5': 0, '6': 0, '7': 0, '8': 0, '9': 0, '10': 0 },
    expected: { affirmative_count: 4 },
  },
  {
    title: 'Ручная проверка: пять ответов «Да» — порог превышен',
    answers: { '1': 1, '2': 1, '3': 1, '4': 1, '5': 1, '6': 0, '7': 0, '8': 0, '9': 0, '10': 0 },
    expected: { affirmative_count: 5 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'kotenев-hart-brief-anxiety-depression-ptsd-1996-yes-count-v1',
};
