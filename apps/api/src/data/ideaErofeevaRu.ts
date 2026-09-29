import type { SeedSection } from '../types.js';
import type { ConfigurableScoring, ValidationCase } from '../scoring/configurable.js';

const options = [
  { value: '1', label: '1 — Совершенно не согласен(на)' },
  { value: '2', label: '2 — Скорее не согласен(на)' },
  { value: '3', label: '3 — Скорее согласен(на)' },
  { value: '4', label: '4 — Полностью согласен(на)' },
];

const items = [
  'Время многих возможностей?',
  'Время исследований и поиска?',
  'Время замешательства?',
  'Время экспериментирования?',
  'Время личной свободы?',
  'Время, когда Вы испытываете стресс?',
  'Время нестабильности?',
  'Время большого давления извне?',
  'Время узнавать, кто Вы такой(ая)?',
  'Время независимости?',
  'Время свободного выбора?',
  'Время попробовать что-то новое?',
  'Время сосредоточиться на себе?',
  'Время планирования будущего?',
  'Время поиска смысла?',
  'Время определиться со своими убеждениями и ценностями?',
  'Время научиться думать самостоятельно?',
  'Время почувствовать себя в некотором отношении взрослым, хотя и не всегда?',
  'Время постепенного взросления?',
];

export const ideaErofeevaRuInstrument: SeedSection = {
  code: 'test_46',
  title: 'Черты становящейся взрослости, IDEA — русская 19-пунктовая версия',
  description: 'Российская адаптация В. Г. Ерофеевой (2023), 19 пунктов и пять шкал. Оценивайте, насколько каждое утверждение описывает настоящий период жизни, включая несколько прошедших и ближайших лет.',
  questions: items.map((text, index) => ({ code: `test_46_${index + 1}`, text: `Этот период Вашей жизни — ${text}`, type: 'single', required: true, options })),
};

export const ideaErofeevaRuScoring: ConfigurableScoring = {
  min: 1,
  max: 4,
  scales: [
    { key: 'identityExploration', label: 'Поиск идентичности', items: [9, 13, 14, 15, 16], reverseItems: [], aggregation: 'sum' },
    { key: 'experimentation', label: 'Эксперименты', items: [1, 2, 4, 12], reverseItems: [], aggregation: 'sum' },
    { key: 'selfFocus', label: 'Направленность на себя', items: [5, 10, 11], reverseItems: [], aggregation: 'sum' },
    { key: 'feelingInBetween', label: 'Ощущение «между» подростковым возрастом и взрослостью', items: [17, 18, 19], reverseItems: [], aggregation: 'sum' },
    { key: 'instability', label: 'Нестабильность', items: [3, 6, 7, 8], reverseItems: [], aggregation: 'sum' },
  ],
};

const allAnswers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const mixedAnswers = Object.fromEntries(items.map((_, index) => [String(index + 1), (index % 4) + 1]));

export const ideaErofeevaRuValidationCases: ValidationCase[] = [
  { title: 'Минимальные ответы', answers: allAnswers(1), expected: { identityExploration: 5, experimentation: 4, selfFocus: 3, feelingInBetween: 3, instability: 4 } },
  { title: 'Максимальные ответы', answers: allAnswers(4), expected: { identityExploration: 20, experimentation: 16, selfFocus: 12, feelingInBetween: 12, instability: 16 } },
  { title: 'Смешанный протокол по таблице опубликованного ключа', answers: mixedAnswers, expected: { identityExploration: 11, experimentation: 11, selfFocus: 6, feelingInBetween: 6, instability: 12 } },
];
