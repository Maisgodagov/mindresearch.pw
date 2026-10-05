import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const yesNo = [
  { value: '1', label: 'Да' },
  { value: '0', label: 'Нет' },
];

const items = [
  'Я стараюсь как можно больше заниматься дополнительно, чтобы получить хорошую оценку.',
  'Больше всего на свете я боюсь получить «двойку».',
  'Я готов на всё, чтобы получить «пятерку».',
  'Бывает, что я отказываюсь отвечать, хотя и готовил задание.',
  'У меня бывает ощущение, что я всё забыл.',
  'Бывает, что и легкие предметы я не могу хорошо ответить.',
  'Когда я настроился отвечать, меня злят разговоры и смех вокруг.',
  'Мне трудно выступать перед классом.',
  'Объявления оценок я всегда жду с волнением.',
  'Я предпочел бы, чтобы на экзамене присутствовал знакомый преподаватель.',
  'Накануне контрольных я всегда испытываю тревогу.',
  'Перед экзаменами у меня бывает внутренняя дрожь.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1437_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: yesNo,
}));

export const instrument: SeedSection = {
  code: 'test_1437',
  title: 'Подвержены ли вы экзаменационному стрессу?',
  description: 'Анкета выявляет склонность к экзаменационному стрессу у учащихся 9-х и 11-х классов по тревожным ожиданиям и переживаниям, опасению неудачи, трудностям ответа и выступления, а также эмоциональным реакциям в ситуации проверки знаний. Профиль может помочь автору опроса заметить, какие переживания сопровождают подготовку к экзаменам; результат не является диагнозом.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 1,
  scales: [{
    key: 'examStress',
    label: 'Подверженность экзаменационному стрессу',
    items: items.map((_, index) => index + 1),
    reverseItems: [],
    aggregation: 'sum',
  }],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы «Нет»: ноль баллов',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 0])),
    expected: { examStress: 0 },
  },
  {
    title: 'Ответы «Да» на пункты 1, 4 и 12: три балла',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), [1, 4, 12].includes(index + 1) ? 1 : 0])),
    expected: { examStress: 3 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'exam-stress-questionnaire-12-positive-answers-v1',
};
