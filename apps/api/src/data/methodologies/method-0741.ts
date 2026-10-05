import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Совсем нет' },
  { value: '2', label: 'Скорее нет' },
  { value: '3', label: 'Средне' },
  { value: '4', label: 'Скорее да' },
  { value: '5', label: 'Очень сильно' },
];

const frequencyOptions = [
  { value: '1', label: 'Никогда' },
  { value: '2', label: 'Редко' },
  { value: '3', label: 'Иногда' },
  { value: '4', label: 'Часто' },
  { value: '5', label: 'Всегда' },
];

const items = [
  'Насколько вам интересны точные цифры и проценты, лежащие в основе игровой механики?',
  'Вы предпочитаете состоять в группе или быть соло (один)?',
  'Насколько вам нравится работать с другими игроками в команде?',
  'Как много времени вы тратите, настраивая вашего персонажа при его создании?',
  'Насколько для вас важно, чтобы доспехи/наряд вашего персонажа сочетались по цвету и стилю?',
  'Насколько для вас важно, чтобы ваш персонаж внешне отличался от других?',
  'Насколько вам нравится исследовать игровой мир только ради самого его исследования?',
  'Насколько для вас важно находить квесты, NPC (неигровых персонажей) или локации, о которых большинство игроков не знает?',
  'Насколько для вас важно в игре прокачивать персонажа настолько быстро, насколько это возможно?',
  'Насколько для вас важно стать могущественным в игре?',
  'Насколько для вас важно знать как можно больше о механике и правилах игры?',
  'Насколько для вас важно погружаться в фантастический мир игры?',
  'Насколько для вас важно уйти из реального мира в игровой?',
  'Насколько вам нравится в игре знакомиться с другими игроками?',
  'Насколько вам нравится в игре болтать с другими игроками?',
  'Насколько вам нравится исследовать каждую локацию в игровом мире?',
  'Насколько вам нравится в игре делать вещи, раздражающие других игроков?',
  'Как часто в игре вы ведёте содержательные беседы с другими игроками?',
  'Как часто в игре вы говорите о личном с игровыми друзьями?',
  'Как часто в игре ваши игровые друзья предлагают вам помощь, когда у вас возникают проблемы в реальной жизни?',
  'Как часто в игре вы придумываете своим персонажам прошлое и истории?',
  'Как часто в игре вы отыгрываете роль вашего персонажа (злобный глупый орк, мудрый маг и т. д.)?',
  'Как часто вы играете, чтобы не думать о проблемах и заботах в реальной жизни?',
  'Как часто в игре вы специально пытаетесь спровоцировать или вывести из себя других игроков?',
];

const frequencyItems = new Set([18, 19, 20, 21, 22, 23, 24]);
const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_771_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: (index === 1 ? [
    { value: '1', label: 'Однозначно один' },
    { value: '2', label: 'Скорее один' },
    { value: '3', label: 'Без разницы' },
    { value: '4', label: 'Скорее в группе' },
    { value: '5', label: 'Однозначно в группе' },
  ] : frequencyItems.has(index + 1) ? frequencyOptions : options),
}));

const instrument: SeedSection = {
  code: 'test_771',
  title: 'Мотивация игры в ММОРПГ',
  description: 'Русскоязычная адаптация опросника Ника Йи оценивает профиль мотивации онлайн-игрока по десяти аспектам: игровому прогрессу, интересу к механике, соревнованию, общению, отношениям, командной работе, исследованию мира, эскапизму, отыгрыванию роли и кастомизации персонажа. Аспекты объединяются в более широкие факторы достижения, социальной мотивации и погружения. Версия адаптирована для русскоязычных игроков; апробация проходила на участниках 12–40 лет, не все из которых считали ММОРПГ основным жанром.',
  questions,
};

const groups = [
  { key: 'mechanics', label: 'Механика', items: [1, 11] },
  { key: 'progress', label: 'Прогресс', items: [9, 10] },
  { key: 'competition', label: 'Соревнование', items: [17, 24] },
  { key: 'socializing', label: 'Общение', items: [14, 15] },
  { key: 'relationships', label: 'Отношения', items: [18, 19, 20] },
  { key: 'teamwork', label: 'Командная работа', items: [2, 3] },
  { key: 'discovery', label: 'Исследование', items: [7, 8, 16] },
  { key: 'escapism', label: 'Эскапизм', items: [13, 23] },
  { key: 'rolePlaying', label: 'Отыгрывание роли', items: [12, 21, 22] },
  { key: 'customization', label: 'Кастомизация', items: [4, 5, 6] },
];
const byKey = Object.fromEntries(groups.map((group) => [group.key, group.items]));

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    ...groups.map((group) => ({ key: group.key, label: group.label, items: group.items, reverseItems: [], aggregation: 'mean' as const })),
    { key: 'achievement', label: 'Достижение', items: [...byKey.mechanics, ...byKey.progress, ...byKey.competition], reverseItems: [], aggregation: 'mean' },
    { key: 'socialMotivation', label: 'Социальная мотивация', items: [...byKey.socializing, ...byKey.relationships, ...byKey.teamwork], reverseItems: [], aggregation: 'mean' },
    { key: 'immersion', label: 'Погружение', items: [...byKey.discovery, ...byKey.escapism, ...byKey.rolePlaying, ...byKey.customization], reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Единицы по всем пунктам дают среднее 1 на каждой шкале',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: Object.fromEntries(scoringConfig.scales.map((scale) => [scale.key, 1])),
  },
  {
    title: 'Максимальные ответы на пунктах общения дают 5 по «Общению»',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), [14, 15].includes(index + 1) ? 5 : 1])),
    expected: Object.fromEntries(scoringConfig.scales.map((scale) => [scale.key, scale.key === 'socializing' ? 5 : scale.key === 'socialMotivation' ? 3 : scale.key === 'relationships' || scale.key === 'teamwork' ? 1 : 1])),
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'yee-bogacheva-mmorpg-ru-2021-v1',
};
