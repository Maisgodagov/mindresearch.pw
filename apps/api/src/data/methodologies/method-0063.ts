import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Да' },
  { value: '0', label: 'Нет' },
  { value: '-1', label: 'Не знаю' },
];

const items = [
  'Знаю, что члены моей семьи часто бывают недовольны мною.',
  'Чувствую, что, как бы я ни поступил(а), всё равно будет не так.',
  'Я многого не успеваю сделать.',
  'Так получается, что именно я чаще всего оказываюсь виноват(а) во всём, что случается в нашей семье.',
  'Часто чувствую себя беспомощным (беспомощной).',
  'Дома мне часто приходится нервничать.',
  'Когда попадаю домой, чувствую себя неуклюжим (неуклюжей) и неловким (неловкой).',
  'Некоторые члены семьи считают меня бестолковым (бестолковой).',
  'Когда я дома, всё время из-за чего-нибудь переживаю.',
  'Часто чувствую на себе критические взгляды членов моей семьи.',
  'Иду домой и с тревогой думаю, что ещё случилось в моё отсутствие.',
  'Дома у меня постоянно ощущение, что надо ещё очень многое сделать.',
  'Нередко чувствую себя лишним (лишней) дома.',
  'Дома у меня такое положение, что просто опускаются руки.',
  'Дома мне постоянно приходится сдерживаться.',
  'Мне кажется, если бы я вдруг исчез (исчезла), то никто бы этого не заметил.',
  'Идёшь домой, думаешь, что будешь делать одно, но, как правило, приходится делать совсем другое.',
  'Как подумаю о своих семейных делах, начинаю волноваться.',
  'Некоторым членам моей семьи бывает неудобно из-за меня перед друзьями и знакомыми.',
  'Часто бывает: хочу сделать хорошо, но оказывается, вышло плохо.',
  'Мне многое у нас не нравится, но я этого стараюсь не показывать.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_101_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_101',
  title: 'Анализ семейной тревоги (АСТ)',
  description: "Методика оценивает переживание семейной тревоги по темам вины, тревожности и напряжённости в отношениях дома. Результаты показывают выраженность отдельных компонентов и их общего показателя; это не клинический диагноз.",
  questions,
};

const byNumber = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const scoringConfig: ConfigurableScoring = {
  min: -1,
  max: 1,
  scales: [
    { key: 'guilt', label: 'Вина (В)', items: [1, 4, 7, 10, 13, 16, 19], reverseItems: [], aggregation: 'sum' },
    { key: 'anxiety', label: 'Тревожность (Т)', items: [2, 5, 8, 11, 14, 17, 20], reverseItems: [], aggregation: 'sum' },
    { key: 'tension', label: 'Напряжённость (Н)', items: [3, 6, 9, 12, 15, 18, 21], reverseItems: [], aggregation: 'sum' },
    { key: 'familyAnxiety', label: 'Общая семейная тревожность (С)', items: Array.from({ length: 21 }, (_, index) => index + 1), reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная сверка по опубликованному примеру',
    answers: Object.fromEntries(Array.from({ length: 21 }, (_, index) => [String(index + 1), [1, 2, 4, 5, 7, 11, 14, 16, 19, 20, 21].includes(index + 1) ? 1 : 0])),
    expected: { guilt: 5, anxiety: 4, tension: 5, familyAnxiety: 14 },
  },
  { title: 'Ответ «Не знаю» не даёт баллов', answers: byNumber(-1), expected: { guilt: 0, anxiety: 0, tension: 0, familyAnxiety: 0 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'ast-eydemiller-yustickis-1987-v1',
};
