import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Полностью согласен' },
  { value: '2', label: 'Согласен' },
  { value: '3', label: 'Наверное, согласен' },
  { value: '4', label: 'Не знаю' },
  { value: '5', label: 'Наверное, не согласен' },
  { value: '6', label: 'Не согласен' },
  { value: '7', label: 'Полностью не согласен' },
];

const items = [
  'Я могу предсказывать поведение других людей.',
  'Я часто чувствую, что мне трудно понять выбор других людей.',
  'Я знаю, что будут чувствовать другие люди после моих действий.',
  'Я легко приспосабливаюсь к разным социальным ситуациям.',
  'Другие люди сердятся на меня, не будучи способными объяснить мне почему.',
  'Я понимаю желания других людей.',
  'Я способен быстро осваиваться в новых ситуациях и сразу знакомиться с людьми.',
  'Люди часто сердятся или раздражаются, когда я говорю то, что я думаю.',
  'Мне трудно налаживать отношения с другими людьми.',
  'Чтобы хорошо понять других людей, мне нужно много времени.',
  'Я могу предсказать, как другие будут реагировать на мое поведение.',
  'Я хорошо подбираю нужные слова в разговоре с новыми людьми.',
  'Я часто могу понять, что на самом деле другие хотят выразить с помощью слов, жестов, мимики и других средств.',
  'Мне часто трудно найти подходящие темы для разговора.',
  'Я часто бываю удивлен реакциями других на то, что я делаю.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2426_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2426',
  title: 'Шкала социального интеллекта Тромсо (модификация для российских школьников)',
  description: 'Русскоязычная модификация TSIS оценивает у школьников 7–16 лет социальное осознание — чувствительность к вербальным и невербальным проявлениям других людей — и социальные навыки, то есть уверенность и компетентность в межличностных ситуациях и решении социальных задач. Два раздельных показателя помогают описать эти стороны социального взаимодействия; версия и нормы разработаны для российских школьников.',
  categoryIds: ['intelligence-social'],
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'social_awareness', label: 'Социальное осознание', items: [2, 5, 8, 9, 10, 14, 15], reverseItems: [], aggregation: 'sum' },
    { key: 'social_skills', label: 'Социальные навыки', items: [1, 3, 4, 6, 7, 11, 12, 13], reverseItems: [], aggregation: 'sum' },
  ],
};

const allAnswers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Все ответы по колонке 1; обратное соответствие статье: сырой балл 7 на каждом пункте', answers: allAnswers(1), expected: { social_awareness: 49, social_skills: 56 } },
  { title: 'Все ответы по колонке 7; обратное соответствие статье: сырой балл 1 на каждом пункте', answers: allAnswers(7), expected: { social_awareness: 7, social_skills: 8 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'nasledov-semenov-tsis-school-ru-2015-v1',
};
