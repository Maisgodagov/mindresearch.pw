import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const answerOptions = [
  { value: '1', label: 'Согласен' },
  { value: '0', label: 'Затрудняюсь ответить' },
  { value: '-1', label: 'Не согласен' },
];

const items = [
  'В наши дни человеку приходится жить сегодняшним днём, предоставляя будущему заботиться о себе самому.',
  'Несмотря на то, что говорят некоторые люди, положение обычного человека ухудшается, а не улучшается.',
  'При нынешних перспективах едва ли справедливо приводить в этот мир ребёнка.',
  'Нет особого смысла обращаться к государственным чиновникам: они часто на самом деле не заинтересованы в проблемах обычного человека.',
  'В наши дни человек не всегда знает, на кого может положиться.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2065_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: answerOptions,
}));

export const instrument: SeedSection = {
  code: 'test_2065',
  title: 'Шкала аномии Сроула (первоначальная пяти-пунктовая версия)',
  description: 'Пяти-пунктовая шкала оценивает индивидуальную аномию как ослабление чувства связи с обществом и уверенности в социальном порядке. Пункты охватывают пессимизм относительно будущего и положения обычных людей, отчуждение от публичных институтов и неуверенность в надёжности окружающих. Предназначена для исследовательских опросов взрослых; сама по себе не является диагностическим инструментом.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 1,
  scales: [
    {
      key: 'anomia',
      label: 'Сумма аномических ответов',
      items: [1, 2, 3, 4, 5],
      reverseItems: [],
      aggregation: 'sum',
    },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Согласие со всеми пятью аномическими утверждениями даёт 5 баллов',
    answers: { '1': 1, '2': 1, '3': 1, '4': 1, '5': 1 },
    expected: { anomia: 5 },
  },
  {
    title: 'Несогласие или неопределённый ответ не добавляют баллов',
    answers: { '1': -1, '2': 0, '3': -1, '4': 0, '5': -1 },
    expected: { anomia: 0 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'srole-anomia-5item-lytkina-ru-v1',
};
