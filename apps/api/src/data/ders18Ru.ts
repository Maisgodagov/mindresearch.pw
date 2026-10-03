import type { SeedSection } from '../types.js';
import type { ConfigurableScoring, ValidationCase } from '../scoring/configurable.js';

const items = [
  'Я обращаю внимание на то, как я себя чувствую.',
  'У меня нет представления о том, как я себя чувствую.',
  'Мне трудно разобраться в своих чувствах.',
  'Я внимателен к своим чувствам.',
  'Я не могу понять, как я себя чувствую.',
  'Когда я расстроен, я признаю свои эмоции.',
  'Когда я расстроен, мне становится неловко за свои чувства.',
  'Когда я расстроен, мне сложно выполнять свою работу.',
  'Когда я расстроен, я над собой не властен.',
  'Когда я расстроен, я уверен, что буду долго оставаться в этом состоянии.',
  'Когда я расстроен, я уверен, что это закончится чувством глубокой подавленности.',
  'Когда я расстроен, мне сложно сфокусироваться на чем-либо еще.',
  'Когда я расстроен, я испытываю стыд за свои чувства.',
  'Когда я расстроен, я чувствую вину за свои чувства.',
  'Когда я расстроен, мне сложно сконцентрироваться.',
  'Когда я расстроен, мне сложно контролировать свое поведение.',
  'Когда я расстроен, я уверен, что единственный исход для меня — погрязнуть в этих чувствах.',
  'Когда я расстроен, я теряю контроль над своим поведением.',
];

const sample = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));

export const ders18RuInstrument: SeedSection = {
  code: 'test_63',
  title: 'Шкала трудностей регуляции эмоций, DERS-18 (перевод PsyTests, 2024)',
  description: 'Русский перевод 18-пунктовой версии Victor и Klonsky (2016). Шесть подшкал и общий балл вычисляются суммированием; пункты 1, 4 и 6 реверсируются. Нормативные пороги не добавлены.',
  questions: items.map((text, index) => ({
      code: `test_63_${index + 1}`,
      text,
      type: 'single' as const,
      required: true,
      options: [
        { value: '1', label: 'Почти никогда' },
        { value: '2', label: 'Иногда' },
        { value: '3', label: 'Примерно в половине случаев' },
        { value: '4', label: 'Довольно часто' },
        { value: '5', label: 'Почти всегда' },
      ],
    })),
};

export const ders18RuScoring: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'awareness', label: 'Осознанность', items: [1, 4, 6], reverseItems: [1, 4, 6], aggregation: 'sum' },
    { key: 'clarity', label: 'Ясность', items: [2, 3, 5], reverseItems: [], aggregation: 'sum' },
    { key: 'goals', label: 'Цели', items: [8, 12, 15], reverseItems: [], aggregation: 'sum' },
    { key: 'impulse', label: 'Импульс', items: [9, 16, 18], reverseItems: [], aggregation: 'sum' },
    { key: 'nonacceptance', label: 'Непринятие', items: [7, 13, 14], reverseItems: [], aggregation: 'sum' },
    { key: 'strategies', label: 'Стратегии', items: [10, 11, 17], reverseItems: [], aggregation: 'sum' },
    { key: 'total', label: 'Общий балл', items: Array.from({ length: 18 }, (_, i) => i + 1), reverseItems: [1, 4, 6], aggregation: 'sum' },
  ],
};

export const ders18RuValidationCases: ValidationCase[] = [
  { title: 'Все ответы 1; реверсированные ответы становятся 5', answers: sample(1), expected: { awareness: 15, clarity: 3, goals: 3, impulse: 3, nonacceptance: 3, strategies: 3, total: 30 } },
  { title: 'Все ответы 3; значения после реверса не меняются', answers: sample(3), expected: { awareness: 9, clarity: 9, goals: 9, impulse: 9, nonacceptance: 9, strategies: 9, total: 54 } },
  { title: 'Все ответы 5; реверсированные ответы становятся 1', answers: sample(5), expected: { awareness: 3, clarity: 15, goals: 15, impulse: 15, nonacceptance: 15, strategies: 15, total: 78 } },
];
