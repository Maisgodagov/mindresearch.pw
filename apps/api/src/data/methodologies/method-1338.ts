import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const answerOptions = [
  { value: '1', label: 'Совершенно не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Отчасти согласен' },
  { value: '4', label: 'Скорее согласен' },
  { value: '5', label: 'Совершенно согласен' },
];

const items = [
  'Я самостоятельно выполняю все учебные задания',
  'Я всюду прихожу вовремя',
  'От меня зависит благополучие города и страны, где я живу',
  'Меня не волнует, если из-за меня пострадает другой человек',
  'Меня волнуют проблемы экологии',
  'Я жертвую личными интересами ради общественного дела',
  'Мне нет дела до моих сверстников',
  'Для меня важно доброе имя моей семьи',
  'Я желаю счастья людям во всем мире',
  'Я всем говорю правду',
  'Мне бывает неприятно, когда люди вытаптывают клумбы и ломают детские площадки',
  'Я стараюсь выполнять свои обязанности по дому',
  'Я помогаю тем членам своей семьи, которые нуждаются в заботе',
  'Я делаю замечания людям, которые мусорят на улице',
  'Я забочусь о себе и веду здоровый образ жизни',
  'Я считаю, что надо спасать беспризорных животных',
  'Мне бывает стыдно за некоторые поступки, даже если о них никто не узнает',
  'В моей компании принято помогать друг другу',
  'Я участвую в волонтерской деятельности',
  'Мне бывает стыдно перед окружающими за некоторые мои поступки',
  'В трудное для семьи время я тоже стараюсь сделать что-то полезное',
  'Я все делаю в нужное время',
  'Я даю другим людям обещания, которые не смогу выполнить',
  'Мне бывает стыдно перед родителями за некоторые мои поступки',
  'Я могу свалить свою вину на одноклассников/однокурсников',
  'Я берусь за общественные дела и отказываюсь от собственных планов',
  'Родители считают, что на меня можно положиться',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1366_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: answerOptions,
}));

export const instrument: SeedSection = {
  code: 'test_1366',
  title: 'Ответственность у подростков',
  description: 'Методика оценивает проявления ответственности у старших подростков 16–19 лет: поддержку близких и сверстников, самоконтроль, совестливость, социальную ответственность и заботу об окружающей среде, а также склонность избегать ответственности. Профиль шкал помогает автору опроса увидеть, в каких сферах ответственности подросток проявляет себя и где может уклоняться от обязательств.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'support', label: 'Поддержка', items: [8, 9, 13, 18, 21, 27], reverseItems: [], aggregation: 'sum' },
    { key: 'selfControl', label: 'Самоконтроль', items: [1, 3, 12, 15], reverseItems: [], aggregation: 'sum' },
    { key: 'conscience', label: 'Совесть', items: [17, 20, 24], reverseItems: [], aggregation: 'sum' },
    { key: 'socialResponsibility', label: 'Социальная ответственность', items: [6, 19, 26], reverseItems: [], aggregation: 'sum' },
    { key: 'environmentalCare', label: 'Забота об окружающей среде', items: [5, 11, 14, 16], reverseItems: [], aggregation: 'sum' },
    { key: 'responsibilityAvoidance', label: 'Избегание ответственности', items: [4, 7, 23, 25], reverseItems: [], aggregation: 'sum' },
    { key: 'overallResponsibility', label: 'Общий показатель ответственности', items: [1, 3, 5, 6, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 24, 26, 27], reverseItems: [], aggregation: 'sum' },
    { key: 'lie', label: 'Шкала лжи', items: [2, 10, 22], reverseItems: [], aggregation: 'sum' },
  ],
};

const allAnswers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: все ответы «Совершенно не согласен»',
    answers: allAnswers(1),
    expected: {
      support: 6,
      selfControl: 4,
      conscience: 3,
      socialResponsibility: 3,
      environmentalCare: 4,
      responsibilityAvoidance: 4,
      overallResponsibility: 20,
      lie: 3,
    },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'danilova-responsibility-adolescents-2024-v1',
};
