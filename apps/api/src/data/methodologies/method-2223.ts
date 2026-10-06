import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: 'yes', label: 'Да' },
  { value: 'rather_yes', label: 'Скорее да, чем нет' },
  { value: 'unknown', label: 'Не знаю' },
  { value: 'rather_no', label: 'Скорее нет, чем да' },
  { value: 'no', label: 'Нет' },
];

const items = [
  'У меня всегда есть, с кем поговорить о своих ежедневных проблемах.',
  'Мне не хватает действительно близкого друга.',
  'Обычно я чувствую себя опустошенным (чувствую пустоту).',
  'Есть много людей, на которых я могу опереться, когда у меня трудности.',
  'Мне не хватает удовольствия от компании других людей.',
  'Я считаю свой круг друзей и знакомых слишком узким.',
  'У меня есть много людей, которым я могу полностью доверять.',
  'У меня достаточно близких мне людей.',
  'Мне не хватает людей вокруг меня.',
  'Я часто чувствую себя отвергнутым.',
  'Я могу обратиться к своим друзьям всегда, когда я нуждаюсь в них.',
];

const positiveItems = [1, 4, 7, 8, 11];
const negativeItems = [2, 3, 5, 6, 9, 10];
const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2239_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2239',
  title: 'Шкала одиночества De Jong Gierveld (DJGLS), русская адаптация',
  description: 'Методика оценивает выраженность субъективного одиночества у взрослых, различая эмоциональный компонент (нехватка близких доверительных связей) и социальный компонент (нехватка более широкого круга общения и поддержки). Подходит авторам опросов, которым нужны общий показатель одиночества и отдельные показатели этих двух аспектов; регистрация воспроизводит русскую 11-пунктовую версию.',
  questions,
};

const itemScores = (numbers: number[], lonelyAnswers: string[]) => Object.fromEntries(
  numbers.map((number) => [number, Object.fromEntries(options.map(({ value }) => [value, lonelyAnswers.includes(value) ? 1 : 0]))]),
);

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 1,
  scales: [
    { key: 'emotional', label: 'Эмоциональное одиночество', items: negativeItems, reverseItems: [], itemScores: itemScores(negativeItems, ['yes', 'rather_yes', 'unknown']), aggregation: 'sum' },
    { key: 'social', label: 'Социальное одиночество', items: positiveItems, reverseItems: [], itemScores: itemScores(positiveItems, ['unknown', 'rather_no', 'no']), aggregation: 'sum' },
    { key: 'total', label: 'Общее одиночество', items: [...positiveItems, ...negativeItems].sort((a, b) => a - b), reverseItems: positiveItems, itemScores: { ...itemScores(negativeItems, ['yes', 'rather_yes', 'unknown']), ...itemScores(positiveItems, ['unknown', 'rather_no', 'no']) }, aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка ключа: все утвердительные ответы дают 6 эмоциональных и 5 социальных баллов одиночества',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 'yes'])),
    expected: { emotional: 6, social: 0, total: 6 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['social-loneliness'],
  scoringConfig,
  validationCases,
  formulaVersion: 'djgls-11-ru-kryukova-ekimchik-dichotomous-v1',
};
