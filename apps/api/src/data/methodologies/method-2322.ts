import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Никогда' },
  { value: '2', label: 'Изредка' },
  { value: '3', label: 'Иногда' },
  { value: '4', label: 'Часто' },
  { value: '5', label: 'Очень часто' },
];

const items = [
  'Дал положительный отзыв товарищу по команде.',
  'Раскритиковал соперника.',
  'Спорил с товарищем по команде.',
  'Помог сопернику подняться с пола.',
  'Умышленно использовал грубый приём (фол) против соперника.',
  'Просил остановить игру, когда соперник получил травму.',
  'Словесно оскорбил товарища по команде.',
  'Поощрил товарища по команде.',
  'Отомстил сопернику после грубого приёма (фола).',
  'Помог сопернику, получившему травму.',
  'Критиковал товарища по команде.',
  'Дал конструктивный совет товарищу по команде.',
  'Попытался разозлить соперника.',
  'Выругался на товарища по команде.',
  'Поздравил товарища по команде за хорошую игру.',
  'Пытался травмировать соперника.',
  'Намеренно отвлекал соперника.',
  'Показал разочарование в плохой игре товарища по команде.',
  'Намеренно нарушил правила игры.',
  'Физически запугал соперника.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2340_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2340',
  title: 'Шкала просоциального и антисоциального поведения в спорте (PABSS)',
  description: 'Методика оценивает частоту просоциальных и антисоциальных поступков спортсмена по отношению к товарищам по команде и соперникам в течение соревновательного сезона. Четыре шкалы позволяют различать поддержку и помощь партнёрам или соперникам, а также антисоциальные действия в адрес каждой из этих групп. Русская версия предназначена для спортсменов, оценивающих поведение за текущий или последний соревновательный сезон.',
  categoryIds: ['sport'],
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'prosocialTeammates', label: 'Просоциальное поведение по отношению к товарищам по команде', items: [1, 8, 12, 15], reverseItems: [], aggregation: 'mean' },
    { key: 'prosocialOpponents', label: 'Просоциальное поведение по отношению к соперникам', items: [4, 6, 10], reverseItems: [], aggregation: 'mean' },
    { key: 'antisocialTeammates', label: 'Антисоциальное поведение по отношению к товарищам по команде', items: [3, 7, 11, 14, 18], reverseItems: [], aggregation: 'mean' },
    { key: 'antisocialOpponents', label: 'Антисоциальное поведение по отношению к соперникам', items: [2, 5, 9, 13, 16, 17, 19, 20], reverseItems: [], aggregation: 'mean' },
  ],
};

const allAnswers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Все ответы «никогда»', answers: allAnswers(1), expected: { prosocialTeammates: 1, prosocialOpponents: 1, antisocialTeammates: 1, antisocialOpponents: 1 } },
  { title: 'Все ответы «очень часто»', answers: allAnswers(5), expected: { prosocialTeammates: 5, prosocialOpponents: 5, antisocialTeammates: 5, antisocialOpponents: 5 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['sport'],
  scoringConfig,
  validationCases,
  formulaVersion: 'pabss-kavussanu-boardley-2009-kislyakov-belov-2020-v1',
};
