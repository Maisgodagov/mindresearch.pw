import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Очень мало или совсем нет' },
  { value: '2', label: 'Немного' },
  { value: '3', label: 'Средне' },
  { value: '4', label: 'Значительно' },
  { value: '5', label: 'Максимально' },
];

const statements = [
  'Я активно ищу столько информации, сколько могу найти в новых ситуациях.',
  'Я такой человек, что действительно радуюсь неизвестности повседневной жизни.',
  'Я делаю всё возможное, когда занимаюсь чем-то сложным и требующим напряжения сил.',
  'Куда бы я ни шёл, я ищу новые вещи или переживания.',
  'Я рассматриваю сложные ситуации как возможность расти и учиться.',
  'Мне нравится делать вещи, которые немного пугают.',
  'Я всегда ищу переживания (ситуации), которые проверяют моё мнение о себе и мире.',
  'Я предпочитаю работу, которая возбуждающе непредсказуема.',
  'Я часто ищу возможности бросить вызов себе и при этом расти как личность.',
  'Я такой человек, который выбирает незнакомых людей, новые события и незнакомые места.',
];

const questions: SeedSection['questions'] = statements.map((text, index) => ({
  code: `test_1613_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1613',
  title: 'Склонность к любопытству и исследованию (CEI-II), русскоязычная версия',
  description: 'CEI-II оценивает выраженность склонности к любопытству и исследованию: мотивацию искать знания и новый опыт, а также готовность принимать новизну, неопределённость и непредсказуемость повседневной жизни. Предназначена для русскоязычных респондентов; русская версия описана на взрослой выборке, включавшей участников 17–66 лет. Суммарный балл даёт общий показатель, а отдельные подшкалы для русской адаптации не следует считать установленными.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [{
    key: 'total',
    label: 'Общая склонность к любопытству и исследованию',
    items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    reverseItems: [],
    aggregation: 'sum',
  }],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы минимальны: сумма десяти пунктов равна 10',
    answers: Object.fromEntries(statements.map((_, index) => [String(index + 1), 1])),
    expected: { total: 10 },
  },
  {
    title: 'Все ответы максимальны: сумма десяти пунктов равна 50',
    answers: Object.fromEntries(statements.map((_, index) => [String(index + 1), 5])),
    expected: { total: 50 },
  },
  {
    title: 'Повторяющийся протокол 1–5 даёт вручную проверенную сумму 30',
    answers: { '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 1, '7': 2, '8': 3, '9': 4, '10': 5 },
    expected: { total: 30 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'cei-ii-yelshansky-anufriev-efimova-semenov-2016-v1',
};
