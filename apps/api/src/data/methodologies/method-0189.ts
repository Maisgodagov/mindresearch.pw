import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'Не относится ко мне' },
  { value: '1', label: 'Не беспокоит меня' },
  { value: '2', label: 'Почти никогда не беспокоит меня' },
  { value: '3', label: 'Иногда беспокоит меня' },
  { value: '4', label: 'Сильно беспокоит меня' },
  { value: '5', label: 'Очень сильно беспокоит меня' },
];

const items = [
  'Мне часто кажется, что люди, которые должны помогать, на самом деле не обращают на меня никакого внимания',
  'Меня беспокоит, когда люди заставляют меня быть таким/ой, как все',
  'Из-за моей национальности я не получаю тех оценок, которые заслуживаю',
  'Многие верят, что люди моей национальности действуют, думают определенным образом, и они относятся ко мне так, как будто это правда',
  'Я чувствую, что из-за моей национальности другие иногда не включают меня в то, чем занимаются (в свои игры, например)',
  'У меня больше того, что мне мешает, чем у большинства других людей',
  'Мне трудно рассказать своим друзьям, что я на самом деле чувствую',
  'Я чувствую себя плохо, когда другие шутят о людях моей национальности',
  'Мне трудно быть вдали от страны, в которой я жил/а раньше',
  'Здесь, в России, я не чувствую себя дома',
  'Люди думают, что я стесняюсь, когда на самом деле мне просто трудно говорить по-русски',
  'Я много думаю о моей родине и ее культуре',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_221_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_221',
  title: 'Детский опросник аккультурационного стресса (ASIC), русская адаптация О. Е. Хухлаева',
  description: 'ASIC оценивает выраженность аккультурационного стресса у детей от 10 лет, адаптирующихся к новой культурной среде. Охватывает воспринимаемую дискриминацию (отношение окружающих, связанное с групповой принадлежностью) и стресс миграции (трудности общения, языка и чувства дома); автор опроса может использовать отдельные показатели этих аспектов и общий средний балл.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 5,
  scales: [
    { key: 'perceivedDiscrimination', label: 'Воспринимаемая дискриминация', items: [1, 2, 3, 4, 5, 6, 7, 8], reverseItems: [], aggregation: 'sum' },
    { key: 'migrationStress', label: 'Стресс, связанный с миграцией', items: [9, 10, 11, 12], reverseItems: [], aggregation: 'sum' },
    { key: 'overallMean', label: 'Общий показатель аккультурационного стресса (среднее)', items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы 0: проверка кодирования «не относится ко мне»',
    answers: Object.fromEntries(Array.from({ length: 12 }, (_, i) => [String(i + 1), 0])),
    expected: { perceivedDiscrimination: 0, migrationStress: 0, overallMean: 0 },
  },
  {
    title: 'Проверка сумм шкал 1–8 и 9–12 и общего среднего',
    answers: Object.fromEntries(Array.from({ length: 12 }, (_, i) => [String(i + 1), i < 8 ? 2 : 4])),
    expected: { perceivedDiscrimination: 16, migrationStress: 16, overallMean: 8 / 3 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'asic-khukhlaev-russian-12item-sum-subscales-mean-total-v1',
};
