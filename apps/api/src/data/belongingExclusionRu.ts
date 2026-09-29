import type { SeedSection } from '../types.js';
import type { ConfigurableScoring, ValidationCase } from '../scoring/configurable.js';

const options = [
  { value: '1', label: '1 — Совершенно не согласен(на)' },
  { value: '2', label: '2 — Не согласен(на)' },
  { value: '3', label: '3 — Скорее не согласен(на)' },
  { value: '4', label: '4 — Затрудняюсь ответить' },
  { value: '5', label: '5 — Скорее согласен(на)' },
  { value: '6', label: '6 — Согласен(на)' },
  { value: '7', label: '7 — Совершенно согласен(на)' },
];

const items = [
  'Я чувствую беспокойство, когда остаюсь в одиночестве.',
  'Мне нравится знакомиться с новыми людьми.',
  'Когда-нибудь я обязательно найду себя.',
  'Меня тяготит одиночество.',
  'Во мне много противоречий.',
  'Могу сказать, что я нашел(ла) «своего» человека.',
  'Не люблю выходные и праздники. На них я всегда остаюсь один(одна).',
  'Я чувствую себя «белой вороной».',
  'Если мне нужна будет помощь, мне всегда есть к кому обратиться.',
  'Я чувствую внутреннюю пустоту.',
  'Я принадлежу к такому типу людей, которые пренебрегают мнением других.',
  'Мне интересно жить.',
  'Стремясь быть частью группы, я всегда как будто нахожусь на ее периферии.',
];

export const belongingExclusionRuInstrument: SeedSection = {
  code: 'test_44',
  title: 'Шкала «Принадлежность—эксклюзия» (Суворова, Раханова, Корзун)',
  description: '13-пунктовая российская методика с тремя шкалами: принадлежность себе, диадическим отношениям и группе. Авторы называют её промежуточной моделью, требующей доработки; результаты следует трактовать как исследовательский профиль, а не диагноз.',
  questions: items.map((text, index) => ({ code: `test_44_${index + 1}`, text, type: 'single', required: true, options })),
};

export const belongingExclusionRuScoring: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'selfBelonging', label: 'Принадлежность себе', items: [1, 3, 5, 8, 10, 12], reverseItems: [1, 3, 5, 8, 10], aggregation: 'sum' },
    { key: 'groupBelonging', label: 'Принадлежность группе', items: [2, 9, 13], reverseItems: [13], aggregation: 'sum' },
    { key: 'dyadicBelonging', label: 'Принадлежность диаде', items: [4, 6, 7, 11], reverseItems: [4, 7, 11], aggregation: 'sum' },
  ],
};

const allAnswers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const mixedAnswers = { '1': 1, '2': 1, '3': 1, '4': 1, '5': 1, '6': 1, '7': 1, '8': 1, '9': 7, '10': 7, '11': 1, '12': 7, '13': 7 };

export const belongingExclusionRuValidationCases: ValidationCase[] = [
  { title: 'Все ответы — минимальное согласие', answers: allAnswers(1), expected: { selfBelonging: 36, groupBelonging: 9, dyadicBelonging: 22 } },
  { title: 'Все ответы — максимальное согласие', answers: allAnswers(7), expected: { selfBelonging: 12, groupBelonging: 15, dyadicBelonging: 10 } },
  { title: 'Контрольный смешанный протокол по опубликованному ключу', answers: mixedAnswers, expected: { selfBelonging: 36, groupBelonging: 9, dyadicBelonging: 22 } },
];
