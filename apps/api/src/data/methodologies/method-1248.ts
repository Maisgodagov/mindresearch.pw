import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

// Авторская версия для 5 класса (23 пункта); физическое благополучие и демография не входят.
const agreement = [
  { value: '1', label: 'НЕТ' },
  { value: '2', label: 'скорее НЕТ' },
  { value: '3', label: 'скорее ДА' },
  { value: '4', label: 'ДА' },
];
const frequency = [
  { value: '1', label: 'Никогда' },
  { value: '2', label: 'Редко' },
  { value: '3', label: 'Часто' },
  { value: '4', label: 'Всегда' },
];
const items = [
  'У меня хорошо идут дела в школе',
  'Меня устраивают правила, принятые в моей школе',
  'В моей школе есть все необходимое для того, чтобы учиться',
  'У меня хорошие отношения с учителями',
  'Мне нравится то, что мы изучаем в школе',
  'Я доволен своими учителями*',
  'У меня хорошие отношения с одноклассниками',
  'Я доволен количеством домашних заданий',
  'Находясь в школе, я испытываю приятные чувства*',
  'Находясь в школе, я испытываю неприятные чувства',
  'Мне не хочется идти в школу',
  'Одноклассники выбирали меня для выполнения задания в паре',
  'У меня были ссоры с моими одноклассниками',
  'Одноклассники помогали мне в случае учебных или других сложностей',
  'Одноклассники меня обзывали',
  'Я обсуждал школьные дела с одноклассниками',
  'Одноклассники плохо говорили о моей внешности',
  'Я выполнял какое-либо общее задание вместе с одноклассниками (например, проект)*',
  'Некоторые одноклассники специально не обращали на меня внимание*',
  'Я защищал своих одноклассников перед другими (например, учителями, другими школьниками)',
  'Я обзывал своих одноклассников',
  'Я участвовал в праздниках, организованных в классе',
  'У меня были ссоры с моими одноклассниками',
];
const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1277_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: index < 8 ? agreement : frequency,
}));

export const instrument: SeedSection = {
  code: 'test_1277',
  title: 'Опросник субъективного благополучия в школе (версия для 5 класса)',
  description: 'Опросник измеряет субъективное благополучие школьника в школьной среде по удовлетворенности школой, аффекту по отношению к школе, сотрудничеству и враждебности в отношениях с одноклассниками. Эта редакция предназначена для учащихся 5 класса и помогает автору опроса описывать групповые результаты по отдельным аспектам школьной жизни; индивидуальные выводы по опубликованным нормам не предусмотрены.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 4,
  scales: [
    { key: 'school_satisfaction', label: 'Удовлетворенность школой', items: [1, 2, 3, 4, 5, 6, 7, 8], reverseItems: [], aggregation: 'mean' },
    { key: 'school_affect', label: 'Аффект по отношению к школе', items: [9, 10, 11], reverseItems: [10, 11], aggregation: 'mean' },
    { key: 'classmate_cooperation', label: 'Сотрудничество с одноклассниками', items: [12, 14, 16, 18, 20, 22], reverseItems: [], aggregation: 'mean' },
    { key: 'classmate_hostility', label: 'Враждебность в отношениях с одноклассниками', items: [13, 15, 17, 19, 21], reverseItems: [], aggregation: 'mean' },
  ],
};

// Averaged responses in source item order; manually checked against the 5th-grade key (p. 271).
const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы «Никогда/НЕТ» (минимальные и реверсивные пункты)',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { school_satisfaction: 1, school_affect: 3, classmate_cooperation: 1, classmate_hostility: 1 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'kanonire-uglanova-kulikova-school-wellbeing-grade5-2022-v1',
};
