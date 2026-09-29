import type { SeedSection } from '../types.js';
import type { ConfigurableScoring, ValidationCase } from '../scoring/configurable.js';

const options = [
  { value: '1', label: '1 — Никогда или почти никогда' },
  { value: '2', label: '2 — Обычно не проявляется' },
  { value: '3', label: '3 — Иногда, но редко' },
  { value: '4', label: '4 — Обычно проявляется' },
  { value: '5', label: '5 — Всегда или почти всегда' },
];

const items = [
  'Смелость',
  'Уступчивость',
  'Готовность помочь',
  'Сильная личность',
  'Застенчивость',
  'Добросовестность',
  'Напористость',
  'Склонность к проявлению чувств',
  'Надёжность',
  'Способность руководить',
  'Нежность',
  'Правдивость',
  'Готовность рисковать',
  'Женственность',
  'Способность понять другого',
  'Доминирование',
  'Сострадательность',
  'Искренность',
  'Мужественность',
  'Мягкость в высказываниях',
  'Тактичность',
  'Склонность к лидерству',
  'Стремление утешить',
  'Порядочность',
  'Сила',
  'Дружелюбие',
  'Вежливость',
];

export const lopukhovaGenderTypeRuInstrument: SeedSection = {
  code: 'test_55',
  title: 'Маскулинность, феминность и гендерный тип личности (О. Г. Лопухова, 2013)',
  description: 'Российский 27-пунктовый ревалидизированный вариант BSRI. Три отдельные шкалы: маскулинность, феминность и буферные качества. Рассчитываются суммы ответов; тип определяется сравнением шкальных сумм с нейтральной точкой 27.',
  questions: items.map((text, index) => ({ code: `test_55_${index + 1}`, text, type: 'single', required: true, options })),
};

const masculinity = [1, 4, 7, 10, 13, 16, 19, 22, 25];
const femininity = [2, 5, 8, 11, 14, 17, 20, 23, 26];
const buffer = [3, 6, 9, 12, 15, 18, 21, 24, 27];
const allItems = Array.from({ length: 27 }, (_, index) => index + 1);

export const lopukhovaGenderTypeRuScoring: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'masculinity', label: 'Маскулинность', items: masculinity, reverseItems: [], aggregation: 'sum' },
    { key: 'femininity', label: 'Феминность', items: femininity, reverseItems: [], aggregation: 'sum' },
    { key: 'buffer', label: 'Буферная шкала', items: buffer, reverseItems: [], aggregation: 'sum' },
  ],
};

const answers = (value: number) => Object.fromEntries(allItems.map(item => [String(item), value]));
export const lopukhovaGenderTypeRuValidationCases: ValidationCase[] = [
  { title: 'Минимальные ответы', answers: answers(1), expected: { masculinity: 9, femininity: 9, buffer: 9 } },
  { title: 'Максимальные ответы', answers: answers(5), expected: { masculinity: 45, femininity: 45, buffer: 45 } },
  { title: 'Нейтральная середина', answers: answers(3), expected: { masculinity: 27, femininity: 27, buffer: 27 } },
];
