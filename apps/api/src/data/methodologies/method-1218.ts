import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const items = [
  'Я легко отвлекался (от моего партнера) на другие вещи.',
  '(Мой партнер) легко отвлекался на другие вещи во время общения.',
  'Я был сосредоточен (на моем партнере) на протяжении всего общения.',
  '(Мой партнер) был сосредоточен на мне на протяжении всего общения.',
  'Я не был полностью сосредоточен на моем партнере во время разговора.',
  '(Мой партнер) не был полностью сосредоточен на мне в разговоре.',
  'Мои мысли были понятны (моему партнеру).',
  'Мысли (моего партнера) были понятны мне.',
  'Мне было понятно то, о чем говорил (мой партнер).',
  '(Моему партнеру) было понятно то, о чем говорил я.',
  'Мне было трудно понять (моего партнера).',
  '(Моему партнеру) было трудно понять меня.',
  'Я могу сказать, какие чувства испытывал (мой партнер).',
  '(Мой партнер) может сказать, какие чувства испытывал я.',
  'Мне было неясно, что чувствовал во время разговора (мой партнер).',
  'Мои эмоции и чувства не были ясны (моему партнеру) во время разговора.',
  'Я могу точно описать чувства (моего партнера).',
  '(Мой партнер) может точно описать мои чувства.',
  'Иногда я попадал под влияние настроения (моего партнера).',
  '(Мой партнер) иногда попадал под влияние моего настроения.',
  'Чувства (моего партнера) влияли на атмосферу нашего общения.',
  'Мои чувства влияли на атмосферу нашего общения.',
  'Мнение (моего партнера) повлияло на мои чувства.',
  'Мое мнение повлияло на чувства (моего партнера).',
  'Мои реакции часто были ответом на поведение (моего партнера).',
  'Реакции (моего партнера) часто были ответом на мое поведение.',
  'Я отвечал взаимностью на действия (моего партнера).',
  '(Мой партнер) отвечал взаимностью на мои действия.',
  'Поведение (моего партнера) было тесно связано с моими действиями и поступками.',
  'Мое поведение было тесно связано с действиями и поступками (моего партнера).',
];

const options = [
  { value: '1', label: 'Полностью не согласен' },
  { value: '2', label: 'Умеренно не согласен' },
  { value: '3', label: 'Слегка не согласен' },
  { value: '4', label: 'Нейтрально / не знаю' },
  { value: '5', label: 'Слегка согласен' },
  { value: '6', label: 'Умеренно согласен' },
  { value: '7', label: 'Полностью согласен' },
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1247_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

const instrument: SeedSection = {
  code: 'test_1247',
  title: 'Опросник социального присутствия Networked Minds (русскоязычная версия НИУ ВШЭ СПб)',
  description: 'Методика измеряет субъективное переживание социального присутствия в конкретном разговоре: распределение внимания между собеседниками, взаимное понимание сообщений и эмоций, эмоциональную и поведенческую взаимозависимость. Предназначена для оценки недавнего взаимодействия взрослых участников в очном или опосредованном формате; русскоязычная форма включает пять шкал.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'attention', label: 'Распределение внимания', items: [1, 2, 3, 4, 5, 6], reverseItems: [1, 2, 5, 6], aggregation: 'sum' },
    { key: 'messageUnderstanding', label: 'Понимание сообщений', items: [7, 8, 9, 10, 11, 12], reverseItems: [11, 12], aggregation: 'sum' },
    { key: 'emotionUnderstanding', label: 'Понимание эмоций', items: [13, 14, 15, 16, 17, 18], reverseItems: [15, 16], aggregation: 'sum' },
    { key: 'emotionalInterdependence', label: 'Эмоциональная взаимозависимость', items: [19, 20, 21, 22, 23, 24], reverseItems: [], aggregation: 'sum' },
    { key: 'behavioralInterdependence', label: 'Поведенческая взаимозависимость', items: [25, 26, 27, 28, 29, 30], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: все ответы 1; реверсивные ответы перекодируются в 7',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { attention: 34, messageUnderstanding: 22, emotionUnderstanding: 22, emotionalInterdependence: 6, behavioralInterdependence: 6 },
  },
  {
    title: 'Все ответы нейтральны (4)',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 4])),
    expected: { attention: 24, messageUnderstanding: 24, emotionUnderstanding: 24, emotionalInterdependence: 24, behavioralInterdependence: 24 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'nmspi-ru-hse-spb-faizova-mararitsa-v1',
};
