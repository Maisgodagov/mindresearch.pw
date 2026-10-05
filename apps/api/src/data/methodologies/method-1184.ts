import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const agreement = [
  'Абсолютно не согласен',
  'Скорее не согласен',
  'В чем-то согласен, в чем-то нет',
  'Скорее согласен',
  'Полностью согласен',
].map((label, index) => ({ value: String(index + 1), label }));

const frequency = ['Никогда', 'Редко', 'Иногда', 'Часто', 'Постоянно']
  .map((label, index) => ({ value: String(index + 1), label }));

const items: { text: string; options: typeof agreement }[] = [
  { text: 'Я позволяю своему ребенку использовать его гаджеты так часто, как ему/ей хочется', options: agreement },
  { text: 'Я позволяю своему ребенку использовать гаджеты любым способом, как ему/ей захочется', options: agreement },
  { text: 'Я позволяю своему ребенку использовать гаджеты столько времени, сколько он(а) хочет', options: agreement },
  { text: 'Я позволяю своему ребенку использовать любые мобильные приложения', options: agreement },
  { text: 'Я позволяю своему ребенку общаться с помощью гаджетов с любыми людьми', options: agreement },
  { text: 'Я настраиваю гаджеты моего ребенка для осуществления родительского контроля', options: agreement },
  { text: 'Я отслеживаю использование гаджета моим ребенком через контроль экранного времени', options: agreement },
  { text: 'Тебе запрещается брать в руки гаджет на определенный период', options: frequency },
  { text: 'Ты должен использовать гаджет не больше определенного времени', options: frequency },
  { text: 'Тебе нужно прямо сейчас отложить свой гаджет', options: frequency },
  { text: 'Ты должен выключить свой гаджет', options: frequency },
  { text: 'Отдай мне свой гаджет, я забираю его на время', options: frequency },
  { text: 'Позволили бы это', options: agreement },
  { text: 'Начали бы делать замечания', options: agreement },
  { text: 'Запретили бы это', options: agreement },
  { text: 'Вмешались в его/ее занятия', options: agreement },
  { text: 'Начали бы объяснять, почему не надо этого делать', options: agreement },
  { text: 'Что он(она) делает со своим гаджетом, чем там занимается', options: frequency },
  { text: 'Сколько времени он(она) проводит за своим гаджетом', options: frequency },
  { text: 'С кем он(она) общается с помощью своего гаджета', options: frequency },
  { text: 'Чувствуете себя комфортно', options: agreement },
  { text: 'Чувствуете, что Вас понимают', options: agreement },
  { text: 'Чувствуете, что ребенок принимает разговор всерьез', options: agreement },
  { text: 'Осваиваете вместе с ребенком новые мобильные приложения', options: frequency },
  { text: 'Показываете, как использовать гаджет для учебы', options: frequency },
  { text: 'Даете какие-либо полезные подсказки касательно использования гаджетов', options: frequency },
  { text: 'Просите у ребенка какие-нибудь полезные подсказки касательно использования гаджетов', options: frequency },
  { text: 'Экспериментируете и пробуете с ребенком все новое, что можно сделать с гаджетом (функции, настройки, приложения и т. п.)', options: frequency },
];

const sections = [
  'В какой степени Вы согласны со следующими утверждениями?',
  'Как часто Вы говорите своему ребенку…',
  'Если бы Ваш ребенок стал использовать свой гаджет все время в выходные дни, Вы…',
  'Как часто Вы обсуждаете с детьми следующие темы?',
  'Когда Вы разговариваете со своими детьми о том, как они используют мобильные устройства, Вы…',
  'Как часто Вы …',
];
const sectionStarts = [1, 8, 13, 18, 21, 24];

export const instrument: SeedSection = {
  code: 'test_1214',
  title: 'Опросник родительской медиации',
  description: 'Методика оценивает стратегии, с помощью которых родители школьников регулируют цифровое поведение детей: контроль и потворствование, запреты и ограничения, вмешательство или игнорирование, активную коммуникацию и совместную деятельность. Отдельная шкала описывает психологическую комфортность таких разговоров; профиль полезен для обсуждения практик цифровой социализации ребенка.',
  questions: items.map(({ text, options }, index) => {
    const itemNumber = index + 1;
    const sectionIndex = sectionStarts.reduce((lastIndex, start, index) => itemNumber >= start ? index : lastIndex, -1);
    return {
      code: `test_1214_${itemNumber}`,
      text: `${sections[sectionIndex]} ${itemNumber}. ${text}`,
      type: 'single',
      required: true,
      options,
    };
  }),
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'control_indulgence', label: 'Контроль-потворствование', items: [1, 2, 3, 4, 5, 6, 7], reverseItems: [1, 2, 3, 4, 5], aggregation: 'sum' },
    { key: 'prohibitions_limits', label: 'Запреты и ограничения', items: [8, 9, 10, 11, 12], reverseItems: [], aggregation: 'sum' },
    { key: 'intervention_ignoring', label: 'Вмешательство-игнорирование', items: [13, 14, 15, 16, 17], reverseItems: [13], aggregation: 'sum' },
    { key: 'joint_activity', label: 'Совместная деятельность', items: [24, 25, 26, 27, 28], reverseItems: [], aggregation: 'sum' },
    { key: 'active_communication', label: 'Активная коммуникация', items: [18, 19, 20], reverseItems: [], aggregation: 'sum' },
    { key: 'mediation_comfort', label: 'Комфортность медиации', items: [21, 22, 23], reverseItems: [], aggregation: 'sum' },
  ],
};

const all = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Все ответы минимальны; обратные пункты перекодированы', answers: all(1), expected: { control_indulgence: 27, prohibitions_limits: 5, intervention_ignoring: 21, joint_activity: 5, active_communication: 3, mediation_comfort: 3 } },
  { title: 'Все ответы максимальны; обратные пункты перекодированы', answers: all(5), expected: { control_indulgence: 13, prohibitions_limits: 25, intervention_ignoring: 17, joint_activity: 25, active_communication: 15, mediation_comfort: 15 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'proekt-parental-media-mediation-2025-v1',
};
