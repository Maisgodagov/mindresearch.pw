import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '4', label: 'Да, это так' },
  { value: '3', label: 'Вероятно, это так' },
  { value: '2', label: 'Вряд ли это так' },
  { value: '1', label: 'Это совсем не так' },
];

const items = [
  'Я чувствую, что могу доверить ему (ей) абсолютно все.',
  'Когда мы вместе, у нас всегда схожее настроение.',
  'Я могу сказать, что он (она) принадлежит только мне.',
  'Он (она) очень умный человек.',
  'Для нее (него) я готов(а) абсолютно на все.',
  'В большинстве случаев он (она) нравится людям почти сразу же после знакомства.',
  'Когда мне плохо, то хочется поделиться только с ним (ней).',
  'Я думаю, что мы с ним (ней) внутренне похожи друг на друга.',
  'Я чувствую себя в ответе за то, чтобы ему (ей) было хорошо.',
  'Мне хотелось бы быть похожим на него (нее).',
  'Мне приятно чувствовать, что он (она) доверяет мне больше других.',
  'Он (она) один (одна) из самых обаятельных мужчин (женщин), которых я знаю.',
  'Мне было бы очень тяжело, если бы пришлось жить без него (нее).',
  'Я уверен(а), что он (она) хорошо ко мне относится.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: 'test_2537_' + (index + 1),
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2537',
  title: 'Шкалы любви и симпатии (модификация Гозмана и Алешиной)',
  description: 'Опросник оценивает эмоциональное отношение к партнеру по двум отдельным аспектам: любовь (привязанность, забота и интимность) и симпатия (уважение, восхищение и воспринимаемое сходство). Он помогает автору опроса сравнить выраженность этих компонентов и общий уровень эмоционального отношения в диаде; русская 14-пунктовая версия описана для супружеских отношений и применялась также в исследованиях старших подростков.',
  categoryIds: ['close-love'],
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 4,
  scales: [
    { key: 'love', label: 'Любовь', items: [1, 3, 5, 7, 9, 11, 13], reverseItems: [], aggregation: 'sum' },
    { key: 'liking', label: 'Симпатия', items: [2, 4, 6, 8, 10, 12, 14], reverseItems: [], aggregation: 'sum' },
    { key: 'total', label: 'Общий уровень эмоциональных отношений', items: Array.from({ length: 14 }, (_, index) => index + 1), reverseItems: [], aggregation: 'sum' },
  ],
};

const allAnswers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Все ответы минимальны: обе шкалы по 7, общий балл 14', answers: allAnswers(1), expected: { love: 7, liking: 7, total: 14 } },
  { title: 'Все ответы максимальны: обе шкалы по 28, общий балл 56', answers: allAnswers(4), expected: { love: 28, liking: 28, total: 56 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'rubin-aleshina-gozman-love-liking-14item-v1',
};
