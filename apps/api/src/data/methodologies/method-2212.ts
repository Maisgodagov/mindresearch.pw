import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Совершенно не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'И согласен, и не согласен' },
  { value: '4', label: 'Согласен' },
  { value: '5', label: 'Совершенно согласен' },
];

const items = [
  'Я чувствовал, что меня ценят.',
  'Мне было комфортно выражать себя.',
  'Я чувствовал, что другие принимают меня.',
  'Я чувствовал, что меня понимают.',
  'Я чувствовал, что другие меня понимают.',
  'Я чувствовал, что меня уважают.',
  'Был кто-то, рядом с кем я чувствовал себя в безопасности.',
  'Был кто-то, кому я мог доверять.',
  'Я чувствовал поддержку со стороны других.',
  'Я чувствовал, что другие меня слышат.',
  'Я чувствовал, что люди постарались бы мне помочь.',
  'Я чувствовал заботу о себе.',
  'Я чувствовал, что нужен другим.',
  'Я не чувствовал осуждения со стороны других.',
  'Я чувствовал, что способен сопереживать другим людям.',
  'Я чувствовал, что при необходимости могу утешить другого человека.',
  'Я испытывал сострадание к другим.',
  'Мне хотелось помочь другим расслабиться.',
  'Я чувствовал, что могу утешить близкого человека.',
  'Я чувствовал такую связь с другими, что хотел им помочь.',
  'Я чувствовал заботу о других.',
  'Мой пульс был ровным.',
  'Мне было легко дышать.',
  'Мой голос звучал обычно.',
  'Моё тело было расслаблено.',
  'У меня было спокойно в животе.',
  'Моё дыхание было ровным.',
  'Я чувствовал, что могу спокойно оставаться на месте.',
  'Моё лицо было расслаблено.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2228_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

const instrument: SeedSection = {
  code: 'test_2228',
  title: 'Шкала нейроцепции в психологической безопасности (NPSS)',
  description: 'NPSS оценивает субъективное чувство психологической безопасности в конкретной недавней ситуации через три аспекта: социальную вовлечённость и принятие, способность к состраданию и телесные ощущения спокойствия. Подходит для взрослых респондентов в исследовательском или клиническом контексте; показатели помогают автору опроса описать чувство безопасности в отношениях и телесной регуляции, но не являются диагностическим заключением.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'socialEngagement', label: 'Социальная вовлечённость', items: Array.from({ length: 14 }, (_, i) => i + 1), reverseItems: [], aggregation: 'sum' },
    { key: 'compassion', label: 'Сострадание', items: Array.from({ length: 7 }, (_, i) => i + 15), reverseItems: [], aggregation: 'sum' },
    { key: 'bodySensations', label: 'Телесные ощущения', items: Array.from({ length: 8 }, (_, i) => i + 22), reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  { title: 'Минимальный ответ по всем пунктам', answers: Object.fromEntries(items.map((_, i) => [String(i + 1), 1])), expected: { socialEngagement: 14, compassion: 7, bodySensations: 8 } },
  { title: 'Максимальный ответ по всем пунктам', answers: Object.fromEntries(items.map((_, i) => [String(i + 1), 5])), expected: { socialEngagement: 70, compassion: 35, bodySensations: 40 } },
];

export const methodology: MethodologyRegistration = {
  categoryIds: ["meaning-satisfaction"],
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'npss-morton-29-ru-v1',
};
