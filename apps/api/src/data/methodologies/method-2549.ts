import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const happinessOptions = [
  { value: '10', label: 'В высшей степени счастливым' },
  { value: '9', label: 'Очень счастливым' },
  { value: '8', label: 'Довольно-таки счастливым' },
  { value: '7', label: 'Серединка на половинку' },
  { value: '6', label: 'Иногда счастливым' },
  { value: '5', label: 'Нейтральным (ни счастливым, ни несчастным)' },
  { value: '4', label: 'Слегка несчастным (чуть ниже нейтрального уровня)' },
  { value: '3', label: 'Пожалуй, несчастным (жизнь немного тосклива)' },
  { value: '2', label: 'Довольно-таки несчастным (испытываю лёгкую подавленность)' },
  { value: '1', label: 'Глубоко несчастным (депрессия, подавленность)' },
  { value: '0', label: 'В высшей степени несчастным (острая депрессия сопровождает меня постоянно)' },
];

const questions: SeedSection['questions'] = [
  {
    code: 'test_2567_1',
    text: 'Насколько счастливым или несчастным вы чувствуете себя в целом? Отметьте один вариант ответа — тот, который точнее других отражает ваши ощущения.',
    type: 'single', required: true, options: happinessOptions,
  },
  {
    code: 'test_2567_2',
    text: 'Ответьте на две следующие группы вопросов как можно точнее и так, чтобы в сумме ваши результаты составили 100%. Какую часть времени (в среднем) вы проводите «на подъёме»? — в течение … % всего своего времени. Как часто вы чувствуете себя несчастным? — в течение … % всего своего времени. Насколько обычно для вас нейтральное состояние? — в течение … % всего своего времени.',
    type: 'text', required: true,
  },
  {
    code: 'test_2567_3',
    text: 'В среднем я чувствую себя: счастливым — в течение … % всего своего времени; несчастным — в течение … % времени; ни счастливым, ни несчастным — в … %.',
    type: 'text', required: true,
  },
];

const instrument: SeedSection = {
  code: 'test_2567',
  title: 'Эмоциональный тест Фордайса (русскоязычная версия, 3 вопроса)',
  description: 'Экспресс-методика оценивает субъективное счастье через общую самооценку счастья/несчастья и долю времени в счастливом, несчастном и нейтральном состоянии. Две процентные группы позволяют сопоставить общую оценку эмоционального опыта с оценкой времени в разных состояниях. Подходит для русскоязычных взрослых респондентов; здесь представлена трёхвопросная русская версия Огнева, описанная и исследованная Елшанским и соавторами.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 100,
  scales: [
    { key: 'overall_happiness', label: 'Общая самооценка счастья (пункт I; 0–10)', items: [1], reverseItems: [], aggregation: 'sum' },
    { key: 'group_ii_happy', label: 'Доля счастливого состояния по группе II (%)', items: [2], reverseItems: [], aggregation: 'formula', formula: 'Поле «на подъёме», процент от 0 до 100; три доли группы II должны суммироваться до 100.' },
    { key: 'group_ii_unhappy', label: 'Доля несчастного состояния по группе II (%)', items: [2], reverseItems: [], aggregation: 'formula', formula: 'Поле «чувствую себя несчастным», процент от 0 до 100; три доли группы II должны суммироваться до 100.' },
    { key: 'group_ii_neutral', label: 'Доля нейтрального состояния по группе II (%)', items: [2], reverseItems: [], aggregation: 'formula', formula: 'Поле нейтрального состояния, процент от 0 до 100; три доли группы II должны суммироваться до 100.' },
    { key: 'group_iii_happy', label: 'Доля счастливого состояния по группе III (%)', items: [3], reverseItems: [], aggregation: 'formula', formula: 'Поле «счастливым», процент от 0 до 100; три доли группы III должны суммироваться до 100.' },
    { key: 'group_iii_unhappy', label: 'Доля несчастного состояния по группе III (%)', items: [3], reverseItems: [], aggregation: 'formula', formula: 'Поле «несчастным», процент от 0 до 100; три доли группы III должны суммироваться до 100.' },
    { key: 'group_iii_neutral', label: 'Доля нейтрального состояния по группе III (%)', items: [3], reverseItems: [], aggregation: 'formula', formula: 'Поле «ни счастливым, ни несчастным», процент от 0 до 100; три доли группы III должны суммироваться до 100.' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: нейтральный ответ и процентные доли 50/20/30',
    answers: { '1': 5, '2': '50, 20, 30', '3': '50, 20, 30' },
    expected: { overall_happiness: 5 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['meaning-satisfaction'],
  scoringConfig,
  validationCases,
  formulaVersion: 'fordyce-emotions-questionnaire-ognev-3q-ru-v1',
};
