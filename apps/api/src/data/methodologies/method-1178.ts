import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'Никогда' },
  { value: '1', label: 'Очень редко' },
  { value: '2', label: 'Редко' },
  { value: '3', label: 'Иногда' },
  { value: '4', label: 'Часто' },
  { value: '5', label: 'Очень часто' },
  { value: '6', label: 'Постоянно' },
];

const statements = [
  'К концу дня, проведенного со своим ребенком, я чувствую себя эмоционально опустошенным(ой).',
  'К концу дня, проведенного с ребенком, я чувствую себя, как выжатый лимон.',
  'Я чувствую себя усталым(ой), когда встаю утром и должен (должна) провести весь день с ребенком.',
  'Я хорошо понимаю, что чувствует мой ребенок, и это помогает мне в общении с ним.',
  'Я общаюсь с моим ребенком только формально, без лишних эмоций и стремлюсь свести общение с ним до минимума.',
  'Я чувствую себя энергичным(ой) и эмоционально воодушевленным(ой).',
  'Я умею находить правильное решение в конфликтных ситуациях со своим ребенком.',
  'Я чувствую угнетенность и апатию.',
  'Я могу продуктивно влиять на развитие и успехи своего ребенка.',
  'В последнее время я стал(а) более отстраненным(ой) и бесчувственным(ой) по отношению к своему ребенку.',
  'Мой ребенок стал мне неинтересен. Он скорее утомляет, чем радует меня.',
  'У меня много планов на будущее в связи с развитием детей, и я верю в их осуществление.',
  'У меня все больше жизненных разочарований в сфере семьи.',
  'Я чувствую равнодушие и потерю интереса ко многому, что радовало меня раньше.',
  'Мне безразлично, что думает и чувствует мой ребенок.',
  'Мне хочется уединиться и отдохнуть от всего и всех.',
  'Я легко могу создать атмосферу доброжелательности и доверия при общении с ребенком.',
  'Я без напряжения и раздражительности общаюсь со своим ребенком, независимо от ситуации, в которой происходит общение.',
  'Я доволен (довольна) своими успехами как родитель.',
  'Я чувствую себя на пределе возможностей.',
  'Я смогу еще много сделать в своей жизни как родитель.',
  'Я проявляю к ребенку больше внимания и заботы, чем получаю от него в ответ признательности и благодарности.',
];

const questions: SeedSection['questions'] = statements.map((text, index) => ({
  code: `test_1208_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1208',
  title: 'Опросник родительского выгорания (И. Н. Ефимова, 2013)',
  description: 'Методика оценивает родительское выгорание в заботе о собственных детях по эмоциональному истощению, деперсонализации и редукции родительских достижений. Подходит матерям и отцам, выполняющим родительские функции; ответы относятся к отношениям с детьми, а не к работе или общей жизненной ситуации.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 6,
  scales: [
    { key: 'emotional_exhaustion', label: 'Эмоциональное истощение', items: [1, 2, 3, 6, 8, 13, 14, 16, 20], reverseItems: [6], aggregation: 'sum' },
    { key: 'depersonalization', label: 'Деперсонализация', items: [5, 10, 11, 15, 22], reverseItems: [], aggregation: 'sum' },
    { key: 'reduced_parental_accomplishment', label: 'Редукция родительских достижений', items: [4, 7, 9, 12, 17, 18, 19, 21], reverseItems: [], aggregation: 'sum' },
  ],
};

const answers = (value: number) => Object.fromEntries(statements.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Ручная проверка: «никогда» по всем пунктам; обратный пункт 6 также даёт 0', answers: answers(0), expected: { emotional_exhaustion: 0, depersonalization: 0, reduced_parental_accomplishment: 0 } },
  { title: 'Ручная проверка: «постоянно» по всем пунктам; пункт 6 инвертирован', answers: answers(6), expected: { emotional_exhaustion: 48, depersonalization: 30, reduced_parental_accomplishment: 48 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'efimova-parental-burnout-22-item-sum-0-6-reverse-6-v1',
};
