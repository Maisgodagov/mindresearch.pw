import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const items = [
  'Общаясь с ними, я противоречу своей истинной натуре.',
  'Я не могу продемонстрировать себя таким, какой я есть.',
  'В общении с ними я не могу быть до конца откровенным, особенно в том, что является для меня важным.',
  'Когда я общаюсь с ними, я перестаю понимать, кто я есть на самом деле.',
  'Если я думаю, что не соответствую их ожиданиям, то я скрываю настоящего себя.',
  'Иногда в общении с ними я стараюсь казаться не тем, кто я есть.',
  'Есть разница между тем, кто я есть, и какое впечатление о себе я стараюсь произвести на собеседника.',
  'Я не такой, каким видят меня они.',
  'У меня есть ощущение, что у них сложилось неправильное представление обо мне.',
  'Я чувствую, что их представления обо мне расходятся с реальностью.',
  'Я чувствую, что у них стереотипное представление обо мне.',
  'Мне кажется, что они не осознают, что я меняюсь.',
  'Иногда, когда они говорят обо мне, мне кажется, что речь идет о ком-то другом.',
];

const answers = ['Совершенно не согласен', '2', '3', '4', '5', '6', 'Полностью согласен'].map((label, index) => ({
  value: String(index + 1),
  label,
}));

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2362_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: answers,
}));

export const instrument: SeedSection = {
  code: 'test_2362',
  title: 'Шкала разрывов идентичности в коммуникации',
  description: 'Русскоязычная адаптация оценивает выраженность двух несоответствий в общении со значимыми людьми: между личной и предъявляемой идентичностями и между личной и реляционной идентичностями. Подходит для исследований и оценки взрослых респондентов в общем контексте межличностного общения; валидизация проведена на выборке 18–71 года.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'pei', label: 'Разрыв личной и предъявляемой идентичности (PEI)', items: [1, 2, 3, 4, 5, 6, 7], reverseItems: [], aggregation: 'sum' },
    { key: 'pri', label: 'Разрыв личной и реляционной идентичности (PRI)', items: [8, 9, 10, 11, 12, 13], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: все ответы 1 дают минимальные суммы шкал',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { pei: 7, pri: 6 },
  },
  {
    title: 'Ручная проверка: ответы 1–7 по кругу дают PEI 28 и PRI 28',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), (index % 7) + 1])),
    expected: { pei: 28, pri: 28 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['trait-presentation'],
  scoringConfig,
  validationCases,
  formulaVersion: 'bultseva-vasilyeva-trifonova-2025-identity-gap-13item-sum-v1',
};
