import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const answers = [
  { value: 'true', label: 'Верно' },
  { value: 'false', label: 'Неверно' },
];

const itemTexts = [
  'Я смотрю в будущее с надеждой и энтузиазмом.',
  'С тем же успехом я мог бы сдаться, потому что я не смогу сделать свою жизнь лучше.',
  'Когда дела идут плохо, мне помогает мысль, что так не может продолжаться вечно.',
  'Я не могу представить себе, как будет выглядеть моя жизнь через 10 лет.',
  'У меня достаточно времени, чтобы достичь того, чего я больше всего хочу.',
  'Я думаю, что в будущем мне удастся достичь того, в чем я действительно заинтересован.',
  'Я полагаю, что мне в жизни встретится больше хорошего, чем другим людям.',
  'Будущее представляется мне мрачным.',
  'Мне никак не удается хоть минуту передохнуть, и ничто не говорит о том, что в будущем станет иначе.',
  'Мой предыдущий опыт хорошо подготовил меня к будущему.',
  'Перспективы, которые я вижу перед собой, скорее неприятны, чем приятны.',
  'Не считаю, что я мог бы достичь того, в чем я действительно заинтересован.',
  'Когда я представляю себе будущее, я вижу себя более счастливым, чем сейчас.',
  'Боюсь, что мои дела не пойдут так, как я бы хотел.',
  'Я смотрю в будущее с доверием.',
  'Я никогда не достигну того, чего хочу.',
  'Очень маловероятно, чтобы когда-нибудь в будущем я был действительно доволен жизнью.',
  'Будущее представляется мне туманным и неопределенным.',
  'Я могу ожидать в жизни скорее хороших, чем плохих моментов.',
  'Не имеет смысла стараться чего-нибудь достичь, потому что я все равно этого не достигну.',
];

const questions: SeedSection['questions'] = itemTexts.map((text, index) => ({
  code: `test_2072_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: answers,
}));

export const instrument: SeedSection = {
  code: 'test_2072',
  title: 'Шкала безнадёжности Бека (русский перевод Горбаткова)',
  description: 'Методика оценивает негативные ожидания относительно будущего и связанное с ними переживание безнадёжности. В опубликованной русской версии отдельно представлены надежда/оптимизм и безнадёжность/пессимизм; версия подходит для исследований подростков и взрослых, но результаты следует трактовать с учётом выбранного формата и популяции.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 1,
  scales: [
    {
      key: 'hopelessness',
      label: 'Безнадёжность',
      items: [2, 4, 8, 9, 11, 12, 14, 16, 17, 18, 20],
      reverseItems: [],
      aggregation: 'sum',
      itemScores: Object.fromEntries([2, 4, 8, 9, 11, 12, 14, 16, 17, 18, 20].map(item => [item, { true: 1, false: 0 }])),
    },
    {
      key: 'hope',
      label: 'Надежда',
      items: [1, 3, 5, 6, 7, 10, 13, 15, 19],
      reverseItems: [],
      aggregation: 'sum',
      itemScores: Object.fromEntries([1, 3, 5, 6, 7, 10, 13, 15, 19].map(item => [item, { true: 1, false: 0 }])),
    },
    {
      key: 'beck_hopelessness_total',
      label: 'Безнадёжность, общий показатель Бека',
      items: itemTexts.map((_, index) => index + 1),
      reverseItems: [1, 3, 5, 6, 7, 10, 13, 15, 19],
      aggregation: 'sum',
    },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все оптимистичные ответы «Верно», пессимистичные «Неверно»: общий балл 0',
    answers: Object.fromEntries(itemTexts.map((_, i) => [String(i + 1), [1, 3, 5, 6, 7, 10, 13, 15, 19].includes(i + 1) ? 'true' : 'false'])),
    expected: { hopelessness: 0, hope: 9, beck_hopelessness_total: 0 },
  },
  {
    title: 'Все пессимистичные ответы «Верно», оптимистичные «Неверно»: общий балл 20',
    answers: Object.fromEntries(itemTexts.map((_, i) => [String(i + 1), [1, 3, 5, 6, 7, 10, 13, 15, 19].includes(i + 1) ? 'false' : 'true'])),
    expected: { hopelessness: 11, hope: 0, beck_hopelessness_total: 20 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'bhs-gorbatkov-ru-binary-key-v1',
};
