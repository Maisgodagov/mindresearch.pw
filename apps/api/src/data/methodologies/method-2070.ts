import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'Никогда' },
  { value: '1', label: 'Почти никогда' },
  { value: '2', label: 'Иногда' },
  { value: '3', label: 'Часто' },
  { value: '4', label: 'Очень часто' },
];

const items = [
  'В течение прошедшего месяца как часто Вы расстраивались из-за того, что происходило неожиданно?',
  'В течение прошедшего месяца как часто Вы чувствовали, что не способны контролировать важные моменты своей жизни?',
  'В течение прошедшего месяца как часто Вы нервничали и испытывали стресс?',
  'В течение прошедшего месяца как часто Вы успешно справлялись с нервировавшими Вас жизненными трудностями?',
  'В течение прошедшего месяца как часто Вы эффективно справлялись с важными изменениями, происходящими в Вашей жизни?',
  'В течение прошедшего месяца как часто Вы чувствовали уверенность в своей способности справляться с личными проблемами?',
  'В течение прошедшего месяца как часто Вы чувствовали, что всё идёт так, как это нужно Вам?',
  'В течение прошедшего месяца как часто Вы обнаруживали, что не можете справиться со всем, что Вам приходилось делать?',
  'В течение прошедшего месяца как часто Вы могли контролировать свою раздражительность?',
  'В течение прошедшего месяца как часто Вы чувствовали, что находитесь на вершине успеха?',
  'В течение прошедшего месяца как часто Вы злились из-за того, что происходило без контроля с Вашей стороны?',
  'В течение прошедшего месяца как часто Вы ловили себя на мыслях о том, что Вам предстоит выполнить?',
  'В течение прошедшего месяца как часто Вы могли контролировать то, на что тратите своё время?',
  'В течение прошедшего месяца как часто Вы чувствовали, что Вам не преодолеть всех скопившихся трудностей?',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2084_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2084',
  title: 'Шкала воспринимаемого стресса (PSS-14)',
  description: 'PSS-14 оценивает, насколько стрессовыми человек воспринимал события своей жизни за последний месяц, включая переживание непредсказуемости и утраты контроля, а также ощущение способности справляться с трудностями и изменениями. Полная 14-пунктовая версия предназначена для широких групп взрослых респондентов и помогает автору опроса получить общий показатель воспринимаемого стресса.',
  questions,
};

const distressItems = [1, 2, 3, 8, 11, 12, 14];
const copingItems = [4, 5, 6, 7, 9, 10, 13];

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 4,
  scales: [
    { key: 'distress', label: 'Дистресс', items: distressItems, reverseItems: [], aggregation: 'sum' },
    { key: 'coping', label: 'Совладание', items: copingItems, reverseItems: copingItems, aggregation: 'sum' },
    { key: 'perceivedStress', label: 'Воспринимаемый стресс', items: [...distressItems, ...copingItems], reverseItems: copingItems, aggregation: 'sum' },
  ],
};

const all = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: ответы «никогда» дают нулевой дистресс и максимальное совладание после реверса',
    answers: all(0),
    expected: { distress: 0, coping: 28, perceivedStress: 28 },
  },
  {
    title: 'Ручная проверка: ответы «очень часто» дают максимальный дистресс и нулевое совладание после реверса',
    answers: all(4),
    expected: { distress: 28, coping: 0, perceivedStress: 28 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'pss-14-zolotareva-2023-ru-0-4-v1',
};
