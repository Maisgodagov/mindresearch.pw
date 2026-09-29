import type { SeedSection } from '../types.js';
import type { ConfigurableScoring, ValidationCase } from '../scoring/configurable.js';

const options = [
  { value: '0', label: '0 — Неверно' },
  { value: '1', label: '1 — Скорее неверно, чем верно' },
  { value: '2', label: '2 — Скорее верно, чем неверно' },
  { value: '3', label: '3 — Большей частью верно' },
  { value: '4', label: '4 — Совершенно верно' },
];

const items = [
  'Вы считаете себя состоявшимся взрослым человеком?',
  'Вас уважают как состоявшегося взрослого человека?',
  'Вы чувствуете, что достигли зрелости?',
  'Вы нашли своё место в жизни?',
  'Вы выстроили свой стиль жизни, который устраивает вас и будет устраивать в дальнейшем?',
  'Вы нашли свой круг общения, который устраивает вас и будет устраивать в дальнейшем?',
];

export const isriRuInstrument: SeedSection = {
  code: 'test_40',
  title: 'Шкала определения стадии идентичности Дж. Коте, ISRI — русская адаптация',
  description: 'Шестипунктовая русская адаптация Ю. В. Борисенко для исследовательской оценки взрослой и социальной идентичности. Суммарный балл соотносится с четырьмя стадиями идентичности по опубликованным диапазонам.',
  questions: items.map((text, index) => ({
    code: `test_40_${index + 1}`,
    text,
    type: 'single',
    required: true,
    options,
  })),
};

export const isriRuScoring: ConfigurableScoring = {
  min: 0,
  max: 4,
  scales: [{ key: 'identityResolution', label: 'Суммарный показатель идентичности', items: [1, 2, 3, 4, 5, 6], reverseItems: [], aggregation: 'sum' }],
};

export const isriRuValidationCases: ValidationCase[] = [
  { title: 'Минимум: диффузная идентичность', answers: Object.fromEntries(Array.from({ length: 6 }, (_, i) => [String(i + 1), 0])), expected: { identityResolution: 0 } },
  { title: 'Максимум: достигнутая идентичность', answers: Object.fromEntries(Array.from({ length: 6 }, (_, i) => [String(i + 1), 4])), expected: { identityResolution: 24 } },
  { title: 'Граница моратория/предрешённой идентичности', answers: { '1': 2, '2': 2, '3': 2, '4': 2, '5': 2, '6': 2 }, expected: { identityResolution: 12 } },
];
