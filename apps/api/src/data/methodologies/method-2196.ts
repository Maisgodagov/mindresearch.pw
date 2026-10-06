import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Совершенно не верно' },
  { value: '2', label: 'Не верно' },
  { value: '3', label: 'Отчасти верно' },
  { value: '4', label: 'Верно' },
  { value: '5', label: 'Совершенно верно' },
];

const items = [
  'Чтобы зарабатывать на жизнь.',
  'Потому что это помогает мне расслабиться.',
  'Потому что это интересно.',
  'Потому что мне нравится проводить время с другими.',
  'Чтобы стать лучше в спорте.',
  'Потому что я в этом лучше, чем другие.',
  'Потому что за это мне платят.',
  'Чтобы тренироваться вместе с другими.',
  'Чтобы лучше справляться со стрессом.',
  'Потому что это позволяет быть здоровым.',
  'Чтобы подчеркнуть мускулатуру и лучше выглядеть.',
  'Быть в хорошей физической форме.',
  'Потому что это делает меня счастливым.',
  'Чтобы уйти от проблем.',
  'Для поддержания физического здоровья.',
  'Чтобы улучшить уже имеющиеся навыки.',
  'Чтобы быть лучшим в группе.',
  'Чтобы контролировать состояние здоровья.',
  'Чтобы добиться совершенства.',
  'Чтобы было какое-то общее занятие с друзьями.',
  'Потому что другие говорят мне, что я должен этим заниматься.',
  'Потому что это работает как снятие стресса.',
  'Ради улучшения фигуры.',
  'Для приобретения новых навыков.',
  'Потому что это весело.',
  'Потому что эти занятия мне назначил врач.',
  'Чтобы я мог работать эффективнее, чем другие.',
  'Потому что это поддерживает мое здоровье.',
  'Чтобы лучше конкурировать с окружающими.',
  'Чтобы общаться с друзьями во время тренировок.',
  'Чтобы сохранять те навыки, которые у меня есть.',
  'Чтобы лучше выглядеть.',
  'Для тренировки моей сердечно-сосудистой системы.',
  'Потому что мне нравится тренироваться.',
  'Чтобы отвлечься от рутинных дел.',
  'Чтобы скинуть вес, лучше выглядеть.',
  'Потому что так я отлично провожу время.',
  'Чтобы побыть с друзьями.',
  'Чтобы быть в лучшей форме, чем окружающие.',
  'Чтобы поддерживать тело в тонусе, быть подтянутым.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2210_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2210',
  title: 'Шкала мотивации к двигательной активности (МОДА, PALMS), русская адаптация',
  description: 'Оценивает мотивы досуговой двигательной активности и любительского спорта по восьми аспектам: конкуренция и амбиции, внешность, ожидания других, групповая принадлежность, физическое и психологическое состояние, мастерство и удовольствие. Подходит для изучения мотивационного профиля взрослых и подростков, занимающихся любительским спортом, фитнесом и другими формами физической активности; результаты помогают автору опроса понять, какие мотивы поддерживают участие.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'competition_ambition', label: 'Конкуренция / Амбиции', items: [6, 17, 27, 29, 39], reverseItems: [], aggregation: 'sum' },
    { key: 'appearance', label: 'Внешность', items: [11, 23, 32, 36, 40], reverseItems: [], aggregation: 'sum' },
    { key: 'others_expectations', label: 'Ожидания других', items: [1, 7, 18, 21, 26], reverseItems: [], aggregation: 'sum' },
    { key: 'affiliation', label: 'Групповая принадлежность', items: [4, 8, 20, 30, 38], reverseItems: [], aggregation: 'sum' },
    { key: 'physical_condition', label: 'Физическое состояние', items: [10, 12, 15, 28, 33], reverseItems: [], aggregation: 'sum' },
    { key: 'psychological_condition', label: 'Психологическое состояние', items: [2, 9, 14, 22, 35], reverseItems: [], aggregation: 'sum' },
    { key: 'mastery', label: 'Мастерство', items: [5, 16, 19, 24, 31], reverseItems: [], aggregation: 'sum' },
    { key: 'enjoyment', label: 'Удовольствие', items: [3, 13, 25, 34, 37], reverseItems: [], aggregation: 'sum' },
  ],
};

const allAnswers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Ручная проверка: все ответы имеют минимальное значение', answers: allAnswers(1), expected: { competition_ambition: 5, appearance: 5, others_expectations: 5, affiliation: 5, physical_condition: 5, psychological_condition: 5, mastery: 5, enjoyment: 5 } },
  { title: 'Ручная проверка: все ответы имеют максимальное значение', answers: allAnswers(5), expected: { competition_ambition: 25, appearance: 25, others_expectations: 25, affiliation: 25, physical_condition: 25, psychological_condition: 25, mastery: 25, enjoyment: 25 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'palms-moda-bochaver-bondarev-papkova-2020-sum-8x5-v1',
};
