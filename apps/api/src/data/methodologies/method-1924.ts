import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: 'a', label: 'А' },
  { value: 'b', label: 'Б' },
];

const itemTexts = [
  [
    'Важно, чтобы любое представление о наличии или отсутствии заговора находило свое подтверждение',
    'Не является важным подтверждение представления о наличии заговора, особенно если оно оригинально по своей сути',
  ],
  [
    'Неопределенность в отношении наличия заговора может раздражать',
    'Неопределенность в отношении наличия заговора обычно меня бодрит',
  ],
  [
    'Важна устойчивость в мире, особенно относительно устоявшихся представлений о заговоре',
    'Мир быстро меняется, как и могут меняться представления о заговоре',
  ],
  [
    'В любом деле важен результат',
    'Процесс любого дела интереснее результата',
  ],
  [
    'Я тревожусь по любому поводу',
    'Я мало тревожусь, можно сказать, редко',
  ],
  [
    'Угрозы в мире могут пройти и незаметно',
    'Угроза в мире существует всегда и к ней надо готовиться',
  ],
  [
    'Другие люди могут мне причинить зло',
    'Другие люди могут мне принести много радости',
  ],
  [
    'Жизнь на планете Земля может остановиться',
    'Жизнь на планете Земля вечная',
  ],
  [
    'Опубликованные данные должны находить свое подтверждение',
    'Опубликованные данные необязательно должны быть подтвержденными',
  ],
  [
    'Меня пугает неопределенность в жизни моего окружения',
    'Меня не пугает неопределенность в жизни моего окружения',
  ],
  [
    'Я не верю ни в какие заговоры',
    'Все же есть отдельные заговоры, в которые я верю',
  ],
  [
    'Результат всегда важнее процесса',
    'Процесс порой важнее результата',
  ],
  [
    'Часто меня называют тревожным человеком',
    'Тревожность мне редко присуща',
  ],
  [
    'В мире много угроз, к которым необходимо готовиться',
    'В мире много угроз и к ним невозможно подготовиться',
  ],
  [
    'В затруднениях с другими людьми важно понять, чем мне это грозит',
    'Если другие люди мне угрожают, надо разобраться и постараться разрешить проблему',
  ],
  [
    'Мы – заложники планеты Земля',
    'Земля – это наш оберегающий дом',
  ],
];

const questions: SeedSection['questions'] = itemTexts.map((choices, index) => ({
  code: `test_1941_${index + 1}`,
  text: `${choices[0]} / ${choices[1]}`,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1941',
  title: 'Типы конспиративистской ментальности',
  description: 'Методика В. И. Пищик измеряет выраженность четырёх установок в отношении информации о заговорах: устойчивости и критичности, поиска объяснений, готовности принимать заговоры и внимания к их последствиям. Рабочая версия опубликована и первично проверена на студентах вузов 17–23 лет; результаты дают профиль баллов по типам, а не клинический диагноз.',
  questions,
};

const itemKeys = [
  { a: 'seeking', b: 'results' },
  { a: 'stable', b: 'ready' },
  { a: 'stable', b: 'ready' },
  { a: 'results', b: 'seeking' },
  { a: 'results', b: 'seeking' },
  { a: 'stable', b: 'ready' },
  { a: 'results', b: 'stable' },
  { a: 'ready', b: 'seeking' },
  { a: 'seeking', b: 'results' },
  { a: 'stable', b: 'ready' },
  { a: 'stable', b: 'ready' },
  { a: 'results', b: 'seeking' },
  { a: 'results', b: 'seeking' },
  { a: 'stable', b: 'ready' },
  { a: 'results', b: 'stable' },
  { a: 'ready', b: 'seeking' },
];

const allItems = Array.from({ length: 16 }, (_, index) => index + 1);
const expectedChoice = (type: string, item: number) => itemKeys[item - 1].a === type ? 'a' : 'b';
const keyMatchedAnswers = Object.fromEntries(allItems.map(item => [String(item), expectedChoice('stable', item)]));
const keyMatchedTotals = Object.fromEntries(['stable', 'seeking', 'ready', 'results'].map(type => [
  type,
  allItems.filter(item => expectedChoice(type, item) === expectedChoice('stable', item)).length,
]));

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 1,
  scales: [
    { key: 'stable', label: 'Устойчивый тип', items: allItems, reverseItems: [], aggregation: 'formula', formula: 'sum(indicator(answer[item] equals option labeled У in the source key), items 1-16)' },
    { key: 'seeking', label: 'Ищущий тип', items: allItems, reverseItems: [], aggregation: 'formula', formula: 'sum(indicator(answer[item] equals option labeled И in the source key), items 1-16)' },
    { key: 'ready', label: 'Готовый тип', items: allItems, reverseItems: [], aggregation: 'formula', formula: 'sum(indicator(answer[item] equals option labeled Г in the source key), items 1-16)' },
    { key: 'results', label: 'Результативный тип', items: allItems, reverseItems: [], aggregation: 'formula', formula: 'sum(indicator(answer[item] equals option labeled Р in the source key), items 1-16)' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'По одному баллу за ключевой вариант каждого типа в соответствующих пунктах',
    answers: keyMatchedAnswers,
    expected: keyMatchedTotals,
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'pishchik-conspirativist-mentality-types-2023-v1',
};
