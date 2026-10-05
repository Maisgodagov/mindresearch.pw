import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const answerLabels = [
  ['не очень', 'нравится', 'не нравится'],
  ['чаще хочется остаться дома', 'бывает по-разному', 'иду с радостью'],
  ['не знаю', 'остался бы дома', 'пошел бы в школу'],
  ['не нравится', 'бывает по-разному', 'нравится'],
  ['хотел бы', 'не хотел бы', 'не знаю'],
  ['не знаю', 'не хотел бы', 'хотел бы'],
  ['часто', 'редко', 'не рассказываю'],
  ['точно не знаю', 'хотел бы', 'не хотел бы'],
  ['мало', 'много', 'нет друзей'],
  ['нравятся', 'не очень', 'не нравятся'],
];

const itemTexts = [
  'Тебе нравится в школе?',
  'Утром, когда ты просыпаешься, ты всегда с радостью идешь в школу или тебе часто хочется остаться дома?',
  'Если бы учитель сказал, что завтра в школу не обязательно приходить всем ученикам, что желающие могут остаться дома, ты пошел бы в школу или остался дома?',
  'Тебе нравится, когда у вас отменяют какие-нибудь уроки?',
  'Ты хотел бы, чтобы тебе не задавали домашних заданий?',
  'Ты хотел бы, чтобы в школе остались одни перемены?',
  'Ты часто рассказываешь о школе родителям?',
  'Ты хотел бы, чтобы у тебя был менее строгий учитель?',
  'У тебя в классе много друзей?',
  'Тебе нравятся твои одноклассники?',
];

const points = [
  [1, 3, 0], [0, 1, 3], [1, 0, 3], [3, 1, 0], [0, 3, 1],
  [1, 3, 0], [3, 1, 0], [1, 0, 3], [1, 3, 0], [3, 1, 0],
];

const questions: SeedSection['questions'] = itemTexts.map((text, index) => ({
  code: `test_970_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: answerLabels[index].map((label, choiceIndex) => ({ value: String(choiceIndex + 1), label })),
}));

export const instrument: SeedSection = {
  code: 'test_970',
  title: 'Опросник для оценки школьной мотивации учащихся начальных классов',
  description: 'Краткая скрининговая анкета Н. Г. Лускановой для оценки школьной мотивации младших школьников. Десять вопросов охватывают отношение к школе и учебным ситуациям, эмоциональные реакции на школьную жизнь, выполнение домашних заданий и отношения с учителем, родителями и одноклассниками. Помогает автору опроса заметить выраженно низкую мотивацию и отслеживать динамику школьной адаптации; результаты предназначены для начальной школы и не заменяют комплексную оценку ребёнка.',
  questions,
};

const weights = Object.fromEntries(points.flatMap((row, itemIndex) => row.map((score, choiceIndex) => [`${itemIndex + 1}:${choiceIndex + 1}`, score])));

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 3,
  scales: [{
    key: 'school_motivation',
    label: 'Школьная мотивация',
    items: Array.from({ length: 10 }, (_, index) => index + 1),
    reverseItems: [],
    aggregation: 'sum',
    weights,
  }],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная сверка: наиболее положительные ключевые варианты дают 30 баллов',
    answers: { '1': 2, '2': 3, '3': 3, '4': 1, '5': 2, '6': 2, '7': 1, '8': 3, '9': 2, '10': 1 },
    expected: { school_motivation: 30 },
  },
  {
    title: 'Ручная сверка: отрицательные варианты дают 0 баллов',
    answers: { '1': 3, '2': 1, '3': 2, '4': 3, '5': 1, '6': 3, '7': 3, '8': 2, '9': 3, '10': 3 },
    expected: { school_motivation: 0 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'luskanova-primary-school-motivation-10-items-weighted-sum-0-1-3-v1',
};
