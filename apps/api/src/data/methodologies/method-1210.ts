import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'Совсем не беспокоила' },
  { value: '1', label: 'Немного беспокоила' },
  { value: '2', label: 'Сильно беспокоила' },
];

const items = [
  'Боль в животе',
  'Боль в спине',
  'Боль в руках, ногах или суставах (коленях, бедрах и т.д.)',
  'Менструальные боли или любой дискомфорт, связанный с менструальным циклом (для женщин)',
  'Головная боль',
  'Боль в грудной клетке',
  'Головокружение',
  'Обморок',
  'Ощущение сильного сердцебиения',
  'Одышка',
  'Боль или дискомфорт во время полового акта',
  'Запор или диарея',
  'Тошнота, метеоризм или расстройство желудка',
  'Чувство усталости или недостаток энергии',
  'Проблемы со сном',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1240_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1240',
  title: 'Шкала соматических симптомов PHQ-15',
  description: 'PHQ-15 оценивает наличие и выраженность 15 соматических симптомов за последние четыре недели: боли, желудочно-кишечные и кардиореспираторные проявления, утомляемость, нарушения сна и другие телесные жалобы. Подходит для скрининга и мониторинга взрослых респондентов; результат отражает симптомную нагрузку и сам по себе не устанавливает диагноз.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 2,
  scales: [{ key: 'total', label: 'Суммарный балл PHQ-15', items: items.map((_, index) => index + 1), reverseItems: [], aggregation: 'sum' }],
};

const allAnswers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Все симптомы отсутствуют', answers: allAnswers(0), expected: { total: 0 } },
  { title: 'Все симптомы беспокоили сильно', answers: allAnswers(2), expected: { total: 30 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'phq-15-ru-zolotareva-2022-v1',
};
