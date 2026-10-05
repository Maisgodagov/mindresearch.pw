import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const items = [
  'Хороших людей не должны интересовать деньги',
  'Не хорошо иметь больше, чем нужно',
  'Жизнь с малым количеством денег — благое дело',
  'Трудно быть богатым и хорошим человеком одновременно',
  'Деньги портят людей',
  'Я не заслуживаю большого количества денег, в то время как у других их меньше, чем у меня',
  'Чем меньше у тебя денег, тем лучше жизнь',
  'Нельзя быть одновременно счастливым в любви и деньгах',
  'Богатые люди — жадные',
  'Я не заслуживаю денег',
  'Деньги — вот что придает смысл жизни',
  'Успех людей зависит только от количества заработанных денег',
  'Деньги смогли бы решить все мои проблемы',
  'Твоя самооценка равна количеству твоих денег',
  'У богатых людей нет никаких причин быть несчастными',
  'Трудно быть бедным и счастливым одновременно',
  'Не стоит что-либо покупать, если это не считается лучшим',
  'Деньги покупают свободу',
  'Большее количество денег сделает тебя счастливее',
  'Мои дела шли бы лучше, если у меня было бы больше денег',
  'Денег никогда не бывает достаточно',
  'Если у тебя есть деньги, кто-нибудь обязательно попытается отнять их',
  'Деньги — это власть',
  'Не стоит спрашивать других, сколько у них денег или сколько они зарабатывают',
  'Не стоит рассказывать остальным, сколько у тебя есть денег или сколько ты зарабатываешь',
  'Мне было бы некомфортно говорить кому-либо, сколько я зарабатываю',
  'Если ты богат, то ты не можешь быть уверен в том, что людям действительно от тебя нужно',
  'Нельзя доверять людям, если дело касается денег',
  'Невежливо разговаривать о деньгах',
];

const options = [
  { value: '1', label: 'Полностью не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Скорее не согласен' },
  { value: '4', label: 'Скорее согласен' },
  { value: '5', label: 'Согласен' },
  { value: '6', label: 'Полностью согласен' },
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1046_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1046',
  title: 'Опросник монетарных аттитюдов Клонц',
  description: 'Русскоязычная финальная адаптация Klontz Money Script Inventory для взрослых респондентов. Описывает убеждения и установки по четырём аспектам отношения к деньгам: избегание денег, деньги как статус, поклонение деньгам и бдительность относительно денег. Может помочь автору опроса исследовать денежные установки, связанные с финансовым поведением; сама по себе не является диагностическим заключением.',
  questions,
};

const seq = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, index) => from + index);

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 6,
  scales: [
    { key: 'avoidance', label: 'Избегание денег', items: seq(1, 10), reverseItems: [], aggregation: 'sum' },
    { key: 'status', label: 'Деньги как статус', items: seq(11, 17), reverseItems: [], aggregation: 'sum' },
    { key: 'worship', label: 'Поклонение деньгам', items: seq(18, 23), reverseItems: [], aggregation: 'sum' },
    { key: 'vigilance', label: 'Обеспокоенность деньгами (бдительность относительно денег)', items: seq(24, 29), reverseItems: [], aggregation: 'sum' },
  ],
};

const allAnswers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: все ответы «Полностью не согласен»',
    answers: allAnswers(1),
    expected: { avoidance: 10, status: 7, worship: 6, vigilance: 6 },
  },
  {
    title: 'Ручная проверка: все ответы «Полностью согласен»',
    answers: allAnswers(6),
    expected: { avoidance: 60, status: 42, worship: 36, vigilance: 36 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'klontz-msi-bayazitova-lapshova-2017-final-ru-v1',
};
