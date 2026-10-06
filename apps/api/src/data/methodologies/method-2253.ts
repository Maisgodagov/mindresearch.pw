import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'Отсутствует' },
  { value: '1', label: 'Слабо' },
  { value: '2', label: 'Умеренно' },
  { value: '3', label: 'Выражено' },
  { value: '4', label: 'Очень сильно' },
];

const items = [
  'Страх упасть в обморок',
  'Страх сердечного приступа',
  'Страх других болезней',
  'Страх смерти',
  'Страх стать беспомощным',
  'Страх сойти с ума',
  'Страх потерять контроль',
  'Страх, что тревога станет заметна окружающим',
  'Страх устроить сцену (стать объектом внимания окружающих)',
  'Страх страха',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2271_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

const instrument: SeedSection = {
  code: 'test_2271',
  title: 'Шкала оценки агорафобии (ACS), русская версия С. А. Макарова',
  description: 'Шкала ACS оценивает выраженность пугающих представлений и «страха страха» у пациентов с диагностированной агорафобией. Пункты охватывают страх телесной беспомощности и болезни, потери контроля, а также смущения или внимания окружающих. Эта десятипунктовая русская версия подходит для описания когнитивных переживаний в клинической работе и исследованиях; она не измеряет агорафобию как таковую.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 4,
  scales: [
    { key: 'bodily_incapacitation', label: 'Страх телесной беспомощности', items: [1, 2, 3, 4, 5], reverseItems: [], aggregation: 'mean' },
    { key: 'losing_control', label: 'Страх потери контроля', items: [6, 7], reverseItems: [], aggregation: 'mean' },
    { key: 'embarrassment', label: 'Страх смущения и внимания окружающих', items: [8, 9, 10], reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная сверка ключа: минимальные ответы дают ноль по всем подшкалам',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 0])),
    expected: { bodily_incapacitation: 0, losing_control: 0, embarrassment: 0 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['mood-anxiety'],
  scoringConfig,
  validationCases,
  formulaVersion: 'acs-hoffart-friis-martinsen-1992-makarov-ru-v1',
};
