import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Совершенно не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Скорее не согласен' },
  { value: '4', label: 'Скорее согласен' },
  { value: '5', label: 'Согласен' },
  { value: '6', label: 'Совершенно согласен' },
];

const statements = [
  'Меня не особенно беспокоит то, что происходит сейчас в моей жизни',
  'Если длительное время не получается решить какую-то жизненную задачу, то, в конце концов, начинаю относиться к ней с безразличием и равнодушием',
  'Даже если что-то имеет для меня важное значение, стараюсь не показывать этого окружающим',
  'У меня пока нет определенных целей и планов на будущее',
  'Когда дело не ладится, несмотря на все приложенные усилия, на него проще «махнуть рукой»',
  'Если что-то вызывает у меня сильные эмоции, стараюсь не подать об этом виду',
  'Когда не удается добиться желаемого, проще отказаться от старой цели и найти себе новую',
  'Я не вкладываю больших усилий в свои повседневные дела и обязанности',
  'При обсуждении многих проблем лучше прикинуться незаинтересованным, чем раскрыть собственные интересы',
];

const questions: SeedSection['questions'] = statements.map((text, index) => ({
  code: `test_293_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_293',
  title: 'Дифференциальный опросник безразличия',
  description: 'Методика К. В. Карпинского измеряет безразличие как индивидуально-психологическое свойство и различает интернальное безразличие (снижение мотивации и личностного смысла), экстернальное (демонстративную отстранённость при сокрытии интересов) и аккомодативное (отказ от прежних целей при неудачах). Подходит для описания этих особенностей личности в исследовательских опросах по версии автора 2022 года.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 6,
  scales: [
    { key: 'accommodative', label: 'Аккомодативное безразличие', items: [2, 5, 7], reverseItems: [], aggregation: 'sum' },
    { key: 'external', label: 'Экстернальное безразличие', items: [3, 6, 9], reverseItems: [], aggregation: 'sum' },
    { key: 'internal', label: 'Интернальное безразличие', items: [1, 4, 8], reverseItems: [], aggregation: 'sum' },
    { key: 'total', label: 'Общее безразличие', items: [1, 2, 3, 4, 5, 6, 7, 8, 9], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [{
  title: 'Ручная проверка по дешифратору: ответы 1–9 равны 1–6 соответственно; аккомодативное=8, экстернальное=10, интернальное=12, общее=30',
  answers: { '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 1, '8': 2, '9': 3 },
  expected: { accommodative: 8, external: 12, internal: 7, total: 27 },
}];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'karpinsky-differential-questionnaire-indifference-2022-nine-item-sums-v1',
};
