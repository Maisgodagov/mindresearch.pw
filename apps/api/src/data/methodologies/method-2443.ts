import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Полностью согласен' },
  { value: '2', label: 'Скорее согласен' },
  { value: '3', label: 'И да, и нет' },
  { value: '4', label: 'Скорее не согласен' },
  { value: '5', label: 'Полностью не согласен' },
];

const items = [
  'Чувствовать себя расстроенным или подавленным для меня невыносимо.',
  'Когда я чувствую себя расстроенным или подавленным, всё, о чём я могу думать, – это как мне плохо.',
  'Я не могу справиться с чувством расстройства или подавленности.',
  'Мои страдания настолько интенсивны, что полностью захватывают меня.',
  'Нет ничего хуже, чем чувствовать себя расстроенным или подавленным.',
  'Я могу переносить состояние расстройства или подавленности не хуже большинства людей.',
  'То, что я чувствую, когда я расстроен или подавлен – неприемлемо.',
  'Я сделаю всё, чтобы избежать чувства расстройства или подавленности.',
  'Кажется, другие люди переносят состояние расстройства или подавленности лучше, чем я.',
  'Для меня переживание подавленности или расстройства всегда является серьезным испытанием.',
  'Мне стыдно за себя, когда я подавлен или расстроен.',
  'Меня пугают чувства подавленности или расстройства.',
  'Я сделаю всё, чтобы перестать чувствовать подавленность или расстройство.',
  'Когда я подавлен или расстроен, мне необходимо немедленно что-то с этим сделать.',
  'Когда я подавлен или расстроен, я невольно сосредотачиваюсь на том, насколько ужасны на самом деле эти чувства.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2461_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

const instrument: SeedSection = {
  code: 'test_2461',
  title: 'Шкала толерантности к дистрессу (DTS)',
  description: 'Шкала оценивает воспринимаемую способность переносить негативные эмоциональные состояния. Четыре аспекта охватывают переносимость дистресса, поглощённость переживанием, оценку его приемлемости и усилия по регуляции. Полная 15-пунктовая версия предназначена для самоотчёта; русская формулировка представлена как перевод psytests.org, без сведений о российской адаптации. Результаты помогают автору опроса изучать индивидуальные различия в переживании эмоционального дистресса.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'tolerance', label: 'Переносимость', items: [1, 3, 5], reverseItems: [], aggregation: 'mean' },
    { key: 'absorption', label: 'Поглощённость дистрессом', items: [2, 4, 15], reverseItems: [], aggregation: 'mean' },
    { key: 'appraisal', label: 'Оценка дистресса', items: [6, 7, 9, 10, 11, 12], reverseItems: [6], aggregation: 'mean' },
    { key: 'regulation', label: 'Регуляция', items: [8, 13, 14], reverseItems: [], aggregation: 'mean' },
    { key: 'total', label: 'Общая толерантность к дистрессу', items: Array.from({ length: 15 }, (_, i) => i + 1), reverseItems: [6], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка ключа: одинаковые ответы 1, пункт 6 реверсируется',
    answers: Object.fromEntries(Array.from({ length: 15 }, (_, i) => [String(i + 1), 1])),
    expected: { tolerance: 1, absorption: 1, appraisal: 4.333333333333333, regulation: 1, total: 1.2 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['framework-cbt', 'regulation-control'],
  scoringConfig,
  validationCases,
  formulaVersion: 'dts-simons-gaher-2005-psytests-ru-v1',
};
