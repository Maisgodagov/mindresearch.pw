import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'Ни разу' },
  { value: '1', label: 'Иногда' },
  { value: '2', label: 'Умеренно' },
  { value: '3', label: 'Часто' },
  { value: '4', label: 'Очень часто' },
];

const items = [
  'Вам грустно или вы в плохом настроении.',
  'Чувствуете грусть, удручены.',
  'Чувствуете желание расплакаться, слезливость.',
  'Чувствуете уныние.',
  'Испытываете чувство безнадежности.',
  'Имеете низкую самооценку.',
  'Испытываете чувство собственной ничтожности и непригодности.',
  'Испытываете чувство вины или стыда.',
  'Критикуете или обвиняете самого себя.',
  'Испытываете трудности с принятием решений.',
  'Чувствуете потерю интереса к членам семьи, друзьям, коллегам.',
  'Испытываете одиночество.',
  'Проводите меньше времени с семьей или с друзьями.',
  'Чувствуете потерю мотивации.',
  'Чувствуете потерю интереса к работе или другим занятиям.',
  'Избегаете работы и другой деятельности.',
  'Ощущаете потерю удовольствия и нехватку удовлетворения от жизни.',
  'Чувствуете усталость.',
  'Испытываете затруднения со сном или, наоборот, слишком много спите.',
  'Имеете сниженный или, наоборот, повышенный аппетит.',
  'Замечаете потерю интереса к сексу.',
  'Беспокоитесь по поводу своего здоровья.',
  'Имеются ли у вас суицидальные мысли?',
  'Хотели бы вы окончить свою жизнь?',
  'Планируете ли вы навредить себе?',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_925_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

const itemNumbers = items.map((_, index) => index + 1);

export const instrument: SeedSection = {
  code: 'test_925',
  title: 'Опросник депрессии Бернса (BDC, редакция 1996 года; русский перевод А. Когтевой, 2019)',
  description: 'Опросник оценивает выраженность симптомов депрессии за последнюю неделю, включая сегодняшний день: эмоциональные и когнитивные переживания, изменения активности и отношений, физические симптомы, а также суицидальные мысли и планы. Версия включает 25 пунктов и предназначена для самооценки взрослыми и наблюдения за изменениями состояния; результат не является диагнозом.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 4,
  scales: [
    { key: 'total', label: 'Общий балл выраженности симптомов', items: itemNumbers, reverseItems: [], aggregation: 'sum' },
  ],
};

const answers = (value: number) => Object.fromEntries(itemNumbers.map(item => [String(item), value]));
const validationCases: ValidationCase[] = [
  { title: 'Все ответы «Ни разу»', answers: answers(0), expected: { total: 0 } },
  { title: 'Все ответы «Очень часто»', answers: answers(4), expected: { total: 100 } },
  {
    title: 'Ручная проверка суммы: первые 10 пунктов по 1, остальные по 0',
    answers: Object.fromEntries(itemNumbers.map(item => [String(item), item <= 10 ? 1 : 0])),
    expected: { total: 10 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'burns-depression-checklist-25-ru-kogteva-2019-v1',
};
