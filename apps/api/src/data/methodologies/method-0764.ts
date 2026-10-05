import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const agreement = [
  { value: '1', label: 'Совершенно не согласен' },
  { value: '2', label: 'В основном не согласен' },
  { value: '3', label: 'Ни то, ни другое' },
  { value: '4', label: 'В основном согласен' },
  { value: '5', label: 'Полностью согласен' },
];
const satisfaction = [
  { value: '1', label: 'Крайне недоволен' },
  { value: '2', label: 'В большей степени недоволен' },
  { value: '3', label: 'Ни то, ни другое' },
  { value: '4', label: 'В основном доволен' },
  { value: '5', label: 'Очень доволен' },
];
const weight = [
  { value: '1', label: 'Большой недобор в весе' },
  { value: '2', label: 'Недостаточный вес' },
  { value: '3', label: 'Нормальный вес' },
  { value: '4', label: 'Есть лишний вес' },
  { value: '5', label: 'Много лишнего веса' },
];
const items = [
  'Перед тем, как появиться в обществе, я всегда смотрю, как я выгляжу.',
  'Я стараюсь покупать одежду, в которой я буду выглядеть наилучшим образом.',
  'Мое тело сексуально привлекательно.',
  'Я постоянно беспокоюсь, что у меня избыточный вес, или, что я могу его набрать.',
  'Мне нравится, как я выгляжу.',
  'При любой возможности я смотрюсь в зеркало, чтобы проверить, как я выгляжу.',
  'Перед тем, как выйти на улицу, обычно я трачу много времени на сборы.',
  'Я очень остро чувствую даже незначительные изменения в своем весе.',
  'Большинство людей считает, что я привлекателен.',
  'Для меня важно всегда хорошо выглядеть.',
  'Я пользуюсь немногими средствами по уходу за собой.',
  'Мне нравится, как я выгляжу без одежды.',
  'Я чувствую себя незащищенным, если не могу ухаживать за своей внешностью, как нужно.',
  'Обычно я надеваю то, что лежит под рукой, и мне неважно, как это выглядит.',
  'Мне нравится, как на мне сидит одежда.',
  'Мне всё равно, что окружающие думают о моей внешности.',
  'Я стараюсь особенно ухаживать за волосами.',
  'Мне не нравится мой внешний облик.',
  'Я физически непривлекателен.',
  'Я никогда не задумываюсь о своей внешности.',
  'Я всегда стараюсь улучшить свой внешний вид.',
  'Я придерживаюсь диеты с целью похудания.',
  'Я пытался сбросить вес, ограничивая себя в пище или придерживаясь радикальных диет.',
  'Мне кажется, что у меня:',
  'Взглянув на меня, большинство бы подумало, что у меня:',
  'Лицо (черты лица, цвет лица и состояние кожи).',
  'Волосы (цвет, густота, структура).',
  'Нижняя часть туловища (ягодицы, бедра, ноги).',
  'Средняя часть туловища (талия, живот).',
  'Верхняя часть туловища (грудная клетка или грудь, плечи, руки).',
  'Мышечный тонус.',
  'Вес.',
  'Рост.',
  'Внешность в целом.',
];
const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_794_${index + 1}`,
  text: index === 25 ? 'Укажите степень вашей удовлетворенности следующими аспектами вашего тела: Лицо (черты лица, цвет лица и состояние кожи).' : text,
  type: 'single', required: true,
  options: index === 22 ? [
    { value: '1', label: 'Никогда' }, { value: '2', label: 'Редко' }, { value: '3', label: 'Иногда' }, { value: '4', label: 'Часто' }, { value: '5', label: 'Очень часто' },
  ] : index === 23 || index === 24 ? weight : index >= 25 ? satisfaction : agreement,
}));

export const instrument: SeedSection = {
  code: 'test_794',
  title: 'Мультимодальный опросник отношения к собственному телу (MBSRQ), русская 34-пунктовая версия',
  description: 'Опросник оценивает отношение к собственному телу у взрослых и подростков от 15 лет: субъективную оценку привлекательности и ориентацию на внешность, удовлетворённость отдельными параметрами тела, озабоченность весом и самооценку веса. Профиль пяти субшкал помогает автору опроса различать оценочные, поведенческие и связанные с весом аспекты образа тела.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1, max: 5,
  scales: [
    { key: 'appearance_evaluation', label: 'Оценка внешности', items: [3, 5, 9, 12, 15, 18, 19], reverseItems: [18, 19], aggregation: 'mean' },
    { key: 'appearance_orientation', label: 'Ориентация на внешность', items: [1, 2, 6, 7, 10, 11, 13, 14, 16, 17, 20, 21], reverseItems: [11, 14, 16, 20], aggregation: 'mean' },
    { key: 'body_areas_satisfaction', label: 'Удовлетворённость параметрами тела', items: [26, 27, 28, 29, 30, 31, 32, 33, 34], reverseItems: [], aggregation: 'mean' },
    { key: 'overweight_preoccupation', label: 'Озабоченность лишним весом', items: [4, 8, 22, 23], reverseItems: [], aggregation: 'mean' },
    { key: 'self_classified_weight', label: 'Оценка собственного веса', items: [24, 25], reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  { title: 'Все минимальные ответы; обратное кодирование проверено', answers: Object.fromEntries(items.map((_, i) => [String(i + 1), 1])), expected: { appearance_evaluation: 19 / 7, appearance_orientation: 19 / 12, body_areas_satisfaction: 1, overweight_preoccupation: 1, self_classified_weight: 1 } },
  { title: 'Все максимальные ответы; обратное кодирование проверено', answers: Object.fromEntries(items.map((_, i) => [String(i + 1), 5])), expected: { appearance_evaluation: 23 / 7, appearance_orientation: 41 / 12, body_areas_satisfaction: 5, overweight_preoccupation: 5, self_classified_weight: 5 } },
];

export const methodology: MethodologyRegistration = {
  instrument, scoringConfig, validationCases,
  formulaVersion: 'mbsrq-cash-baranskaya-tataurova-2011-34-v1',
};
