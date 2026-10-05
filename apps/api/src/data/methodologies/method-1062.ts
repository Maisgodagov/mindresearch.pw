import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'Безусловно, нет' },
  { value: '1', label: 'Пожалуй, нет' },
  { value: '2', label: 'Пожалуй, да' },
  { value: '3', label: 'Безусловно, да' },
];

const statements = [
  'Были ли вы способны сосредоточиться на том, чем вы занимаетесь?',
  'Сильно страдали от бессонницы из-за волнений?',
  'Чувствовали, что играете важную роль в происходящем?',
  'Чувствовали себя способным принимать решения?',
  'Чувствовали себя в постоянном напряжении?',
  'Чувствовали себя не в состоянии преодолеть трудности?',
  'Могли получать удовольствие от своих обычных повседневных занятий?',
  'Были способны решить свои проблемы?',
  'Чувствовали себя несчастным или подавленным?',
  'Теряли уверенность в себе?',
  'Думали о себе как о ничтожном человеке?',
  'Чувствовали себя в целом умеренно счастливым?',
];

const questions: SeedSection['questions'] = statements.map((text, index) => ({
  code: `test_1092_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1092',
  title: 'Опросник общего здоровья GHQ-12 (перевод А. Лисицыной)',
  description: 'Краткий скрининговый опросник оценивает текущее психологическое неблагополучие и эмоциональную устойчивость за последние недели. Он охватывает концентрацию, сон и напряжение, совладание с повседневными трудностями, самооценку и настроение; предназначен для взрослых в исследовательских и общих медицинских контекстах и не устанавливает диагноз.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 3,
  scales: [{
    key: 'general_health',
    label: 'Общий балл психологического неблагополучия GHQ-12 (Likert)',
    items: Array.from({ length: 12 }, (_, i) => i + 1),
    reverseItems: [3, 4, 7, 8, 12],
    aggregation: 'sum',
  }],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все пункты с ответом «безусловно, нет»: пять положительных формулировок реверсируются; сумма 15',
    answers: Object.fromEntries(Array.from({ length: 12 }, (_, i) => [String(i + 1), 0])),
    expected: { general_health: 15 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'goldberg-ghq12-likert-reverse-positive-5-items-total-v1',
};
