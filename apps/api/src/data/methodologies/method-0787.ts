import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Не согласен' },
  { value: '2', label: 'Скорее не согласен' },
  { value: '3', label: 'Скорее согласен' },
  { value: '4', label: 'Согласен' },
];

const items = [
  'Я убежден, что любые попытки изменить мир тщетны.',
  'В моей жизни бывают периоды, когда я остаюсь ко всему безучастным.',
  'Свое нынешнее состояние я могу назвать упадком сил.',
  'Мне стало лень заниматься делами, которые раньше вызывали у меня интерес.',
  'Иногда я не чувствую вкуса жизни.',
  'Я фаталист и считаю, что человек бессилен против судьбы.',
  'По возможности я стараюсь дистанцироваться от сильных чувств и переживаний.',
  'Мне знакомо состояние, когда находишься на грани отчаяния.',
  'Никому нет дела до моих проблем и жизненных неурядиц.',
  'Ко многим предметам, которыми восторгаются другие, я испытываю равнодушие.',
  'С некоторых пор я стал редко общаться с близкими мне людьми.',
  'Я довольно прохладно отношусь к любой идее совершенствования себя или мира.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_817_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_817',
  title: 'Новая шкала апатии',
  description: 'Шкала оценивает выраженность апатии как состояния безразличия и равнодушия к себе, другим и миру. Единый показатель охватывает переживания безучастности, утраты интереса и сил, безнадежности, эмоционального дистанцирования и снижения общения. Разработана для взрослых русскоязычных респондентов; может применяться для психологического скрининга условно здоровой популяции.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 4,
  scales: [{
    key: 'apathy',
    label: 'Апатия',
    items: Array.from({ length: 12 }, (_, index) => index + 1),
    reverseItems: [],
    aggregation: 'sum',
  }],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная сверка: все ответы «Не согласен» дают 12 баллов',
    answers: Object.fromEntries(Array.from({ length: 12 }, (_, index) => [String(index + 1), 1])),
    expected: { apathy: 12 },
  },
  {
    title: 'Ручная сверка: все ответы «Согласен» дают 48 баллов',
    answers: Object.fromEntries(Array.from({ length: 12 }, (_, index) => [String(index + 1), 4])),
    expected: { apathy: 48 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'zolotareva-new-apathy-scale-12-item-sum-v1',
};
