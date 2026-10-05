import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Совсем неверно' },
  { value: '2', label: 'Редко верно' },
  { value: '3', label: 'Иногда верно' },
  { value: '4', label: 'Часто верно' },
  { value: '5', label: 'Всегда верно' },
];

const items = [
  'Я быстро занимаю оборонительную позицию при споре с ребенком.',
  'Я понимаю, о чем думает мой ребенок, даже если он/она не рассказывает мне об этом.',
  'Я принимаю, что у моего ребенка может быть мнение, отличное от моего.',
  'Я слушаю своего ребенка вполуха, потому что занят другими мыслями.',
  'Я предупреждаю своего ребенка спокойным голосом.',
  'Я не могу сдерживать эмоции, споря с ребенком.',
  'Я легко отвлекаюсь на другое, когда мы с ребенком делаем что-то вместе.',
  'Я быстро раздражаюсь, если мой ребенок отвлекает меня, когда я занимаюсь чем-то другим.',
  'Я понимаю, что чувствует мой ребенок, просто вглянув на него/нее.',
  'Я принимаю своего ребенка таким, какой он есть.',
  'Я терпелив(а) со своим ребенком.',
  'Я с трудом успокаиваюсь после ссора/спора с ребенком.',
  'Я замечаю изменения в настроении своего ребенка.',
  'Я выслушиваю своего ребенка, не осуждая и не критикуя его/ее.',
  'В занятиях со своим ребенком, я часто тороплюсь, не уделяя ему должного внимания.',
  'Я понимаю, почему мой ребенок ведет себя так, а не иначе.',
  'Моему ребенку нужно позвать меня несколько раз, чтобы я обратил на него/нее внимание, даже если мы находимся в одной комнате.',
  'Я терпим(а) к недостаткам моего ребенка.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1362_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1362',
  title: 'Осознанное родительство для родителей (MPIP), русская адаптация',
  description: 'MPIP оценивает осознанное родительство матерей и отцов детей от 0,5 до 18 лет: принятие и сострадание к ребенку, понимание его мыслей и чувств, присутствие во взаимодействии «здесь и сейчас» и родительскую саморегуляцию. Опросник помогает описать эти стороны детско-родительских отношений в исследовательских и оценочных опросах.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'acceptance_compassion', label: 'Принятие и сострадание по отношению к ребенку (ACC)', items: [3, 5, 11, 10, 14, 18], reverseItems: [], aggregation: 'sum' },
    { key: 'being_mindful_with_child', label: 'Присутствие «здесь и сейчас» с ребенком (BMC)', items: [1, 4, 7, 15, 17], reverseItems: [1, 4, 7, 15, 17], aggregation: 'sum' },
    { key: 'awareness_child', label: 'Понимание ребенка (AC)', items: [2, 9, 13, 16], reverseItems: [], aggregation: 'sum' },
    { key: 'overall', label: 'Общий показатель осознанного родительства', items: Array.from({ length: 18 }, (_, i) => i + 1), reverseItems: [1, 4, 7, 15, 17, 6, 8, 12], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Вручную проверено: все ответы по центру шкалы',
    answers: Object.fromEntries(Array.from({ length: 18 }, (_, index) => [String(index + 1), 3])),
    expected: { acceptance_compassion: 18, being_mindful_with_child: 15, awareness_child: 12, overall: 54 },
  },
  {
    title: 'Вручную проверено: все прямые ответы максимальны, все реверсивные минимальны',
    answers: Object.fromEntries(Array.from({ length: 18 }, (_, index) => [String(index + 1), [1, 4, 6, 7, 8, 12, 15, 17].includes(index + 1) ? 1 : 5])),
    expected: { acceptance_compassion: 30, being_mindful_with_child: 25, awareness_child: 20, overall: 90 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'mpip-ru-savenysheva-2025-18items-reverse-1-4-7-15-17-6-8-12-v1',
};
