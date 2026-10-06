import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Полностью не согласен' },
  { value: '2', label: 'Скорее не согласен' },
  { value: '3', label: 'Не указано в опубликованной шкале' },
  { value: '4', label: 'Согласен частично' },
  { value: '5', label: 'Полностью согласен' },
];

const items = [
  'В жизни нужно подчиняться только себе и никому более.',
  'Потерпевшие часто ведут себя хуже преступников.',
  'Ловят преступников только из-за их неосмотрительности.',
  'Потерпевшие всегда сами виноваты в произошедшем с ними.',
  'Жить по законам общества можно, только если это выгодно.',
  'Потерпевшие от преступлений заслуживают своей судьбы.',
  'При хорошей подготовке преступление всегда останется нераскрытым.',
  'Лишь глупые или несчастливые люди отбывают наказание в местах лишения свободы.',
  'Потерпевшие наивны настолько, что могут постоянно быть жертвами преступлений.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2371_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2371',
  title: 'Шкала риска криминализации',
  description: 'Авторская исследовательская шкала оценивает выраженность субъективных установок, связанных с риском криминализации: эгоцентрической направленности, отрицания уголовного наказания и обвиняющего отношения к потерпевшему. Опубликованная краткая версия включает девять утверждений и предназначена для научно-исследовательского изучения взрослых правопослушных и криминогенных групп; балл не является индивидуальным диагностическим заключением.',
  categoryIds: ['work-service'],
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  // In the source response scale, only 1, 2, 4 and 5 are defined; value 3
  // is retained as a technical placeholder, mapped to the neutral midpoint.
  min: 1,
  max: 5,
  scales: [
    { key: 'total', label: 'Интегральный показатель риска криминализации', items: [1, 2, 3, 4, 5, 6, 7, 8, 9], reverseItems: [], itemScores: Object.fromEntries(items.map((_, index) => [index + 1, { '1': 1, '2': 2, '3': 3, '4': 4, '5': 5 }])), aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  { title: 'Ручная сверка: минимальное значение каждого пункта', answers: Object.fromEntries(items.map((_, index) => [String(index + 1), '1'])), expected: { total: 9 } },
  { title: 'Ручная сверка: максимальное значение каждого пункта', answers: Object.fromEntries(items.map((_, index) => [String(index + 1), '5'])), expected: { total: 45 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['work-service'],
  scoringConfig,
  validationCases,
  formulaVersion: 'zlokazov-criminalization-risk-9item-2023-v1',
};
