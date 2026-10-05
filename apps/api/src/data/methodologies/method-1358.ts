import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'Совсем нет' },
  { value: '1', label: 'Немного' },
  { value: '2', label: 'Довольно сильно' },
  { value: '3', label: 'Очень сильно' },
];

const prompts = [
  'заставляли вас стыдиться себя.',
  'заставляли вас чувствовать себя виноватым.',
  'заставляли вас критиковать себя.',
  'заставляли вас чувствовать себя неудачником.',
  'расстраивали вас.',
  'вызывали у вас беспокойство.',
  'мешали принимать пищу с семьей или друзьями.',
  'делали сложным прием пищи в присутствии других людей.',
  'мешали вам заниматься делами, которые вам обычно нравились.',
  'не позволяли вам проводить время с друзьями.',
  'мешали вашим отношениям с другими людьми.',
  'делали вас рассеянным.',
  'делали вас забывчивым.',
  'влияли на вашу способность принимать каждодневные решения.',
  'влияли на вашу трудоспособность на работе (если применимо).',
  'мешали вам сконцентрироваться.',
];

const questions: SeedSection['questions'] = prompts.map((prompt, index) => ({
  code: `test_1386_${index + 1}`,
  text: `За последний месяц, в какой степени ваши пищевые привычки, физические упражнения, чувства по поводу вашего питания, фигуры и веса ${prompt}`,
  type: 'single',
  required: true,
  options,
}));

const allAnswers = (value: number) => Object.fromEntries(prompts.map((_, index) => [String(index + 1), value]));

export const instrument: SeedSection = {
  code: 'test_1386',
  title: 'Оценка клинических ухудшений при РПП (CIA 3.0)',
  description: 'Опросник оценивает выраженность психосоциальных ограничений, связанных с особенностями пищевого поведения, физическими упражнениями и переживаниями о питании, фигуре и весе за последний месяц. Пункты охватывают эмоциональное и когнитивное самочувствие, повседневную деятельность, работу и взаимодействие с другими людьми. Подходит для взрослых, проходящих оценку или лечение расстройств пищевого поведения; общий балл отражает тяжесть функционального ущерба и не устанавливает диагноз.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 3,
  scales: [
    { key: 'global', label: 'Общее психосоциальное ухудшение', items: prompts.map((_, index) => index + 1), reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  { title: 'Все ответы «Совсем нет»', answers: allAnswers(0), expected: { global: 0 } },
  { title: 'Все ответы «Очень сильно»', answers: allAnswers(3), expected: { global: 48 } },
  { title: 'Один ответ «Немного», остальные «Совсем нет»', answers: { ...allAnswers(0), '1': 1 }, expected: { global: 1 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'cia-3-0-bohn-fairburn-2008-global-sum-16-v1',
};
