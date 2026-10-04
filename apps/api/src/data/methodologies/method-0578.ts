import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const items = [
  '…чтобы учеба (работа) доставляла мне удовольствие, и изменения в ней не создавали дополнительных хлопот',
  '…встречаться и общаться с приятными мне людьми',
  '…предчувствовать надвигающиеся события и получать удовольствие от самостоятельного познания жизни',
  '…вести активный образ жизни и быть удовлетворенным своей готовностью к будущему',
  '…управлять хотя бы кем-нибудь',
  '…достигать поставленных целей в своей учебе (работе)',
  '…общаться с новыми интересными людьми',
  '…постоянно расширять свой кругозор',
  '…быть готовым принимать решения, имеющие последствия для окружающих меня людей',
  '…занять заметное положение в обществе',
  '…чтобы мои способности ярко проявлялись в учебе (работе)',
  '…быть тактичным в общении',
  '…познать смысл жизни',
  '…знать свои возможности в предстоящих переменах',
  '…достичь сотрудничества с управляемым мною коллективом',
];

const needLabels = [
  'Потребность в безопасности и в удовольствии',
  'Потребность в эмоциональном общении',
  'Ориентировочная потребность и потребность в свободе',
  'Потребность в активности и готовности к будущему',
  'Потребность в доминировании',
  'Потребность в достижении',
  'Потребность в эмоциональном насыщении',
  'Потребность в познании',
  'Потребность в подготовленности',
  'Потребность в статусе',
  'Потребность быть личностью',
  'Нравственно-эстетические потребности',
  'Потребность в смысле жизни',
  'Потребность в самовыражении',
  'Потребность в управлении',
];

const pairs: { first: number; second: number }[] = [];
for (let first = 0; first < items.length; first += 1) {
  for (let second = first + 1; second < items.length; second += 1) pairs.push({ first, second });
}

const questions: SeedSection['questions'] = pairs.map(({ first, second }, index) => ({
  code: `test_609_${index + 1}`,
  text: `Я хочу… Что для вас предпочтительнее: ${items[first]} или ${items[second]}? Выберите одно утверждение.`,
  type: 'single',
  required: true,
  options: [
    { value: String(first + 1), label: items[first].replace(/^…/, '') },
    { value: String(second + 1), label: items[second].replace(/^…/, '') },
  ],
}));

export const instrument: SeedSection = {
  code: 'test_609',
  title: 'Методика для диагностики актуальных потребностей личности',
  description: 'Методика А. В. Капцова оценивает относительную выраженность 15 актуальных потребностей через вынужденный выбор между попарно сопоставляемыми желаниями. Потребности объединены в психофизиологический, социальный и высший уровни, а также соотнесены с трудом, общением, познанием, рекреацией и управлением. Профиль помогает автору опроса увидеть, какие потребности чаще получают предпочтение у взрослого респондента в момент обследования; авторская публикация приводит нормы для возрастных групп 16–18, 19–24, 25–39 и 40–65 лет отдельно для мужчин и женщин.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 1,
  scales: needLabels.map((label, index) => ({
    key: `need_${index + 1}`,
    label,
    items: pairs.flatMap((pair, pairIndex) => pair.first === index || pair.second === index ? [pairIndex + 1] : []),
    reverseItems: [],
    aggregation: 'count-option' as const,
    optionValue: String(index + 1),
  })),
};

const allFirstNeedAnswers = Object.fromEntries(pairs.map((_, index) => [String(index + 1), '1']));
const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: выбор утверждения 1 во всех 14 парах с ним даёт 14 выборов потребности 1',
    answers: allFirstNeedAnswers,
    expected: Object.fromEntries(needLabels.map((_, index) => [`need_${index + 1}`, index === 0 ? 14 : 0])),
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'kaptsov-actual-needs-2008-pairwise-v1',
};
