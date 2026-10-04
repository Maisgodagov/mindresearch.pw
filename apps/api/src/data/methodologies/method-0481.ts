import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const answerOptions = [
  { value: '1', label: 'Причина отсутствует' },
  { value: '2', label: 'Причина встречается крайне редко' },
  { value: '3', label: 'Причина встречается редко' },
  { value: '4', label: 'Причина выражена в среднем' },
  { value: '5', label: 'Причина встречается достаточно часто' },
  { value: '6', label: 'Причина встречается часто' },
];

const items = [
  'Отсутствие ясных целей и намерений в жизни.',
  'Неумение определять порядок действий в жизни (неумение установить очередность действий).',
  'Равнодушие к жизни и работе.',
  'Отсутствие желания проявлять активность.',
  'Чувство постоянной спешки.',
  'Отсутствие видения своих перспектив.',
  'Несобранность (постоянное откладывание дел на потом).',
  'Отсутствие желания добиваться результатов.',
  'Усталость.',
  'Эмоциональное напряжение.',
  'Отсутствие конкретных взглядов на отдельные проблемы в жизни.',
  'Непоследовательность действий при работе.',
  'Отсутствие желания работать.',
  'Тревожность, что не сделаю хорошо, как надо.',
  'Чувство сжатости, ограниченности времени.',
  'Не знаю, что нужно делать в жизни.',
  'Неумение длительно сосредоточиваться и работать над одной проблемой.',
  'Отсутствие стимулирующих моментов в жизни и работе.',
  'Слабость, пассивность.',
  'Чувство острой нехватки времени.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_515_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: answerOptions,
}));

export const instrument: SeedSection = {
  code: 'test_515',
  title: 'Личностные дезорганизаторы времени',
  description: 'Методика оценивает выраженность личностных факторов, связанных с неэффективным использованием времени и непродуктивной организацией деятельности. Охватывает ценностно-смысловые, мотивационные и организационные затруднения, эмоциональную апатию и эмоциональное напряжение. Разработана для изучения работающих людей; стандартизация проводилась на выборке студентов, школьных педагогов и продавцов-консультантов.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 6,
  scales: [
    { key: 'values_meaning', label: 'Ценностно-смысловые дезорганизаторы', items: [1, 6, 11, 16], reverseItems: [], aggregation: 'sum' },
    { key: 'organizational', label: 'Организационные дезорганизаторы', items: [2, 7, 12, 17], reverseItems: [], aggregation: 'sum' },
    { key: 'motivational', label: 'Мотивационные дезорганизаторы', items: [3, 8, 13, 18], reverseItems: [], aggregation: 'sum' },
    { key: 'emotional_apathy', label: 'Эмоциональная апатия', items: [4, 9, 14, 19], reverseItems: [], aggregation: 'sum' },
    { key: 'emotional_tension', label: 'Эмоциональное напряжение', items: [5, 10, 15, 20], reverseItems: [], aggregation: 'sum' },
    { key: 'overall', label: 'Общий показатель дезорганизации', items: Array.from({ length: 20 }, (_, index) => index + 1), reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: минимальный ответ по каждому пункту',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { values_meaning: 4, organizational: 4, motivational: 4, emotional_apathy: 4, emotional_tension: 4, overall: 20 },
  },
  {
    title: 'Ручная проверка: максимальный ответ по каждому пункту',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 6])),
    expected: { values_meaning: 24, organizational: 24, motivational: 24, emotional_apathy: 24, emotional_tension: 24, overall: 120 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'kuzmina-ldv-2011-v1',
};
