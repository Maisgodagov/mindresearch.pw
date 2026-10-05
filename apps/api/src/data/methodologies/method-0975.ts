import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Совсем нет' },
  { value: '2', label: 'Редко' },
  { value: '3', label: 'Часто' },
  { value: '4', label: 'Постоянно' },
];

const items = [
  'За последний месяц вы прилагали большие усилия к достижению своих целей?',
  'За последний месяц вы были склонны сосредотачиваться скорее на том, чего вы достигли, а не на том, чего вы не достигли?',
  'За последний месяц вам говорили, что ваши стандарты слишком высоки?',
  'За последний месяц вы чувствовали себя неудачником, потому что вы не преуспели в достижении своих целей?',
  'За последний месяц вы боялись, что можете не достичь ваших стандартов?',
  'За последний месяц вы повышали свои стандарты, потому что вы думали, что они были слишком просты в достижении?',
  'За последний месяц вы оценивали себя на основе своей способности достигать высоких стандартов?',
  'За последний месяц вы сделали достаточно для того, чтобы минимально соответствовать своим стандартам?',
  'За последний месяц вы неоднократно проверяли как хорошо вы соответствуете своим стандартам (например, сравнивая свои результаты с результатами других)?',
  'Как вы думаете, за последний месяц другие люди подумали бы о вас как о «перфекционисте»?',
  'В течение последнего месяца вы продолжали пытаться соответствовать своим стандартам, даже если это означало, что какая-то часть вашей жизни страдает?',
  'За последний месяц вы избегали каких-либо проверок своей результативности (при достижении целей) в случае, если вы потерпели неудачу?',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1005_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1005',
  title: 'Опросник клинического перфекционизма (CPQ), русскоязычная адаптация',
  description: 'Опросник оценивает клинический перфекционизм за последний месяц: самооценку, зависящую от достижений, стремление соответствовать высоким стандартам и негативное оценивание результатов. Подходит для взрослых респондентов и может использоваться как дополнительный исследовательский инструмент при изучении перфекционизма и РПП; сам по себе не устанавливает диагноз.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 4,
  scales: [
    { key: 'achievement_self_evaluation', label: 'Самооценка на основании достижений', items: [4, 5, 7, 9, 12], reverseItems: [], aggregation: 'sum' },
    { key: 'high_standards', label: 'Соответствие высоким стандартам', items: [1, 3, 6, 10, 11], reverseItems: [], aggregation: 'sum' },
    { key: 'negative_results_evaluation', label: 'Негативное оценивание результатов', items: [2, 8], reverseItems: [2, 8], aggregation: 'sum' },
    { key: 'total_original', label: 'Общий балл CPQ по оригинальному правилу', items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], reverseItems: [2, 8], aggregation: 'sum' },
  ],
};

const answers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Все ответы «Совсем нет» (обратные пункты реверсируются)', answers: answers(1), expected: { achievement_self_evaluation: 5, high_standards: 5, negative_results_evaluation: 8, total_original: 14 } },
  { title: 'Все ответы «Постоянно» (обратные пункты реверсируются)', answers: answers(4), expected: { achievement_self_evaluation: 20, high_standards: 20, negative_results_evaluation: 2, total_original: 34 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'cpq-ru-skupova-2024-v1',
};
