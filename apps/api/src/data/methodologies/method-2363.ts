import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const pairs = [
  ['Умеет составлять пазлы', 'Не умеет составлять пазлы'],
  ['Имеет много друзей', 'Не имеет много друзей'],
  ['Умеет плавать', 'Не умеет плавать'],
  ['Мама улыбается', 'Мама не улыбается'],
  ['Умеет дорисовывать по образцу', 'Не умеет дорисовывать по образцу'],
  ['Остается у друзей на ночь', 'Не остается у друзей на ночь'],
  ['Умеет карабкаться вверх', 'Не умеет карабкаться вверх'],
  ['Мама ходит с тобой, куда ты захочешь', 'Мама не ходит с тобой, куда ты захочешь'],
  ['Знает цвета', 'Не знает цвета'],
  ['Играет с друзьями', 'Не играет с друзьями'],
  ['Умеет обуваться', 'Не умеет обуваться'],
  ['Мама готовит любимую еду', 'Мама не готовит любимую еду'],
  ['Знает алфавит', 'Не знает алфавит'],
  ['Есть друзья на игровой площадке', 'Нет друзей на игровой площадке'],
  ['Умеет бегать', 'Не умеет бегать'],
  ['Мама читает тебе', 'Мама не читает тебе'],
  ['Умеет считать', 'Не умеет считать'],
  ['Приглашается в игру другими', 'Не приглашается в игру другими'],
  ['Умеет прыгать', 'Не умеет прыгать'],
  ['Мама играет с тобой', 'Мама не играет с тобой'],
  ['Знает первую букву имени', 'Не знает первую букву имени'],
  ['Обедает у друзей', 'Не обедает у друзей'],
  ['Умеет прыгать через скакалку', 'Не умеет прыгать через скакалку'],
  ['Мама разговаривает с тобой', 'Мама не разговаривает с тобой'],
];

const options = [
  { value: 'much-positive', label: 'Совсем как я: ближе первый вариант, сильное сходство' },
  { value: 'a-little-positive', label: 'Немного как я: ближе первый вариант, небольшое сходство' },
  { value: 'a-little-negative', label: 'Немного как я: ближе второй вариант, небольшое сходство' },
  { value: 'much-negative', label: 'Совсем как я: ближе второй вариант, сильное сходство' },
];

const questions: SeedSection['questions'] = pairs.map(([positive, negative], index) => ({
  code: `test_2381_${index + 1}`,
  text: `Какой вариант больше похож на тебя? Первый ребёнок: «${positive}»; второй ребёнок: «${negative}». Насколько выбранный ребёнок похож на тебя?`,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2381',
  title: 'Шкала самооценки компетентности и социального принятия дошкольника (ШСКиСП)',
  description: 'Картиночная шкала для оценки дифференцированного самовосприятия детей 4–7 лет в четырёх областях: когнитивная и физическая компетентность, принятие сверстниками и материнское принятие. Профиль помогает автору опроса увидеть, в каких сферах ребёнок воспринимает себя более или менее компетентным и принятым; глобальную самооценку методика отдельно не измеряет.',
  questions,
};

const items = (first: number) => Array.from({ length: 6 }, (_, i) => first + i * 4);
export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 4,
  scales: [
    { key: 'cognitive', label: 'Когнитивная компетентность', items: items(1), reverseItems: [], aggregation: 'sum', itemScores: Object.fromEntries(items(1).map((n) => [n, { 'much-positive': 4, 'a-little-positive': 3, 'a-little-negative': 2, 'much-negative': 1 }])) },
    { key: 'physical', label: 'Физическая компетентность', items: items(3), reverseItems: [], aggregation: 'sum', itemScores: Object.fromEntries(items(3).map((n) => [n, { 'much-positive': 4, 'a-little-positive': 3, 'a-little-negative': 2, 'much-negative': 1 }])) },
    { key: 'peer', label: 'Принятие сверстниками', items: items(2), reverseItems: [], aggregation: 'sum', itemScores: Object.fromEntries(items(2).map((n) => [n, { 'much-positive': 4, 'a-little-positive': 3, 'a-little-negative': 2, 'much-negative': 1 }])) },
    { key: 'maternal', label: 'Материнское принятие', items: items(4), reverseItems: [], aggregation: 'sum', itemScores: Object.fromEntries(items(4).map((n) => [n, { 'much-positive': 4, 'a-little-positive': 3, 'a-little-negative': 2, 'much-negative': 1 }])) },
  ],
};

const all = (value: string) => Object.fromEntries(pairs.map((_, i) => [String(i + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Ручная проверка: выраженное сходство со всеми компетентными и принимаемыми детьми', answers: all('much-positive'), expected: { cognitive: 24, physical: 24, peer: 24, maternal: 24 } },
  { title: 'Ручная проверка: выраженное сходство со всеми менее компетентными и принимаемыми детьми', answers: all('much-negative'), expected: { cognitive: 6, physical: 6, peer: 6, maternal: 6 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['self-esteem'],
  scoringConfig,
  validationCases,
  formulaVersion: 'harter-pike-pspcsa-chernysheva-markova-ru-2012-v1',
};
