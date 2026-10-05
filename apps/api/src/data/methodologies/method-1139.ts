import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const items = [
  'Я придерживаюсь здорового питания, даже если меня тянет объесться или съесть какую-нибудь вредную пищу.',
  'Не страшно испытывать тягу или желание к перееданию, потому что мне не обязательно идти у них на поводу.',
  'Мне необходимо контролировать свои позывы к еде, чтобы контролировать свое питание.',
  'Мне нужно сконцентрироваться на том, чтобы избавиться от желания питаться нездоровой едой.',
  'Мне не обязательно переедать, даже когда мне этого хочется.',
  'Контролировать свои позывы есть вредную пищу так же важно, как контролировать свое питание.',
  'Мои мысли и чувства по поводу еды должны поменяться, прежде чем я смогу изменить свое питание.',
  'Несмотря на свою тягу к нездоровой еде, я продолжаю питаться правильно.',
  'Прежде чем я смогу внести важные изменения в свое питание, мне придется научиться контролировать свои позывы что-либо съесть.',
  'Даже если мне сильно хочется съесть что-нибудь вредное, я всё равно могу питаться правильно.',
];

const options = [
  { value: '1', label: 'Очень редко верно' },
  { value: '2', label: 'Редко верно' },
  { value: '3', label: 'Иногда верно' },
  { value: '4', label: 'Часто верно' },
  { value: '5', label: 'Почти всегда верно' },
  { value: '6', label: 'Всегда верно' },
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1169_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1169',
  title: 'Опросник принятия и осознания питания (FAAQ)',
  description: 'FAAQ оценивает психологическую гибкость в ситуациях, связанных с едой: готовность придерживаться здорового питания при тяге и пищевых позывах, а также принятие связанных с едой мыслей, чувств и переживаний без попыток сначала подавить или контролировать их. Подходит для самоотчётного исследования пищевого поведения и отслеживания изменений в контексте вмешательств при проблемном питании или снижении веса; это не диагностическая шкала.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 6,
  scales: [
    { key: 'total', label: 'Общий балл принятия и гибкости', items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], reverseItems: [3, 4, 6, 7, 9], aggregation: 'sum' },
    { key: 'willingness', label: 'Готовность (Willingness)', items: [1, 2, 3, 5, 8, 10], reverseItems: [3], aggregation: 'sum' },
    { key: 'acceptance', label: 'Принятие (Acceptance)', items: [4, 6, 7, 9], reverseItems: [4, 6, 7, 9], aggregation: 'sum' },
  ],
};

const uniformAnswers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Все ответы на минимуме; ручной пересчёт обратных пунктов', answers: uniformAnswers(1), expected: { total: 35, willingness: 11, acceptance: 24 } },
  { title: 'Все ответы на максимуме; ручной пересчёт обратных пунктов', answers: uniformAnswers(6), expected: { total: 35, willingness: 25, acceptance: 10 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'juarascio-forman-timko-butryn-faaq-2011-v1',
};
