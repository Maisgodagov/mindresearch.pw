import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'Совсем нет' },
  { value: '1', label: 'Немного' },
  { value: '2', label: 'Умеренно' },
  { value: '3', label: 'Довольно сильно' },
  { value: '4', label: 'Очень сильно' },
];

const items = [
  'Тяжелые сны, воспроизводящие часть этого опыта или явно связанные с этим опытом?',
  'Яркие образы или воспоминания, которые иногда приходят в голову, и Вы чувствуете, что случившееся происходит снова здесь и сейчас?',
  'Избегание внутренних напоминаний о пережитом (например, мыслей, чувств или физических ощущений)?',
  'Избегание внешних напоминаний о событии (например, людей, мест, разговоров, предметов, действий или ситуаций)?',
  'Повышенная готовность к опасности, обостренная бдительность или настороженность?',
  'Чувство нервозности или повышенной пугливости?',
  'За прошедший месяц описанные выше проблемы влияли на Ваши отношения или социальную жизнь?',
  'За прошедший месяц описанные выше проблемы влияли на Вашу работу или работоспособность?',
  'За прошедший месяц описанные выше проблемы влияли на другие важные сферы Вашей жизни, такие как воспитание детей, учеба и другие важные занятия?',
  'Когда я расстроен, мне требуется много времени, чтобы успокоиться',
  'Я чувствую эмоциональное оцепенение или эмоциональную опустошенность',
  'Я чувствую себя неудачником',
  'Я чувствую себя никчемным',
  'Я чувствую себя отстраненным или отчужденным от людей',
  'Мне тяжело поддерживать эмоциональную близость с людьми',
  'За прошедший месяц указанные выше проблемы с эмоциями, представлениями о себе и взаимоотношениями приводили к обеспокоенности или негативным переживаниям по поводу Ваших отношений или социальной жизни?',
  'За прошедший месяц указанные выше проблемы с эмоциями, представлениями о себе и взаимоотношениями влияли на Вашу работу или работоспособность?',
  'За прошедший месяц указанные выше проблемы с эмоциями, представлениями о себе и взаимоотношениями влияли на другие важные сферы Вашей жизни, такие как воспитание детей, учеба и другие важные занятия?',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_540_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_540',
  title: 'Международный опросник травмы (ITQ-RU)',
  description: 'Русскоязычная версия ITQ оценивает выраженность симптомов ПТСР по МКБ-11 (повторное переживание, избегание и чувство угрозы), нарушений Я-организации (эмоциональная дисрегуляция, негативный образ Я и нарушения в отношениях), а также связанное с ними нарушение функционирования. Предназначена для взрослых; русская адаптация валидизировалась на неклинической выборке взрослых, переживших как минимум одно травматическое событие.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 4,
  scales: [
    { key: 're_experiencing', label: 'Повторное переживание', items: [1, 2], reverseItems: [], aggregation: 'mean' },
    { key: 'avoidance', label: 'Избегание', items: [3, 4], reverseItems: [], aggregation: 'mean' },
    { key: 'threat', label: 'Чувство угрозы', items: [5, 6], reverseItems: [], aggregation: 'mean' },
    { key: 'ptsd', label: 'ПТСР', items: [1, 2, 3, 4, 5, 6], reverseItems: [], aggregation: 'mean' },
    { key: 'ptsd_function_social', label: 'Функционирование ПТСР: отношения и социальная жизнь', items: [7], reverseItems: [], aggregation: 'mean' },
    { key: 'ptsd_function_work', label: 'Функционирование ПТСР: работа', items: [8], reverseItems: [], aggregation: 'mean' },
    { key: 'ptsd_function_other', label: 'Функционирование ПТСР: другие сферы', items: [9], reverseItems: [], aggregation: 'mean' },
    { key: 'affect_dysregulation', label: 'Эмоциональная дисрегуляция', items: [10, 11], reverseItems: [], aggregation: 'mean' },
    { key: 'negative_self_concept', label: 'Негативный образ Я', items: [12, 13], reverseItems: [], aggregation: 'mean' },
    { key: 'relationship_disturbances', label: 'Нарушения в отношениях', items: [14, 15], reverseItems: [], aggregation: 'mean' },
    { key: 'dso', label: 'Нарушения Я-организации', items: [10, 11, 12, 13, 14, 15], reverseItems: [], aggregation: 'mean' },
    { key: 'dso_function_social', label: 'Функционирование нарушений Я-организации: отношения и социальная жизнь', items: [16], reverseItems: [], aggregation: 'mean' },
    { key: 'dso_function_work', label: 'Функционирование нарушений Я-организации: работа', items: [17], reverseItems: [], aggregation: 'mean' },
    { key: 'dso_function_other', label: 'Функционирование нарушений Я-организации: другие сферы', items: [18], reverseItems: [], aggregation: 'mean' },
    { key: 'cptsd', label: 'КПТСР', items: [1, 2, 3, 4, 5, 6, 10, 11, 12, 13, 14, 15], reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы нулевые: все средние шкалы равны нулю',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 0])),
    expected: {
      re_experiencing: 0, avoidance: 0, threat: 0, ptsd: 0,
      ptsd_function_social: 0, ptsd_function_work: 0, ptsd_function_other: 0,
      affect_dysregulation: 0, negative_self_concept: 0, relationship_disturbances: 0,
      dso: 0, dso_function_social: 0, dso_function_work: 0, dso_function_other: 0, cptsd: 0,
    },
  },
  {
    title: 'Ручная проверка: средние PTSD=3, DSO=2 и CPTSD=2.5 по формулам приложения',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), index < 6 ? 3 : index < 15 ? 2 : 4])),
    expected: {
      re_experiencing: 3, avoidance: 3, threat: 3, ptsd: 3,
      ptsd_function_social: 2, ptsd_function_work: 2, ptsd_function_other: 2,
      affect_dysregulation: 2, negative_self_concept: 2, relationship_disturbances: 2,
      dso: 2, dso_function_social: 4, dso_function_work: 4, dso_function_other: 4, cptsd: 2.5,
    },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'itq-ru-padun-2022-v1',
};
