import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const items = [
  'Я чувствую побуждение ходить по магазинам и тратить деньги, даже когда у меня нет ни времени, ни денег.',
  'Я получаю мало удовольствия от покупок или вообще не получаю его.',
  'Я ненавижу ходить по магазинам.',
  'Я постоянно покупаю напитки.',
  'Я чувствую себя «под кайфом», когда совершаю покупки.',
  'Я покупаю вещи, даже когда мне ничего не нужно.',
  'Я впадаю в «запой» покупками, когда я расстроен(а), разочарован(а), подавлен(а) или зол(зла).',
  'Я беспокоюсь о своих привычках тратить, но всё равно хожу по магазинам и трачу деньги.',
  'Я чувствую беспокойство после того, как отправляюсь в «запой» покупками.',
  'Я покупаю вещи, даже если не могу себе этого позволить.',
  'Я чувствую вину или стыд после того, как отправляюсь в «запой» покупками.',
  'Я покупаю вещи, которые мне не нужны или которыми я не буду пользоваться.',
  'Иногда мне хочется пройтись по магазинам.',
];

const options = [
  { value: '1', label: 'Полностью не согласен' },
  { value: '2', label: 'Скорее не согласен' },
  { value: '3', label: 'Ни согласен, ни не согласен' },
  { value: '4', label: 'Скорее согласен' },
  { value: '5', label: 'Полностью согласен' },
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2181_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2181',
  title: 'Шкала компульсивных покупок (ECBS), русскоязычная адаптация',
  description: 'Методика оценивает выраженность склонности к компульсивным покупкам у взрослых потребителей. Она охватывает побуждение и потерю контроля, покупки как эмоциональную регуляцию, чрезмерные траты, тревогу и вину после покупок. Русскоязычная версия первично адаптирована на российской выборке; результат отражает общий индекс склонности, а не клинический диагноз.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'compulsive_buying', label: 'Общий индекс компульсивных покупок (среднее по 10 пунктам)', items: [1, 5, 6, 7, 8, 9, 10, 11, 12, 13], reverseItems: [], aggregation: 'mean' },
  ],
};

const allAnswers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Минимальное согласие по всем пунктам; общий индекс учитывает только 10 небуферных пунктов', answers: allAnswers(1), expected: { compulsive_buying: 1 } },
  { title: 'Максимальное согласие по всем пунктам; общий индекс учитывает только 10 небуферных пунктов', answers: allAnswers(5), expected: { compulsive_buying: 5 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'ecbs-ru-maksimenko-deyneka-2024-v1',
};
