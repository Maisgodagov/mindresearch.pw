import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'Нет' },
  { value: '1', label: 'Скорее нет, чем да' },
  { value: '2', label: 'Скорее да, чем нет' },
  { value: '3', label: 'Да' },
];

const statements = [
  'Считали ли Вы когда-нибудь, что жизнь к Вам несправедлива?',
  'Бывало ли у Вас ощущение, что Вами пренебрегают?',
  'Неудачи в Вашей жизни — простое стечение обстоятельств?',
  'Вам говорили, что быть одиноким — Ваше предназначение?',
  'Вам приходилось скрывать правду ради получения чего-то нужного для Вас (вещи, идеи...)?',
  'Бывало ли у Вас ощущение, что Вам навязывают работу, которую должны выполнять другие?',
  'Чувствовали ли Вы себя совершенно обессиленным и беззащитным?',
  'Ваше мнение в коллективе игнорировали?',
  'Приходилось ли Вам представляться слабым и немощным, для того чтобы привлечь внимание окружающих?',
  'Казалось ли Вам, что к Вам относятся как к «мальчику для битья»?',
  'Делились ли Вы своими неприятностями с малознакомыми людьми?',
  'Вас игнорировали значимые для Вас люди?',
  'Пользоваться своими несчастьями, для того чтобы добиться денежных либо моральных компенсаций, считается практичным?',
  'Бывало ли, что Вас использовали в своих целях?',
  'Вам приятно, когда Вам сочувствуют?',
  'Трудно ли Вам привыкать к новому коллективу?',
  'Поплакаться, чтобы добиться необходимого, — оказывается лучшим способом влияния на других?',
  'Говорили ли Вам, что Вы невезучий?',
  'Другие люди умеют лучше контролировать события своей жизни, чем Вы сами?',
  'Являлись ли Вы объектом унизительных для Вас шуток?',
  'Лучший способ добиться желаемого — задобрить окружение?',
  'Переживали ли Вы состояние ненужности?',
  'Приходилось ли Вам скрывать истинные мотивы для достижения своих целей?',
  'Окружающие люди по отношению к Вам бывали враждебно настроены?',
  'Вам приходилось хлопотать о материальной помощи у близкого окружения?',
  'Вас оставляли без необходимого внимания родные, друзья?',
  'Можете ли Вы сказать о себе, что Вы ранимы и обидчивы?',
  'Вы страдали от недостаточно почтительного отношения к себе?',
  'Играть роль жертвы, если требуют обстоятельства, благоразумно?',
  'Вам говорили, что у Вас низкая самооценка?',
  'Окружающие люди проявляли недостаточную заботу о Вас?',
  'Другие люди казались Вам более привлекательными, чем Вы сами?',
];

const questions: SeedSection['questions'] = statements.map((text, index) => ({
  code: `test_1925_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1925',
  title: 'Тип ролевой виктимности',
  description: 'Опросник оценивает выраженность двух форм ролевой виктимности: игровой роли жертвы, связанной с манипулятивным использованием позиции жертвы, и социальной роли жертвы, связанной с аутсайдерством и переживанием пренебрежения. Предназначен для психически здоровых людей от 14 лет; помогает исследовать латентные ролевые модели в повседневной жизни и не является клинической диагностикой.',
  questions,
};

const sequence = (start: number, end: number) => Array.from({ length: end - start + 1 }, (_, index) => start + index);
const oddItems = sequence(1, 31).filter(item => item % 2 === 1);
const evenItems = sequence(2, 32).filter(item => item % 2 === 0);

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 3,
  scales: [
    { key: 'game_victim_role', label: 'Игровая роль жертвы', items: oddItems, reverseItems: [], aggregation: 'sum' },
    { key: 'social_victim_role', label: 'Социальная роль жертвы', items: evenItems, reverseItems: [], aggregation: 'sum' },
    { key: 'positive_significance', label: 'Положительная значимость', items: [9, 11, 13, 15, 17, 25, 29, 31], reverseItems: [], aggregation: 'sum' },
    { key: 'negative_significance', label: 'Отрицательная значимость', items: [2, 10, 12, 20, 22, 24, 26, 28], reverseItems: [], aggregation: 'sum' },
    { key: 'role_victimization_total', label: 'Общий балл ролевой виктимности', items: sequence(1, 32), reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: ответ «Нет» на все пункты даёт нулевые суммы по всем ключам',
    answers: Object.fromEntries(sequence(1, 32).map(item => [String(item), 0])),
    expected: { game_victim_role: 0, social_victim_role: 0, positive_significance: 0, negative_significance: 0, role_victimization_total: 0 },
  },
  {
    title: 'Ручная проверка ключа: по 3 балла на пункт дают по 48 на ролевые шкалы, 24 на индексы и 96 всего',
    answers: Object.fromEntries(sequence(1, 32).map(item => [String(item), 3])),
    expected: { game_victim_role: 48, social_victim_role: 48, positive_significance: 24, negative_significance: 24, role_victimization_total: 96 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'odintsova-radchikova-role-victimization-2012-32-item-v1',
};
