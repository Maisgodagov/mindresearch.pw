import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const acuteOptions = [
  { value: '1', label: 'Нет, это совсем не так' },
  { value: '2', label: 'Пожалуй, так' },
  { value: '3', label: 'Верно' },
  { value: '4', label: 'Совершенно верно' },
];

const chronicOptions = [
  { value: '1', label: 'Почти никогда' },
  { value: '2', label: 'Иногда' },
  { value: '3', label: 'Часто' },
  { value: '4', label: 'Почти всегда' },
];

const acuteItems = [
  'Мне хорошо.',
  'Когда много проблем, не могу сосредоточиться на одном деле.',
  'Я нервничаю.',
  'Выполнение даже простых действий требует от меня дополнительного напряжения.',
  'Чувство тревоги нарастает во мне.',
  'У меня дрожат руки.',
  'Неожиданно трудно вспомнить необходимую информацию.',
  'Затрудняюсь включиться в общий разговор.',
  'Я неожиданно вспотел.',
  'С трудом нахожу слова, чтобы выразить даже простую мысль.',
  'Все мысли смешались, так и вертятся в голове.',
  'Я бодр и уверен в себе.',
];

const chronicItems = [
  'Во мне нарастает тревога, когда я вспоминаю о скопившихся проблемах.',
  'Плохо сплю по ночам.',
  'Долго обдумываю каждый свой промах.',
  'Если работа не клеится, то раздражение мешает ее продолжать.',
  'Меня все чаще мучают головные боли.',
  'У меня все чаще бывает хандра.',
  'Если кто-то пытается на меня надавить, то я начинаю грубить.',
  'Прихожу в бешенство, когда мне делают замечания.',
  'Едва начав работать, я чувствую, как наваливается усталость.',
  'У меня появились приступы тошноты и/или головокружения.',
  'Когда просыпаюсь ночью, то засыпаю с трудом.',
  'Волнуюсь по любому пустячному поводу.',
  'Мне трудно полностью сосредоточиться на работе.',
  'Все чаще ощущаю безнадежность.',
  'У меня появились «провалы памяти», могу забыть сделать что-нибудь важное.',
  'Бывает сжимается горло и трудно вздохнуть.',
  'Все чаще испытываю грусть.',
  'У меня крепкий и здоровый сон.',
];

const questions: SeedSection['questions'] = [
  ...acuteItems.map((text, index) => ({
    code: `test_1364_${index + 1}`,
    text,
    type: 'single' as const,
    required: true,
    options: acuteOptions,
  })),
  ...chronicItems.map((text, index) => ({
    code: `test_1364_${index + 13}`,
    text,
    type: 'single' as const,
    required: true,
    options: chronicOptions,
  })),
];

export const instrument: SeedSection = {
  code: 'test_1364',
  title: 'Острый и хронический стресс (ОХС)',
  description: 'Краткий скрининговый опросник оценивает субъективные проявления острого стресса в текущем состоянии и хронического стресса за последние месяцы. Охватывает общее самочувствие, эмоциональную и когнитивную напряженность, физиологический дискомфорт, трудности общения и исполнения, а также тревожность, нарушения физического состояния и сна, астенизацию, депрессивные и агрессивные проявления. Версия разработана для молодежи и студентов; предназначена для исследовательских и межгрупповых сравнений.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 4,
  scales: [
    { key: 'acute', label: 'Острый стресс', items: Array.from({ length: 12 }, (_, i) => i + 1), reverseItems: [1, 12], aggregation: 'sum' },
    { key: 'chronic', label: 'Хронический стресс', items: Array.from({ length: 18 }, (_, i) => i + 13), reverseItems: [30], aggregation: 'sum' },
  ],
};

const answers = (acute: number, chronic: number) => Object.fromEntries([
  ...acuteItems.map((_, index) => [String(index + 1), acute]),
  ...chronicItems.map((_, index) => [String(index + 13), chronic]),
]);

const validationCases: ValidationCase[] = [
  { title: 'Минимальные ответы по обеим шкалам', answers: answers(1, 1), expected: { acute: 14, chronic: 20 } },
  { title: 'Максимальные ответы по обеим шкалам', answers: answers(4, 4), expected: { acute: 46, chronic: 70 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'oihs-morosanova-zinchenko-2024-v1',
};
