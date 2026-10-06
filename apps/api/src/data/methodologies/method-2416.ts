import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const responseOptions = [
  { value: '1', label: 'Почти никогда' },
  { value: '2', label: 'Редко' },
  { value: '3', label: 'Нечто среднее' },
  { value: '4', label: 'Часто' },
  { value: '5', label: 'Почти всегда' },
];

const itemTexts = [
  'Я не одобряю и осуждаю свои недостатки и промахи.',
  'Когда мне грустно, я склонен «зацикливаться» и фиксироваться на всем, что идет не так.',
  'Когда дела идут плохо, я рассматриваю трудности как часть жизни, через которую проходят все.',
  'Когда я думаю о своих промахах, я чувствую себя отделенным, отрезанным от остального мира.',
  'Я стараюсь относиться к себе с любовью, когда испытываю душевную боль.',
  'Когда мне не удается что-то важное, меня поглощает чувство неполноценности (я начинаю остро переживать чувство неполноценности).',
  'Когда я морально раздавлен, я напоминаю себе, что в мире уйма других людей, которые чувствуют себя так же, как и я.',
  'Когда времена действительно тяжелые, я склонен быть жестким с собой.',
  'Когда что-то меня огорчает, я стараюсь уравновешивать свои эмоции.',
  'Когда я чувствую себя неполноценным в какой-то сфере, я стараюсь напомнить себе, что чувство неполноценности порой посещает каждого.',
  'Я нетерпим к тем аспектам своей личности, которые мне не нравятся.',
  'Когда я переживаю трудное время, я забочусь о себе и отношусь к себе с нежностью.',
  'Когда мне грустно, я склонен чувствовать, что большинство людей, возможно, счастливей меня.',
  'Когда случается что-то неприятное, я стараюсь выработать сбалансированный взгляд на ситуацию.',
  'Я стараюсь рассматривать свои неудачи как проявление человеческой природы.',
  'Когда я наблюдаю проявления своих качеств, которые мне не нравятся, я ругаю себя за них.',
  'Когда мне не удается что-то важное, я стараюсь смотреть на это событие объективно.',
  'Когда мне действительно трудно, я склонен чувствовать, что другие люди справляются гораздо легче, чем я.',
  'Я мягок с собой, когда переживаю страдание.',
  'Когда меня что-то огорчает, чувства захлестывают меня.',
  'Я бываю немного жестким с собой, когда испытываю страдание.',
  'Когда мне грустно, я стараюсь исследовать это чувство с любопытством и непредвзятостью.',
  'Я терпим к своим недостаткам и промахам.',
  'Когда случается что-то неприятное, я склонен реагировать очень остро.',
  'Когда мне не удается что-то важное, я склонен чувствовать себя одиноким в своей неудаче.',
  'Я стараюсь быть понимающим и терпеливым к тем качествам моей личности, которые мне не нравятся.',
];

const questions: SeedSection['questions'] = itemTexts.map((text, index) => ({
  code: `test_2434_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: responseOptions,
}));

export const instrument: SeedSection = {
  code: 'test_2434',
  title: 'Шкала сочувствия к себе (Self-Compassion Scale, SCS), русская адаптация Чистопольской и соавторов',
  description: 'Шкала оценивает способы отношения к себе в трудные времена: доброту к себе, общность человеческого опыта и внимательное отношение к переживаниям, а также самокритику, самоизоляцию и чрезмерную идентификацию с негативными чувствами. Русская адаптация опубликована для студенческой выборки 17–28 лет; авторы также описывают возможное применение в исследованиях качества жизни и клинических исследованиях.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'self_kindness', label: 'Доброта к себе', items: [5, 12, 19, 23, 26], reverseItems: [], aggregation: 'mean' },
    { key: 'self_judgment', label: 'Самокритика', items: [1, 8, 11, 16, 21], reverseItems: [], aggregation: 'mean' },
    { key: 'common_humanity', label: 'Общность с человечеством', items: [3, 7, 10, 15], reverseItems: [], aggregation: 'mean' },
    { key: 'isolation', label: 'Самоизоляция', items: [4, 13, 18, 25], reverseItems: [], aggregation: 'mean' },
    { key: 'mindfulness', label: 'Внимательность к переживаниям', items: [9, 14, 17, 22], reverseItems: [], aggregation: 'mean' },
    { key: 'overidentification', label: 'Чрезмерная идентификация', items: [2, 6, 20, 24], reverseItems: [], aggregation: 'mean' },
    { key: 'self_compassion_total', label: 'Общий балл сочувствия к себе', items: Array.from({ length: 26 }, (_, index) => index + 1), reverseItems: [1, 2, 4, 6, 8, 11, 13, 16, 18, 20, 21, 24, 25], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка по ключу: ответы 5 по позитивным пунктам и 1 по инвертируемым дают все шкалы 5',
    answers: Object.fromEntries(Array.from({ length: 26 }, (_, index) => [String(index + 1), [1, 2, 4, 6, 8, 11, 13, 16, 18, 20, 21, 24, 25].includes(index + 1) ? 1 : 5])),
    expected: { self_kindness: 5, self_judgment: 1, common_humanity: 5, isolation: 1, mindfulness: 5, overidentification: 1, self_compassion_total: 5 },
  },
  {
    title: 'Ручная проверка общей формулы: после обратного кодирования все ответы 3 дают общий средний балл 3',
    answers: Object.fromEntries(Array.from({ length: 26 }, (_, index) => [String(index + 1), 3])),
    expected: { self_kindness: 3, self_judgment: 3, common_humanity: 3, isolation: 3, mindfulness: 3, overidentification: 3, self_compassion_total: 3 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument: { ...instrument, categoryIds: ['framework-cbt', 'self-attitude'] },
  categoryIds: ['framework-cbt', 'self-attitude'],
  scoringConfig,
  validationCases,
  formulaVersion: 'neff-scs-26-chistopolskaya-et-al-ru-2020-subscale-mean-reverse-negative-grand-mean-v1',
};
