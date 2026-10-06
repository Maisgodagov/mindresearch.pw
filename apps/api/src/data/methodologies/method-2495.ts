import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const answers = Array.from({ length: 10 }, (_, value) => ({
  value: String(value),
  label: value === 0 ? 'Абсолютно не согласен' : value === 9 ? 'Абсолютно согласен' : String(value),
}));

const items = [
  'Обычно я чувствую, что люди разделяют мои взгляды на жизнь.',
  'Я часто реагирую на происходящее так же, как и окружающие.',
  'Окружающие склонны реагировать на события в том же ключе, что и я.',
  'Люди редко видят ситуацию так же, как и я.',
  'Люди обычно не могут понять, что я испытал.',
  'Люди часто смотрят на вещи с той же перспективы, что и я.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2513_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: answers,
}));

export const instrument: SeedSection = {
  code: 'test_2513',
  title: 'Шкала экзистенциальной изоляции (EIS), русскоязычная адаптация Авериной и Лебедевой (2024)',
  description: 'Шкала измеряет выраженность переживания экзистенциальной изоляции — ощущения, что собственный опыт и взгляд на мир трудно разделить с другими и быть ими полностью понятым. Шесть утверждений охватывают воспринимаемое сходство реакций и взглядов окружающих, а также чувство непонятости личного опыта. Подходит для русскоязычных участников исследований; опубликованная адаптация проверялась на взрослых респондентах 18–78 лет.',
  categoryIds: ['meaning-concerns'],
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 9,
  scales: [
    { key: 'existential_isolation', label: 'Экзистенциальная изоляция', items: [1, 2, 3, 4, 5, 6], reverseItems: [1, 2, 3, 6], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы 0: обратные пункты дают 9, прямые — 0',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 0])),
    expected: { existential_isolation: 36 },
  },
  {
    title: 'Все ответы 9: обратные пункты дают 0, прямые — 9',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 9])),
    expected: { existential_isolation: 18 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'eis-averina-lebedeva-2024-v1',
};
