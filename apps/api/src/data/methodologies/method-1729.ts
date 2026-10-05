import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'Не согласен' },
  { value: '1', label: 'Скорее не согласен' },
  { value: '2', label: 'И да, и нет' },
  { value: '3', label: 'Скорее согласен' },
  { value: '4', label: 'Полностью согласен' },
];

const items = [
  'В неопределённой ситуации я обычно верю, что всё будет хорошо.',
  'Меня очень легко вывести из себя.',
  'От будущего я не жду ничего особенно хорошего.',
  'Я всегда во всём ищу позитив.',
  'Я всегда с оптимизмом смотрю в будущее.',
  'Общение с друзьями доставляет мне большое удовольствие.',
  'Для меня важно всегда быть занятым.',
  'Я мало верю в то, что будущее будет хорошим.',
  'Я не строю особенно оптимистических планов на будущее.',
  'Меня нелегко расстроить.',
  'Я верю в то, что всё, что происходит, — к лучшему.',
  'Я редко надеюсь на то, что со мной произойдёт что-то хорошее.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1746_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1746',
  title: 'Тест диспозиционного оптимизма (ТДО / LOT)',
  description: 'Русскоязычная адаптация LOT оценивает диспозиционный оптимизм как обобщённые ожидания благоприятных или неблагоприятных событий в будущем. Охватывает позитивные ожидания, негативные ожидания и их общий биполярный показатель; подходит для взрослых и исследовательских выборок, на которых проверялась русскоязычная версия (преимущественно студенты). Четыре пункта-наполнителя в баллы не входят.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 4,
  scales: [
    { key: 'positive_expectations', label: 'Позитивные ожидания', items: [1, 4, 5, 11], reverseItems: [], aggregation: 'sum' },
    { key: 'negative_expectations_reversed', label: 'Негативные ожидания (инвертированная оценка)', items: [3, 8, 9, 12], reverseItems: [3, 8, 9, 12], aggregation: 'sum' },
    { key: 'dispositional_optimism', label: 'Общий показатель диспозиционного оптимизма', items: [1, 3, 4, 5, 8, 9, 11, 12], reverseItems: [3, 8, 9, 12], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная сверка: при ответе «не согласен» на все пункты позитивная шкала равна 0, негативная после инверсии — 16, общий балл — 16; пункты-наполнители исключены.',
    answers: Object.fromEntries(Array.from({ length: 12 }, (_, index) => [String(index + 1), '0'])),
    expected: { positive_expectations: 0, negative_expectations_reversed: 16, dispositional_optimism: 16 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'gordeeva-sychev-osin-lot-2010-v1',
};
