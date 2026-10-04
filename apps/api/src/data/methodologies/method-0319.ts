import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const answerOptions = [
  { value: '1', label: 'Совсем неверно' },
  { value: '2', label: 'Скорее неверно' },
  { value: '3', label: 'В какой-то степени верно' },
  { value: '4', label: 'В основном верно' },
  { value: '5', label: 'Полностью верно' },
];

const items = [
  'В моих решениях отражаются мои самые важные ценности и чувства.',
  'Я предпринимаю действия, чтобы не испытывать негативных чувств по отношению к себе.',
  'Я часто размышляю о том, почему я реагирую на что-то тем или иным образом.',
  'Я полностью отождествляю себя с тем, что делаю.',
  'Меня очень интересует, когда я реагирую со страхом или тревогой на события в моей жизни.',
  'Я многое делаю для того, чтобы избежать чувства стыда.',
  'Я пытаюсь заставить себя делать определённые вещи.',
  'Мои действия соответствуют тому, кто я есть на самом деле.',
  'Мне интересно понять причины своих действий.',
  'Моё целостное «Я» стоит за важными решениями, которые я принимаю.',
  'Я верю, что определённые действия помогают мне нравиться другим.',
  'Мне самому интересно, почему я поступаю именно так, а не иначе.',
  'Мне нравится исследовать свои чувства.',
  'Я часто заставляю себя что-то делать.',
  'В своих решениях я неуклонно следую тому, что я хочу или о чём забочусь.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_351_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: answerOptions,
}));

export const instrument: SeedSection = {
  code: 'test_351',
  title: 'Индекс автономного функционирования (IAF), русскоязычная адаптация',
  description: 'Методика оценивает диспозиционное автономное функционирование в рамках теории самодетерминации: авторство и самоконгруэнтность действий, заинтересованность в понимании собственного опыта и восприимчивость к внутреннему и внешнему контролю. Подходит для исследовательских опросов взрослых и старших подростков; русская адаптация проверялась преимущественно на студенческой выборке, поэтому перенос на иные группы требует осторожности.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'authorship', label: 'Авторство / самоконгруэнтность', items: [1, 4, 8, 10, 15], reverseItems: [], aggregation: 'mean' },
    { key: 'interest', label: 'Заинтересованность', items: [3, 5, 9, 12, 13], reverseItems: [], aggregation: 'mean' },
    { key: 'susceptibility_to_control', label: 'Восприимчивость к контролю (обратная шкала автономного функционирования)', items: [2, 6, 7, 11, 14], reverseItems: [2, 6, 7, 11, 14], aggregation: 'mean' },
    { key: 'iaf_total', label: 'Общий индекс автономного функционирования', items: Array.from({ length: 15 }, (_, index) => index + 1), reverseItems: [2, 6, 7, 11, 14], aggregation: 'mean' },
  ],
};

const allAnswers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Все ответы минимальные', answers: allAnswers(1), expected: { authorship: 1, interest: 1, susceptibility_to_control: 5, iaf_total: 7 / 3 } },
  { title: 'Все ответы максимальные', answers: allAnswers(5), expected: { authorship: 5, interest: 5, susceptibility_to_control: 1, iaf_total: 11 / 3 } },
  { title: 'Проверка реверсивных пунктов', answers: Object.fromEntries(items.map((_, index) => [String(index + 1), index + 1 === 2 || index + 1 === 6 || index + 1 === 7 || index + 1 === 11 || index + 1 === 14 ? 1 : 5])), expected: { authorship: 5, interest: 5, susceptibility_to_control: 5, iaf_total: 5 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'weinstein-przybylski-ryan-2012-kostromina-et-al-2023-v1',
};
