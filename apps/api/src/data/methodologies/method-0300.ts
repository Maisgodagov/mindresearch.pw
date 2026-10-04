import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Категорически не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Частично согласен' },
  { value: '4', label: 'Согласен' },
  { value: '5', label: 'Полностью согласен' },
];

const items = [
  'Я часто замечаю, что злюсь на людей или ситуации.',
  'Когда я злюсь, я злюсь очень сильно.',
  'Когда я злюсь, я остаюсь злым еще какое-то время.',
  'Когда я злюсь на кого-то, мне хочется ударить этого человека.',
  'Мой гнев мешает мне выполнять работу или заниматься другими делами.',
  'Мой гнев мешает мне ладить с людьми так хорошо, как я хотел бы.',
  'Мой гнев негативно сказывается на моем здоровье.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_332_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_332',
  title: 'Измерение реакций гнева (DAR-R)',
  description: 'Русскоязычная взрослая версия DAR-R оценивает выраженность реакций гнева: частоту, интенсивность и длительность переживания, импульс к физической агрессии, а также связанные с гневом нарушения работы, отношений и здоровья. Подходит для описания общей реакции гнева и двух аспектов — реагирования гневом и функциональных нарушений; сама по себе не является диагностическим заключением.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'anger_response', label: 'Реагирование гневом', items: [1, 2, 3, 4], reverseItems: [], aggregation: 'sum' },
    { key: 'anger_impairment', label: 'Нарушения, вызванные гневом', items: [5, 6, 7], reverseItems: [], aggregation: 'sum' },
    { key: 'total_anger_reaction', label: 'Общая реакция гнева', items: [1, 2, 3, 4, 5, 6, 7], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы «Категорически не согласен»: минимальные суммы',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { anger_response: 4, anger_impairment: 3, total_anger_reaction: 7 },
  },
  {
    title: 'Проверка разделения субшкал на пунктах 1–4 и 5–7',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), index < 4 ? 5 : 1])),
    expected: { anger_response: 20, anger_impairment: 3, total_anger_reaction: 23 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'novaco-dar-r-shmarina-blinova-2025-v1',
};
