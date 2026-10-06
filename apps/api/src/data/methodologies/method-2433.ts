import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
  { value: '6', label: '6' },
  { value: '7', label: '7' },
];

const itemTexts = [
  'В целом я считаю себя:',
  'По сравнению с большинством сверстников, я:',
  'Некоторые люди обычно очень счастливы. Они получают удовольствие от жизни, что бы ни происходило, беря от жизни всё. Насколько это похоже на Вас?',
  'Некоторые люди обычно не особенно счастливы. Хотя они и не страдают депрессией, похоже, они никогда не бывают так счастливы, как могли бы быть. Насколько это похоже на Вас?',
];

const endpointLabels = [
  ['не особенно счастливым(ой)', 'очень счастливым(ой)'],
  ['менее счастлив(а)', 'более счастлив(а)'],
  ['совсем не похоже', 'в большой степени похоже'],
  ['совсем не похоже', 'в большой степени похоже'],
];

const questions: SeedSection['questions'] = itemTexts.map((text, index) => ({
  code: `test_2451_${index + 1}`,
  text: `${text} [${endpointLabels[index][0]} — ${endpointLabels[index][1]}]`,
  type: 'single',
  required: true,
  options,
}));

const instrument: SeedSection = {
  code: 'test_2451',
  title: 'Шкала субъективного счастья (SHS), русскоязычная версия',
  description: 'Краткая шкала оценивает глобальное субъективное счастье и эмоционально-чувственный компонент субъективного благополучия: общее ощущение себя счастливым человеком, сравнение с ровесниками и соответствие описаниям счастливого и менее счастливого человека. Русскоязычная версия Осина и Леонтьева валидировалась на взрослых участниках; пригодна для экспресс-оценки субъективного благополучия в русскоязычных опросах.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [{ key: 'shs', label: 'Субъективное счастье', items: [1, 2, 3, 4], reverseItems: [4], aggregation: 'mean' }],
};

const validationCases: ValidationCase[] = [
  { title: 'Проверка реверсивного пункта: одинаковые ответы 1 дают среднее 6,5', answers: { '1': 1, '2': 1, '3': 1, '4': 1 }, expected: { shs: 6.5 } },
  { title: 'Все ответы по центру: среднее 4', answers: { '1': 4, '2': 4, '3': 4, '4': 4 }, expected: { shs: 4 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['meaning-satisfaction'],
  scoringConfig,
  validationCases,
  formulaVersion: 'lyubomirsky-lepper-shs-osin-leontiev-ru-mean-reverse-4-v1',
};
