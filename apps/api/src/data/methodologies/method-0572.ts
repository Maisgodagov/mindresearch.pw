import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const answers = [
  { value: '0', label: 'Никогда' },
  { value: '1', label: 'Редко' },
  { value: '2', label: 'Часто' },
  { value: '3', label: 'Всегда' },
];

const items = [
  'Обсуждаю с учащимися цели и задачи совместной учебной деятельности.',
  'Советуюсь с ребятами по вопросу о выборе организационных форм проведения урока.',
  'Стараюсь создать на уроке доверительные межличностные отношения с учащимися.',
  'Стремлюсь к взаимной личной информированности с учащимися.',
  'Использую учащихся в роли «преподавателей» на уроке.',
  'Выставляю отдельным учащимся по несколько отметок за урок.',
  'Признаю право учащегося на ошибку.',
  'Использую на уроке учебный взаимоконтроль учащихся.',
  'На уроке стараюсь ставить не завышенные отметки учащимся, а адекватные их знаниям.',
  'Нерадивым учащимся ставлю в журнал «двойки».',
  'Отметки применяю в качестве основного побудительного стимула учащихся к учению.',
  'При нарушении учащимся учебной дисциплины, в случае его неподготовленности к учебному занятию, немедленно ставлю в известность администрацию школы и родителей.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_603_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: answers,
}));

export const instrument: SeedSection = {
  code: 'test_603',
  title: 'Методика диагностики уровня педагогического сотрудничества в процессе обучения',
  description: 'Методика предназначена для самооценки преподавателем используемых форм совместной учебной деятельности и отношения к сотрудничеству с учащимися. Она охватывает обсуждение целей и форм урока, доверие, взаимную информированность, участие и взаимоконтроль учащихся, а также способы оценивания и реагирования на нарушения. Подходит для педагогов, оценивающих собственную практику в процессе обучения.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 3,
  scales: [
    {
      key: 'pedagogical_cooperation',
      label: 'Уровень педагогического сотрудничества',
      items: Array.from({ length: 12 }, (_, index) => index + 1),
      reverseItems: [9, 10, 11, 12],
      aggregation: 'sum',
    },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы «Всегда»: прямые пункты по 3, пункты 9–12 по 0',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 3])),
    expected: { pedagogical_cooperation: 24 },
  },
  {
    title: 'Все ответы «Никогда»: прямые пункты по 0, пункты 9–12 по 3',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 0])),
    expected: { pedagogical_cooperation: 12 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'pedagogical-cooperation-learning-12-items-reverse-9-12-v1',
};
