import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const statements = [
  'Добиться признания и уважения.', 'Иметь тёплые отношения с людьми.', 'Обеспечить себе будущее.',
  'Зарабатывать на жизнь.', 'Иметь хороших собеседников.', 'Упрочить своё положение.',
  'Развивать свои силы и способности.', 'Обеспечить себе материальный комфорт.',
  'Повышать уровень мастерства и компетентности.', 'Избегать неприятностей.',
  'Стремиться к новому и неизведанному.', 'Обеспечить себе положение влияния.',
  'Покупать хорошие вещи.', 'Заниматься делом, требующим полной отдачи.', 'Быть понятым другими.',
];

const pairs: { first: number; second: number }[] = [];
for (let first = 0; first < 15; first += 1) {
  for (let second = first + 1; second < 15; second += 1) pairs.push({ first, second });
}

const questions: SeedSection['questions'] = pairs.map(({ first, second }, index) => ({
  code: `test_1433_${index + 1}`,
  text: `Я хочу… ${statements[first]} Или: ${statements[second]}`,
  type: 'single', required: true,
  options: [
    { value: String(first + 1), label: statements[first].replace(/\.$/, '') },
    { value: String(second + 1), label: statements[second].replace(/\.$/, '') },
  ],
}));

const groups = [
  { key: 'material', label: 'Материальные потребности', statements: [4, 8, 13] },
  { key: 'safety', label: 'Потребность в безопасности', statements: [3, 6, 10] },
  { key: 'social', label: 'Потребность в социальных контактах', statements: [2, 5, 15] },
  { key: 'recognition', label: 'Потребность в признании', statements: [1, 9, 12] },
  { key: 'self_expression', label: 'Потребность в самовыражении', statements: [7, 11, 14] },
];

export const instrument: SeedSection = {
  code: 'test_1433',
  title: 'Пирамида потребностей (модификация И. А. Акиндиновой)',
  description: 'Методика оценивает актуальность пяти групп потребностей взрослого человека в модели Маслоу: материальных, безопасности, социальных контактов, признания и самовыражения. Попарный вынужденный выбор между 15 желаниями помогает автору опроса увидеть относительную выраженность этих мотивационных приоритетов; версия И. А. Акиндиновой трактует баллы как актуальность потребностей.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 15,
  scales: groups.map((group) => ({
    key: group.key,
    label: group.label,
    items: pairs.map((_, index) => index + 1),
    reverseItems: [],
    weights: Object.fromEntries(pairs.map(({ first, second }, index) => [
      index + 1,
      group.statements.includes(first + 1) ? first + 1 : group.statements.includes(second + 1) ? second + 1 : 0,
    ])),
    aggregation: 'sum' as const,
  })),
};

const validationCases: ValidationCase[] = [
  {
    title: 'Вручную проверено: при выборе первого варианта в каждой паре баллы Aᵢ равны 14 для каждого утверждения; группы суммируют соответствующие три Aᵢ',
    answers: Object.fromEntries(pairs.map(({ first }, index) => [String(index + 1), String(first + 1)])),
    expected: { material: 126, safety: 84, social: 126, recognition: 84, self_expression: 126 },
  },
  {
    title: 'Вручную проверено: при выборе второго варианта в каждой паре баллы Aᵢ равны 14 для каждого утверждения; группы суммируют соответствующие три Aᵢ',
    answers: Object.fromEntries(pairs.map(({ second }, index) => [String(index + 1), String(second + 1)])),
    expected: { material: 126, safety: 84, social: 126, recognition: 84, self_expression: 126 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'ladanov-akindinova-paired-choice-needs-five-sums-v1',
};
