import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const importance = [
  { value: '1', label: 'Очень важно' },
  { value: '2', label: 'Скорее важно' },
  { value: '3', label: 'Затрудняюсь ответить' },
  { value: '4', label: 'Скорее не важно' },
  { value: '5', label: 'Совсем не важно' },
];
const agreement = [
  { value: '1', label: 'Полностью согласен' },
  { value: '2', label: 'Скорее согласен' },
  { value: '3', label: 'Затрудняюсь ответить' },
  { value: '4', label: 'Скорее не согласен' },
  { value: '5', label: 'Совершенно не согласен' },
];
const frequency13 = [
  { value: '1', label: 'Никогда' },
  { value: '2', label: 'Редко' },
  { value: '3', label: 'Время от времени' },
  { value: '4', label: 'Часто' },
  { value: '5', label: 'Постоянно' },
];
const frequency14 = [
  { value: '1', label: 'Очень редко' },
  { value: '2', label: 'Редко' },
  { value: '3', label: 'Время от времени' },
  { value: '4', label: 'Часто' },
  { value: '5', label: 'Очень часто' },
];

const prompts = [
  'На идеальной работе иметь достаточно времени на личную или семейную жизнь.',
  'На идеальной работе иметь благоприятные условия работы (хорошая вентиляция и освещение, просторное помещение и т. п.).',
  'На идеальной работе иметь хорошие деловые отношения с вашим непосредственным начальником.',
  'На идеальной работе быть уверенным, что вы смените работу только по собственному желанию.',
  'На идеальной работе работать с людьми, которые умеют сотрудничать.',
  'На идеальной работе работать с начальником, который советуется с вами при принятии решений.',
  'На идеальной работе иметь возможность продвигаться по службе.',
  'На идеальной работе иметь такую работу, в которой присутствуют элементы риска и разнообразия.',
  'Черта характера: личная уравновешенность и стабильность.',
  'Черта характера: бережливость.',
  'Черта характера: упорство (настойчивость).',
  'Черта характера: уважение традиций.',
  'Как часто вы нервничаете или чувствуете напряжение на работе (на учебе)?',
  'Судя по вашему опыту, как часто вы замечаете, что подчиненные боятся выразить свое несогласие с начальником?',
  'Большинству людей можно доверять.',
  'Можно быть хорошим руководителем, не имея точных ответов на большинство вопросов, которые могут задать подчиненные.',
  'Нельзя допускать, чтобы у подчиненного было два руководителя.',
  'Конкуренция между служащими обычно приносит больше вреда, чем пользы.',
  'Правила, принятые в организации, не должны нарушаться, даже если работник думает, что это в интересах организации.',
  'Если люди терпят неудачу в жизни, чаще всего это следствие их собственных ошибок.',
];
const questions: SeedSection['questions'] = prompts.map((text, index) => ({
  code: `test_83_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: index < 12 ? importance : index === 12 ? frequency13 : index === 13 ? frequency14 : agreement,
}));

export const instrument: SeedSection = {
  code: 'test_83',
  title: 'Модуль исследования ценностей, VSM-94',
  description: "Опросник Хофстеде описывает культурные ценности по нескольким измерениям, включая дистанцию власти, индивидуализм и отношение к неопределённости. Его используют для сопоставления групп и культур; индивидуальный результат нельзя трактовать как личностную характеристику.",
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'PDI', label: 'Дистанция власти (Power Distance)', items: [3, 6, 14, 17], reverseItems: [], aggregation: 'sum', weights: { 3: -35, 6: 35, 14: 25, 17: -20 } },
    { key: 'IDV', label: 'Индивидуализм — коллективизм (Individualism)', items: [1, 2, 4, 8], reverseItems: [], aggregation: 'sum', weights: { 1: -50, 2: 30, 4: 20, 8: -25 } },
    { key: 'MAS', label: 'Маскулинность — фемининность (Masculinity)', items: [5, 7, 15, 20], reverseItems: [], aggregation: 'sum', weights: { 5: 60, 7: -20, 15: 20, 20: -70 } },
    { key: 'UAI', label: 'Избегание неопределённости (Uncertainty Avoidance)', items: [13, 16, 18, 19], reverseItems: [], aggregation: 'sum', weights: { 13: 25, 16: 20, 18: -50, 19: -15 } },
    { key: 'LTO', label: 'Долгосрочная ориентация (Long-Term Orientation)', items: [10, 12], reverseItems: [], aggregation: 'sum', weights: { 10: -20, 12: 20 } },
  ],
};

const answers = (value: number) => Object.fromEntries(Array.from({ length: 20 }, (_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Вручную рассчитанный контроль: во всех пунктах ответ 3; постоянные формул учтены', answers: answers(3), expected: { PDI: -5, IDV: 55, MAS: 70, UAI: 0, LTO: 40 } },
  { title: 'Проверка крайних ответов: во всех пунктах ответ 1', answers: answers(1), expected: { PDI: -15, IDV: 105, MAS: 90, UAI: 100, LTO: 40 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'hofstede-vsm-94-1999-lto-russian-adaptation-v1',
};
