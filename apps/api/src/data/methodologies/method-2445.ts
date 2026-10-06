import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const symptoms = [
  'Ощущение онемения или покалывания в теле',
  'Ощущение жара в теле',
  'Дрожь в ногах',
  'Неспособность расслабиться',
  'Страх, что произойдет самое плохое',
  'Головокружение или ощущение легкости в голове',
  'Ускоренное сердцебиение',
  'Неустойчивость',
  'Ощущение ужаса',
  'Нервозность',
  'Дрожь в руках',
  'Ощущение удушья',
  'Шаткость походки',
  'Страх утраты контроля',
  'Затрудненность дыхания',
  'Страх смерти',
  'Испуг',
  'Желудочно-кишечные расстройства',
  'Обмороки',
  'Приливы крови к лицу',
  'Усиление потоотделения (не связанное с жарой)',
];

const options = [
  { value: '0', label: 'Совсем не беспокоил' },
  { value: '1', label: 'Слегка. Не слишком меня беспокоил' },
  { value: '2', label: 'Умеренно. Это было неприятно, но я мог это переносить' },
  { value: '3', label: 'Очень сильно. Я с трудом мог это выносить' },
];

const questions: SeedSection['questions'] = symptoms.map((text, index) => ({
  code: `test_2463_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2463',
  title: 'Шкала тревоги А. Бека (BAI)',
  description: 'Шкала оценивает выраженность тревоги за последнюю неделю, включая сегодняшний день, через телесные и психические симптомы. Суммарный балл подходит для предварительного скрининга и оценки выраженности тревожных проявлений у подростков от 14 лет и взрослых; результат сам по себе не устанавливает диагноз.',
  categoryIds: ['mood-anxiety'],
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 3,
  scales: [{
    key: 'total',
    label: 'Суммарная выраженность тревоги',
    items: symptoms.map((_, index) => index + 1),
    reverseItems: [],
    aggregation: 'sum',
  }],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все симптомы не беспокоили: минимальный балл',
    answers: Object.fromEntries(symptoms.map((_, index) => [String(index + 1), 0])),
    expected: { total: 0 },
  },
  {
    title: 'Все симптомы беспокоили очень сильно: максимальный балл',
    answers: Object.fromEntries(symptoms.map((_, index) => [String(index + 1), 3])),
    expected: { total: 63 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'beck-anxiety-inventory-ru-minzdrav-guideline-v1',
};
