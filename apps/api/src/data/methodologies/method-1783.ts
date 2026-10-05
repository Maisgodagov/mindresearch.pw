import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Абсолютно не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Скорее не согласен' },
  { value: '4', label: 'Определенного мнения не имею' },
  { value: '5', label: 'Скорее согласен' },
  { value: '6', label: 'Согласен' },
  { value: '7', label: 'Полностью согласен' },
];

const statements = [
  'Деньги – важный фактор в жизни каждого человека.',
  'Деньги – это благо.',
  'Деньги – вещь важная.',
  'Я отношусь к деньгам очень серьезно.',
  'Деньги имеют значение.',
  'Деньги на дороге не валяются.',
  'Деньги делают жизнь комфортной.',
  'Деньги – вещь соблазнительная.',
  'Считаю, что очень важно откладывать определенные суммы.',
  'Деньги – источник всех бед.',
  'Деньги – это зло.',
  'Потраченные деньги выброшены на ветер.',
  'Деньги – это стыдно.',
  'Деньги – вещь бесполезная.',
  'Сберечь копейку – то же, что ее заработать.',
  'Деньги – мерило профессиональной состоятельности.',
  'Деньги – это главное (главная цель) в моей жизни.',
  'Деньги – символ успеха.',
  'За деньги можно купить всё.',
  'Деньги обеспечивают уважение окружающих.',
  'Деньги достойны уважения.',
  'Деньги помогают человеку реализовать свои знания и способности.',
  'Деньги обеспечат вам много друзей.',
  'Я разумно расходую свои деньги.',
  'Я тщательно планирую денежные расходы.',
  'Я немедленно оплачиваю счета во избежание любых штрафных санкций.',
  'Деньги обеспечивают человеку свободу и независимость.',
  'Наличие денег на счете – фактор уверенности в будущем.',
  'Деньги дают возможность стать таким, каким хочешь быть.',
  'Деньги – это власть.',
];

const questions: SeedSection['questions'] = statements.map((text, index) => ({
  code: `test_1800_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1800',
  title: 'Тест на отношение к деньгам (Money Ethic Scale, 30-пунктовая русская форма)',
  description: 'Методика измеряет многомерное отношение к деньгам у взрослых: восприятие денег как блага, зла, достижения, источника уважения, средства планирования бюджета и свободы/власти. Профиль шести отдельных аспектов помогает автору опроса изучить финансовые убеждения и установки; отдельный общий показатель для этой формы источником не задан.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'good', label: 'Благо (Good)', items: [1, 2, 3, 6, 11, 13, 17, 19, 22], reverseItems: [], aggregation: 'sum' },
    { key: 'evil', label: 'Зло (Evil)', items: [4, 12, 14, 16, 23, 24], reverseItems: [], aggregation: 'sum' },
    { key: 'achievement', label: 'Достижение (Achievement)', items: [5, 7, 8, 28], reverseItems: [], aggregation: 'sum' },
    { key: 'respect', label: 'Уважение / самооценка (Respect)', items: [10, 15, 18, 20], reverseItems: [], aggregation: 'sum' },
    { key: 'budget', label: 'Бюджет (Budget)', items: [26, 29, 30], reverseItems: [], aggregation: 'sum' },
    { key: 'freedom_power', label: 'Свобода / власть (Freedom/Power)', items: [9, 21, 25, 27], reverseItems: [], aggregation: 'sum' },
  ],
};

const answers = (value: number) => Object.fromEntries(statements.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы минимальны: суммы шкал соответствуют числу входящих пунктов',
    answers: answers(1),
    expected: { good: 9, evil: 6, achievement: 4, respect: 4, budget: 3, freedom_power: 4 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'tang-money-ethic-scale-30-item-1992-ru-psytests-v1',
};
