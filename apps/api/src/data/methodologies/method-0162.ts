import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const itemTexts = [
  'Я чувствую глубокую связь между собой и всем остальным человечеством.',
  'Для меня важно чувство принадлежности к мировому сообществу.',
  'Я чувствую себя тесно связанным с другими людьми, живущими на планете.',
  'Я осознаю, что являюсь частью мирового сообщества.',
  'Принадлежность к мировому сообществу является для меня важной частью ответа на вопрос о том, кто я такой.',
];

const options = [
  { value: '1', label: 'Совершенно не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Трудно сказать' },
  { value: '4', label: 'Согласен' },
  { value: '5', label: 'Полностью согласен' },
];

const questions: SeedSection['questions'] = itemTexts.map((text, index) => ({
  code: `test_197_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_197',
  title: 'Глобальная социальная идентификация',
  description: 'Пяти пунктовая шкала оценивает, насколько человек ощущает связь с человечеством и мировым сообществом, осознаёт принадлежность к нему и включает эту принадлежность в представление о себе. Подходит для взрослых респондентов в русской адаптации Т. А. Нестика; может использоваться авторами опросов для изучения глобальной идентичности.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [{
    key: 'globalSocialIdentification',
    label: 'Глобальная социальная идентификация',
    items: [1, 2, 3, 4, 5],
    reverseItems: [],
    aggregation: 'mean',
  }],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы минимальны — средний балл равен 1',
    answers: { '1': 1, '2': 1, '3': 1, '4': 1, '5': 1 },
    expected: { globalSocialIdentification: 1 },
  },
  {
    title: 'Контрольный смешанный набор — средний балл равен 3',
    answers: { '1': 1, '2': 2, '3': 3, '4': 4, '5': 5 },
    expected: { globalSocialIdentification: 3 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'reese-proch-cohrs-2014-nestik-2018-gsi-5item-mean-v1',
};
