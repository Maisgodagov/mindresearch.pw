import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Совсем не важно' },
  { value: '2', label: 'Не важно' },
  { value: '3', label: 'Практически не важно' },
  { value: '4', label: 'Нейтрально' },
  { value: '5', label: 'Немного важно' },
  { value: '6', label: 'Важно' },
  { value: '7', label: 'Очень важно' },
];

const items = [
  'Поддерживающий(ая)',
  'Имеет привлекательное лицо',
  'Имеет хорошую работу',
  'Заботливый(ая)',
  'Жизнерадостный(ая)',
  'Имеет высокий доход',
  'Эрудированный(ая)',
  'Верный(ая)',
  'Имеет привлекательную внешность',
  'Добрый(ая)',
  'Тактичный(ая)',
  'Имеет красивый дом или квартиру',
  'Сообразительный(ая)',
  'Социально активный(ая)',
  'Честный(ая)',
  'Любознательный(ая)',
  'Образованный(ая)',
  'Общительный(ая)',
  'Коммуникабельный(ая)',
  'Внимательный(ая)',
  'Любящий(ая)',
  'Сексуальный(ая)',
  'Умный(ая)',
  'Понимающий(ая)',
  'Хорошее чувство юмора',
  'Обладающий широким кругозором',
  'Улыбчивый(ая)',
  'Занимает высокую должность в компании',
  'Надежный(ая)',
  'Имеет высокий социальный статус',
  'Успешный(ая)',
  'Мудрый(ая)',
  'Имеет спортивную фигуру',
  'Имеет красивое тело',
  'Финансово благополучен(а)',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2279_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2279',
  title: 'Шкала оценки идеального партнера (IPRS), русская версия',
  description: 'Методика измеряет, насколько важны человеку различные качества гипотетического романтического партнера. Пять аспектов предпочтений: успешность и ресурсы, интеллект, забота и надежность, физическая привлекательность, коммуникативные способности. Русская адаптация изучалась на выборке взрослых и молодежи 16–63 лет; инструмент полезен авторам опросов для описания предпочтений при выборе партнера, а не для диагностики.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'status_resources', label: 'Успешность / ресурсы', items: [3, 6, 12, 28, 30, 31, 35], reverseItems: [], aggregation: 'mean' },
    { key: 'intelligence', label: 'Ум', items: [7, 13, 16, 17, 23, 26, 32], reverseItems: [], aggregation: 'mean' },
    { key: 'warmth_trustworthiness', label: 'Забота / надежность', items: [1, 4, 8, 10, 11, 15, 20, 21, 24, 29], reverseItems: [], aggregation: 'mean' },
    { key: 'physical_attractiveness', label: 'Красота / физическая привлекательность', items: [2, 9, 22, 33, 34], reverseItems: [], aggregation: 'mean' },
    { key: 'social_skills', label: 'Коммуникативные способности', items: [5, 14, 18, 19, 25, 27], reverseItems: [], aggregation: 'mean' },
  ],
};

const allAnswers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Все характеристики оценены как совсем не важные', answers: allAnswers(1), expected: { status_resources: 1, intelligence: 1, warmth_trustworthiness: 1, physical_attractiveness: 1, social_skills: 1 } },
  { title: 'Все характеристики оценены как очень важные', answers: allAnswers(7), expected: { status_resources: 7, intelligence: 7, warmth_trustworthiness: 7, physical_attractiveness: 7, social_skills: 7 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['close-love'],
  scoringConfig,
  validationCases,
  formulaVersion: 'iprs-russian-adaptation-provorova-semenova-manokin-2025-v1',
};
