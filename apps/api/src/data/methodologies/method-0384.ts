import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const items = [
  'Доброжелательность',
  'Заинтересованность',
  'Поощрение инициативы обучаемых',
  'Открытость (свободное выражение чувств, отсутствие «маски»)',
  'Активность (все время в общении, держит обучаемых в «тонусе»)',
  'Гибкость (легко схватывает и разрешает возникшие проблемы, конфликты)',
  'Дифференцированность (индивидуальный подход) в общении',
];
const options = Array.from({ length: 7 }, (_, index) => ({ value: String(7 - index), label: String(7 - index) }));
const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_420_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_420',
  title: 'Карта коммуникативной деятельности',
  description: 'Экспертная оценка стиля общения педагога с аудиторией: доброжелательности, интереса, поддержки инициативы, открытости, активности, гибкости и индивидуального подхода. Предназначена для педагогов; для исходной редакции рекомендуется усреднять независимые оценки четырех-пяти экспертов, имеющих опыт общения с аудиторией.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [{ key: 'communication', label: 'Коммуникативная деятельность', items: [1, 2, 3, 4, 5, 6, 7], reverseItems: [], aggregation: 'sum' }],
};

const validationCases: ValidationCase[] = [
  { title: 'Все характеристики оценены на минимальный балл', answers: Object.fromEntries(items.map((_, i) => [String(i + 1), 1])), expected: { communication: 7 } },
  { title: 'Все характеристики оценены на максимальный балл', answers: Object.fromEntries(items.map((_, i) => [String(i + 1), 7])), expected: { communication: 49 } },
  { title: 'Ручной контроль: 7 + 6 + 5 + 4 + 3 + 2 + 1', answers: { '1': 7, '2': 6, '3': 5, '4': 4, '5': 3, '6': 2, '7': 1 }, expected: { communication: 28 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'rogov-kkd-7x7-v1',
};
