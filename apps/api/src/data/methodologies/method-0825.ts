import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const responseOptions = [
  { value: '1', label: 'Полностью не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Сомневаюсь' },
  { value: '4', label: 'Согласен' },
  { value: '5', label: 'Полностью согласен' },
];

const itemTexts = [
  'Тренировка – это самое важное в моей жизни.',
  'У меня возникают конфликты с близкими из-за количества моих тренировок.',
  'Я использую тренировки, чтобы изменить настроение (например, получить кайф / забыться).',
  'Объем тренировок в последнее время увеличивается.',
  'Если я вынужден пропустить тренировку, я испытываю уныние и раздражительность.',
  'Я стараюсь сократить обычный объем тренировок, но затем возобновляю прежний и снова пытаюсь их сократить.',
];

const questions: SeedSection['questions'] = itemTexts.map((text, index) => ({
  code: `test_855_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: responseOptions,
}));

export const instrument: SeedSection = {
  code: 'test_855',
  title: 'Определитель аддикции упражнений (EAI)',
  description: 'Краткий скрининговый опросник для оценки риска проблемного, потенциально аддиктивного отношения к физическим тренировкам. Шесть пунктов охватывают значимость тренировок, конфликты с близкими, изменение настроения, рост объёма нагрузки, неприятные переживания при пропуске и возврат к прежнему объёму после попытки сократить занятия. Предназначен для регулярно тренирующихся взрослых; результат отражает уровень риска и не является диагнозом.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [{
    key: 'exercise_addiction_risk',
    label: 'Суммарный балл EAI',
    items: [1, 2, 3, 4, 5, 6],
    reverseItems: [],
    aggregation: 'sum',
  }],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Минимальные ответы: 1 + 1 + 1 + 1 + 1 + 1',
    answers: { '1': 1, '2': 1, '3': 1, '4': 1, '5': 1, '6': 1 },
    expected: { exercise_addiction_risk: 6 },
  },
  {
    title: 'Ручная проверка: 4 + 4 + 3 + 4 + 5 + 4',
    answers: { '1': 4, '2': 4, '3': 3, '4': 4, '5': 5, '6': 4 },
    expected: { exercise_addiction_risk: 24 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'exercise-addiction-inventory-eai-griffiths-2005-felsendorff-egorov-2007-v1',
};
