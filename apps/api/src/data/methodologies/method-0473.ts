import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const answers = [
  { value: '1', label: 'Да, верно' },
  { value: '2', label: 'Скорее, верно' },
  { value: '3', label: 'Скорее, неверно' },
  { value: '4', label: 'Нет, неверно' },
];

const items = [
  'Критика и замечания очень задевают меня.',
  'Меня беспокоит чувство, что я в чем-то хуже других.',
  'Чтобы чувствовать себя уверенно, необходимо знать, что ждёт тебя в будущем.',
  'Мне осложняет работу осознание того, что время на её выполнение ограничено.',
  'От выполнения умственной работы я устаю больше, чем от физической.',
  'Посторонний шум мешает мне сосредоточиться над выполняемой работой.',
  'Монотонная работа меня раздражает.',
  'Одиночество тяготит меня.',
  'Мне страшно смотреть вниз с высоты.',
  'В жизни слишком много препятствий и ограничений, которые меня раздражают.',
  'Я не люблю неожиданностей.',
  'Мою жизнь «отравляют» одни и те же проблемы.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_507_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: answers,
}));

export const instrument: SeedSection = {
  code: 'test_507',
  title: 'Краткая шкала стрессоустойчивости (КШСУ)',
  description: 'КШСУ Е. В. Распопина — краткая одномерная шкала для экспресс-оценки общей стрессоустойчивости у взрослых от 17 лет. Пункты охватывают реакции на критику, самооценку, неопределённость, дефицит времени, умственную и физическую нагрузку, монотонность, одиночество, угрозу, повседневные препятствия и повторяющиеся проблемы. Подходит для скрининга, массовых и прикладных исследований, консультирования; не предназначена для экспертного профотбора.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 4,
  scales: [
    { key: 'stress_resistance', label: 'Стрессоустойчивость', items: Array.from({ length: 12 }, (_, index) => index + 1), reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  { title: 'Все ответы «Да, верно»: первичная сумма 12', answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])), expected: { stress_resistance: 12 } },
  { title: 'Все ответы «Нет, неверно»: первичная сумма 48', answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 4])), expected: { stress_resistance: 48 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'kshsu-raspopin-2013-v1',
};
