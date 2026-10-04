import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Полностью не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Ни то, ни другое' },
  { value: '4', label: 'Согласен' },
  { value: '5', label: 'Полностью согласен' },
];

const items = [
  'В моем окружении есть люди, на помощь которых я могу рассчитывать.',
  'В моем окружении есть люди, которые могут поддержать и ободрить меня.',
  'В моем окружении есть люди, которые ценят меня как личность.',
  'Я активно включаюсь, когда в моем окружении появляется проблема, с которой нужно справляться вместе.',
  'Я часто приглашаю своих знакомых к себе домой.',
  'Я ищу возможность помочь людям в моем окружении, когда они в этом нуждаются.',
  'Я могу доверять людям, живущим в нашем обществе.',
  'Людям в моем окружении можно доверять.',
  'Большинство людей, которые мне встречаются, честные.',
  'Меня уважают.',
  'Люди вежливы со мной.',
  'Ко мне относятся с таким же уважением, как и к другим людям.',
  'Я чувствую себя одиноким.',
  'Я регулярно ощущаю себя в изоляции от других.',
  'Нет никого, с кем я был бы достаточно близок.',
  'У меня есть чувство сопричастности своему окружению.',
  'У меня есть чувство принадлежности к той местности или тому региону, в котором я проживаю.',
  'У меня есть чувство принадлежности к своей стране.',
  'Я полностью погружаюсь в деятельность, которой занимаюсь.',
  'В большинстве моих занятий я чувствую себя полным сил.',
  'Я обычно работаю с воодушевлением.',
  'В своей повседневной жизни я реализую множество своих способностей.',
  'Я регулярно задействую свои таланты.',
  'Я каждый день занимаюсь тем, что у меня хорошо получается.',
  'Вчера я узнал кое-что новое.',
  'Для меня важно узнавать новое.',
  'Я учусь чему-то новому практически каждый день.',
  'Я достигаю большинства своих целей.',
  'Я реализую свои амбиции.',
  'Я на пути к осуществлению своей мечты.',
  'Я способен добиться успеха, если приложу к этому усилия.',
  'Я уверен, что смогу справиться с непредвиденными обстоятельствами.',
  'Я верю, что на многое способен.',
  'То, чем я занимаюсь в жизни, имеет ценность и смысл.',
  'То, что я делаю, приносит пользу обществу.',
  'Работа, которую я выполняю, важна для других людей.',
  'Большинство моих жизненных решений берут на себя другие люди.',
  'Жизненные решения, которые я принимаю, на самом деле редко бывают моими собственными.',
  'Другие люди решают, что я могу делать, а что – нет.',
  'В моей жизни есть понятная цель.',
  'Я нашел в жизни смысл, который меня удовлетворяет.',
  'Я знаю, что придает смысл моей жизни.',
  'Я с оптимизмом смотрю в будущее.',
  'У меня позитивный взгляд на жизнь.',
  'Я ожидаю от своей жизни больше хорошего, чем плохого.',
  'Во многих отношениях моя жизнь близка к идеалу.',
  'Я доволен своей жизнью.',
  'Моя жизнь складывается хорошо.',
  'Большую часть времени я чувствую себя позитивно.',
  'Большую часть времени я чувствую себя счастливым.',
  'Большую часть времени я чувствую себя хорошо.',
  'Я испытываю негативные чувства большую часть времени.',
  'Большую часть времени я чувствую себя несчастным.',
  'Большую часть времени я чувствую себя плохо.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_459_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_459',
  title: 'Комплексный опросник процветания (CIT), русскоязычная адаптация 2025 года',
  description: 'Полная версия CIT оценивает психологическое благополучие и позитивное функционирование взрослых через поддержку, участие в сообществе, доверие, уважение, одиночество, принадлежность, вовлеченность, навыки и обучение, достижения, самоэффективность, самоценность, контроль, смысл, оптимизм, удовлетворенность жизнью и положительные и отрицательные эмоции. Профиль субшкал помогает автору опроса увидеть сильные стороны и области благополучия, требующие внимания; русская адаптация опубликована для взрослой выборки.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'support', label: 'Поддержка', items: [1, 2, 3], reverseItems: [], aggregation: 'sum' },
    { key: 'community', label: 'Участие в сообществе', items: [4, 5, 6], reverseItems: [], aggregation: 'sum' },
    { key: 'trust', label: 'Доверие', items: [7, 8, 9], reverseItems: [], aggregation: 'sum' },
    { key: 'respect', label: 'Уважение', items: [10, 11, 12], reverseItems: [], aggregation: 'sum' },
    { key: 'loneliness', label: 'Одиночество', items: [13, 14, 15], reverseItems: [13, 14, 15], aggregation: 'sum' },
    { key: 'belonging', label: 'Принадлежность', items: [16, 17, 18], reverseItems: [], aggregation: 'sum' },
    { key: 'engagement', label: 'Вовлеченность', items: [19, 20, 21], reverseItems: [], aggregation: 'sum' },
    { key: 'skills', label: 'Навыки', items: [22, 23, 24], reverseItems: [], aggregation: 'sum' },
    { key: 'learning', label: 'Обучение', items: [25, 26, 27], reverseItems: [], aggregation: 'sum' },
    { key: 'accomplishment', label: 'Достижения', items: [28, 29, 30], reverseItems: [], aggregation: 'sum' },
    { key: 'selfEfficacy', label: 'Самоэффективность', items: [31, 32, 33], reverseItems: [], aggregation: 'sum' },
    { key: 'selfWorth', label: 'Самоценность', items: [34, 35, 36], reverseItems: [], aggregation: 'sum' },
    { key: 'control', label: 'Контроль', items: [37, 38, 39], reverseItems: [37, 38, 39], aggregation: 'sum' },
    { key: 'meaning', label: 'Смысл и цель', items: [40, 41, 42], reverseItems: [], aggregation: 'sum' },
    { key: 'optimism', label: 'Оптимизм', items: [43, 44, 45], reverseItems: [], aggregation: 'sum' },
    { key: 'lifeSatisfaction', label: 'Удовлетворенность жизнью', items: [46, 47, 48], reverseItems: [], aggregation: 'sum' },
    { key: 'positiveEmotions', label: 'Положительные эмоции', items: [49, 50, 51], reverseItems: [], aggregation: 'sum' },
    { key: 'negativeEmotions', label: 'Отрицательные эмоции', items: [52, 53, 54], reverseItems: [52, 53, 54], aggregation: 'sum' },
  ],
};

const answers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Все ответы нейтральны: после реверса каждая субшкала равна 9', answers: answers(3), expected: { support: 9, community: 9, trust: 9, respect: 9, loneliness: 9, belonging: 9, engagement: 9, skills: 9, learning: 9, accomplishment: 9, selfEfficacy: 9, selfWorth: 9, control: 9, meaning: 9, optimism: 9, lifeSatisfaction: 9, positiveEmotions: 9, negativeEmotions: 9 } },
  { title: 'Все ответы полностью согласен: прямые шкалы 15, обратные шкалы 3', answers: answers(5), expected: { support: 15, community: 15, trust: 15, respect: 15, loneliness: 3, belonging: 15, engagement: 15, skills: 15, learning: 15, accomplishment: 15, selfEfficacy: 15, selfWorth: 15, control: 3, meaning: 15, optimism: 15, lifeSatisfaction: 15, positiveEmotions: 15, negativeEmotions: 3 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'cit-kostenko-nabieva-lebedeva-2025-v1',
};
