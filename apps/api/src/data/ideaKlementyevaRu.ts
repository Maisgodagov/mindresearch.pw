import type { SeedSection } from '../types.js';
import type { ConfigurableScoring, ValidationCase } from '../scoring/configurable.js';

const options = [
  { value: '1', label: '1 — Категорически не согласен(на)' },
  { value: '2', label: '2 — Скорее не согласен(на)' },
  { value: '3', label: '3 — Скорее согласен(на)' },
  { value: '4', label: '4 — Полностью согласен(на)' },
];

const items = [
  'Время многих возможностей?',
  'Время исследований?',
  'Время сомнений?',
  'Время экспериментов?',
  'Время личной свободы?',
  'Время ограничений и запретов?',
  'Время ответственности за себя?',
  'Время переживания стресса?',
  'Время нестабильности?',
  'Время оптимизма?',
  'Время социального давления на меня?',
  'Время самопонимания и самопознания?',
  'Время заботы о других?',
  'Время ответственности за других?',
  'Время личной независимости?',
  'Время свободных выборов?',
  'Время непредсказуемых поступков?',
  'Время исполнения обязательств перед другими людьми?',
  'Время самостоятельности?',
  'Время беспокойства?',
  'Время открывать новый опыт?',
  'Время сосредоточенности на себе?',
  'Время отделиться от родителей и найти свое место в жизни?',
  'Время самоопределения?',
  'Время планирования будущего?',
  'Время поиска смысла жизни?',
  'Время утверждения своих ценностей и убеждений?',
  'Время научиться думать самостоятельно?',
  'Время, когда в чем-то чувствуешь себя взрослым, а в чем-то — еще нет?',
  'Время постепенного взросления?',
  'Время неуверенности в достижении полной взрослости?',
];

export const ideaKlementyevaRuInstrument: SeedSection = {
  code: 'test_47',
  title: 'Шкала оценки формирующейся взрослости, IDEA-R — версия Клементьевой',
  description: 'Российская 31-пунктовая IDEA-R М. В. Клементьевой (2023), проверенная на студенческой выборке 18–25 лет. Отвечая, рассматривайте настоящее, несколько прошедших лет и ближайшие несколько лет как единый период примерно в пять лет.',
  questions: items.map((text, index) => ({ code: `test_47_${index + 1}`, text: `Этот период Вашей жизни — ${text}`, type: 'single', required: true, options })),
};

export const ideaKlementyevaRuScoring: ConfigurableScoring = {
  min: 1,
  max: 4,
  scales: [
    { key: 'identityExplorationSelfFocus', label: 'Исследование идентичности / сосредоточенность на себе', items: [7, 12, 19, 22, 23, 24, 25, 26, 27, 28], reverseItems: [], aggregation: 'sum' },
    { key: 'instabilityNegativity', label: 'Негативность / нестабильность', items: [3, 6, 8, 9, 11, 17, 20, 31], reverseItems: [], aggregation: 'sum' },
    { key: 'personalFreedom', label: 'Личная свобода', items: [5, 10, 15, 16], reverseItems: [], aggregation: 'sum' },
    { key: 'experimentsPossibilities', label: 'Эксперименты / возможности', items: [1, 2, 4, 21], reverseItems: [], aggregation: 'sum' },
    { key: 'feelingInBetween', label: 'Чувство «между»', items: [29, 30], reverseItems: [], aggregation: 'sum' },
    { key: 'otherFocused', label: 'Ориентация на других', items: [13, 14, 18], reverseItems: [], aggregation: 'sum' },
  ],
};

const allAnswers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const mixedAnswers = Object.fromEntries(items.map((_, index) => [String(index + 1), (index % 4) + 1]));

export const ideaKlementyevaRuValidationCases: ValidationCase[] = [
  { title: 'Минимальные ответы', answers: allAnswers(1), expected: { identityExplorationSelfFocus: 10, instabilityNegativity: 8, personalFreedom: 4, experimentsPossibilities: 4, feelingInBetween: 2, otherFocused: 3 } },
  { title: 'Максимальные ответы', answers: allAnswers(4), expected: { identityExplorationSelfFocus: 40, instabilityNegativity: 32, personalFreedom: 16, experimentsPossibilities: 16, feelingInBetween: 8, otherFocused: 12 } },
  { title: 'Смешанный протокол по ключу приложения', answers: mixedAnswers, expected: { identityExplorationSelfFocus: 29, instabilityNegativity: 21, personalFreedom: 10, experimentsPossibilities: 8, feelingInBetween: 3, otherFocused: 5 } },
];
