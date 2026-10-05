import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Никогда' },
  { value: '2', label: 'Редко' },
  { value: '3', label: 'Иногда' },
  { value: '4', label: 'Часто' },
  { value: '5', label: 'Очень часто' },
];

const items = [
  'Я тревожусь, если думаю, о том, что мое заболевание может прогрессировать',
  'Я нервничаю, когда мне назначают посещение врачей или медицинские осмотры',
  'Я боюсь боли',
  'Я испытываю обеспокоенность по поводу достижения моих профессиональных целей из-за моей болезни',
  'Когда я испытываю беспокойство, у меня учащается сердцебиение, появляется боль в животе',
  'Меня беспокоит, что мои дети могут заболеть такой же болезнью как у меня',
  'Меня беспокоит возможность утратить самостоятельность',
  'Я боюсь, что из-за болезни не смогу продолжать заниматься привычными для меня делами',
  'Я боюсь серьезных лечебных процедур в ходе моей болезни',
  'Я боюсь, что лечение может повредить мое тело',
  'Меня беспокоит, что будет с моей семьей, если со мной что-нибудь случится',
  'Мысль о том, что я больше не смогу работать из-за болезни меня беспокоит',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1270_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1270',
  title: 'Опросник страха прогрессирования заболевания, FoP-Q-SF',
  description: 'Краткая версия FoP-Q-SF оценивает выраженность беспокойства пациента о прогрессировании или рецидиве заболевания и связанных с этим последствиях. Пункты охватывают эмоциональные реакции, профессиональные и семейные опасения, а также страх утраты автономии; русская версия Сироты и Московченко апробирована на женщинах с онкологическими заболеваниями репродуктивной системы.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'total', label: 'Общий страх прогрессирования заболевания', items: Array.from({ length: 12 }, (_, i) => i + 1), reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: минимальная частота по всем 12 пунктам',
    answers: Object.fromEntries(Array.from({ length: 12 }, (_, i) => [String(i + 1), 1])),
    expected: { total: 12 },
  },
  {
    title: 'Ручная проверка: ответы 1–5 циклически; сумма двенадцати ответов',
    answers: Object.fromEntries(Array.from({ length: 12 }, (_, i) => [String(i + 1), (i % 5) + 1])),
    expected: { total: 35 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'fop-q-sf-sirota-moskovchenko-2014-sum-12-v1',
};
