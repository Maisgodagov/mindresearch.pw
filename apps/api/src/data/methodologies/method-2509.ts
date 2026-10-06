import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const itemTexts = [
  'Я с нетерпением жду своего будущего',
  'Я не удовлетворен своей нынешней жизнью',
  'У меня очень счастливые воспоминания о детстве',
  'Я сомневаюсь, что смогу чего-то добиться в жизни в будущем',
  'Я доволен своей нынешней жизнью',
  'Я хотел бы забыть свою прошлую жизнь',
  'Мое будущее делает меня счастливым',
  'Я испытываю негативные чувства по поводу своего нынешнего положения',
  'У меня хорошие воспоминания о том, как я рос',
  'Я сомневаюсь, что стану значимым человеком в будущем',
  'Я доволен своим нынешним положением',
  'Я не доволен своим прошлым',
  'Я с улыбкой смотрю в будущее',
  'Я доволен своей жизнью сейчас',
  'Мое прошлое заставляет меня грустить',
  'Мысли о будущем навевают на меня грусть',
  'В целом, я доволен тем, что делаю сейчас',
  'Я бы хотел, чтобы мое прошлое было другим',
  'Меня радует мое будущее',
  'Я не доволен тем, как я живу сейчас',
  'Я с удовольствием думаю о своем прошлом',
  'Мне не нравится думать о своем будущем',
  'Я не счастлив в своей нынешней жизни',
  'Мне нравится думать о своей прошлой жизни, потому что в ней я был счастлив',
  'Думать наперед бессмысленно',
  'В целом, я счастлив в своей нынешней жизни',
  'У меня есть неприятные мысли о моем прошлом',
  'Мысли о будущем вызывают во мне радость',
  'Моя нынешняя жизнь заставляет меня тревожиться',
  'Мое прошлое полно счастливых воспоминаний',
];

const responseOptions = [
  { value: '1', label: 'Совершенно не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'И да, и нет' },
  { value: '4', label: 'Согласен' },
  { value: '5', label: 'Абсолютно согласен' },
];

const questions: SeedSection['questions'] = itemTexts.map((text, index) => ({
  code: `test_2527_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: responseOptions,
}));

export const instrument: SeedSection = {
  code: 'test_2527',
  title: 'Шкала юношеского отношения ко времени (ATAS)',
  description: 'ATAS измеряет позитивное и негативное отношение подростков к прошлому, настоящему и будущему по шести отдельным аспектам: позитивное и негативное отношение к каждому временному периоду. Шкала предназначена для изучения временной перспективы в подростковом возрасте; в русскоязычной версии Хегай (2025) не предусмотрен единый общий балл, поэтому результаты рассматриваются по шести субшкалам.',
  categoryIds: ['trait-goal'],
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'pastPositive', label: 'Прошлое позитивно', items: [3, 9, 21, 24, 30], reverseItems: [], aggregation: 'sum' },
    { key: 'pastNegative', label: 'Прошлое негативно', items: [6, 12, 15, 18, 27], reverseItems: [], aggregation: 'sum' },
    { key: 'presentPositive', label: 'Настоящее позитивно', items: [5, 11, 14, 17, 26], reverseItems: [], aggregation: 'sum' },
    { key: 'presentNegative', label: 'Настоящее негативно', items: [2, 8, 20, 23, 29], reverseItems: [], aggregation: 'sum' },
    { key: 'futurePositive', label: 'Будущее позитивно', items: [1, 7, 13, 19, 28], reverseItems: [], aggregation: 'sum' },
    { key: 'futureNegative', label: 'Будущее негативно', items: [4, 10, 16, 22, 25], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка ключа: ответ 1 на все пункты даёт 5 баллов по каждой субшкале',
    answers: Object.fromEntries(itemTexts.map((_, index) => [String(index + 1), 1])),
    expected: {
      pastPositive: 5,
      pastNegative: 5,
      presentPositive: 5,
      presentNegative: 5,
      futurePositive: 5,
      futureNegative: 5,
    },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['trait-goal'],
  scoringConfig,
  validationCases,
  formulaVersion: 'atas-khegay-2025-v1',
};
