import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'никогда' },
  { value: '2', label: 'редко' },
  { value: '3', label: 'иногда' },
  { value: '4', label: 'часто' },
  { value: '5', label: 'всегда' },
];

const items = [
  'Заранее предупреждаете, когда и сколько по времени ребенок может смотреть фильмы, мультфильмы, YouTube и т.д.',
  'Обсуждаете с ребенком происходящее на экране во время просмотра.',
  'Вместе с ребенком смотрите фильмы, мультфильмы, YouTube и т.д., которые он выбрал сам и хочет, чтобы Вы к нему присоединились.',
  'Заранее предупреждаете ребенка, какие именно фильмы, мультфильмы, видео на YouTube и т.д. он может посмотреть.',
  'Обсуждаете с ребенком различные фильмы, мультфильмы, видео на YouTube и т.д. (в общем, а не в момент просмотра).',
  'Вместе с ребенком смотрите фильмы, мультфильмы, YouTube и т.д., которые Вы выбрали сами, и хотите, чтобы ребенок к Вам присоединился.',
  'Заранее предупреждаете, когда и как долго ребенок может играть в игры, использовать различные приложения, веб-сайты и т.д.',
  'Обсуждаете с ребенком происходящее на экране во время игры или при использовании приложения, веб-сайта и т.д.',
  'Вместе с ребенком играете в игры, используете приложения, веб-сайты и т.д., которые выбрал ребенок и хочет, чтобы Вы присоединились к нему.',
  'Заранее предупреждаете, какие игры, приложения, веб-сайты и т.д. может использовать ребенок.',
  'Обсуждаете с ребенком различные игры, приложения, веб-сайты и т.д. (в общем, а не в момент просмотра).',
  'Совместно с ребенком играете в игры, используете приложения, веб-сайты и т.д., которые выбрали Вы, и хотите, чтобы ребенок к Вам присоединился.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1554_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1554',
  title: 'Родительское посредничество детской медиаактивности',
  description: 'Опросник оценивает, как родители детей старшего дошкольного возраста (5–7 лет) регулируют взаимодействие ребенка с цифровыми устройствами и медиаконтентом. Он охватывает ограничительную стратегию, обсуждение и объяснение медиасодержания, а также совместное использование устройств; результаты помогают автору опроса описать применяемые семьей способы медиа-посредничества.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'restrictive', label: 'Ограничительная стратегия посредничества', items: [1, 4, 7, 10], reverseItems: [], aggregation: 'sum' },
    { key: 'instructive', label: 'Инструктивная стратегия посредничества', items: [2, 5, 8, 11], reverseItems: [], aggregation: 'sum' },
    { key: 'co_use', label: 'Совместное использование', items: [3, 6, 9, 12], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  { title: 'Все пункты оценены как «никогда»', answers: Object.fromEntries(items.map((_, i) => [String(i + 1), 1])), expected: { restrictive: 4, instructive: 4, co_use: 4 } },
  { title: 'Все пункты оценены как «всегда»', answers: Object.fromEntries(items.map((_, i) => [String(i + 1), 5])), expected: { restrictive: 20, instructive: 20, co_use: 20 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'denisenkova-taruntaev-fedorov-2023-12items-v1',
};
