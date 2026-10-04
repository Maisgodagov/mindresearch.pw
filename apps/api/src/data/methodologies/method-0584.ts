import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const responseOptions = [
  { value: '1', label: 'Да, согласен с этим' },
  { value: '2', label: 'Скорее согласен, чем не согласен' },
  { value: '3', label: 'Скорее не согласен, чем согласен' },
  { value: '4', label: 'Нет, не согласен с этим' },
];

const items = [
  'Мне необходимо подтверждение того, что я сделал правильный выбор профессии',
  'Меня беспокоит, что мои нынешние интересы с годами могут измениться',
  'Я не знаю, какие виды деятельности я мог бы хорошо выполнять',
  'Я не знаю своих основных сильных и слабых сторон',
  'Работы, которые я могу выполнять, вряд ли обеспечат меня средствами для того образа жизни, который мне нравится',
  'Если бы мне пришлось выбирать профессию сейчас, боюсь, что я сделал бы неудачный выбор',
  'Я чувствую растерянность, когда думаю над тем, как строить будущую карьеру',
  'Определиться со своей карьерой — давняя и сложная проблема для меня',
  'В целом проблема принятия решения по поводу карьеры ставит меня в тупик',
  'Я не уверен в том, что мой нынешний выбор профессии — это точно «моё»',
  'Я недостаточно знаю о том, что делают работники в моей и близких ей специальностях',
  'По-моему, нет работы, которая однозначно подходила бы мне',
  'Я не знаю, какой работой я мог бы заниматься с удовольствием',
  'Я бы хотел расширить число профессий, которые можно рассматривать в качестве вариантов дальнейшей карьеры',
  'Мои оценки собственных способностей сильно меняются из года в год',
  'Я не уверен в себе во многих областях жизни',
  'Когда я принимал решение о выборе профессии, я размышлял об этом менее одного года',
  'Я не понимаю, как некоторые люди могут быть такими уверенными относительно того, чем они хотят заниматься',
  'Я не уверен в своей способности получить необходимую для дальнейшей работы подготовку',
  'У меня недостаточно материальных средств, чтобы начать (или продолжить) ту карьеру, которая мне больше всего нравится',
  'Мне не хватает способностей, чтобы заниматься той профессией, которую я выбрал',
  'Человек, имеющий большое значение в моей жизни, не одобряет мой профессиональный выбор',
  'Мне не хватает настойчивости для преодоления трудностей в карьере',
  'У меня недостаточно социальных связей и знакомств для успешной карьеры',
  'Сложившаяся экономическая (социальная) ситуация в стране или регионе не позволит мне реализовать ту карьеру, которая мне нравится',
  'Как найти работу в выбранной специальности',
  'Какие требования предъявляют различные профессии к людям',
  'О возможных вариантах трудоустройства',
  'Как получить дополнительную подготовку (опыт, обучение) в выбранной профессии',
  'Какие профессии востребованы на рынке труда',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_615_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: responseOptions,
}));

export const instrument: SeedSection = {
  code: 'test_615',
  title: 'Методика измерения карьерного самоопределения (МИКС)',
  description: 'МИКС выявляет трудности карьерного самоопределения по трём аспектам: ясность профессиональной идентичности, воспринимаемые барьеры карьерного развития и потребность в информации о профессиях, обучении и трудоустройстве. Русскоязычная адаптация предназначена прежде всего для студентов выпускных курсов и выпускников вузов; результаты помогают автору опроса изучить карьерные затруднения и информационные потребности этой группы.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 4,
  scales: [
    { key: 'vocational_identity', label: 'Профессиональная идентичность', items: Array.from({ length: 18 }, (_, index) => index + 1), reverseItems: [], aggregation: 'sum' },
    { key: 'development_barriers', label: 'Барьеры развития', items: Array.from({ length: 7 }, (_, index) => index + 19), reverseItems: [], aggregation: 'sum' },
    { key: 'information_need', label: 'Потребность в информации', items: Array.from({ length: 5 }, (_, index) => index + 26), reverseItems: [], aggregation: 'sum' },
  ],
};

// Article scoring: sum items 1–18; for 19–25 subtract their sum from 35;
// for 26–30 subtract their sum from 25. The latter two transformations are
// represented as explicit weighted sums so their published raw-score formula is preserved.
scoringConfig.scales[1] = { key: 'development_barriers', label: 'Барьеры развития', items: Array.from({ length: 7 }, (_, index) => index + 19), reverseItems: [], weights: Object.fromEntries(Array.from({ length: 7 }, (_, index) => [index + 19, -1])), aggregation: 'sum' };
scoringConfig.scales[2] = { key: 'information_need', label: 'Потребность в информации', items: Array.from({ length: 5 }, (_, index) => index + 26), reverseItems: [], weights: Object.fromEntries(Array.from({ length: 5 }, (_, index) => [index + 26, -1])), aggregation: 'sum' };

const validationCases: ValidationCase[] = [
  {
    title: 'Проверка формул по граничным ответам: везде выбран первый вариант',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { vocational_identity: 18, development_barriers: -7, information_need: -5 },
  },
  {
    title: 'Проверка формул по граничным ответам: везде выбран последний вариант',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 4])),
    expected: { vocational_identity: 72, development_barriers: -28, information_need: -20 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'miks-demin-sedykh-2017-v1',
};
