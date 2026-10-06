import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Полностью не согласна' },
  { value: '2', label: 'Скорее не согласна' },
  { value: '3', label: 'Скорее согласна' },
  { value: '4', label: 'Полностью согласна' },
];

const items = [
  'Быть матерью — это то, что меня воодушевляет',
  'Я часто сомневаюсь, действительно ли я хочу быть матерью',
  'Когда я представляю, как взаимодействую со своим ребенком, то чувствую себя неуверенной и подавленной',
  'Быть матерью для меня сейчас означает двигаться вперед и развиваться в жизни',
  'Я часто ловлю себя на мысли, что сожалею о том, что стала (стану) матерью',
  'Быть матерью — это то, чего я, без сомнения, хочу',
  'Иногда я испытываю сильное неприятие или страх по поводу материнства',
  'Мне всегда было ясно, что я хочу быть матерью',
  'Я часто хочу изменить свое решение стать матерью',
  'Когда я думаю о материнстве, я испытываю положительные и отрицательные чувства одновременно',
  'Если бы у меня были сомнения по поводу материнства, я бы открыто поделилась ими со своей семьей',
  'Если бы у меня были сомнения по поводу материнства, я бы открыто поделилась ими со своей подругой',
  'Если бы у меня были сомнения по поводу материнства, я бы открыто поделилась ими со своим партнером (если у вас нет партнера, подумайте, что бы вы сделали, если бы у вас он был)',
  'Если бы у меня были какие-либо сомнения по поводу материнства, я бы, вероятно, держала их в себе',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2200_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2200',
  title: 'Шкала материнской амбивалентности (MAS), русскоязычная адаптация',
  description: 'Русскоязычная адаптация MAS оценивает выраженность компонентов материнской амбивалентности: сомнений в желании быть матерью, неприятия материнства и сокрытия связанных с ним противоречивых переживаний от близких. Она помогает автору опроса отдельно изучать эти эмоциональные и поведенческие аспекты у женщин, воспитывающих детей до трех лет и испытывающих трудности в родительстве; беременная версия обозначена авторами как перспективное применение, требующее дополнительной оценки.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 4,
  scales: [
    { key: 'doubts', label: 'Сомнения', items: [2, 3, 5, 7, 9, 10], reverseItems: [], aggregation: 'sum' },
    { key: 'rejection', label: 'Неприятие', items: [1, 4, 6, 8], reverseItems: [1, 4, 6, 8], aggregation: 'sum' },
    { key: 'concealment', label: 'Сокрытие', items: [11, 12, 13, 14], reverseItems: [11, 12, 13], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Вручную проверено: минимальные ответы после реверсирования дают суммы 6, 16 и 13',
    answers: Object.fromEntries(Array.from({ length: 14 }, (_, index) => [String(index + 1), 1])),
    expected: { doubts: 6, rejection: 16, concealment: 13 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'mas-korgozha-shvets-ru-2025-three-subscales-reverse-key-v1',
};
