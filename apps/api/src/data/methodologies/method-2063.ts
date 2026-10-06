import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Абсолютно не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Скорее не согласен' },
  { value: '4', label: 'Не знаю, не уверен' },
  { value: '5', label: 'Скорее согласен' },
  { value: '6', label: 'Согласен' },
  { value: '7', label: 'Абсолютно согласен' },
];

const statements = [
  'Несмотря на то, что тело может умереть, душа продолжает существовать.',
  'Некоторые люди способны левитировать (поднимать) объекты силой мысли.',
  'Черная магия реально существует.',
  'Черная кошка может принести невезение.',
  'Ваше сознание или душа могут покидать Ваше тело и путешествовать (астральная проекция).',
  'Снежный человек существует.',
  'Астрология — это способ точного предсказания будущего.',
  'Дьявол существует.',
  'Психокинез — передвижение объектов силой мысли, действительно существует.',
  'Ведьмы (колдуны) существуют.',
  'Если разбить зеркало, то это принесет несчастье.',
  'Когда человек спит или находится в состоянии транса, его душа может покинуть тело.',
  'Лох-несское чудовище существует.',
  'Гороскоп точно описывает будущее человека.',
  'Я верю в Бога.',
  'Мысли человека могут влиять на движение физических объектов.',
  'Используя заговоры и заклинания, можно заколдовать человека.',
  'Число «13» — несчастливое.',
  'Реинкарнация (переселение душ) действительно случается.',
  'На других планетах есть жизнь.',
  'Некоторые экстрасенсы могут точно предсказать будущее.',
  'Рай и ад существуют.',
  'Мысли читать невозможно.',
  'Существуют реальные примеры колдовства.',
  'Общаться с умершими возможно.',
  'Некоторые люди имеют необъяснимые способности предсказывать будущее.',
];

const questions: SeedSection['questions'] = statements.map((text, index) => ({
  code: `test_2077_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2077',
  title: 'Шкала веры в паранормальное (RPBS), русская адаптация',
  description: 'Шкала оценивает выраженность веры в паранормальные явления по семи аспектам: традиционная религиозная вера, пси-способности, колдовство, суеверия, спиритизм, экстраординарные формы жизни и предсказания. Русская адаптация Д. С. Григорьева предназначена для исследований убеждений взрослых и старших подростков; результаты описывают степень согласия с утверждениями, а не клинический диагноз.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'traditional_religious_belief', label: 'Традиционная религиозная вера', items: [1, 8, 15, 22], reverseItems: [], aggregation: 'mean' },
    { key: 'psi_abilities', label: 'Пси-способности', items: [2, 9, 16, 23], reverseItems: [23], aggregation: 'mean' },
    { key: 'witchcraft', label: 'Колдовство', items: [3, 10, 17, 24], reverseItems: [], aggregation: 'mean' },
    { key: 'superstition', label: 'Суеверия', items: [4, 11, 18], reverseItems: [], aggregation: 'mean' },
    { key: 'spiritualism', label: 'Спиритизм', items: [5, 12, 19, 25], reverseItems: [], aggregation: 'mean' },
    { key: 'extraordinary_life_forms', label: 'Экстраординарные формы жизни', items: [6, 13, 20], reverseItems: [], aggregation: 'mean' },
    { key: 'precognition', label: 'Предсказания', items: [7, 14, 21, 26], reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная сверка: ответы 1 по всем пунктам; обратный пункт 23 перекодируется в 7',
    answers: Object.fromEntries(statements.map((_, index) => [String(index + 1), 1])),
    expected: {
      traditional_religious_belief: 1,
      psi_abilities: 2.5,
      witchcraft: 1,
      superstition: 1,
      spiritualism: 1,
      extraordinary_life_forms: 1,
      precognition: 1,
    },
  },
  {
    title: 'Ручная сверка: нейтральные ответы 4 дают 4 по всем шкалам после обратного кодирования',
    answers: Object.fromEntries(statements.map((_, index) => [String(index + 1), 4])),
    expected: {
      traditional_religious_belief: 4,
      psi_abilities: 4,
      witchcraft: 4,
      superstition: 4,
      spiritualism: 4,
      extraordinary_life_forms: 4,
      precognition: 4,
    },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'rpbs-tobacyk-2004-grigoryev-ru-2015-seven-subscales-v1',
};
