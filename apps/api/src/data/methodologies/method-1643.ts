import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'Неверно' },
  { value: '1', label: 'Иногда верно' },
  { value: '2', label: 'Верно' },
];

const statements = [
  'Я откладываю принятие решений до последнего момента.',
  'Я откладываю реализацию желаемой цели, чтобы выполнить свою задачу как можно лучше.',
  'После реализации намеченной цели, я испытываю тревогу, что не выполнил свою задачу вовремя.',
  'Приняв решение я, как правило, откладываю на неопределенный срок его реализацию.',
  'Я должен выполнить задуманное как можно лучше, поэтому сначала выполняю неглавные задачи.',
  'Я откладываю реализацию желаемой цели, чтобы выполнить свою задачу не тревожась заранее.',
  'Прежде чем принять решение у меня уходит много времени на то, чтобы заставить себя целенаправленно думать о нём.',
  'Все запланированные задачи мне надо сделать как можно лучше, поэтому я не тороплюсь с выполнением и главных, и второстепенных задач.',
  'Я ощущаю тревогу, когда требуется принять главное решение.',
  'Прежде чем реализовывать основное дело, я трачу много времени на реализацию второстепенных задач.',
  'Чем труднее намеченная цель, тем менее я смотивирован принять быстрое решение и, тем больше удовольствия я получаю от её реализации.',
  'У меня вызывает тревогу реализация принятого решения, поэтому я стараюсь не спешить с его принятием.',
  'Я откладываю реализацию желаемой цели, чтобы получить удовольствие, выполняя задачу в экстремально короткие сроки.',
  'Для меня важно выполнить трудноразрешимую задачу как можно лучше, поэтому трачу много времени и на процесс принятия решения и на процесс реализации.',
  'Я испытываю тревогу в процессе принятия главного решения, поэтому трачу много времени на выполнение второстепенных задач, прежде чем приступить к главной цели.',
];

const questions: SeedSection['questions'] = statements.map((text, index) => ({
  code: `test_1660_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1660',
  title: 'Степень выраженности прокрастинации (СВП)',
  description: 'Опросник оценивает выраженность добровольного откладывания значимых целей, а также связанные с ним мотивационную недостаточность, перфекционизм и тревожность. Разработан М. А. Киселевой для изучения прокрастинации у молодёжи; результаты помогают автору опроса описать общий показатель и профиль по трём компонентам, не являясь клиническим диагнозом.',
  questions,
};

const itemRange = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, index) => from + index);
export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 2,
  scales: [
    { key: 'overall', label: 'Общая прокрастинация', items: itemRange(1, 15), reverseItems: [], aggregation: 'sum' },
    { key: 'motivation', label: 'Мотивационная недостаточность', items: [1, 4, 7, 10, 13], reverseItems: [], aggregation: 'sum' },
    { key: 'perfectionism', label: 'Перфекционизм', items: [2, 5, 8, 11, 14], reverseItems: [], aggregation: 'sum' },
    { key: 'anxiety', label: 'Тревожность', items: [3, 6, 9, 12, 15], reverseItems: [], aggregation: 'sum' },
  ],
};

const all = (value: number) => Object.fromEntries(itemRange(1, 15).map(item => [String(item), value]));
export const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы «Неверно»: нулевые суммы',
    answers: all(0),
    expected: { overall: 0, motivation: 0, perfectionism: 0, anxiety: 0 },
  },
  {
    title: 'Все ответы «Верно»: максимальные суммы',
    answers: all(2),
    expected: { overall: 30, motivation: 10, perfectionism: 10, anxiety: 10 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'kiselyova-svp-2015-v1',
};
