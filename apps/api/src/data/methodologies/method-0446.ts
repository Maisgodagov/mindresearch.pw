import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Полностью не согласен/не согласна' },
  { value: '2', label: 'Не согласен/не согласна' },
  { value: '3', label: 'Скорее не согласен/не согласна' },
  { value: '4', label: 'Ни согласен, ни не согласен/не согласна' },
  { value: '5', label: 'Скорее согласен/согласна' },
  { value: '6', label: 'Согласен/согласна' },
  { value: '7', label: 'Полностью согласен/согласна' },
];

const items = [
  'Частота сексуальных отношений меня устраивает.',
  'В моей сексуальной жизни нет ничего тревожного.',
  'В моей сексуальной жизни много физического удовольствия.',
  'Я считаю себя сексуально удовлетворенным/удовлетворенной.',
  'У меня нет проблем с реализацией своих сексуальных фантазий.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_482_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_482',
  title: 'Краткая шкала сексуального благополучия (SSWBS), 7-балльная русскоязычная форма',
  description: 'SSWBS оценивает субъективное сексуальное благополучие: удовлетворённость частотой сексуальных отношений, отсутствие сексуального дистресса, физическое удовольствие, эмоциональную сексуальную наполненность и возможность реализации сексуальных фантазий. Пяти пунктов достаточно для краткой исследовательской оценки у взрослых, включая цисгендерных и трансгендерных респондентов; прямое сравнение групп следует интерпретировать с осторожностью.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'sswbs', label: 'Субъективное сексуальное благополучие', items: [1, 2, 3, 4, 5], reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы «Ни согласен, ни не согласен»: среднее равно 4',
    answers: { '1': 4, '2': 4, '3': 4, '4': 4, '5': 4 },
    expected: { sswbs: 4 },
  },
  {
    title: 'Все ответы полностью согласны: среднее равно 7',
    answers: { '1': 7, '2': 7, '3': 7, '4': 7, '5': 7 },
    expected: { sswbs: 7 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'sswbs-gerymski-2021-7point-mean-v1',
};

