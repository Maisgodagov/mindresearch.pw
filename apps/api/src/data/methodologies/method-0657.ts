import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Абсолютно не согласен' },
  { value: '2', label: 'Отчасти не согласен' },
  { value: '3', label: 'Не знаю' },
  { value: '4', label: 'Отчасти согласен' },
  { value: '5', label: 'Абсолютно согласен' },
];

const statements = [
  'За границей мне было бы приятно ощущать себя представителем именно своего народа.',
  'Хочу, чтобы мои друзья (подруги) были представителями разных народов России.',
  'Не хотелось бы, чтобы все нации постепенно смешивались, каждый точно должен знать свои корни.',
  'Для человека важнее ощущать себя прежде всего представителем своего народа, а не гражданином России.',
  'Я не уверен, что являюсь представителем того народа, к которому относят меня окружающие.',
  'Мне неприятно лишний раз вспоминать о своей национальности.',
  'Я верю, что конфликты между народами в нашем обществе в будущем прекратятся.',
  'Принадлежность к разным национальностям мешает людям, живущим в России, чувствовать себя единым народом.',
];

const questions: SeedSection['questions'] = statements.map((text, index) => ({
  code: `test_688_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_688',
  title: 'Методика оценки позитивности и неопределенности этнической идентичности',
  description: 'Методика Татарко и Лебедевой измеряет эмоциональную позитивность этнической идентичности и ясность ощущения себя представителем своего народа (неопределенность идентичности). Две отдельные шкалы помогают автору опроса различать эмоциональную валентность этнической принадлежности и определенность этнической самоидентификации; версия включает восемь утверждений с пятибалльной шкалой согласия.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'positivity', label: 'Позитивность этнической идентичности', items: [1, 2, 3, 4], reverseItems: [2, 4], aggregation: 'mean' },
    { key: 'uncertainty', label: 'Неопределенность этнической идентичности', items: [5, 6, 7, 8], reverseItems: [5, 6], aggregation: 'mean' },
  ],
};

const answers = (values: number[]) => Object.fromEntries(values.map((value, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: ответы 1..8 по порядку; после реверсирования средние равны 3,5 и 2,5',
    answers: answers([1, 2, 3, 4, 5, 1, 2, 3]),
    expected: { positivity: 3.5, uncertainty: 2.5 },
  },
  {
    title: 'Ручная проверка: нейтральные ответы дают средние 3 по обеим шкалам',
    answers: answers(Array(8).fill(3)),
    expected: { positivity: 3, uncertainty: 3 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'tatarko-lebedeva-ethnic-identity-positivity-uncertainty-2011-v1',
};
