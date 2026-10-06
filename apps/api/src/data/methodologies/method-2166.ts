import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: 'yes', label: 'Да' },
  { value: 'no', label: 'Нет' },
];

const prompts = [
  'Вы когда-нибудь забывали принять препараты?',
  'Не относитесь ли Вы иногда невнимательно к часам приема лекарственных средств?',
  'Не пропускаете ли Вы прием препаратов, если чувствуете себя хорошо?',
  'Если Вы чувствуете себя плохо после приема лекарственных средств, не пропускаете ли Вы следующий прием?',
];

const questions: SeedSection['questions'] = prompts.map((text, index) => ({
  code: `test_2180_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2180',
  title: 'Шкала комплаентности Мориски—Грин (4 пункта)',
  description: 'Краткая шкала предварительно оценивает приверженность лекарственной терапии по четырём типичным проявлениям: забывчивости, невнимательности ко времени приёма и пропуску препаратов при улучшении или ухудшении самочувствия. Подходит для скрининговой оценки взрослых пациентов, принимающих назначенные препараты; результат помогает автору опроса выявить возможные трудности соблюдения схемы лечения, но сам по себе не является диагнозом.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 1,
  scales: [{
    key: 'adherence',
    label: 'Приверженность лекарственной терапии',
    items: [1, 2, 3, 4],
    reverseItems: [],
    aggregation: 'sum',
    itemScores: {
      1: { yes: 0, no: 1 },
      2: { yes: 0, no: 1 },
      3: { yes: 0, no: 1 },
      4: { yes: 0, no: 1 },
    },
  }],
};

export const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: все ответы «Нет» дают максимальную приверженность',
    answers: { '1': 'no', '2': 'no', '3': 'no', '4': 'no' },
    expected: { adherence: 4 },
  },
  {
    title: 'Ручная проверка: один ответ «Да» снижает сумму на один балл',
    answers: { '1': 'yes', '2': 'no', '3': 'no', '4': 'no' },
    expected: { adherence: 3 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'morisky-green-4-ru-yes0-no1-sum-v1',
};
