import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'Совсем нет' },
  { value: '1', label: 'В некоторой степени' },
  { value: '2', label: 'В значительной степени' },
  { value: '3', label: 'В высокой степени' },
];

const items = [
  'Я стал хуже переносить стресс и чаще испытываю стресс, чем обычно.',
  'Я стал более агрессивным, чаще срываюсь на окружающих и с трудом сдерживаю себя.',
  'Я чувствую себя выгоревшим и опустошённым.',
  'Я постоянно устаю без понятной причины.',
  'Я стал более раздражительным, беспокойным и разочарованным.',
  'Мне трудно принимать обычные повседневные решения.',
  'У меня проблемы со сном: я сплю слишком много или слишком мало, беспокойно, долго не могу заснуть или просыпаюсь слишком рано.',
  'Особенно по утрам я чувствую тревогу, беспокойство или внутреннее напряжение.',
  'Я чрезмерно употребляю алкоголь или лекарства, чтобы успокоиться и расслабиться; становлюсь чрезмерно активным или снимаю напряжение напряжённой работой, беспокойными физическими упражнениями; ем слишком мало или слишком много.',
  'Изменилось ли моё поведение так, что ни я сам, ни другие меня не узнают и со мной стало трудно иметь дело?',
  'Чувствовал ли я сам или замечали ли другие, что я подавлен, настроен негативно или безнадёжно смотрю на всё?',
  'Замечал ли я сам или замечали ли другие, что я стал чаще жалеть себя, жаловаться или выглядеть жалким?',
  'Есть ли среди моих кровных родственников склонность к злоупотреблению алкоголем или лекарствами, депрессии или подавленности, попыткам самоубийства либо рискованному поведению?',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_202_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_202',
  title: 'Готландская шкала мужской депрессии (GSMD)',
  description: 'Скрининговая шкала оценивает выраженность депрессивных симптомов у мужчин, включая стресс, раздражительность и агрессивное отреагирование, истощение, нарушения сна, тревогу, изменения активности и пищевого поведения, безнадёжность, жалобы и семейную отягощённость. Полезна автору опроса для изучения как типичных, так и внешне проявляющихся поведенческих аспектов мужской депрессии; исходная шкала рассчитана на мужчин.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 3,
  scales: [
    { key: 'distress', label: 'Дистресс', items: [1, 2, 5, 8, 9, 10, 12], reverseItems: [], aggregation: 'sum' },
    { key: 'depression', label: 'Депрессивные симптомы', items: [3, 4, 6, 7, 11, 13], reverseItems: [], aggregation: 'sum' },
    { key: 'total', label: 'Общий балл GSMD', items: Array.from({ length: 13 }, (_, i) => i + 1), reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все пункты «Совсем нет»: нулевые субшкалы и общий балл',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 0])),
    expected: { distress: 0, depression: 0, total: 0 },
  },
  {
    title: 'Все пункты в высокой степени: максимальные суммы',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 3])),
    expected: { distress: 21, depression: 18, total: 39 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'gotland-male-depression-scale-zierau-2002-autonomov-2014-13item-sums-v1',
};
