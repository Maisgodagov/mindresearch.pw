import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Не согласен' },
  { value: '2', label: 'Скорее не согласен' },
  { value: '3', label: 'Скорее согласен' },
  { value: '4', label: 'Согласен' },
];

const items = [
  'Обычно я вполне удовлетворён результатом своей работы.',
  'Я зациклен на своих профессиональных ошибках и неудачах.',
  'Мне бы хотелось быть лучшим, а не просто компетентным специалистом.',
  'Только безупречный результат работы говорит об истинном профессионализме.',
  'Настоящий профессионал не имеет права на ошибку.',
  'Я считаю допустимым результат выше среднего в своей работе.',
  'Мне страшно, что коллеги обнаружат мой непрофессионализм.',
  'Даже опытный специалист может совершить ошибку в своей работе.',
  'Я согласен с тем, что «главное — не победа, а участие».',
  'Для меня важнее получить удовольствие от работы, чем признание за неё.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2341_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

const instrument: SeedSection = {
  code: 'test_2341',
  title: 'Шкала профессионального перфекционизма (ШПП)',
  description: 'Шкала оценивает профессиональный перфекционизм у взрослых работающих респондентов по двум отдельным аспектам: позитивному стремлению к высоким, но реалистичным стандартам и негативным нереалистичным или труднодостижимым требованиям к себе в работе. Помогает различать эти тенденции в контексте психологии труда и организационных опросов.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 4,
  scales: [
    { key: 'positiveProfessionalPerfectionism', label: 'Позитивный профессиональный перфекционизм', items: [1, 6, 8, 9, 10], reverseItems: [], aggregation: 'sum' },
    { key: 'negativeProfessionalPerfectionism', label: 'Негативный профессиональный перфекционизм', items: [2, 3, 4, 5, 7], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: все ответы 1 дают по 5 баллов в обеих субшкалах',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { positiveProfessionalPerfectionism: 5, negativeProfessionalPerfectionism: 5 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['trait-regulation'],
  scoringConfig,
  validationCases,
  formulaVersion: 'zolotareva-job-perfectionism-scale-2020-v1',
};
