import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '-2', label: 'Полностью неверно' },
  { value: '-1', label: 'Неверно' },
  { value: '0', label: 'Затрудняюсь ответить' },
  { value: '1', label: 'Верно' },
  { value: '2', label: 'Полностью верно' },
];

const items = [
  'В Сети у меня много интересных друзей, с которыми я познакомился в играх.',
  'Мне интересно было бы узнать, что думают обо мне мои друзья по игре.',
  'Я хотел бы получить статус администратора или модератора чата (форума) игры или кого-то, кто может влиять на игровой процесс.',
  'Во время игры я могу забыть про еду и вспомнить про то, что я хочу есть, только по ее окончании.',
  'Неудачи в компьютерной игре вызывают у меня очень яркие эмоции.',
  'В любой игре я читаю информацию о ее тактике и характеристиках героев, снаряжения, техники.',
  'Если уж я играю, то, как правило, состою в каком-нибудь клане (гильдии, команде и т. п.).',
  'После того, как я поиграю, мне бывает тяжело уснуть.',
  'Я слежу за праздниками в игре и отмечаю их со своими виртуальными друзьями.',
  'На самом деле большинству моих товарищей по игре безразлично мое мнение о них.',
  'Я не критикую действия разработчиков игры.',
  'У меня бывают боли в спине, руках или голове из-за того, что я много времени провожу за компьютером.',
  'Когда я нахожусь не в игре, я вспоминаю и переживаю события, которые были в ней накануне.',
  'Я смотрю видеоролики с прохождением игры.',
  'Я вкладываю в игру реальные деньги.',
  'Бывает так, что из-за игры мне не удается вовремя следить за собой (мыться, чистить зубы и т. п.).',
  'Большая часть людей, с которыми я играю, мне малоинтересна.',
  'Я бы доверил друзьям, с которыми я познакомился в игре, решать важный для меня вопрос.',
  'Мне, в общем, все равно, кто является модератором, администратором или разработчиком игры.',
  'Мне снятся сны, в которых я продолжаю играть.',
  'Я не сажусь играть, если у меня плохое настроение.',
  'Я пишу в ЧаВо (FAQ) или викисловарь игры.',
  'Я стараюсь принимать участие во всех мероприятиях в игре (рейды, турниры, конкурсы).',
  'Если я нахожусь не у компьютера, то на меня накатывает депрессия.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_561_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_561',
  title: 'Методика диагностики гейм-аддикции (ДГА)',
  description: 'ДГА оценивает выраженность зависимости от онлайн-игр через значимость игрового круга общения, эмоциональное, когнитивное и поведенческое отношение к игре, а также физические проявления чрезмерной игры. Методика полезна авторам опросов и исследователям, изучающим онлайн-игроков и старшеклассников/студентов; исходная проверка проводилась на школьниках старших классов и студентах Москвы. Это исследовательский показатель, а не самостоятельный клинический диагноз.',
  questions,
};

const interpersonal = [1, 2, 3, 9, 10, 11, 17, 18, 19];
const gameAttitude = [5, 6, 7, 13, 14, 15, 21, 22, 23];
const physical = [4, 8, 12, 16, 20, 24];

export const scoringConfig: ConfigurableScoring = {
  min: -2,
  max: 2,
  scales: [
    { key: 'attraction', label: 'Межличностные отношения — аттракция', items: [1, 9, 17], reverseItems: [17], aggregation: 'sum' },
    { key: 'referentiality', label: 'Межличностные отношения — референтность', items: [2, 10, 18], reverseItems: [10], aggregation: 'sum' },
    { key: 'power', label: 'Межличностные отношения — власть', items: [3, 11, 19], reverseItems: [11, 19], aggregation: 'sum' },
    { key: 'interpersonal_relations', label: 'Межличностные отношения', items: interpersonal, reverseItems: [10, 11, 17, 19], aggregation: 'sum' },
    { key: 'emotional', label: 'Отношение к игре — эмоциональный компонент', items: [5, 13, 21], reverseItems: [21], aggregation: 'sum' },
    { key: 'cognitive', label: 'Отношение к игре — когнитивный компонент', items: [6, 14, 22], reverseItems: [], aggregation: 'sum' },
    { key: 'behavioral', label: 'Отношение к игре — поведенческий компонент', items: [7, 15, 23], reverseItems: [], aggregation: 'sum' },
    { key: 'game_attitude', label: 'Отношение к игре', items: gameAttitude, reverseItems: [21], aggregation: 'sum' },
    { key: 'physical', label: 'Физические проявления зависимости', items: physical, reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка реверсивных утверждений: исходные баллы 2 дают 1 после реверса',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 2])),
    expected: {
      attraction: 2, referentiality: 2, power: 0, interpersonal_relations: 4,
      emotional: 2, cognitive: 6, behavioral: 6, game_attitude: 14, physical: 12,
    },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'dga-kochetkov-2016-v1',
};
