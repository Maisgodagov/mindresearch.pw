import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Не было такого' },
  { value: '2', label: 'Очень редко' },
  { value: '3', label: 'Редко' },
  { value: '4', label: 'Иногда' },
  { value: '5', label: 'Часто' },
  { value: '6', label: 'Очень часто' },
  { value: '7', label: 'Всё время' },
];

const prompts = [
  'Как часто за последние 2 недели вы чувствовали воодушевление от того, что вы находитесь в принимающей стране (стране проживания)?',
  'Как часто за последние 2 недели вы чувствовали себя неуместно, как будто вы не вписываетесь в культуру принимающей страны?',
  'Как часто за последние 2 недели вы чувствовали грусть от того, что вы находитесь вдали от родной страны?',
  'Как часто за последние 2 недели вы чувствовали тревогу по поводу того, как вести себя в определенных ситуациях?',
  'Как часто за последние 2 недели вы чувствовали себя одиноким вдали от семьи и друзей из вашей родной страны?',
  'Как часто за последние 2 недели вы чувствовали тоску по дому, когда думали о родной стране?',
  'Как часто за последние 2 недели вы чувствовали разочарование, вызванное трудностями с адаптацией к принимающей стране?',
  'Как часто за последние 2 недели вы чувствовали удовлетворение своей повседневной жизнью в принимающей стране?',
];

const questions: SeedSection['questions'] = prompts.map((text, index) => ({
  code: `test_479_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_479',
  title: 'Краткая шкала психологической адаптации (BPAS)',
  description: 'BPAS измеряет эмоционально-психологическую адаптацию людей, живущих в новом культурном контексте: позитивные чувства к жизни в принимающей стране и негативные переживания, связанные с культурной неуместностью, тревогой, одиночеством и тоской по родине. Шкала подходит для исследовательских опросов мигрантов и других людей, переживающих культурное перемещение; представлена русскоязычная версия Ооки и Вачкова для взрослых русскоязычных мигрантов.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'psychological_adaptation', label: 'Психологическая адаптация BPAS', items: [1, 2, 3, 4, 5, 6, 7, 8], reverseItems: [2, 3, 4, 5, 6, 7], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы минимальные: реверсивные пункты преобразуются в 7',
    answers: { '1': 1, '2': 1, '3': 1, '4': 1, '5': 1, '6': 1, '7': 1, '8': 1 },
    expected: { psychological_adaptation: 32 },
  },
  {
    title: 'Позитивные пункты максимальны, негативные минимальны: максимальная адаптация',
    answers: { '1': 7, '2': 1, '3': 1, '4': 1, '5': 1, '6': 1, '7': 1, '8': 7 },
    expected: { psychological_adaptation: 56 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'bpas-ohki-vachkov-2022-demes-geeraert-2014-reverse-2-7-sum-v1',
};
