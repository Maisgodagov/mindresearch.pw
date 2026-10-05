import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'Редко' },
  { value: '1', label: 'Иногда' },
  { value: '2', label: 'Часто' },
  { value: '3', label: 'Всегда' },
];

const statements = [
  'Из-за неверных подсказок интуиции Вам случалось попадать в беду.',
  'Когда Вы поступаете вопреки интуиции, у Вас всё складывается хорошо.',
  'Вы попадали впросак из-за того, что следовали интуиции.',
  'Когда речь идёт о чём-то важном лично для Вас, интуиция Вас подводит.',
  'Когда речь идёт о Вас самих, у Вас нет уверенности в Вашей интуиции.',
  'Интуиция даёт Вам подсказки в работе с точностью до наоборот.',
  'Подсказки Вашей интуиции ошибочны.',
  'В трудных ситуациях Вас выручает правило: «Послушай интуицию и сделай наоборот».',
  'Когда речь идёт о близких Вам людях, интуиция даёт неверные подсказки.',
  'Интуиция Вас подводит в отношении Ваших планов.',
  'Ваши сны нужно толковать наоборот.',
];

const questions: SeedSection['questions'] = statements.map((text, index) => ({
  code: `test_965_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

const instrument: SeedSection = {
  code: 'test_965',
  title: 'Опросник для определения уровня обратной интуиции',
  description: 'Опросник П. Е. Григорьева оценивает выраженность обратной интуиции — переживания неверных или инвертированных интуитивных подсказок. Пункты охватывают неприятные последствия следования интуиции, ситуации вопреки ей, уверенность в интуитивных оценках себя, близких и планов, а также трактовку снов. Авторская проверка и стандартизация проводились на взрослых; форма предназначена для исследовательской оценки этого признака и не заменяет клиническую оценку.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 3,
  scales: [
    {
      key: 'reverse_intuition',
      label: 'Уровень обратной интуиции',
      items: Array.from({ length: 11 }, (_, index) => index + 1),
      reverseItems: [],
      aggregation: 'sum',
    },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы «редко»: сумма одиннадцати нулевых оценок равна 0',
    answers: Object.fromEntries(Array.from({ length: 11 }, (_, index) => [String(index + 1), 0])),
    expected: { reverse_intuition: 0 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'grigoryev-reverse-intuition-questionnaire-2025-raw-sum-v1',
};
