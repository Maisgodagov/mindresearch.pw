import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const answers = [
  'Совсем нет',
  'Редко (менее 1 часа в день)',
  'Иногда (от 1 до 3 часов в день)',
  'Часто (от 3 до 8 часов в день)',
  'Очень часто (более 8 часов в день)',
].map((label, index) => ({ value: String(index), label }));

const stems = [
  'Сколько времени в среднем занимают у вас эти симптомы?',
  'Насколько часто эти симптомы вызывают у вас стресс?',
  'Насколько трудно вам контролировать эти симптомы?',
  'Насколько часто эти симптомы заставляют вас избегать делать что-либо, ходить куда-либо или быть с кем-либо?',
  'Насколько часто эти симптомы мешают вашей учебе, работе, социальной или семейной жизни?',
];

const questions: SeedSection['questions'] = stems.map((text, index) => ({
  code: `test_2457_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: answers,
}));

export const instrument: SeedSection = {
  code: 'test_2457',
  title: 'Шкала телесного дисморфического расстройства (BDD-D)',
  description: 'Краткая одномерная шкала оценивает выраженность симптомов телесного дисморфического расстройства за прошедшую неделю: время, занятое беспокойством о внешности и связанными повторяющимися действиями, вызываемый ими стресс, контроль, избегание и влияние на повседневное функционирование. Русскоязычная адаптация изучалась у взрослых пациентов с нервной булимией и нервной анорексией; полезна для оценки выраженности дисморфофобических переживаний в исследованиях и психологическом обследовании этой группы.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 4,
  scales: [{
    key: 'total',
    label: 'Общий показатель дисморфофобии',
    items: [1, 2, 3, 4, 5],
    reverseItems: [],
    aggregation: 'sum',
  }],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Вручную проверено по опубликованной формуле: пять ответов 0 дают сумму 0',
    answers: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 },
    expected: { total: 0 },
  },
  {
    title: 'Вручную проверено по опубликованной формуле: ответы 1, 2, 3, 4, 0 дают сумму 10',
    answers: { '1': 1, '2': 2, '3': 3, '4': 4, '5': 0 },
    expected: { total: 10 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['clinical-body'],
  scoringConfig,
  validationCases,
  formulaVersion: 'bdd-d-zolotareva-ulyanova-2025-ru-v1',
};
