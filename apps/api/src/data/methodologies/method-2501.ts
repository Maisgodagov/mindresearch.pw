import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'почти никогда (менее 5 % времени/случаев)' },
  { value: '1', label: 'иногда (менее 25% времени/случаев)' },
  { value: '2', label: 'часто (менее 50 % времени/случаев)' },
  { value: '3', label: 'чаще всего (более 50% времени/случаев)' },
  { value: '4', label: 'почти всегда (более 95 % времени/случаев)' },
];

const statements = [
  'Не идет на контакт',
  'Предпочитает находиться в уединении',
  'Не реагирует на то, что происходит вокруг',
  'Не проявляет инициативы во взаимодействии и общении',
  'Не наблюдает за тем, что делают другие',
  'Проявляет беспокойство при вмешательстве в его занятия',
  'Проявляет тревогу без видимой причины',
  'Беспокоится при изменении обычного распорядка.',
  'Расстраивается при расставании со значимым взрослым',
  'Выглядит скованным',
  'Много плачет, ноет',
  'Быстро устает, вялый',
  'Отказывается от еды',
  'Выглядит несчастным, грустным или подавленным.',
  'Отсутствует интерес к окружающему, в том числе - к играм',
  'Самоповреждающее поведение (грызет палец, бьёт себя по голове и т.д.)',
  'Проявляет агрессию без видимой причины к сверстникам и взрослым',
  'Совершает стереотипные движения (раскачивается, вертит головой, ходит по кругу и т.д.)',
  'Совершает стереотипные действия по отношению к своему телу (сосет палец, трогает половые органы и др.)',
  'Проявляет разрушающее поведение по отношению к предметам',
  'Внезапно меняется настроение',
  'Не может сидеть или стоять спокойно, много бегает',
  'Перескакивает с одного дела на другое, ничего не завершая',
  'Не может долго удерживать внимание на чем-либо, например - слушать, когда читают или рассказывают',
  'Не может быстро успокоиться',
];

const questions: SeedSection['questions'] = statements.map((statement, index) => ({
  code: `test_2519_${index + 1}`,
  text: statement,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2519',
  title: 'Шкала эмоционального неблагополучия и атипичного поведения дошкольников',
  description: 'Шкала предназначена для оценки родителями и воспитателями эмоционального неблагополучия и атипичных форм поведения детей раннего и дошкольного возраста. Она охватывает неконтактность, тревогу, депрессивные проявления, дезадаптивное поведение и гиперактивность/расторможенность; результаты помогают автору опроса увидеть выраженность этих аспектов по отдельности и в целом.',
  categoryIds: ['parenting-child'],
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 4,
  scales: [
    { key: 'noncontact', label: 'Неконтактность', items: [1, 2, 3, 4, 5], reverseItems: [], aggregation: 'sum' },
    { key: 'anxiety', label: 'Тревога', items: [6, 7, 8, 9, 10], reverseItems: [], aggregation: 'sum' },
    { key: 'depression', label: 'Депрессия', items: [11, 12, 13, 14, 15], reverseItems: [], aggregation: 'sum' },
    { key: 'maladaptive_behavior', label: 'Дезадаптивное поведение', items: [16, 17, 18, 19, 20], reverseItems: [], aggregation: 'sum' },
    { key: 'hyperactivity_disinhibition', label: 'Гиперактивность/расторможенность', items: [21, 22, 23, 24, 25], reverseItems: [], aggregation: 'sum' },
    { key: 'total', label: 'Полная шкала', items: Array.from({ length: 25 }, (_, index) => index + 1), reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: все ответы «почти никогда» дают нулевые суммы по всем шкалам',
    answers: Object.fromEntries(Array.from({ length: 25 }, (_, index) => [String(index + 1), 0])),
    expected: { noncontact: 0, anxiety: 0, depression: 0, maladaptive_behavior: 0, hyperactivity_disinhibition: 0, total: 0 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'kazmin-konovko-salnikova-tupitsina-fedina-senap-2014-v1',
};
