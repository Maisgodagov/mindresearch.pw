import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Совсем не подходит' },
  { value: '2', label: 'Немного подходит' },
  { value: '3', label: 'В достаточной мере подходит' },
  { value: '4', label: 'Подходит в значительной мере' },
  { value: '5', label: 'Полностью подходит' },
];

const items = [
  'Я часто читаю книги и журналы о своей вере.',
  'Я жертвую деньги своей религиозной организации.',
  'Я уделяю время тому, чтобы расти в понимании своей веры.',
  'Религия особенно важна для меня, потому что она отвечает на многие вопросы о смысле жизни.',
  'Мои религиозные убеждения лежат в основе всего моего подхода к жизни.',
  'Мне нравится проводить время с людьми той же религиозной принадлежности (вероисповедания), что и я.',
  'Религиозные убеждения влияют на все мои поступки в жизни.',
  'Для меня важно проводить время в религиозных размышлениях.',
  'Мне нравится заниматься деятельностью, связанной с моей верой (вероисповеданием).',
  'Я всегда в курсе того, что происходит в моей религиозной общине, и имею определенное влияние на принятие решений в ней.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2370_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2370',
  title: 'Шкала религиозной приверженности RCI-10 (русскоязычная адаптация)',
  description: 'RCI-10 оценивает, насколько человек придерживается религиозных ценностей, убеждений и практик и интегрирует их в повседневную жизнь. Методика охватывает интраперсональную приверженность (личные убеждения, размышления и религиозный смысл) и интерперсональную приверженность (связь с общиной и участие в её деятельности). Русскоязычная адаптация проверена на популяционной выборке от 15 лет и клинической выборке взрослых; она может помочь автору опроса учитывать религиозную приверженность в исследовательском, консультативном или клиническом контексте.',
  categoryIds: ['social-religion'],
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'intrapersonal', label: 'Интраперсональная религиозная приверженность', items: [1, 3, 4, 5, 7, 8], reverseItems: [], aggregation: 'sum' },
    { key: 'interpersonal', label: 'Интерперсональная религиозная приверженность', items: [2, 6, 9, 10], reverseItems: [], aggregation: 'sum' },
    { key: 'total', label: 'Общая религиозная приверженность', items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], reverseItems: [], aggregation: 'sum' },
  ],
};

export const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: минимальные ответы дают суммы 6, 4 и 10',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { intrapersonal: 6, interpersonal: 4, total: 10 },
  },
  {
    title: 'Ручная проверка: ответы 1–5 по кругу дают 18, 12 и 30',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), (index % 5) + 1])),
    expected: { intrapersonal: 18, interpersonal: 12, total: 30 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'rci-10-dvoinin-zolotareva-shankov-2023-ru-subscale-and-total-sums-v1',
};
