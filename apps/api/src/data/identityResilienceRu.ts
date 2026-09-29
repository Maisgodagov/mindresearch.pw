import type { SeedSection } from '../types.js';
import type { ConfigurableScoring, ValidationCase } from '../scoring/configurable.js';

const options = [
  { value: '1', label: '1 — Совсем не согласен' },
  { value: '2', label: '2 — Не согласен' },
  { value: '3', label: '3 — Частично согласен и частично не согласен' },
  { value: '4', label: '4 — Согласен' },
  { value: '5', label: '5 — Полностью согласен' },
];

const items = [
  'В целом я доволен собой.',
  'Я чувствую, что мне нечем гордиться.',
  'Иногда я чувствую себя бесполезным.',
  'По большому счету я склонен считать себя неудачником.',
  'Мне всегда удается решить сложные проблемы, если я достаточно стараюсь.',
  'Если кто-то сопротивляется мне, я найду средства и способы получить то, что хочу.',
  'Я уверен, что смогу эффективно справиться с неожиданными событиями.',
  'Благодаря своей находчивости я знаю, как справляться с непредвиденными ситуациями.',
  'Мое прошлое и настоящее неразрывно связаны друг с другом.',
  'Мое настоящее — просто продолжение прошлого.',
  'Между моим прошлым и настоящим существует непрерывность.',
  'Мое прошлое прекрасно сливается с моим настоящим.',
  'Я чувствую себя уникальным.',
  'Я не думаю, что имею много особенных характеристик, которые отличают меня от других.',
  'Я думаю, что мои характеристики отличаются от характеристик других.',
  'Я чувствую, что некоторые мои характеристики полностью уникальны для меня.',
];

export const identityResilienceRuInstrument: SeedSection = {
  code: 'test_52',
  title: 'Индекс устойчивости идентичности (IRI; русская адаптация Я. А. Соловьёвой и М. А. Одинцовой)',
  description: '16 утверждений для оценки четырёх компонентов устойчивости идентичности: самооценки, самоэффективности, целостности и уникальности. Русская адаптация проверялась на русскоязычной выборке N=175. Результаты показываются по четырём отдельным шкалам; универсальные пороги и общий балл не добавляются.',
  questions: items.map((text, index) => ({ code: `test_52_${index + 1}`, text, type: 'single', required: true, options })),
};

export const identityResilienceRuScoring: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'selfEsteem', label: 'Самооценка', items: [1, 2, 3, 4], reverseItems: [2, 3, 4], aggregation: 'sum' },
    { key: 'selfEfficacy', label: 'Самоэффективность', items: [5, 6, 7, 8], reverseItems: [], aggregation: 'sum' },
    { key: 'continuity', label: 'Целостность', items: [9, 10, 11, 12], reverseItems: [], aggregation: 'sum' },
    { key: 'uniqueness', label: 'Уникальность', items: [13, 14, 15, 16], reverseItems: [14], aggregation: 'sum' },
  ],
};

const answers = (values: number[]) => Object.fromEntries(values.map((value, index) => [String(index + 1), value]));

export const identityResilienceRuValidationCases: ValidationCase[] = [
  { title: 'Минимум прямых ответов; обратные пункты перекодируются', answers: answers(Array(16).fill(1)), expected: { selfEsteem: 16, selfEfficacy: 4, continuity: 4, uniqueness: 8 } },
  { title: 'Максимум прямых ответов; обратные пункты перекодируются', answers: answers(Array(16).fill(5)), expected: { selfEsteem: 8, selfEfficacy: 20, continuity: 20, uniqueness: 16 } },
  { title: 'Смешанный протокол: отдельная ручная проверка каждой шкалы', answers: answers([1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1]), expected: { selfEsteem: 10, selfEfficacy: 11, continuity: 12, uniqueness: 11 } },
];
