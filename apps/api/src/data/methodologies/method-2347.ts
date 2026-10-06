import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const answers = [
  { value: '1', label: 'Никогда' },
  { value: '2', label: 'Редко' },
  { value: '3', label: 'Иногда' },
  { value: '4', label: 'В большинстве случаев' },
  { value: '5', label: 'Всегда' },
];

const items = [
  'Правила вызывают у меня чувство сопротивления',
  'Мне нравится противоречить окружающим',
  'Если мне что-то запрещают, то я думаю: «Это именно то, что я и сделаю»',
  'Мысль зависимости от других меня тяготит',
  'Я воспринимаю чужие советы как вмешательство в мои дела',
  'Я расстраиваюсь, когда не могу принимать свободные и независимые решения',
  'Меня раздражает, когда кто-то указывает на вещи, которые для меня очевидны',
  'Я злюсь, когда ограничивают мою свободу выбора',
  'Советы и рекомендации побуждают меня поступать наоборот',
  'Я удовлетворен(а), только когда действую по собственной воле',
  'Я сопротивляюсь чужим попыткам повлиять на меня',
  'Меня злит, когда кого-то преподносят мне как образец для подражания',
  'Когда кто-то заставляет меня что-то делать, мне хочется поступить наоборот',
  'Меня разочаровывает, когда я вижу, как другие подчиняются стандартам и правилам общества',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2365_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: answers,
}));

export const instrument: SeedSection = {
  code: 'test_2365',
  title: 'Шкала реактивного сопротивления Мерца—Хонга',
  description: 'Русскоязычная адаптация оценивает выраженность личностного реактивного сопротивления — реакции на воспринимаемое ограничение свободы и внешнее влияние. Пункты охватывают нежелание подчиняться правилам и нормам, противодействие внешнему влиянию, сопротивление советам и эмоциональную реакцию на ограничение выбора. Версия Ничко и Гуриевой проверялась на русскоязычной взрослой выборке 18–75 лет; авторы отмечают необходимость дальнейшей проверки модели на расширенной выборке.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'norm_resistance', label: 'Нежелание подчиняться правилам и нормам', items: [1, 3, 13, 14], reverseItems: [], aggregation: 'sum' },
    { key: 'external_influence', label: 'Противостояние внешнему влиянию', items: [4, 10, 11], reverseItems: [], aggregation: 'sum' },
    { key: 'advice_resistance', label: 'Сопротивление советам и рекомендациям', items: [5, 9, 12], reverseItems: [], aggregation: 'sum' },
    { key: 'choice_reaction', label: 'Эмоциональная реакция на ограничение выбора', items: [6, 7, 8], reverseItems: [], aggregation: 'sum' },
    { key: 'reactance_total', label: 'Общий балл реактивного сопротивления', items: [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Вручную проверено: минимальные ответы дают 4 по первой подшкале, 3 по остальным и среднее 1',
    answers: Object.fromEntries(Array.from({ length: 14 }, (_, index) => [String(index + 1), index === 1 ? 5 : 1])),
    expected: { norm_resistance: 4, external_influence: 3, advice_resistance: 3, choice_reaction: 3, reactance_total: 1 },
  },
  {
    title: 'Вручную проверено: максимальные ответы дают 20 по первой подшкале, 15 по остальным и среднее 5',
    answers: Object.fromEntries(Array.from({ length: 14 }, (_, index) => [String(index + 1), index === 1 ? 5 : 5])),
    expected: { norm_resistance: 20, external_influence: 15, advice_resistance: 15, choice_reaction: 15, reactance_total: 5 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['regulation-control'],
  scoringConfig,
  validationCases,
  formulaVersion: 'nichko-gurieva-merz-hong-reactance-ru-2025-13item-v1',
};
