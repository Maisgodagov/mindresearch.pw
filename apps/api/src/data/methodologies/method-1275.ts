import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const items = [
  'Я считаю, что получаю неплохую оплату за свой труд.',
  'Получить повышение на моей работе – шансов почти что нет.',
  'Мой руководитель довольно компетентен в своей работе.',
  'Я не доволен соц. пакетом и/или бонусами, которые я получаю.',
  'За хорошо сделанную работу я получаю должное признание.',
  'Многие наши правила и процедуры мешают хорошо выполнять работу.',
  'Мне нравятся люди, с которыми я работаю.',
  'Иногда мне кажется, что моя работа не имеет смысла.',
  'С коммуникацией в нашей организации всё хорошо.',
  'Повышение зарплаты слишком маленькое и происходит очень редко.',
  'Те, кто хорошо справляются с работой, имеют неплохие шансы на повышение.',
  'Мой руководитель ко мне несправедлив.',
  'Наши бонусы не уступают тем, которые предлагает большинство других организаций.',
  'Я не чувствую, что мою работу ценят.',
  'Мои усилия хорошо выполнить работу редко натыкаются на бюрократические препоны.',
  'Мне приходится работать усерднее из-за некомпетентности моих коллег.',
  'Мне нравится делать то, чем я занимаюсь на своей работе.',
  'Мне не совсем ясны цели нашей организации.',
  'Я чувствую, что меня не очень-то ценят, судя по моей зарплате.',
  'Люди здесь уходят на повышение так же быстро, как и в других местах.',
  'Мой начальник практически не интересуется чувствами своих подчиненных.',
  'Помимо зарплаты у нас есть достойный социальный пакет.',
  'За хорошую работу здесь можно получить премию.',
  'У меня слишком много дел на работе.',
  'Мне нравится быть среди коллег.',
  'Мне иногда кажется, что я не понимаю, что вообще происходит с нашей организацией.',
  'Я испытываю гордость, выполняя свою работу.',
  'Я доволен возможностями роста зарплаты.',
  'У нас нет некоторых бонусов, которые должны быть.',
  'Мне нравится мой руководитель.',
  'У меня слишком много бумажной волокиты.',
  'Я не чувствую, что мои усилия вознаграждаются должным образом.',
  'Я доволен своими шансами на повышение в должности.',
  'На работе слишком много споров и ругани.',
  'Моя работа увлекательная.',
  'Рабочие задания нам не объясняют в достаточной мере.',
];

const options = [
  { value: '1', label: 'Совершенно не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Скорее не согласен' },
  { value: '4', label: 'Скорее согласен' },
  { value: '5', label: 'Согласен' },
  { value: '6', label: 'Совершенно согласен' },
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1303_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1303',
  title: 'Опросник удовлетворенности работой (Job Satisfaction Survey, JSS)',
  description: 'JSS оценивает отношение сотрудника к работе и организации по девяти аспектам: оплате, возможностям повышения, руководству, дополнительным льготам, вознаграждению за результаты, правилам и условиям выполнения работы, отношениям с коллегами, содержанию труда и коммуникации. Подходит для взрослых работающих респондентов в организациях разных типов; изначально разработан для сферы социальных услуг. Результаты дают профиль удовлетворённости отдельными сторонами и общий показатель.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 6,
  scales: [
    { key: 'pay', label: 'Оплата труда', items: [1, 10, 19, 28], reverseItems: [10, 19], aggregation: 'sum' },
    { key: 'promotion', label: 'Повышение', items: [2, 11, 20, 33], reverseItems: [2], aggregation: 'sum' },
    { key: 'supervision', label: 'Руководство', items: [3, 12, 21, 30], reverseItems: [12, 21], aggregation: 'sum' },
    { key: 'fringeBenefits', label: 'Дополнительные льготы', items: [4, 13, 22, 29], reverseItems: [4, 29], aggregation: 'sum' },
    { key: 'contingentRewards', label: 'Вознаграждение за результаты', items: [5, 14, 23, 32], reverseItems: [14, 23, 32], aggregation: 'sum' },
    { key: 'operatingConditions', label: 'Условия выполнения работы', items: [6, 15, 24, 31], reverseItems: [6, 24, 31], aggregation: 'sum' },
    { key: 'coworkers', label: 'Коллеги', items: [7, 16, 25, 34], reverseItems: [16, 34], aggregation: 'sum' },
    { key: 'natureOfWork', label: 'Содержание работы', items: [8, 17, 27, 35], reverseItems: [8], aggregation: 'sum' },
    { key: 'communication', label: 'Коммуникация', items: [9, 18, 26, 36], reverseItems: [18, 26, 36], aggregation: 'sum' },
    { key: 'total', label: 'Общая удовлетворенность работой', items: Array.from({ length: 36 }, (_, i) => i + 1), reverseItems: [2, 4, 6, 8, 10, 12, 14, 16, 18, 19, 21, 23, 24, 26, 29, 31, 32, 34, 36], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  { title: 'Все ответы «Совершенно не согласен»', answers: Object.fromEntries(items.map((_, i) => [String(i + 1), 1])), expected: { pay: 16, promotion: 21, supervision: 18, fringeBenefits: 18, contingentRewards: 15, operatingConditions: 15, coworkers: 18, natureOfWork: 21, communication: 15, total: 157 } },
  { title: 'Все ответы «Совершенно согласен»', answers: Object.fromEntries(items.map((_, i) => [String(i + 1), 6])), expected: { pay: 12, promotion: 27, supervision: 12, fringeBenefits: 12, contingentRewards: 15, operatingConditions: 15, coworkers: 12, natureOfWork: 27, communication: 15, total: 59 } },
  { title: 'Первый пункт 6, остальные 1', answers: Object.fromEntries(items.map((_, i) => [String(i + 1), i === 0 ? 6 : 1])), expected: { pay: 21, promotion: 21, supervision: 18, fringeBenefits: 18, contingentRewards: 15, operatingConditions: 15, coworkers: 18, natureOfWork: 21, communication: 15, total: 162 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'spector-jss-1985-psytests-ru-v1',
};
