import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const responseOptions = [
  'Совершенно не согласен',
  'Не согласен',
  'Скорее не согласен',
  'Не уверен',
  'Скорее согласен',
  'Согласен',
  'Совершенно согласен',
].map((label, index) => ({ value: String(index + 1), label }));

const items = [
  'Мне нравится смотреть, как питомец наслаждается своей едой.',
  'Мой питомец значит для меня больше, чем любой мой друг (или значил бы, если бы у меня был питомец).',
  'Мне бы хотелось иметь домашнее животное.',
  'Содержать домашнее животное — напрасная трата денег.',
  'Домашние животные приносят радость в мою жизнь (или приносили бы, если бы они у меня были).',
  'Я думаю, что домашних животных всегда нужно держать на улице.',
  'Я каждый день нахожу время, чтобы поиграть со своим питомцем (или играл бы, если бы у меня был питомец).',
  'Я иногда общаюсь с домашним животным и понимаю, что оно хочет сказать (или понял бы, если бы случилось пообщаться).',
  'Мир стал бы лучше, если бы люди перестали столько времени уделять заботе о своих питомцах и стали вместо этого больше заботиться о других людях.',
  'Я люблю кормить животных с руки.',
  'Я люблю домашних животных.',
  'Животным место в зоопарке или в дикой природе, а не дома.',
  'Если держать дома животных, можно предполагать, что они испортят мебель.',
  'Мне нравятся домашние животные.',
  'Домашние животные милые, но не стоят тех сил, которые ты на них тратишь.',
  'Я часто разговариваю со своим питомцем (или разговаривал бы, если бы он у меня был).',
  'Я ненавижу животных.',
  'К домашним животным нужно относиться с тем же уважением, что и к остальным членам семьи.',
];

const reverseItems = [4, 6, 9, 12, 13, 15, 17];
const itemNumbers = items.map((_, index) => index + 1);

const instrument: SeedSection = {
  code: 'test_1109',
  title: 'Опросник отношения к животным (PAS), русская подростковая адаптация',
  description: 'Опросник оценивает выраженность доброжелательного отношения к домашним животным у подростков: привязанность и взаимодействие с питомцами, радость от их присутствия, а также представления о ценности и месте животных в жизни человека. Подходит для описания установок подростков, в том числе не имеющих собственного питомца; высокий суммарный балл соответствует более дружелюбному отношению.',
  questions: items.map((text, index) => ({
    code: `test_1109_${index + 1}`,
    text,
    type: 'single',
    required: true,
    options: responseOptions,
  })),
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [{
    key: 'friendly_attitude',
    label: 'Дружелюбное отношение к домашним животным',
    items: itemNumbers,
    reverseItems,
    aggregation: 'sum',
  }],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы минимальны; обратные пункты после перекодировки дают 7, сумма 60.',
    answers: Object.fromEntries(itemNumbers.map(item => [String(item), 1])),
    expected: { friendly_attitude: 60 },
  },
  {
    title: 'Все ответы максимальны; обратные пункты после перекодировки дают 1, сумма 66.',
    answers: Object.fromEntries(itemNumbers.map(item => [String(item), 7])),
    expected: { friendly_attitude: 66 },
  },
  {
    title: 'Вручную: ответ 7 на прямых пунктах и 1 на обратных даёт 18 × 7 = 126.',
    answers: Object.fromEntries(itemNumbers.map(item => [String(item), reverseItems.includes(item) ? 1 : 7])),
    expected: { friendly_attitude: 126 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'volkova-russian-adolescent-pas-18item-reverse-4-6-9-12-13-15-17-v1',
};
