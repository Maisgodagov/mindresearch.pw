import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Совершенно не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Нечто среднее' },
  { value: '4', label: 'Согласен' },
  { value: '5', label: 'Совершенно согласен' },
];

const items = [
  'Мне легко удается перестать тратить усилия на то, чтобы ее все-таки достичь',
  'Мне тяжело прекратить попытки достичь этой цели',
  'Я еще долго чувствую свою причастность этой цели, не могу отстраниться от нее',
  'Мне легко удается перестать думать о цели и отстраниться от нее',
  'Я думаю о другой, новой цели, которую мог бы начать достигать',
  'Я ищу другие, осмысленные для меня цели',
  'Я убеждаю себя, что у меня есть другие, не менее важные цели для достижения',
  'Я говорю себе, что есть другие, новые цели, к которым можно стремиться',
  'Я начинаю работать над другими, новыми целями',
  'Я прилагаю усилия для достижения других важных для меня целей',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2257_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2257',
  title: 'Шкала отказа и смены цели (русскоязычная версия)',
  description: 'Русскоязычная версия шкалы оценивает две отдельные способности саморегуляции при невозможности продолжать важную цель: отказываться от неё, прекращая усилия и привязанность, и находить и начинать преследовать новые значимые цели. Подходит для исследовательских опросов взрослых и студентов; показатели следует рассматривать раздельно, без диагностических выводов.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'goalDisengagement', label: 'Отказ от цели', items: [1, 2, 3, 4], reverseItems: [2, 3], aggregation: 'sum' },
    { key: 'goalReengagement', label: 'Смена цели', items: [5, 6, 7, 8, 9, 10], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка ключа: ответы 1–5 циклически; пункты 2 и 3 реверсированы',
    answers: { '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 1, '7': 2, '8': 3, '9': 4, '10': 5 },
    expected: { goalDisengagement: 1 + 4 + 3 + 4, goalReengagement: 5 + 1 + 2 + 3 + 4 + 5 },
  },
  {
    title: 'Все ответы минимальны; обратные пункты после перекодировки равны 5',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { goalDisengagement: 1 + 5 + 5 + 1, goalReengagement: 6 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['trait-goal'],
  scoringConfig,
  validationCases,
  formulaVersion: 'gdgrs-rasskazova-2018-v1',
  details: {
    version: 'Русскоязычная версия; апробация Рассказовой (2018)',
    year: 2018,
    author: 'Carsten Wrosch, Michael F. Scheier, Gregory E. Miller, Richard Schulz, Charles S. Carver; русскоязычная адаптация Е. И. Рассказовой',
    summary: instrument.description!,
    adaptation: 'Русский перевод прошёл экспертную оценку и интервьюирование респондентов; исследовался на выборке студентов и работающих взрослых.',
    rightsNote: 'Формулировки воспроизведены по опубликованной русскоязычной адаптации. При дальнейшем распространении полного текста следует учитывать права авторов и издателя.',
    steps: [
      'Предъявляются 10 утверждений о реакции на прекращение важной цели; для каждого выбирается степень согласия от 1 до 5.',
      'Пункты отказа от цели (1–4) суммируются после обратного перекодирования пунктов 2 и 3 по формуле 6 − ответ.',
      'Пункты смены цели (5–10) суммируются без обратного перекодирования. Интерпретируйте две суммы раздельно.',
    ],
    keys: [
      { label: 'Отказ от цели', value: 'Пункты 1–4; обратные 2 и 3; сумма после пересчёта 6 − ответ.' },
      { label: 'Смена цели', value: 'Пункты 5–10; сумма без обратных пунктов.' },
    ],
    notes: ['Диапазон отказа от цели: 4–20; диапазон смены цели: 6–30. Русская апробация указывает на возможную низкую согласованность субшкалы отказа от цели у работников с низким уровнем образования; нормативные пороги не задаются.'],
    sources: [
      { title: 'Рассказова Е. И. (2018). «Апробация русскоязычной версии шкалы отказа и смены цели» — статья с русским текстом пунктов и факторной структурой', url: 'https://msupsyj.ru/articles/article/7527/' },
      { title: 'Рассказова Е. И. (2018). «Апробация русскоязычной версии шкалы отказа и смены цели» — PDF выпуска, таблица 2', url: 'https://msupsyj.ru/upload/iblock/43a/f3b36vb97ncvs4f0r76v8tfq4951px7g/vestnik_2018_2.pdf' },
      { title: 'Wrosch, Scheier, Miller, Schulz, & Carver (2003). “Adaptive Self-Regulation of Unattainable Goals” — оригинальная публикация и шкала', url: 'https://journals.sagepub.com/doi/10.1177/0146167203256921' },
      { title: 'Psytests.org. «Шкала отказа и смены цели» — страница русской методики и бланка', url: 'https://psytests.org/emvol/gdres.html' },
    ],
  },
};
