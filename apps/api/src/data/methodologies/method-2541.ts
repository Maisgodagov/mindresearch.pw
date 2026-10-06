import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '5', label: 'Полностью согласен' },
  { value: '4', label: 'Согласен' },
  { value: '3', label: 'Затрудняюсь ответить' },
  { value: '2', label: 'Не согласен' },
  { value: '1', label: 'Совершенно не согласен' },
];

const items = [
  'Только я несу ответственность за возврат своих долгов',
  'В моем окружении (друзья и сотрудники) не принято давать в долг',
  'Я всегда точно рассчитываю свой бюджет, чтобы не брать в долг',
  'Чтобы получить кредит на выгодных условиях, я готов собирать все необходимые справки и документы',
  'Я согласен с утверждением «Хочешь потерять друга – дай ему в долг»',
  'Я охотно даю в долг тем людям, которым доверяю',
  'Я считаю, что человек, берущий в долг у друзей, не заслуживает уважения',
  'Я всегда стараюсь отдавать долги как можно быстрее',
  'Если человек хочет отдать долг вовремя, он всегда найдет для этого средства',
  'Мне проще отказаться от понравившейся вещи, чем взять деньги в долг на ее покупку',
  'Прежде чем взять кредит, я проанализирую необходимую информацию и выберу наиболее выгодное предложение',
  'Я точно знаю, сколько я могу потратить денег в месяц, чтобы не брать в долг',
  'Собираясь взять в долг, я всегда рассчитываю полную стоимость кредита',
  'Жить надо в соответствии со своими доходами',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2559_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2559',
  title: 'Экспресс-опросник долгового поведения (М. А. Гагарина, М. А. Падун, 2021)',
  description: 'Опросник оценивает установки и представления о долговом поведении у взрослых: рациональность исполнения обязательств, избегание или принятие заимствования, а также осуждение или терпимость к должникам и готовность одалживать деньги. Опубликованная апробация проводилась на выборке взрослых от 17 до 82 лет; методика даёт профиль по трём субшкалам, а не прямое наблюдение фактического поведения.',
  categoryIds: ['social-attitude'],
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'debtRationality', label: 'Долговая рациональность — нерациональность', items: [1, 4, 8, 9, 11, 13], reverseItems: [], aggregation: 'sum' },
    { key: 'debtAvoidance', label: 'Избегание — принятие долгов', items: [3, 10, 12, 14], reverseItems: [], aggregation: 'sum' },
    { key: 'disapproval', label: 'Осуждение — терпимость к должникам', items: [2, 5, 6, 7], reverseItems: [6], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: все ответы «затрудняюсь ответить» дают среднюю сумму на шкале',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 3])),
    expected: { debtRationality: 18, debtAvoidance: 12, disapproval: 12 },
  },
  {
    title: 'Ручная проверка реверсивного пункта 6: согласие даёт 1 балл в шкале осуждения',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), index === 5 ? 5 : 1])),
    expected: { debtRationality: 6, debtAvoidance: 4, disapproval: 4 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'gagarina-padun-debt-behavior-express-2021-v1',
};
