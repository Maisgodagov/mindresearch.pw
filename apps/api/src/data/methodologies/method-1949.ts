import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Совершенно не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Не совсем согласен' },
  { value: '4', label: 'Не могу решить' },
  { value: '5', label: 'Почти согласен' },
  { value: '6', label: 'Согласен' },
  { value: '7', label: 'Совершенно согласен' },
];

const items: [string, boolean][] = [
  ['Она проявляет ко мне интерес, всегда настроена позитивно, готова проводить со мной время.', false],
  ['Она не уважает мои взгляды и мнения: больше настаивает на своих желаниях.', true],
  ['Она помогает, поддерживает, присутствует рядом, когда это необходимо; пытается удовлетворить мои потребности.', false],
  ['Она чувствительна и внимательна к моим чувствам.', false],
  ['У неё нет достойных восхищения или уважения талантов, способностей и достижений.', true],
  ['Она не даёт мне безусловную любовь.', true],
  ['Она не открыта и не восприимчива к моим чувствам.', true],
  ['Она злой человек.', true],
  ['Она способствует качественному и открытому, доверительному общению.', false],
  ['Она не всегда честная, может прибегать к лжи.', true],
  ['Она делает много для того, чтобы наши отношения были на равных.', false],
  ['Она заботливая, способная мне сострадать.', false],
  ['Она не обладает достойными восхищения или уважения моральными качествами, а именно: достоинство, терпение, самообладание, здравый смысл, преданность делу.', true],
  ['Она меня успокаивает, помогает мне чувствовать себя комфортно.', false],
  ['Она следует золотому правилу (не делайте другим того, чего вы не желаете для себя, и поступайте с другими так, как хотели бы, чтобы поступали с вами).', false],
  ['Она часто говорит обидные слова или делает обидные действия.', true],
  ['Она беспокоится о других людях (животных) и хочет защищать их.', false],
  ['Она не предана мне.', true],
  ['Она – та, на кого я равняюсь, та, кем я горжусь и в кого верю.', false],
  ['Она не понимает меня и не сочувствует.', true],
];

const questions: SeedSection['questions'] = items.map(([text], index) => ({
  code: `test_1965_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1965',
  title: 'Уважение в близких отношениях, RPS-20',
  description: 'Шкала оценивает уважение респондента к романтическому партнёру как ценностное отношение и воспринимаемую значимость партнёра и отношений. Пункты охватывают внимание и поддержку, чуткость, честность, моральные качества, равноправие и уважительное общение. Подходит взрослым, оценивающим нынешнего партнёра либо партнёра из наиболее значимых прошлых романтических отношений; русская версия — адаптация О. А. Екимчик.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [{
    key: 'respect',
    label: 'Уважение к партнёру (сумма; выше — больше уважения)',
    items: Array.from({ length: 20 }, (_, index) => index + 1),
    reverseItems: items.flatMap(([_, reverse], index) => reverse ? [index + 1] : []),
    aggregation: 'sum',
  }],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: все ответы 4 дают 80; реверсивные пункты остаются 4',
    answers: Object.fromEntries(Array.from({ length: 20 }, (_, index) => [String(index + 1), 4])),
    expected: { respect: 80 },
  },
  {
    title: 'Ручная проверка: все прямые ответы 7, все реверсивные 1 дают максимум 140',
    answers: Object.fromEntries(items.map(([_, reverse], index) => [String(index + 1), reverse ? 1 : 7])),
    expected: { respect: 140 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'rps-20-frei-shaver-2002-ekimchik-ru-v1',
};
