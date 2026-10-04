import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const answers = [
  { value: '1', label: 'Почти никогда' },
  { value: '2', label: 'Иногда' },
  { value: '3', label: 'Часто' },
  { value: '4', label: 'Почти всегда' },
];

const items = [
  'Я спокоен.',
  'Мне хочется узнать, понять, докопаться до сути.',
  'Я разъярен.',
  'Я падаю духом, сталкиваясь с трудностями в учебе.',
  'Я напряжен.',
  'Я испытываю любопытство.',
  'Мне хочется стукнуть кулаком по столу.',
  'Я стараюсь получать только хорошие и отличные оценки.',
  'Я раскован.',
  'Мне интересно.',
  'Я рассержен.',
  'Я прилагаю все силы, чтобы добиться успеха в учебе.',
  'Меня волнуют возможные неудачи.',
  'Мне кажется, что урок никогда не кончится.',
  'Мне хочется на кого-нибудь накричать.',
  'Я стараюсь всё делать правильно.',
  'Я чувствую себя неудачником.',
  'Я чувствую себя исследователем.',
  'Мне хочется что-нибудь сломать.',
  'Я чувствую, что не справлюсь с заданиями.',
  'Я взвинчен.',
  'Я энергичен.',
  'Я взбешен.',
  'Я горжусь своими школьными успехами.',
  'Я чувствую себя совершенно свободно.',
  'Я чувствую, что у меня хорошо работает голова.',
  'Я раздражен.',
  'Я решаю самые трудные задачи.',
  'Мне не хватает уверенности в себе.',
  'Мне скучно.',
  'Мне хочется что-нибудь сломать.',
  'Я стараюсь не получить двойку.',
  'Я уравновешен.',
  'Мне нравится думать, решать.',
  'Я чувствую себя обманутым.',
  'Я стремлюсь показать свои способности и ум.',
  'Я боюсь.',
  'Я чувствую уныние и тоску.',
  'Меня многое приводит в ярость.',
  'Я хочу быть среди лучших.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_577_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: answers,
}));

export const instrument: SeedSection = {
  code: 'test_577',
  title: 'Диагностика мотивации учения и эмоционального отношения к учению',
  description: 'Методика А. М. Прихожан для школьников 10–16 лет оценивает учебную мотивацию и эмоциональное отношение к учению по четырём аспектам: познавательная активность, мотивация достижения, тревожность и гнев. Профиль помогает автору опроса увидеть выраженность интереса к познанию и стремления к учебному успеху наряду с напряжением и гневом, связанными с уроками.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 4,
  scales: [
    { key: 'cognitiveActivity', label: 'Познавательная активность', items: [2, 6, 10, 14, 18, 22, 26, 30, 34, 38], reverseItems: [14, 30, 38], aggregation: 'sum' },
    { key: 'achievementMotivation', label: 'Мотивация достижения', items: [4, 8, 12, 16, 20, 24, 28, 32, 36, 40], reverseItems: [4, 20, 32], aggregation: 'sum' },
    { key: 'anxiety', label: 'Тревожность', items: [1, 5, 9, 13, 17, 21, 25, 29, 33, 37], reverseItems: [1, 9, 25, 33], aggregation: 'sum' },
    { key: 'anger', label: 'Гнев', items: [3, 7, 11, 15, 19, 23, 27, 31, 35, 39], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: все ответы «Почти никогда»',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { cognitiveActivity: 13, achievementMotivation: 19, anxiety: 16, anger: 10 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'prikhozhan-learning-motivation-2003-four-scales-reverse-v1',
};
