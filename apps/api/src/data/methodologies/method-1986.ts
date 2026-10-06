import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const responseOptions = [
  { value: '1', label: 'Не сформирована' },
  { value: '2', label: 'Едва ли сформирована' },
  { value: '3', label: 'Слабо сформирована' },
  { value: '4', label: 'Более или менее сформирована' },
  { value: '5', label: 'Полностью сформирована' },
];

const items = [
  'Способность оценить дальнейшие перспективы',
  'Способность прогнозировать будущее',
  'Способность замечать малейшие признаки неожиданных обстоятельств',
  'Способность принимать оценку/критику окружающих',
  'Способность видеть свои возможности и перспективы',
  'Способность видеть свои ограничения',
  'Способность оценивать окружающих',
  'Способность четко понимать, чего я хочу достичь',
  'Способность претворять желания в планы',
  'Способность реально планировать',
  'Способность обратиться к окружающим за советом',
  'Способность искать решение проблемы',
  'Способность находить альтернативы при отсутствии результата от принятых решений',
  'Способность осуществлять задуманное',
  'Способность быть настойчивым',
  'Способность обратиться за помощью в трудной ситуации',
  'Способность понимать, совпадает ли моя цель с полученным результатом',
  'Способность видеть позитивное в неудачной ситуации',
  'Способность учиться на своих ошибках',
  'Способность анализировать ситуацию в случае ее успеха',
  'Способность похвалить себя при достижении желаемой цели',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2002_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: responseOptions,
}));

export const instrument: SeedSection = {
  code: 'test_2002',
  title: 'Утрехтская шкала проактивной копинг-компетентности (русская адаптация)',
  description: 'Оценивает воспринимаемую способность взрослого человека заранее замечать возможные трудности и справляться с ними. Охватывает планирование, анализ ситуации и результатов, прогнозирование проблем, обращение за социальной поддержкой и понимание собственных ограничений; подходит для взрослых 18–57 лет в версии первичной русскоязычной адаптации.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'planning', label: 'Планирование', items: [1, 5, 8, 9, 10, 14, 15], reverseItems: [], aggregation: 'sum' },
    { key: 'situation_analysis', label: 'Анализ ситуации', items: [12, 13, 17, 18, 19, 20, 21], reverseItems: [], aggregation: 'sum' },
    { key: 'problem_anticipation', label: 'Прогнозирование проблемы', items: [1, 2, 3, 7, 13, 21], reverseItems: [], aggregation: 'sum' },
    { key: 'social_support', label: 'Социальная поддержка', items: [7, 11, 16, 19], reverseItems: [], aggregation: 'sum' },
    { key: 'own_limitations', label: 'Понимание собственных ограничений', items: [4, 5, 6, 7, 13], reverseItems: [], aggregation: 'sum' },
  ],
};

const allAnswers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  {
    title: 'Все способности оценены минимально',
    answers: allAnswers(1),
    expected: { planning: 7, situation_analysis: 7, problem_anticipation: 6, social_support: 4, own_limitations: 5 },
  },
  {
    title: 'Все способности оценены максимально',
    answers: allAnswers(5),
    expected: { planning: 35, situation_analysis: 35, problem_anticipation: 30, social_support: 20, own_limitations: 25 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'upcc-ru-bekhter-2025-v1',
};
