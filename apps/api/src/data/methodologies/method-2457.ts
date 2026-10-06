import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Полностью не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Скорее не согласен' },
  { value: '4', label: 'Нечто среднее' },
  { value: '5', label: 'Скорее согласен' },
  { value: '6', label: 'Согласен' },
  { value: '7', label: 'Полностью согласен' },
];

const items = [
  'Моя мотивация снижается, когда я испытываю усталость.',
  'Физическая нагрузка вызывает у меня усталость.',
  'Я быстро утомляюсь.',
  'Усталость мешает моей физической работоспособности.',
  'Усталость часто становится причиной моих проблем.',
  'Моя усталость препятствует стабильной физической работоспособности.',
  'Усталость мешает мне выполнять определенные задания и обязанности.',
  'Усталость — один из моих самых неприятных симптомов.',
  'Усталость мешает моей работе, семье или общественной жизни.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2475_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2475',
  title: 'Шкала тяжести усталости (FSS-9)',
  description: 'Полная девятипунктовая версия FSS оценивает выраженность усталости и её влияние на мотивацию, физическую работоспособность, выполнение обязанностей, работу, семейную и общественную жизнь за прошедшую неделю. Русскоязычная версия подходит для исследований взрослых клинических и популяционных выборок; результат отражает самооценку влияния усталости и не является диагнозом.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'fatigueSeverity', label: 'Тяжесть усталости (FSS-9)', items: [1, 2, 3, 4, 5, 6, 7, 8, 9], reverseItems: [], aggregation: 'mean' },
  ],
};

const answers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Вручную проверено: одинаковые ответы 1 дают среднее 1', answers: answers(1), expected: { fatigueSeverity: 1 } },
  { title: 'Вручную проверено: одинаковые ответы 7 дают среднее 7', answers: answers(7), expected: { fatigueSeverity: 7 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['clinical-somatic'],
  scoringConfig,
  validationCases,
  formulaVersion: 'fss-9-zolotareva-2025-mean-v1',
};
