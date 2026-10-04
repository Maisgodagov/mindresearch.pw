import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Совершенно не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Затрудняюсь ответить' },
  { value: '4', label: 'Согласен' },
  { value: '5', label: 'Совершенно согласен' },
];

const items = [
  'Мне хочется прикрыть свое тело',
  'Мне хочется быть невидимкой',
  'Мне хочется скривиться от стыда или отвращения',
  'Мне хочется быть меньше',
  'Мне хочется спрятаться',
  'Я чувствую себя глупо',
  'Я чувствую себя плохим человеком',
  'Я чувствую себя уязвимым',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_477_${index + 1}`,
  text: `Когда я стою перед зеркалом… ${text.toLowerCase()}.`,
  type: 'single',
  required: true,
  options,
}));

const instrument: SeedSection = {
  code: 'test_477',
  title: 'Краткая шкала переживания телесного стыда (PBSS-R)',
  description: 'PBSS-R измеряет переживаемый телесный стыд через эмоциональные и поведенческие реакции при взгляде на свое тело: стремление прикрыться, стать незаметной или спрятаться, а также стыд, отвращение и уязвимость. Русскоязычная версия подходит для исследовательской и скрининговой оценки девушек подросткового и юношеского возраста (13–21 год); применимость к другим возрастам и мужчинам требует отдельной проверки.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'bodyShame', label: 'Переживание телесного стыда', items: [1, 2, 3, 4, 5, 6, 7, 8], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы минимальны: сумма восьми пунктов равна 8',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { bodyShame: 8 },
  },
  {
    title: 'Все ответы максимальны: сумма восьми пунктов равна 40',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 5])),
    expected: { bodyShame: 40 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'pbss-r-russian-polskaya-et-al-2026-v1',
};
