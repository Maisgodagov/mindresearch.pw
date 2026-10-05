import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'Никогда' },
  { value: '1', label: 'Редко' },
  { value: '2', label: 'Иногда' },
  { value: '3', label: 'Часто' },
  { value: '4', label: 'Очень часто' },
];

const items = [
  'Боль в грудной клетке',
  'Ощущение напряженности',
  'Затуманенное зрение (помутнение зрения)',
  'Приступы головокружения',
  'Дезориентация, утрата контакта с окружающей действительностью',
  'Учащенное или углубленное дыхание',
  'Ощущение нехватки воздуха',
  'Ощущение скованности грудной клетки',
  'Ощущение вздутия в животе',
  'Онемение, покалывание в пальцах',
  'Неспособность глубоко вдохнуть',
  'Скованность рук или пальцев',
  'Напряжение вокруг рта',
  'Холодные руки или ноги',
  'Учащенное сердцебиение',
  'Чувство тревоги',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_798_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_798',
  title: 'Наймигенский опросник для диагностики дисфункционального дыхания',
  description: 'Наймигенский опросник оценивает частоту 16 субъективных симптомов, связанных с дисфункциональным дыханием и гипервентиляционными жалобами: респираторных ощущений, парестезий и других телесных и тревожных проявлений. Русская версия опубликована для взрослых респондентов и применялась в исследовании российской выборки 18–88 лет; она может помочь автору опроса проводить скрининговую оценку выраженности симптоматики и отслеживать её изменения, но сама по себе не устанавливает диагноз.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 4,
  scales: [
    { key: 'respiratory', label: 'Респираторные симптомы', items: [1, 2, 6, 7, 8, 11, 15], reverseItems: [], aggregation: 'sum' },
    { key: 'peripheralTetany', label: 'Периферическая тетания', items: [10, 12, 13, 14], reverseItems: [], aggregation: 'sum' },
    { key: 'centralTetany', label: 'Центральная тетания', items: [1, 3, 4, 5, 9], reverseItems: [], aggregation: 'sum' },
    { key: 'total', label: 'Общий балл', items: items.map((_, index) => index + 1), reverseItems: [], aggregation: 'sum' },
  ],
};

const uniformAnswers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Ручная проверка: нулевые ответы дают нулевые суммы', answers: uniformAnswers(0), expected: { respiratory: 0, peripheralTetany: 0, centralTetany: 0, total: 0 } },
  { title: 'Ручная проверка: по 1 баллу на пункт; суммы равны числу включённых пунктов', answers: uniformAnswers(1), expected: { respiratory: 7, peripheralTetany: 4, centralTetany: 5, total: 16 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'nijmegen-russian-2022-v1',
};
