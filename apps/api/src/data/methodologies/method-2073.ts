import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Совершенно не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Скорее не согласен' },
  { value: '4', label: 'Ни согласен, ни не согласен' },
  { value: '5', label: 'Скорее согласен' },
  { value: '6', label: 'Согласен' },
  { value: '7', label: 'Совершенно согласен' },
];

const items = [
  'Русские передают свои традиции из поколения в поколение.',
  'История России — это последовательность взаимосвязанных событий.',
  'Ценности и убеждения русских выдержали проверку временем.',
  'Основные периоды в истории России связаны друг с другом.',
  'На протяжении всей истории русские сохраняют свой менталитет.',
  'Нет никакой связи между прошлыми, настоящими и будущими событиями в истории России.',
  'Русские всегда будут отличаться своими традициями и убеждениями.',
  'Существует причинно-следственная связь между различными событиями в истории России.',
  'Россия сохраняет традиции и обычаи на протяжении всей своей истории.',
  'Основные события в истории России образуют неразрывную цепочку.',
  'Русские всегда придерживались и придерживаются собственных ценностей.',
  'Нет никакой преемственности между разными периодами в истории России.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2087_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

const instrument: SeedSection = {
  code: 'test_2087',
  title: 'Шкала воспринимаемой коллективной преемственности (PCC), русская адаптация',
  description: 'Оценивает, насколько человек воспринимает этническую группу русских как устойчивую во времени общность. Охватывает культурную преемственность традиций, ценностей и менталитета, а также историческую связанность периодов и событий. Русская адаптация предназначена для исследований восприятия этнической группы русских; при применении к другим группам формулировки и пригодность версии требуют отдельного обоснования.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'cultural', label: 'Культурная преемственность', items: [1, 3, 5, 7, 9, 11], reverseItems: [], aggregation: 'sum' },
    { key: 'historical', label: 'Историческая преемственность', items: [2, 4, 6, 8, 10, 12], reverseItems: [6, 12], aggregation: 'sum' },
    { key: 'total', label: 'Общая воспринимаемая коллективная преемственность', items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], reverseItems: [6, 12], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы нейтральные: четыре балла по каждому пункту',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 4])),
    expected: { cultural: 24, historical: 24, total: 48 },
  },
  {
    title: 'Максимальное согласие со всеми прямыми пунктами и максимальное несогласие с обратными',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), [6, 12].includes(index + 1) ? 1 : 7])),
    expected: { cultural: 42, historical: 42, total: 84 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'pcc-ru-terskova-et-al-2022-v1',
};
