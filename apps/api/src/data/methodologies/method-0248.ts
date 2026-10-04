import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

// Код ответа — число серий, в которых выбрано суждение (от 0 до 3).
const items = [
  'Понимаю, что ученик должен хорошо учиться.',
  'Стремлюсь быстро и точно выполнять требования учителя.',
  'Хочу окончить школу и учиться дальше.',
  'Хочу быть культурным и развитым человеком.',
  'Хочу получать хорошие отметки.',
  'Хочу получать одобрение учителей и родителей.',
  'Хочу, чтобы товарищи были всегда хорошего мнения обо мне.',
  'Хочу, чтобы в классе у меня было много друзей.',
  'Хочу быть лучшим учеником в классе.',
  'Хочу, чтобы мои ответы на уроках были всегда лучше всех.',
  'Хочу, чтобы не ругали родители и учителя.',
  'Не хочу получать плохие отметки.',
  'Люблю узнавать новое.',
  'Нравится, когда учитель рассказывает что-то интересное.',
  'Люблю думать, рассуждать на уроке.',
  'Люблю брать сложные задания, преодолевать трудности.',
  'Мне интересно беседовать с учителем на разные темы.',
  'Мне больше нравится выполнять учебное задание в группе, чем одному.',
  'Люблю решать задачи разными способами.',
  'Люблю всё новое и необычное.',
  'Хочу учиться только на «4» и «5».',
  'Хочу добиться в будущем больших успехов.',
];

const responseOptions = [
  { value: '0', label: 'Не выбрано ни в одной серии' },
  { value: '1', label: 'Выбрано в одной серии' },
  { value: '2', label: 'Выбрано в двух сериях' },
  { value: '3', label: 'Выбрано во всех трёх сериях' },
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_280_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: responseOptions,
}));

export const instrument: SeedSection = {
  code: 'test_280',
  title: 'Диагностика учебной мотивации школьников (М. В. Матюхина, модификация Н. Ц. Бадмаевой)',
  description: 'Методика выявляет ведущие мотивы учебной деятельности школьников: долг и ответственность, самоопределение и самосовершенствование, благополучие, аффилиацию, престиж, избегание неудачи, учебно-познавательные мотивы, общение, творческую самореализацию и достижение успеха. Автор опроса может использовать её для описания структуры учебных побуждений школьников. Процедура разработана для школьников и предполагает три серии выбора суждений.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 3,
  scales: [
    { key: 'duty_responsibility', label: 'Долг и ответственность', items: [1, 2], reverseItems: [], aggregation: 'sum' },
    { key: 'self_determination', label: 'Самоопределение и самосовершенствование', items: [3, 4], reverseItems: [], aggregation: 'sum' },
    { key: 'wellbeing', label: 'Благополучие', items: [5, 6], reverseItems: [], aggregation: 'sum' },
    { key: 'affiliation', label: 'Аффилиация', items: [7, 8], reverseItems: [], aggregation: 'sum' },
    { key: 'prestige', label: 'Престиж', items: [9, 10], reverseItems: [], aggregation: 'sum' },
    { key: 'failure_avoidance', label: 'Избегание неудачи', items: [11, 12], reverseItems: [], aggregation: 'sum' },
    { key: 'learning_content', label: 'Учебно-познавательные мотивы: содержание учения', items: [13, 14], reverseItems: [], aggregation: 'sum' },
    { key: 'learning_process', label: 'Учебно-познавательные мотивы: процесс учения', items: [15, 16], reverseItems: [], aggregation: 'sum' },
    { key: 'communication', label: 'Коммуникативные мотивы', items: [17, 18], reverseItems: [], aggregation: 'sum' },
    { key: 'creative_self_realization', label: 'Творческая самореализация', items: [19, 20], reverseItems: [], aggregation: 'sum' },
    { key: 'achievement', label: 'Достижение успеха', items: [21, 22], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная сверка: обе формулировки мотива долга выбраны во всех трёх сериях',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), index < 2 ? 3 : 0])),
    expected: {
      duty_responsibility: 4,
      self_determination: 0,
      wellbeing: 0,
      affiliation: 0,
      prestige: 0,
      failure_avoidance: 0,
      learning_content: 0,
      learning_process: 0,
      communication: 0,
      creative_self_realization: 0,
      achievement: 0,
    },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'matyukhina-badmaeva-three-series-coincidence-v1',
};
