import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const responseOptions = [
  { value: '1', label: 'Никогда не верно' },
  { value: '2', label: 'Очень редко верно' },
  { value: '3', label: 'Редко верно' },
  { value: '4', label: 'Иногда верно' },
  { value: '5', label: 'Часто верно' },
  { value: '6', label: 'Почти всегда верно' },
  { value: '7', label: 'Всегда верно' },
];

const statements = [
  'Я могу эффективно работать, несмотря на любые личные переживания.',
  'Я могу признавать свои ошибки на работе и чувствовать себя успешным.',
  'Я могу работать очень эффективно, даже если я нервничаю из-за чего-то.',
  'Беспокойства и переживания не мешают моему успеху.',
  'Я могу выполнять дела, как требуется, независимо от того, как я себя чувствую.',
  'Я могу работать эффективно, даже когда я сомневаюсь в себе.',
  'Мои мысли и чувства не мешают моей работе.',
];

const questions: SeedSection['questions'] = statements.map((text, index) => ({
  code: `test_1167_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: responseOptions,
}));

export const instrument: SeedSection = {
  code: 'test_1167',
  title: 'Опросник принятия и действий на рабочем месте (WAAQ)',
  description: 'WAAQ оценивает психологическую гибкость в рабочем контексте: способность эффективно действовать и следовать рабочим целям, сохраняя контакт с тревогой, сомнениями и другими неприятными внутренними переживаниями. Пункты охватывают эффективность работы при личных переживаниях, нервозности и сомнениях, отношение к ошибкам и влияние чувств и мыслей на рабочее поведение. Оригинальная семипунктовая версия предназначена для работающих взрослых; это контекстная оценка, а не клинический диагноз.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [{
    key: 'workplacePsychologicalFlexibility',
    label: 'Психологическая гибкость на рабочем месте',
    items: [1, 2, 3, 4, 5, 6, 7],
    reverseItems: [],
    aggregation: 'sum',
  }],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все минимальные ответы дают минимальную сумму',
    answers: { '1': 1, '2': 1, '3': 1, '4': 1, '5': 1, '6': 1, '7': 1 },
    expected: { workplacePsychologicalFlexibility: 7 },
  },
  {
    title: 'Смешанный профиль подсчитан вручную: 1+2+3+4+5+6+7',
    answers: { '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7 },
    expected: { workplacePsychologicalFlexibility: 28 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'waaq-bond-lloyd-guenole-2013-psytests-ru-v1',
};
