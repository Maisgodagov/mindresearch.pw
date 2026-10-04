import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const statements = [
  'Намеревались спроектировать свое профессиональное будущее',
  'Предпринимали шаги для достижения карьерных целей',
  'Заботились о развитии Вашей карьеры',
  'Разработали планы и цели для будущей карьеры',
  'Знакомились с людьми, которые могут повлиять на Вашу карьеру',
  'Устанавливали связи с людьми в тех областях, где Вы хотели бы работать',
  'Устанавливали или поддерживали контакты с людьми, которые могут помочь Вам в профессии',
  'Развивали знания и навыки в выполнении задач, имеющих решающее значение для Вашей будущей трудовой жизни',
  'Получали опыт в различных областях, чтобы усилить Ваши знания и навыки',
  'Добровольно принимали участие в дополнительном образовании, тренинге или других мероприятиях, важных для карьеры',
];

const answerOptions = [
  { value: '1', label: 'Почти ни в какой' },
  { value: '2', label: 'В очень малой степени' },
  { value: '3', label: 'В некоторой степени' },
  { value: '4', label: 'В достаточной степени' },
  { value: '5', label: 'В значительной степени' },
];

const questions: SeedSection['questions'] = statements.map((text, index) => ({
  code: `test_427_${index + 1}`,
  text: index === 0 ? `В какой степени за последние 6 месяцев Вы… ${text}` : text,
  type: 'single',
  required: true,
  options: answerOptions,
}));

export const instrument: SeedSection = {
  code: 'test_427',
  title: 'Карьерная вовлеченность (КВ; русская адаптация CES)',
  description: 'Шкала измеряет проактивное поведение в развитии карьеры за последние шесть месяцев: планирование карьеры, создание полезных профессиональных контактов и саморазвитие знаний и навыков. Русская адаптация предназначена для студентов вузов и колледжей и сотрудников организаций; результаты помогают автору опроса различать эти три направления карьерной активности.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'careerPlanning', label: 'Планирование карьеры', items: [1, 2, 3, 4], reverseItems: [], aggregation: 'mean' },
    { key: 'careerNetworking', label: 'Карьерный нетворкинг', items: [5, 6, 7], reverseItems: [], aggregation: 'mean' },
    { key: 'careerSelfDevelopment', label: 'Карьерное саморазвитие', items: [8, 9, 10], reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная сверка: ответы 1–10 совпадают с номером варианта; средние по субшкалам равны 2.5, 6 и 9',
    answers: Object.fromEntries(Array.from({ length: 10 }, (_, index) => [String(index + 1), index + 1])),
    expected: { careerPlanning: 2.5, careerNetworking: 6, careerSelfDevelopment: 9 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'volkova-bordunos-chiker-ces-ru-2026-v1',
};
