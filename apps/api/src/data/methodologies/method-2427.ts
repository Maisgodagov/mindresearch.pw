import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Совсем не описывает меня' },
  { value: '2', label: 'Немного описывает меня' },
  { value: '3', label: 'Умеренно описывает меня' },
  { value: '4', label: 'Хорошо описывает меня' },
  { value: '5', label: 'Крайне удачно описывает меня' },
];

const items = [
  'Меня беспокоит, что другие люди проводят время с большим удовлетворением, чем я.',
  'Меня беспокоит, что мои друзья проводят время с большим удовлетворением, чем я.',
  'Я переживаю, когда узнаю, что мои друзья веселятся без меня.',
  'Я тревожусь, когда я не знаю, чем планируют заниматься мои друзья.',
  'Мне важно понимать «шутки для своих» в компании друзей.',
  'Иногда я задумываюсь, не слишком ли много времени я трачу, чтобы быть в курсе всего происходящего.',
  'Я беспокоюсь, когда упускаю возможность встретиться с друзьями.',
  'Если я хорошо провожу время, мне важно делиться подробностями онлайн (например, обновлять статус).',
  'Я переживаю, если не могу присоединиться к запланированной встрече с друзьями.',
  'Когда я уезжаю на отдых, я продолжаю следить за тем, чем занимаются мои друзья.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2445_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

const instrument: SeedSection = {
  code: 'test_2445',
  title: 'Шкала страха упущенных возможностей (FoMOs)',
  description: 'Десятипунктовая русскоязычная версия FoMOs измеряет индивидуальные различия в опасении упустить более приятный опыт, общение и события, доступные другим. Пункты охватывают социальное сравнение, тревогу из-за активности друзей, пропущенные встречи и стремление следить за происходящим и делиться им онлайн. Подходит для исследовательских опросов взрослых; это полный перевод исходной десятипунктовой шкалы, а не шестипунктовая факторная адаптация Ардисламова и коллег 2024 года.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [{
    key: 'total',
    label: 'Средний показатель страха упущенных возможностей',
    items: Array.from({ length: 10 }, (_, index) => index + 1),
    reverseItems: [],
    aggregation: 'mean',
  }],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы минимальны: среднее 1',
    answers: Object.fromEntries(Array.from({ length: 10 }, (_, index) => [String(index + 1), 1])),
    expected: { total: 1 },
  },
  {
    title: 'Ручная проверка: пункты 1–5 равны 1, пункты 6–10 равны 5; среднее 3',
    answers: Object.fromEntries(Array.from({ length: 10 }, (_, index) => [String(index + 1), index < 5 ? 1 : 5])),
    expected: { total: 3 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument: { ...instrument, categoryIds: ['cyberpsychology'] },
  scoringConfig,
  validationCases,
  formulaVersion: 'przybylski-fomos-ru-psytests-10item-mean-v1',
};
