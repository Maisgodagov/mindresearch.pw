import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const responseOptions = [
  { value: '1', label: 'Полностью не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Скорее не согласен' },
  { value: '4', label: 'Скорее согласен' },
  { value: '5', label: 'Согласен' },
  { value: '6', label: 'Полностью согласен' },
];

const items = [
  'Мое развитие имеет четкую цель и направление',
  'Я часто ставлю перед собой новые цели и задачи',
  'Чтобы быть продуктивным, я всегда планирую свой день',
  'Самодисциплина и самоконтроль очень важны для меня',
  'Получение новых знаний, умений и навыков во всех сферах жизни для меня крайне интересно',
  'Я хочу обучаться чему-то новому на протяжении всей жизни',
  'Я стараюсь регулярно проходить повышение квалификации',
  'Я с удовольствием читаю специальную литературу, смотрю документальные фильмы',
  'Общение с некоторыми людьми вдохновляет меня на развитие',
  'На мой взгляд, саморазвитие — это личная ответственность каждого человека',
  'Я учусь на своих ошибках',
  'Для человека свойственно постоянное движение вперед, он может и должен менять и развивать свои убеждения и ценности на протяжении жизни',
  'Мне нравится знакомиться с новыми интересными людьми',
  'Я часто бросаю самому себе вызов, чтобы выйти из зоны комфорта',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_265_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: responseOptions,
}));

export const instrument: SeedSection = {
  code: 'test_265',
  title: 'Диагностика саморазвития личности',
  description: 'Методика оценивает направленность личности на саморазвитие в трех аспектах: планирование и саморегуляция, обучение, общение и внутренний локус контроля. Подходит для исследовательских опросов взрослых и старших подростков; первичная апробация проводилась на участниках от 16 лет, преимущественно в возрасте 16–30 лет.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 6,
  scales: [
    { key: 'planning_self_regulation', label: 'Саморазвитие через планирование и саморегуляцию', items: [1, 2, 3, 4], reverseItems: [], aggregation: 'sum' },
    { key: 'learning', label: 'Саморазвитие через обучение', items: [5, 6, 7, 8], reverseItems: [], aggregation: 'sum' },
    { key: 'communication_internal_locus', label: 'Саморазвитие через общение и внутренний локус контроля', items: [9, 10, 11, 12, 13, 14], reverseItems: [], aggregation: 'sum' },
    { key: 'total', label: 'Интегральный показатель саморазвития', items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14], reverseItems: [], aggregation: 'sum' },
  ],
};

const allAnswers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Минимальное согласие по всем пунктам', answers: allAnswers(1), expected: { planning_self_regulation: 4, learning: 4, communication_internal_locus: 6, total: 14 } },
  { title: 'Максимальное согласие по всем пунктам', answers: allAnswers(6), expected: { planning_self_regulation: 24, learning: 24, communication_internal_locus: 36, total: 84 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'rean-stavtsev-mozerov-dsrl-2025-v1',
};
