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

const itemTexts = [
  'Все складывается лучше, когда симпатии и антипатии ясно определены.',
  'Лучше всего, когда даже неоднозначные вещи получают четкое определение.',
  'Мне не нравятся неоднозначные установки.',
  'Я хочу ясно понимать, что является «хорошим», а что — «плохим».',
  'Мне нравится, когда границы всего четко обозначены.',
  'В этом мире есть только «победители» и «проигравшие».',
  'Я считаю, что всех людей можно разделить на «победителей» и «проигравших».',
  'Людей можно четко разделить на «хороших» и «плохих».',
  'На все вопросы есть либо правильный, либо неправильный ответ.',
  'Я думаю о каждом человеке как о друге или враге.',
  'Я хочу четко различать безопасное и опасное.',
  'Информацию следует определять как истинную или ложную.',
  'Я хочу выяснять, приносит ли что-либо мне пользу или нет.',
  'Я предпочитаю разделять информацию на полезную и бесполезную для меня.',
  'Лучше всего, когда соревнования имеют ясный результат.',
];

const questions: SeedSection['questions'] = itemTexts.map((text, index) => ({
  code: `test_946_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: responseOptions,
}));

export const instrument: SeedSection = {
  code: 'test_946',
  title: 'Опросник дихотомического мышления (DTI), русская версия',
  description: 'DTI оценивает выраженность черно-белого, «все или ничего» стиля мышления. Три аспекта — предпочтение четких дихотомий, убеждение, что явления и люди делятся на две противоположные категории, и стремление разделять последствия и информацию на полезные/вредные или безопасные/опасные. Общая версия предназначена для взрослых респондентов; русская адаптация Дурневой применялась в исследовании девушек подросткового и юношеского возраста.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 6,
  scales: [
    { key: 'preferenceForDichotomy', label: 'Предпочтение дихотомичности', items: [1, 2, 3, 4, 5], reverseItems: [], aggregation: 'sum' },
    { key: 'dichotomousBelief', label: 'Дихотомические убеждения', items: [6, 7, 8, 9, 10], reverseItems: [], aggregation: 'sum' },
    { key: 'profitAndLossThinking', label: 'Мышление по принципу выгоды', items: [11, 12, 13, 14, 15], reverseItems: [], aggregation: 'sum' },
    { key: 'total', label: 'Общий показатель дихотомического мышления', items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы минимальны: каждая субшкала по 5, общий балл 15',
    answers: Object.fromEntries(Array.from({ length: 15 }, (_, i) => [String(i + 1), '1'])),
    expected: { preferenceForDichotomy: 5, dichotomousBelief: 5, profitAndLossThinking: 5, total: 15 },
  },
  {
    title: 'Ручная проверка: два максимальных ответа в первой шкале, остальные минимальны',
    answers: { '1': '6', '2': '6', '3': '1', '4': '1', '5': '1', '6': '1', '7': '1', '8': '1', '9': '1', '10': '1', '11': '1', '12': '1', '13': '1', '14': '1', '15': '1' },
    expected: { preferenceForDichotomy: 15, dichotomousBelief: 5, profitAndLossThinking: 5, total: 25 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'oshio-2009-durneva-ru-dti-v1',
};
