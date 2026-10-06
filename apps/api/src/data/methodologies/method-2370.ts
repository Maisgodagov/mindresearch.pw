import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Очень редко' },
  { value: '2', label: 'Редко' },
  { value: '3', label: 'Значительную часть времени' },
  { value: '4', label: 'Большую часть времени или постоянно' },
];

const items = [
  'Я чувствую себя более нервным и тревожным, чем обычно',
  'Я испытываю чувство страха совершенно без причины',
  'Я легко огорчаюсь или впадаю в панику',
  'У меня ощущение, что я не могу собраться и взять себя в руки',
  'У меня ощущение полного благополучия, я чувствую, что со мной не случится ничего плохого',
  'Мои руки и ноги дрожат и трясутся',
  'У меня бывают головные боли, боли в шее и спине',
  'Я чувствую разбитость и быстро устаю',
  'Я спокоен, могу сидеть спокойно без особых усилий',
  'У меня бывает ощущение учащенного сердцебиения',
  'У меня бывают приступы головокружения',
  'У меня бывают приступы слабости',
  'Я дышу свободно',
  'Ощущение онемения и покалывания в пальцах рук и ног',
  'Боли в желудке и диспепсические расстройства',
  'Частые позывы на мочеиспускание',
  'Мои руки обычно сухие и теплые',
  'Мое лицо горит и краснеет',
  'Я легко засыпаю и сплю глубоким освежающим сном',
  'Меня мучают ночные кошмары',
];

const reverseItems = [5, 9, 13, 17, 19];
const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2388_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2388',
  title: 'Шкала самооценки тревоги Цунга (SAS), русская адаптация И. А. Бевз',
  description: 'Шкала самоотчёта оценивает выраженность тревоги по эмоциональным переживаниям и соматическим проявлениям: страху и тревожному напряжению, дрожи, утомляемости, сердцебиению, головокружению и другим телесным симптомам. Пять позитивно сформулированных пунктов о спокойствии и благополучии учитываются в обратном направлении. Русская адаптация И. А. Бевз (1999) предназначена для самооценки тревожных симптомов у пациентов; результат помогает количественно описать выраженность симптомов и сам по себе не устанавливает диагноз.',
  questions,
};

const itemNumbers = Array.from({ length: 20 }, (_, index) => index + 1);
const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 4,
  scales: [
    { key: 'raw', label: 'Сырой суммарный балл', items: itemNumbers, reverseItems, aggregation: 'sum' },
    { key: 'index', label: 'Индекс тревоги (сырой балл × 1,25)', items: itemNumbers, reverseItems, aggregation: 'sum', weights: Object.fromEntries(itemNumbers.map(item => [item, 1.25])) },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: ответы 1 на прямых пунктах и 4 на обратных дают минимальный сырой балл',
    answers: Object.fromEntries(itemNumbers.map(item => [String(item), reverseItems.includes(item) ? 4 : 1])),
    expected: { raw: 20, index: 25 },
  },
  {
    title: 'Ручная проверка: ответы 1 на всех пунктах; пять обратных пунктов инвертируются',
    answers: Object.fromEntries(itemNumbers.map(item => [String(item), 1])),
    expected: { raw: 35, index: 43.75 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['mood-anxiety'],
  scoringConfig,
  validationCases,
  formulaVersion: 'zung-sas-bevz-1999-raw-sum-index-times-1_25-reverse-5-9-13-17-19-v1',
};
