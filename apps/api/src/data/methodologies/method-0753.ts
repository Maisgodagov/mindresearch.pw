import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const answers = [
  { value: '5', label: 'Очень сильно повлияло' },
  { value: '4', label: 'Сильно повлияло' },
  { value: '3', label: 'Средне повлияло' },
  { value: '2', label: 'Слабо повлияло' },
  { value: '1', label: 'Никак не повлияло' },
];

const items = [
  'Требует общения с разными людьми',
  'Нравится родителям',
  'Предполагает высокое чувство ответственности',
  'Требует переезда на новое место жительства',
  'Соответствует моим способностям',
  'Позволяет ограничиться имеющимся оборудованием',
  'Дает возможность приносить пользу людям',
  'Способствует умственному и физическому развитию',
  'Является высокооплачиваемой',
  'Позволяет работать близко от дома',
  'Является престижной',
  'Дает возможности для роста профессионального мастерства',
  'Единственно возможная в сложившихся обстоятельствах',
  'Позволяет реализовать способности к руководящей работе',
  'Является привлекательной',
  'Близка к любимому школьному предмету',
  'Позволяет сразу получить хороший результат труда для других',
  'Избрана моими друзьями',
  'Позволяет использовать профессиональные умения вне работы',
  'Дает большие возможности проявить творчество',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_783_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: answers,
}));

export const instrument: SeedSection = {
  code: 'test_783',
  title: 'Мотивы выбора профессии (Р. В. Овчарова)',
  description: 'Методика оценивает ведущие мотивы выбора профессии у школьников и студентов: внутренние индивидуально значимые и социально значимые мотивы, а также внешние положительные и отрицательные факторы. Профиль помогает автору опроса обсуждать основания профессионального выбора и различать интерес к содержанию труда, общественную направленность и влияние внешних обстоятельств.',
  questions,
};

const scaleItems = [
  { key: 'internal_individual', label: 'Внутренние индивидуально значимые мотивы', items: [1, 5, 8, 15, 20] },
  { key: 'internal_social', label: 'Внутренние социально значимые мотивы', items: [3, 7, 12, 14, 17] },
  { key: 'external_positive', label: 'Внешние положительные мотивы', items: [4, 9, 10, 16, 19] },
  { key: 'external_negative', label: 'Внешние отрицательные мотивы', items: [2, 6, 11, 13, 18] },
];

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: scaleItems.map(scale => ({ ...scale, reverseItems: [], aggregation: 'sum' })),
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы «Никак не повлияло» дают по 5 баллов на шкале',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { internal_individual: 5, internal_social: 5, external_positive: 5, external_negative: 5 },
  },
  {
    title: 'Все ответы «Очень сильно повлияло» дают по 25 баллов на шкале',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 5])),
    expected: { internal_individual: 25, internal_social: 25, external_positive: 25, external_negative: 25 },
  },
  {
    title: 'Проверка ключа на одном пункте каждой шкалы',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), [1, 2, 3, 4].includes(index + 1) ? 5 : 1])),
    expected: { internal_individual: 9, internal_social: 9, external_positive: 9, external_negative: 21 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'ovcharova-motives-choice-profession-1993-v1',
};
