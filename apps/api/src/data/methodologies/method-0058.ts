import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Никогда' },
  { value: '2', label: 'Почти никогда' },
  { value: '3', label: 'Иногда' },
  { value: '4', label: 'Часто' },
  { value: '5', label: 'Всегда' },
];

const items = [
  'Если ваш ребенок что-то сделал хорошо, вы даете ему это понять.',
  'Вы угрожаете наказать ребенка, а потом не наказываете его на самом деле.',
  'Вы вызываетесь помочь ребенку в особых занятиях, в которых он участвует.',
  'Вашему ребенку удается уговорить вас не наказывать его, после того как он что-то сделал не так.',
  'Вы спрашиваете ребенка, как прошел день.',
  'Вы помогаете ребенку в его делах.',
  'Вы поздравляете своего ребенка, когда он что-то хорошо делает.',
  'Вы хвалите своего ребенка, если он хорошо себя ведет.',
  'Вы целуете или обнимаете своего ребенка, когда он что-то хорошо сделал.',
  'Вы освобождаете ребенка от наказания досрочно (например, снимаете ограничения раньше, чем говорили поначалу).',
  'Наказания вашего ребенка зависят от вашего настроения.',
  'Вы лупите ребенка рукой, когда он сделал что-нибудь плохое.',
  'Вы игнорируете ребенка, когда он плохо себя ведет.',
  'Вы шлепаете ребенка, когда он сделал что-нибудь плохое.',
  'Вы бьете ребенка ремнем или другим предметом, когда он сделал что-нибудь плохое.',
  'Вы кричите и вопите на ребенка, когда он сделал что-нибудь плохое.',
  'Вы применяете тайм-аут (заставляете его/ее сидеть или стоять в углу) в качестве наказания.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_96_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_96',
  title: 'Алабамский опросник практик родительского воспитания, APQ-PR',
  description: 'Краткая русскоязычная адаптация для родителей детей дошкольного возраста. Оцените частоту применения каждой практики воспитания по шкале от «Никогда» до «Всегда». 17 пунктов образуют три шкалы; показатели рассчитываются суммированием ответов по ключу.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'positive_involvement', label: 'Позитивное воспитание / вовлеченность', items: [1, 3, 5, 6, 7, 8, 9], reverseItems: [], aggregation: 'sum' },
    { key: 'punishment', label: 'Применение наказаний', items: [12, 13, 14, 15, 16, 17], reverseItems: [], aggregation: 'sum' },
    { key: 'inconsistent_discipline', label: 'Непоследовательная дисциплина', items: [2, 4, 10, 11], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: одинаковый средний ответ, суммы соответствуют числу пунктов в каждой шкале',
    answers: Object.fromEntries(Array.from({ length: 17 }, (_, index) => [String(index + 1), 3])),
    expected: { positive_involvement: 21, punishment: 18, inconsistent_discipline: 12 },
  },
  {
    title: 'Ручная проверка: крайние ответы дают минимумы и максимумы шкал',
    answers: Object.fromEntries(Array.from({ length: 17 }, (_, index) => [String(index + 1), 1])),
    expected: { positive_involvement: 7, punishment: 6, inconsistent_discipline: 4 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'apq-pr-loginova-slobodskaya-2016-17items-sum-v1',
};
