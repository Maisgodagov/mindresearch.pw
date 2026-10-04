import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'Никогда' },
  { value: '1', label: 'Раз в месяц или реже' },
  { value: '2', label: 'Раз в одну или две недели' },
  { value: '3', label: 'Раз в день или чаще' },
];

const items = [
  'Читали ему книги',
  'Рассказывали ему истории, сказки',
  'Играли с ним в игры с буквами (например, в кубики с буквами, лото)',
  'Обсуждали с ним то, о чем вы вместе прочитали',
  'Играли с ним в слова',
  'Писали с ним буквы или слова',
  'Играли с ним в игры с цифрами (например, в кубики с цифрами, детское домино)',
  'Считали с ним разные объекты',
  'Вместе играли в настольные игры',
  'Занимались с ним по обучающим тетрадям, развивающим пособиям',
  'Вместе играли в сюжетно-ролевые игры',
  'Вместе мастерили поделки или собирали конструктор',
  'Рисовали вместе',
  'Разучивали стихи, песни вместе',
  'Вместе искали ответ на вопрос в энциклопедии или интернете',
];

const questions: SeedSection['questions'] = items.map((item, index) => ({
  code: `test_305_${index + 1}`,
  text: `${index + 1}. ${item}`,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_305',
  title: 'Дошкольная родительская вовлеченность (версия Антипкиной, 2018)',
  description: 'Одномерная шкала оценивает, как часто родитель или члены семьи до поступления ребёнка в школу участвовали вместе с ним в развивающих практиках: чтении и занятиях с буквами, словами и числами, играх, творчестве и поиске информации. Подходит для исследовательской оценки родителей первоклассников, вспоминающих дошкольный период; результат описывает сообщаемую частоту практик, а не диагностическую норму.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 3,
  scales: [{
    key: 'preschool_involvement_raw',
    label: 'Сырой суммарный балл дошкольной родительской вовлеченности',
    items: Array.from({ length: 15 }, (_, index) => index + 1),
    reverseItems: [],
    aggregation: 'sum',
  }],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы «Никогда»: минимальная сырая сумма',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 0])),
    expected: { preschool_involvement_raw: 0 },
  },
  {
    title: 'Все ответы «Раз в день или чаще»: максимальная сырая сумма',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 3])),
    expected: { preschool_involvement_raw: 45 },
  },
  {
    title: 'Ручная проверка: один ответ в каждой из четырёх категорий и один пропуск подсчёта заменён нулём не допускается; все пункты заданы',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), index < 4 ? index : 1])),
    expected: { preschool_involvement_raw: 17 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'antipkina-preschool-parental-involvement-2018-raw-sum-v1',
};
