import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = Array.from({ length: 7 }, (_, index) => ({
  value: String(index + 1),
  label: index === 0 ? 'Совсем не согласен' : index === 6 ? 'Полностью согласен' : String(index + 1),
}));

const items = [
  'Я надеюсь на лучшее.',
  'Я нашел свой личностный смысл в текущей ситуации.',
  'Я делаю что-то продуктивное каждый день.',
  'Я помогаю другим в это время.',
  'Я продолжаю делать то, что важнее всего в моей жизни.',
  'Я верю, что из этого выйдет что-то позитивное.',
  'Я использую эту ситуацию, чтобы стать ближе со своими любимыми людьми.',
  'Я благодарен за свою жизнь, как она есть.',
  'Когда это закончится, я буду сильнее, чем был раньше.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_708_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_708',
  title: 'Методика смыслового совладания (MCCS), русскоязычная адаптация',
  description: 'Методика оценивает выраженность смыслового совладания в ответ на трудную ситуацию: надежду, личностное переосмысление, продуктивную и значимую деятельность, просоциальность, близость с другими, благодарность и ожидаемый личностный рост. Русскоязычная адаптация проверялась на взрослых и студенческой выборках; формулировки бланка привязаны к контексту пандемии COVID-19, поэтому при использовании для другой стрессовой ситуации контекст следует учитывать отдельно.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    {
      key: 'meaningCenteredCoping',
      label: 'Смысловое совладание',
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      reverseItems: [],
      aggregation: 'sum',
    },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы минимальные: сумма равна 9',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { meaningCenteredCoping: 9 },
  },
  {
    title: 'Все ответы максимальные: сумма равна 63',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 7])),
    expected: { meaningCenteredCoping: 63 },
  },
  {
    title: 'Проверка единого ключа на пункте 1 при минимальных остальных ответах',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), index === 0 ? 7 : 1])),
    expected: { meaningCenteredCoping: 15 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'mccs-leontiev-rasskazova-taranenko-2025-ru-v1',
};
