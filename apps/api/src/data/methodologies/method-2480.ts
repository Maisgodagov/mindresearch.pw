import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Абсолютно не согласен(на)' },
  { value: '2', label: 'Скорее не согласен(на)' },
  { value: '3', label: 'Не уверен(на)' },
  { value: '4', label: 'Скорее согласен(на)' },
  { value: '5', label: 'Абсолютно согласен(на)' },
];

const items = [
  'Принимая важное финансовое решение, я советуюсь с другими, но решение остается за мной.',
  'Мои финансовые проблемы касаются только меня, и никто не сможет их решить лучше, чем я сам(а).',
  'В решении важных финансовых вопросов я не стремлюсь поступать «как все», поскольку они тоже могут ошибаться.',
  'Для меня более свойственно ощущение, что я сам(а) контролирую финансовую ситуацию, чем ощущение зависимости от нее.',
  'В разных ситуациях, связанных с моими финансами, я предпочитаю брать ответственность на себя, а не перекладывать ее на других.',
  'Планируя свои личные финансы (кредиты, сбережение, инвестирование и т.п.) я больше доверяю себе, чем другим.',
  'В плане контроля моих финансов (состояние банковского счета, движение по карте и т.п.) для меня всегда важно быть в курсе происходящих событий.',
  'Даже если я не знаю, как поступить в решении финансовых проблем, я не полагаюсь на «авось» и решаю все вопросы сам(а).',
  'У меня есть собственные принципы финансового поведения (сберегательного, инвестиционного, кредитного), которым я всегда следую.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2498_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2498',
  title: 'Шкала финансовой автономности личности',
  description: 'Шкала измеряет способность человека самостоятельно, независимо от мнения окружающих управлять личными финансами, принимать связанные с ними решения, контролировать финансовое положение и брать ответственность за свои действия. Охватывает самостоятельность суждений, финансовый самоконтроль, ответственность и следование собственным принципам; разработана и психометрически проверена на предпенсионерах 45–63 лет, поэтому прежде всего подходит для исследовательского описания этой группы.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'total', label: 'Финансовая автономность', items: Array.from({ length: 9 }, (_, index) => index + 1), reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: все ответы 1 дают минимальную сумму',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { total: 9 },
  },
  {
    title: 'Ручная проверка: все ответы 5 дают максимальную сумму',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 5])),
    expected: { total: 45 },
  },
];

export const methodology: MethodologyRegistration = {
  categoryIds: ['social-attitude'],
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'drobycheva-financial-autonomy-2024-v1',
};
