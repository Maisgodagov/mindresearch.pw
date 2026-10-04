import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const responseOptions = [
  { value: '0', label: 'Левое качество выражено очень сильно' },
  { value: '1', label: 'Левое качество выражено заметно' },
  { value: '2', label: 'Левое качество выражено слабо' },
  { value: '3', label: 'Оба качества выражены одинаково или трудно сказать' },
  { value: '4', label: 'Правое качество выражено слабо' },
  { value: '5', label: 'Правое качество выражено заметно' },
  { value: '6', label: 'Правое качество выражено очень сильно' },
];

const pairs: [string, string][] = [
  ['Обаятельный', 'Непривлекательный'],
  ['Слабый', 'Сильный'],
  ['Разговорчивый', 'Молчаливый'],
  ['Безответственный', 'Добросовестный'],
  ['Упрямый', 'Уступчивый'],
  ['Замкнутый', 'Открытый'],
  ['Добрый', 'Эгоистичный'],
  ['Зависимый', 'Независимый'],
  ['Деятельный', 'Пассивный'],
  ['Черствый', 'Отзывчивый'],
  ['Решительный', 'Нерешительный'],
  ['Вялый', 'Энергичный'],
  ['Справедливый', 'Несправедливый'],
  ['Расслабленный', 'Напряженный'],
  ['Суетливый', 'Спокойный'],
  ['Враждебный', 'Дружелюбный'],
  ['Уверенный', 'Неуверенный'],
  ['Нелюдимый', 'Общительный'],
  ['Честный', 'Неискренний'],
  ['Несамостоятельный', 'Самостоятельный'],
  ['Раздражительный', 'Невозмутимый'],
];

const questions: SeedSection['questions'] = pairs.map(([left, right], index) => ({
  code: `test_518_${index + 1}`,
  text: `${left} — ${right}. Оцените указанного человека (или себя) по этой паре качеств.`,
  type: 'single',
  required: true,
  options: responseOptions,
}));

export const instrument: SeedSection = {
  code: 'test_518',
  title: 'Личностный дифференциал (адаптация НИПНИ им. В. М. Бехтерева)',
  description: 'Методика описывает субъективное отношение к себе или другому человеку по трём факторам: оценке (самоуважение и принятие), силе (осознаваемые волевые качества и самостоятельность) и активности (общительность и направленность на взаимодействие). Подходит для взрослых и исследовательских/профориентационных опросов, где важно сопоставить личностный образ одного или нескольких оцениваемых объектов; это не нормативный диагностический вывод.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 6,
  scales: [
    { key: 'evaluation', label: 'Оценка', items: [1, 4, 7, 10, 13, 16, 19], reverseItems: [1, 7, 13, 19], aggregation: 'sum' },
    { key: 'strength', label: 'Сила', items: [2, 5, 8, 11, 14, 17, 20], reverseItems: [5, 11, 17], aggregation: 'sum' },
    { key: 'activity', label: 'Активность', items: [3, 6, 9, 12, 15, 18, 21], reverseItems: [3, 9, 15, 21], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Вручную проверено: нейтральная отметка по всем биполярным парам',
    answers: Object.fromEntries(pairs.map((_, index) => [String(index + 1), 3])),
    expected: { evaluation: 21, strength: 21, activity: 21 },
  },
  {
    title: 'Вручную проверено: все ответы на положительном полюсе, с учетом направления пунктов',
    answers: Object.fromEntries(pairs.map(([left, right], index) => [String(index + 1), (
      [1, 7, 13, 19].includes(index + 1) ? (left === 'Обаятельный' || left === 'Добрый' || left === 'Справедливый' || left === 'Честный' ? 0 : 6) :
      [5, 11, 17].includes(index + 1) ? 0 :
      [3, 9, 15, 21].includes(index + 1) ? 0 : 6
    )])),
    expected: { evaluation: 42, strength: 42, activity: 42 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'bazhin-etkind-1983-21item-evaluation-strength-activity-sum-reverse-v1',
};
