import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'Совершенно не согласен' },
  { value: '1', label: 'Скорее не согласен' },
  { value: '2', label: 'Скорее согласен' },
  { value: '3', label: 'Полностью согласен' },
];

const items = [
  'Мой питомец значит для меня больше, чем некоторые из моих друзей.',
  'Я считаю, что мой питомец – это просто домашнее животное.',
  'Мой питомец знает, когда мне плохо.',
  'Я часто говорю с другими людьми о своем питомце.',
  'Я верю, что любовь к моему питомцу помогает мне оставаться здоровым.',
  'Домашние животные заслуживают того же уважения, что и люди.',
  'Мы очень близки с моим питомцем.',
  'Я часто играю со своим питомцем.',
  'Я считаю своего питомца отличным компаньоном.',
  'Мой питомец делает меня счастливым.',
  'Я считаю питомца своим другом.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_475_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

const instrument: SeedSection = {
  code: 'test_475',
  title: 'Краткая Лексингтонская шкала привязанности к домашним питомцам (B-LAPS)',
  description: 'Однофакторная шкала оценивает эмоциональную привязанность владельца к питомцу: близость, позитивные чувства и компаньонские отношения, а также уважение к животным. Предназначена для исследовательского изучения взрослых владельцев домашних животных; опубликованная русская версия проверялась в межкультурной выборке России, Индии, Италии и Польши.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 3,
  scales: [
    { key: 'attachment', label: 'Привязанность к домашнему питомцу', items: Array.from({ length: 11 }, (_, index) => index + 1), reverseItems: [2], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы по 0; обратный пункт дает 3',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 0])),
    expected: { attachment: 3 },
  },
  {
    title: 'Все ответы по 3; обратный пункт дает 0',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 3])),
    expected: { attachment: 30 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'b-laps-nartova-bochaver-et-al-2025-11items-0-3-reverse-2-v1',
};
