import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const common = ['нет', 'очень редко', 'иногда', 'часто'];
const repeatedEvents = ['нет', '1 раз', 'более 1 раза', 'более 3 раз'];
const yesNoFrequency = ['нет', 'несколько дней', 'несколько месяцев', 'все время'];
const questionsData: { text: string; options: string[]; scores: number[] }[] = [
  { text: 'Находились ли Вы в зоне боевых действий?', options: yesNoFrequency, scores: [0, 1, 2, 3] },
  { text: 'Находились ли Вы на приграничных территориях вооруженного конфликта?', options: yesNoFrequency, scores: [0, 1, 2, 3] },
  { text: 'Находились ли Вы на территориях с желтым уровнем террористической опасности?', options: yesNoFrequency, scores: [0, 1, 2, 3] },
  { text: 'Находились ли Ваши родственники в зоне боевых действий?', options: yesNoFrequency, scores: [0, 1, 2, 3] },
  { text: 'Были ли Вы вынуждены переехать / покинуть свой дом в связи с повышенным риском террористической угрозы (вооруженным конфликтом)?', options: ['нет', 'всего на пару дней', 'на несколько месяцев', 'до сих пор не могу вернуться в свой дом'], scores: [0, 1, 2, 3] },
  { text: 'Посещают ли Вас мысли о войне?', options: common, scores: [0, 1, 2, 3] },
  { text: 'Сколько раз в день просматриваете ленту новостей?', options: ['вообще не смотрю', 'не более 2 раз', 'около 5 раз', 'более 10 раз'], scores: [0, 1, 2, 3] },
  { text: 'Сталкиваетесь ли Вы с переизбытком непроверенной информации?', options: common, scores: [0, 1, 2, 3] },
  { text: 'Когда читаете новости, появляется ли чувство тревоги и беспокойства?', options: common, scores: [0, 1, 2, 3] },
  { text: 'После просмотра новостей Вы плохо засыпаете?', options: common, scores: [0, 1, 2, 3] },
  { text: 'Как думаете, современная информация представляет для общества опасность?', options: common, scores: [0, 1, 2, 3] },
  { text: 'Часто ли Вы обсуждаете с родственниками/друзьями/коллегами новости?', options: common, scores: [0, 1, 2, 3] },
  { text: 'Как Вы оцениваете свои отношения с близкими людьми?', options: ['очень хорошие', 'хорошие', 'удовлетворительные', 'плохие'], scores: [0, 1, 2, 3] },
  { text: 'Изменились ли Ваши отношения с близкими за последний год в худшую сторону?', options: ['нет', 'почти не изменились', 'изменились', 'очень сильно'], scores: [0, 1, 2, 3] },
  { text: 'Как часто Вы чувствуете себя одиноким(-ой)?', options: ['никогда', 'очень редко', 'иногда', 'часто'], scores: [0, 1, 2, 3] },
  { text: 'Подвергались ли Вы физическому или психологическому насилию/издевательству?', options: ['никогда', 'очень редко', 'иногда', 'часто'], scores: [0, 1, 2, 3] },
  { text: 'Сталкивались ли Вы с потерей близкого члена семьи?', options: ['нет', 'скорее нет, чем да', 'скорее да, чем нет', 'да'], scores: [0, 1, 2, 3] },
  { text: 'Сталкивались ли Вы с потерей близкого друга?', options: ['нет', 'скорее нет, чем да', 'скорее да, чем нет', 'да'], scores: [0, 1, 2, 3] },
  { text: 'Как Вы оцениваете свое настоящее финансовое положение?', options: ['очень хорошее', 'удовлетворительное', 'достаточное', 'плохое'], scores: [0, 1, 2, 3] },
  { text: 'Меняли ли Вы место работы/учебы за последний год?', options: ['нет', 'думаю над этим', 'да, 1 раз', 'да, более 1 раза'], scores: [0, 1, 2, 3] },
  { text: 'Изменилось ли Ваше финансовое состояние?', options: ['в лучшую сторону', 'никак не изменилось', 'незначительно ухудшилось', 'ухудшилось'], scores: [0, 1, 2, 3] },
  { text: 'Снизилось ли качество Вашей жизни?', options: ['нет', 'скорее нет, чем да', 'скорее да, чем нет', 'да'], scores: [0, 1, 2, 3] },
  { text: 'Сталкивались ли Вы с ухудшением жилищных условий?', options: ['нет', 'скорее нет, чем да', 'скорее да, чем нет', 'да'], scores: [0, 1, 2, 3] },
  { text: 'Часто ли Вам приходится занимать деньги / брать кредит?', options: ['нет', 'скорее нет, чем да', 'скорее да, чем нет', 'да'], scores: [0, 1, 2, 3] },
  { text: 'Пришлось ли Вам за последний год пережить пожар?', options: repeatedEvents, scores: [0, 1, 2, 3] },
  { text: 'Пришлось ли Вам за последний год пережить наводнение?', options: repeatedEvents, scores: [0, 1, 2, 3] },
  { text: 'Пришлось ли Вам за последний год пережить ураган?', options: repeatedEvents, scores: [0, 1, 2, 3] },
  { text: 'Пришлось ли Вам за последний год пережить шквалы?', options: repeatedEvents, scores: [0, 1, 2, 3] },
  { text: 'Пришлось ли Вам за последний год пережить землетрясение?', options: repeatedEvents, scores: [0, 1, 2, 3] },
  { text: 'Пришлось ли Вам за последний год пережить оползни?', options: repeatedEvents, scores: [0, 1, 2, 3] },
  { text: 'Испытываете ли беспокойство по поводу состояния Вашего здоровья?', options: common, scores: [0, 1, 2, 3] },
  { text: 'Приходилось ли Вам находиться на лечении в стационарном отделении?', options: common, scores: [0, 1, 2, 3] },
  { text: 'Были ли у Вас эпизоды потери сознания?', options: common, scores: [0, 1, 2, 3] },
  { text: 'Беспокоят ли Вас головные боли?', options: common, scores: [0, 1, 2, 3] },
  { text: 'Имеются ли у Вас проблемы со сном/засыпанием?', options: common, scores: [0, 1, 2, 3] },
  { text: 'Чувствуете ли вы истощение, усталость и упадок сил?', options: common, scores: [0, 1, 2, 3] },
];

export const instrument: SeedSection = {
  code: 'test_119',
  title: 'Анкета угроз психологической безопасности',
  description: 'Авторская анкета Т. А. Финогеновой (2025). Ответьте на вопросы, выбрав по одному варианту; ответы должны отражать последний год Вашей жизни.',
  questions: questionsData.map((question, index) => ({
    code: `test_119_${index + 1}`,
    text: question.text,
    type: 'single',
    required: true,
    options: question.options.map((label, optionIndex) => ({ value: String(question.scores[optionIndex]), label })),
  })),
};

const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, index) => from + index);
const scoreScale = (key: string, label: string, items: number[], aggregation: 'sum' | 'mean' = 'sum') => ({ key, label, items, reverseItems: [], aggregation });

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 3,
  scales: [
    scoreScale('military', 'Военные угрозы', range(1, 6)),
    scoreScale('information', 'Информационные угрозы', range(7, 12)),
    scoreScale('social', 'Социальные угрозы', range(13, 18)),
    scoreScale('economic', 'Экономические угрозы', range(19, 24)),
    scoreScale('natural', 'Природные угрозы', range(25, 30)),
    scoreScale('health', 'Угрозы здоровью', range(31, 36)),
    scoreScale('anthropogenic', 'Антропогенные угрозы (среднее четырёх шкал)', [...range(1, 6), ...range(7, 12), ...range(13, 18), ...range(19, 24)], 'mean'),
    scoreScale('total', 'Общий показатель угроз', range(1, 36)),
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: минимальные ответы дают нулевые шкалы и общий балл',
    answers: Object.fromEntries(range(1, 36).map(item => [String(item), 0])),
    expected: { military: 0, information: 0, social: 0, economic: 0, natural: 0, health: 0, anthropogenic: 0, total: 0 },
  },
  {
    title: 'Ручная проверка: максимальные ответы дают 18 по подшкалам, 3 по среднему и 108 всего',
    answers: Object.fromEntries(range(1, 36).map(item => [String(item), 3])),
    expected: { military: 18, information: 18, social: 18, economic: 18, natural: 18, health: 18, anthropogenic: 3, total: 108 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'finogenova-psychological-safety-threats-questionnaire-2025-v1',
};
