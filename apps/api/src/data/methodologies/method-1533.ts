import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const agreementOptions = [
  { value: '1', label: 'Совершенно не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Скорее не согласен, чем согласен' },
  { value: '4', label: 'Нейтрально' },
  { value: '5', label: 'Скорее согласен, чем не согласен' },
  { value: '6', label: 'Согласен' },
  { value: '7', label: 'Совершенно согласен' },
];

const frequencyOptions = [
  { value: '1', label: 'Никогда' },
  { value: '2', label: 'Очень редко' },
  { value: '3', label: 'Редко' },
  { value: '4', label: 'Иногда' },
  { value: '5', label: 'Время от времени' },
  { value: '6', label: 'Часто' },
  { value: '7', label: 'Очень часто' },
];

const itemTexts = [
  'В моем шкафу есть нераспакованные покупки.',
  'Друзья могут назвать меня шопоголиком.',
  'Большая часть моей жизни сосредоточена вокруг покупок.',
  'Я покупаю вещи, в которых нет необходимости.',
  'Я покупаю вещи, которые не планировал покупать.',
  'Мне трудно контролировать свое желание покупать.',
];

const questions: SeedSection['questions'] = itemTexts.map((text, index) => ({
  code: `test_1550_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: index < 3 ? agreementOptions : frequencyOptions,
}));

const instrument: SeedSection = {
  code: 'test_1550',
  title: 'Ричмондская шкала компульсивного покупательского поведения',
  description: 'Русскоязычная адаптация О. С. Посыпановой оценивает склонность к компульсивным покупкам у взрослых: навязчивую сосредоточенность на покупках, повторные и незапланированные приобретения, а также трудность контроля покупательского желания. Результат помогает автору опроса изучать общий уровень выраженности поведения и отдельно обсессивно-компульсивный и импульсивный компоненты; адаптация проверялась на российских участниках 18–73 лет.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'total', label: 'Общий показатель компульсивного покупательского поведения', items: [1, 2, 3, 4, 5, 6], reverseItems: [], aggregation: 'sum' },
    { key: 'obsessiveCompulsive', label: 'Обсессивно-компульсивные покупки', items: [1, 2, 3], reverseItems: [], aggregation: 'sum' },
    { key: 'impulsive', label: 'Импульсивные покупки', items: [4, 5, 6], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная сверка: все ответы по 1 дают минимальные суммы',
    answers: { '1': 1, '2': 1, '3': 1, '4': 1, '5': 1, '6': 1 },
    expected: { total: 6, obsessiveCompulsive: 3, impulsive: 3 },
  },
  {
    title: 'Ручная сверка: ответы 1–6 дают сумму 21, подшкалы 6 и 15',
    answers: { '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6 },
    expected: { total: 21, obsessiveCompulsive: 6, impulsive: 15 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'posypanova-richmond-compulsive-buying-2024-v1',
};
