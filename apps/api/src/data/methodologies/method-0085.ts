import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const situations = [
  'Ваш(а) супруг(а) критикует что-то, что Вы сказали.',
  'Ваш(а) супруг(а) начинает всё меньше времени проводить вместе с Вами.',
  'Ваш(а) супруг(а) не обращает внимания на то, что Вы ему говорите.',
  'Ваш(а) супруг(а) ведет себя с Вами холодно и отстраненно.',
  'Ваш(а) супруг(а) не выполняет как следует своих домашних обязанностей.',
  'Ваш(а) супруг(а) принимает важные решения, которые повлияют на Вас обоих, не спрашивая Вашего мнения.',
  'Ваш(а) супруг(а) не оказывает Вам поддержки, когда Вы в этом нуждаетесь.',
  'Ваш(а) супруг(а) проявляет негативное отношение к тому, что Вы делаете.',
];

const statements = [
  'Такое поведение супруга(и) вызвано его(её) особенностями (типом личности, настроением и т.п.)',
  'Причина такого поведения, по-видимому, сохранится в будущем',
  'Причина такого поведения влияет и на другие сферы наших отношений',
  'Супруг(а) ведет себя так скорее сознательно, чем непроизвольно',
  'Такое поведение супруга(и) вызвано скорее эгоистическими, чем бескорыстными мотивами',
  'Супруг(а) заслуживает осуждения за то, что так поступает со мной',
];

const responseLabels = [
  'совершенно не согласен(сна)',
  'не согласен(сна)',
  'скорее не согласен(сна)',
  'скорее согласен(сна)',
  'согласен(сна)',
  'полностью согласен(сна)',
];

const scaleNames = [
  'Локус',
  'Стабильность',
  'Глобальность',
  'Сознательность (преднамеренность)',
  'Мотивация',
  'Вина',
];

const questions: SeedSection['questions'] = situations.flatMap((situation, situationIndex) =>
  statements.map((statement, statementIndex) => {
    const item = situationIndex * statements.length + statementIndex + 1;
    return {
      code: `test_123_${item}`,
      text: `${situation} ${statement}`,
      type: 'single' as const,
      required: true,
      options: responseLabels.map((label, index) => ({ value: String(index + 1), label })),
    };
  }),
);

export const instrument: SeedSection = {
  code: 'test_123',
  title: 'Атрибуции в супружеских отношениях',
  description: 'Русская версия Relationship Attribution Measure (RAM), перевод О. А. Сычева. Для каждой из восьми ситуаций представьте её и оцените каждое утверждение по шкале от «совершенно не согласен(сна)» до «полностью согласен(сна)».',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 6,
  scales: scaleNames.map((label, scaleIndex) => ({
    key: ['locus', 'stability', 'globality', 'intentionality', 'motivation', 'blame'][scaleIndex],
    label,
    items: Array.from({ length: situations.length }, (_, situationIndex) => situationIndex * 6 + scaleIndex + 1),
    reverseItems: [],
    aggregation: 'sum' as const,
  })),
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: минимальный ответ по каждому из восьми повторов каждой шкалы даёт 8 баллов',
    answers: Object.fromEntries(Array.from({ length: 48 }, (_, index) => [String(index + 1), 1])),
    expected: { locus: 8, stability: 8, globality: 8, intentionality: 8, motivation: 8, blame: 8 },
  },
  {
    title: 'Ручная проверка: максимальный ответ по каждому из восьми повторов каждой шкалы даёт 48 баллов',
    answers: Object.fromEntries(Array.from({ length: 48 }, (_, index) => [String(index + 1), 6])),
    expected: { locus: 48, stability: 48, globality: 48, intentionality: 48, motivation: 48, blame: 48 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'sychev-ram-ru-2016-v1',
};
