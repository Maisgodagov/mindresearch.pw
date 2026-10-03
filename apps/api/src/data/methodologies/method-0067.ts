import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'Нет' },
  { value: '1', label: 'Да' },
];

const items = [
  'Присущи ли Вам периоды безразличного отношения к окружающему?',
  'Испытывали ли Вы когда-нибудь чувство разочарования в жизни?',
  'Бывали ли у Вас сильные головные боли или головокружения?',
  'Ощущали ли Вы жжение, покалывание или чувство ползания мурашек в различных частях тела?',
  'Часто ли меняется у Вас настроение?',
  'Приходилось ли Вам убегать из дома после обид?',
  'Бывают ли ссоры между Вашими родителями?',
  'Чувствовали ли Вы себя человеком особенным и непонятым другими?',
  'Приходилось ли Вам замечать, что посторонние смотрели на Вас как-то осуждающе?',
  'Любили ли Вы пропускать школьные занятия?',
  'Испытываете ли Вы раздражение после замечания старших?',
  'Хотелось ли Вам избавиться от какой-нибудь мысли, которая Вас упорно преследовала?',
  'Были ли у Вас ушибы головы?',
  'Были ли настроены родители против некоторых Ваших товарищей?',
  'Имеются ли у Вас привычки, с которыми трудно бороться?',
  'Снижали ли Вам в школе оценку за поведение?',
  'Нравились ли Вам методы воспитания в семье?',
  'Ощущали ли Вы сильное сердцебиение на экзаменах или в других сложных ситуациях?',
  'Испытываете ли Вы затруднения при переходе к новым условиям жизни, работы, учебы?',
  'Обидчивый ли Вы человек?',
  'Раздражает ли Вас длительное ожидание?',
  'Не подводит ли Вас память при волнении?',
  'Сомневались ли Вы когда-нибудь в правильности своих поступков?',
  'Просыпаетесь ли Вы среди ночи от страшных сновидений?',
  'Переносили ли Вы отравления?',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_105_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_105',
  title: 'Анкета диагностики нервно-психической неустойчивости (НПН)',
  description: "Анкета предназначена для скрининговой оценки признаков нервно-психической неустойчивости по ответам на поведенческие и эмоциональные утверждения. Итоговый прогностический показатель требует осторожной интерпретации и не является диагнозом.",
  questions,
};

const coefficients = [
  { no: -1.8, yes: 7.4 },
  { no: -1.8, yes: 6.5 },
  { no: -0.8, yes: 12.6 },
  { no: -1.8, yes: 5.8 },
  { no: -1.5, yes: 6.5 },
  { no: -0.8, yes: 12.3 },
  { no: -1.8, yes: 5.1 },
  { no: -1.5, yes: 5.6 },
  { no: -2.0, yes: 4.2 },
  { no: -0.8, yes: 11.8 },
  { no: -1.5, yes: 5.6 },
  { no: -2.3, yes: 3.0 },
  { no: -0.8, yes: 9.3 },
  { no: -1.5, yes: 4.8 },
  { no: -1.5, yes: 4.2 },
  { no: -0.8, yes: 7.4 },
  { no: 8.1, yes: -0.8 },
  { no: -9.3, yes: 2.8 },
  { no: -1.5, yes: 4.2 },
  { no: -0.8, yes: 7.0 },
  { no: -1.5, yes: 3.0 },
  { no: -2.5, yes: 6.5 },
  { no: -2.8, yes: 1.5 },
  { no: -0.4, yes: 8.1 },
  { no: -0.8, yes: 6.5 },
];

const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 1,
  scales: [{
    key: 'npn',
    label: 'Прогностическая вероятность НПН',
    items: items.map((_, index) => index + 1),
    reverseItems: [],
    weights: Object.fromEntries(coefficients.map((coefficient, index) => [index + 1, coefficient.yes - coefficient.no])),
    aggregation: 'sum',
  }],
};

// Offset is the sum of all «Нет» coefficients; yes answers add the published difference.
const noOffset = coefficients.reduce((sum, coefficient) => sum + coefficient.no, 0);
const validationCases: ValidationCase[] = [
  { title: 'Все ответы «Нет»; сумма опубликованных коэффициентов', answers: Object.fromEntries(items.map((_, i) => [String(i + 1), 0])), expected: { npn: noOffset } },
  { title: 'Пункт 1 «Да», остальные «Нет»; коэффициент пункта проверен по таблице', answers: Object.fromEntries(items.map((_, i) => [String(i + 1), i === 0 ? 1 : 0])), expected: { npn: noOffset + 9.2 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'kramarenko-rudoy-npn-1984-predictive-coefficients-v1',
};
