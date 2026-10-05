import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const items = [
  'Я понимаю смысл моей жизни.',
  'Я всегда стараюсь найти в жизни что-то, что заставит меня почувствовать, что моя жизнь наполнена смыслом.',
  'Я всегда стремлюсь найти цель в жизни.',
  'В моей жизни есть четкое понимание цели.',
  'У меня есть четкое понимание того, что наполняет мою жизнь смыслом.',
  'Я уже нашел удовлетворяющую меня цель жизни.',
  'Я всегда ищу чего-то, что заставит меня почувствовать значимость моей жизни.',
  'Я ищу цель или миссию в жизни.',
  'У меня нет четкой цели в жизни.',
  'Я ищу смысл моей жизни.',
];

const options = [
  { value: '1', label: 'Абсолютно неверно' },
  { value: '2', label: 'В основном неверно' },
  { value: '3', label: 'До определенной степени неверно' },
  { value: '4', label: 'Не могу сказать, верно или нет' },
  { value: '5', label: 'До определенной степени верно' },
  { value: '6', label: 'В основном верно' },
  { value: '7', label: 'Абсолютно верно' },
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1233_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1233',
  title: 'Опросник смысла жизни (MLQ), русскоязычная версия',
  description: 'Опросник оценивает субъективное присутствие смысла и цели в жизни, а также активность поиска смысла. Две отдельные субшкалы помогают автору опроса различать переживание уже найденного смысла и стремление его найти; версия представляет опубликованный русский перевод, исследованный на русскоязычной выборке взрослых.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'presence', label: 'Наличие (присутствие смысла жизни)', items: [1, 4, 5, 6, 9], reverseItems: [9], aggregation: 'sum' },
    { key: 'search', label: 'Поиск смысла жизни', items: [2, 3, 7, 8, 10], reverseItems: [], aggregation: 'sum' },
    { key: 'total', label: 'Общая шкала', items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], reverseItems: [9], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  { title: 'Все ответы минимальны', answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])), expected: { presence: 11, search: 5, total: 16 } },
  { title: 'Все ответы максимальны', answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 7])), expected: { presence: 29, search: 35, total: 64 } },
  { title: 'Все ответы средние', answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 4])), expected: { presence: 20, search: 20, total: 40 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'mlq-ru-elshansky-et-al-2015-v1',
  details: {
    version: 'Русскоязычный перевод, опубликованный Елшанским и соавторами',
    summary: 'Десять утверждений измеряют наличие смысла жизни и поиск смысла как отдельные показатели.',
    adaptation: 'Русский перевод исследовался на русскоязычной выборке 17–66 лет; опубликованные психометрические данные представлены для взрослых респондентов.',
    rightsNote: 'Текст и ключ воспроизводятся по опубликованной русскоязычной версии и статье об её психометрических показателях; соблюдайте условия правообладателей оригинального MLQ при дальнейшей публикации или коммерческом использовании.',
    steps: ['Предъявляются 10 утверждений и единая семибалльная шкала ответа.', 'Подсчитайте Presence по пунктам 1, 4, 5, 6 и 9, Search по пунктам 2, 3, 7, 8 и 10; пункт 9 перекодируется как 8 − ответ.', 'Общий показатель равен сумме двух субшкал.'],
    keys: [{ label: 'Presence', value: '1, 4, 5, 6, 9 (пункт 9 обратный)' }, { label: 'Search', value: '2, 3, 7, 8, 10' }, { label: 'Общая шкала', value: 'Все 10 пунктов; пункт 9 обратный' }],
    notes: ['Каждая субшкала имеет диапазон 5–35; общая шкала — 10–70. Более высокое значение Search отражает большую выраженность поиска, а не большую наличность смысла.', 'Русская статья сообщает, что валидность субшкалы Search на её выборке не была установлена; нормативные пороги в этой регистрации не задаются.'],
    sources: [
      { title: 'Елшанский и др. (2015). «Психометрические показатели русскоязычной версии теста “Опросник смысла жизни” (MLQ)» — русский текст, бланк и ключ', url: 'https://psychology.snauka.ru/2015/10/6019' },
      { title: 'Steger, Frazier, Oishi, & Kaler (2006). “The Meaning in Life Questionnaire: Assessing the Presence of and Search for Meaning in Life”', url: 'https://doi.org/10.1037/0022-0167.53.1.80' },
      { title: 'Psytests: «Опросник смысла жизни, MLQ» — русская страница методики', url: 'https://psytests.org/life/mlq.html' },
    ],
  },
};
