import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'никогда' },
  { value: '1', label: 'редко' },
  { value: '2', label: 'иногда' },
  { value: '3', label: 'часто' },
  { value: '4', label: 'очень часто' },
];

const items = [
  'бьется ли мое сердце',
  'достаточно хорошо ли я владею социальными навыками',
  'веду ли я себя напряженно',
  'бегло ли я говорю',
  'контролирую ли я свое дыхание',
  'насколько хорошо я участвую в разговоре',
  'выгляжу ли я напряжённо',
  'прилично ли я себя веду',
  'краснею ли я, дрожу или потею',
  'понимаю ли я, что говорят другие',
  'насколько напряженно я себя чувствую',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2501_${index + 1}`,
  text: `${index === 0 ? 'В присутствии других людей я постоянно сосредотачиваюсь на том…\n' : ''}${text}`,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2501',
  title: 'Шкала фокуса внимания на себе (SFAS), русскоязычная адаптация 2023 года',
  description: 'Однофакторная шкала оценивает устойчивую склонность направлять внимание на себя в присутствии других людей: на телесное возбуждение и напряжение, а также на собственное социальное поведение и его успешность. Подходит для русскоязычной взрослой общей выборки; сама по себе не является диагностическим инструментом.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 4,
  scales: [
    { key: 'self_focused_attention', label: 'Фокус внимания на себе', items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  { title: 'Все ответы «никогда»', answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 0])), expected: { self_focused_attention: 0 } },
  { title: 'Все ответы «очень часто»', answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 4])), expected: { self_focused_attention: 44 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['self-awareness'],
  scoringConfig,
  validationCases,
  formulaVersion: 'sfas-boegels-lebedkin-knyazev-2023-ru-v1',
};
