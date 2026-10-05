import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const answers = [
  { value: '1', label: 'Да, это правда' },
  { value: '2', label: 'Скорее, да' },
  { value: '3', label: 'Не уверен' },
  { value: '4', label: 'Скорее, нет' },
  { value: '5', label: 'Нет, это неправда' },
];

const items = [
  'Я чувствую себя здоровым.',
  'Физически я мало на что способен.',
  'Я чувствую себя активным.',
  'Всё, что я делаю, доставляет мне удовольствие.',
  'Я чувствую себя усталым.',
  'Мне кажется, я многое успеваю за день.',
  'Когда я занимаюсь чем-либо, я могу сконцентрироваться на этом.',
  'Физически я способен на многое.',
  'Я боюсь дел, которые мне необходимо сделать.',
  'Я думаю, что за день выполняю очень мало дел.',
  'Я могу хорошо концентрировать внимание.',
  'Я чувствую себя отдохнувшим.',
  'Мне требуется много усилий для концентрации внимания.',
  'Физически я чувствую себя в плохом состоянии.',
  'У меня много планов.',
  'Я быстро устаю.',
  'Я очень мало успеваю сделать.',
  'Мне кажется, что я ничего не делаю.',
  'Мои мысли легко рассеиваются.',
  'Физически я чувствую себя в прекрасном состоянии.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1703_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: answers,
}));

export const instrument: SeedSection = {
  code: 'test_1703',
  title: 'Субъективная шкала оценки астении (MFI-20)',
  description: 'MFI-20 измеряет выраженность усталости по пяти отдельным аспектам: общей и физической усталости, снижению активности, снижению мотивации и психической усталости (трудностям концентрации). Профиль подшкал помогает автору опроса описать разные стороны субъективной усталости у взрослых и клинических или неклинических групп; русская версия на Psytests опубликована без установленного автора перевода и сведений об адаптации.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'general_fatigue', label: 'Общая усталость', items: [1, 5, 12, 16], reverseItems: [12], aggregation: 'sum' },
    { key: 'physical_fatigue', label: 'Физическая усталость', items: [2, 8, 14, 20], reverseItems: [2, 8, 20], aggregation: 'sum' },
    { key: 'reduced_activity', label: 'Снижение активности', items: [3, 6, 10, 17], reverseItems: [3, 6], aggregation: 'sum' },
    { key: 'reduced_motivation', label: 'Снижение мотивации', items: [4, 9, 15, 18], reverseItems: [4, 15], aggregation: 'sum' },
    { key: 'mental_fatigue', label: 'Психическая усталость', items: [7, 11, 13, 19], reverseItems: [7, 11], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы по 1: прямые пункты минимальны, позитивно сформулированные реверсируются',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { general_fatigue: 8, physical_fatigue: 16, reduced_activity: 12, reduced_motivation: 12, mental_fatigue: 12 },
  },
  {
    title: 'Все ответы по 5: прямые пункты максимальны, позитивно сформулированные реверсируются',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 5])),
    expected: { general_fatigue: 18, physical_fatigue: 8, reduced_activity: 12, reduced_motivation: 12, mental_fatigue: 12 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'mfi-20-smets-1995-five-subscales-reverse-positive-v1',
};
