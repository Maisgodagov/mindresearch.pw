import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Полностью не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Согласен' },
  { value: '4', label: 'Полностью согласен' },
];

const items = [
  'Наша семья гибко реагирует на непредвиденные обстоятельства.',
  'Наши друзья ценят нас такими какие мы есть.',
  'То, что мы делаем друг для друга, заставляет нас чувствовать себя семьей.',
  'Мы принимаем стрессовые события как часть нашей жизни.',
  'Мы признаем, что проблемы могут возникать неожиданно.',
  'Мы все участвуем в принятии важных семейных решений.',
  'Мы можем преодолевать страдания и приходить к взаимопониманию.',
  'В нашей семье мы понимаем друг друга.',
  'Мы можем обратиться за разъяснениями, если не понимаем друг друга.',
  'В нашей семье все честны и откровенны друг с другом.',
  'Мы можем пойти на компромисс, когда возникают проблемы.',
  'Мы можем рассчитывать на поддержку других людей.',
  'В нашей семье мы можем открыто уточнить, если не понимаем смысла высказывания.',
  'Мы можем решить основные проблемы.',
  'Мы справимся, если возникнет еще одна проблема.',
  'Мы можем обсуждать то, как мы взаимодействуем в нашей семье.',
  'Мы можем справляться с трудностями всей семьей.',
  'Мы советуемся друг с другом при принятии решений.',
  'Мы представляем проблему с позитивной стороны, чтобы ее решить.',
  'Мы обсуждаем проблемы и совместно их решаем.',
  'Мы обсуждаем различные вопросы до тех пор, пока не примем решение.',
  'Мы можем свободно выражать свое мнение в семье.',
  'Нам нравится уделять время и силы нашей семье.',
  'Мы считаем, что люди готовы помочь нам в чрезвычайной ситуации.',
  'В нашем социальном окружении мы чувствуем себя в безопасности.',
  'Мы чувствуем себя сильными перед лицом значимых проблем.',
  'У нас есть силы для решения своих проблем.',
  'Мы знаем, что если возникнут проблемы, другие люди нам помогут.',
  'Мы знаем, что мы важны для наших друзей.',
  'Мы все разделяем ответственность в семье.',
  'Мы проявляем любовь и привязанность к членам семьи.',
  'Мы говорим друг другу, как сильно мы ценим каждого.',
  'Даже в трудные минуты мы верим, что все разрешится.',
  'Мы ищем новые способы решения проблем.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2277_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2277',
  title: 'Шкала оценки жизнеспособности семьи (FRAS), русская адаптация',
  description: 'Методика оценивает воспринимаемую жизнеспособность семьи как способность сохранять связность и коммуникацию, конструктивно решать проблемы, принимать стрессовые события и использовать социальную поддержку. Четырехфакторная русская адаптация 2021 года предназначена для взрослых респондентов 18–65 лет и полезна для исследований семейных процессов в связи с кризисами и стрессом.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 4,
  scales: [
    { key: 'communication_connectedness', label: 'Семейная коммуникация и связность', items: [3, 6, 8, 9, 10, 11, 16, 18, 20, 21, 22, 23, 30, 31, 32], reverseItems: [], aggregation: 'sum' },
    { key: 'positive_outlook_problem_solving', label: 'Позитивный прогноз и решение проблем', items: [14, 15, 17, 19, 26, 27, 33, 34], reverseItems: [], aggregation: 'sum' },
    { key: 'acceptance_flexibility', label: 'Принятие и гибкость', items: [1, 4, 5, 7, 13], reverseItems: [], aggregation: 'sum' },
    { key: 'social_resources', label: 'Социальные ресурсы', items: [2, 12, 24, 25, 28, 29], reverseItems: [], aggregation: 'sum' },
    { key: 'total', label: 'Общая жизнеспособность семьи', items: Array.from({ length: 34 }, (_, index) => index + 1), reverseItems: [], aggregation: 'sum' },
  ],
};

const allAnswers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Ручная проверка: все ответы «Полностью не согласен» дают минимальные суммы по ключу', answers: allAnswers(1), expected: { communication_connectedness: 15, positive_outlook_problem_solving: 8, acceptance_flexibility: 5, social_resources: 6, total: 34 } },
  { title: 'Все ответы «Полностью согласен» дают максимальные суммы по ключу', answers: allAnswers(4), expected: { communication_connectedness: 60, positive_outlook_problem_solving: 32, acceptance_flexibility: 20, social_resources: 24, total: 136 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['parenting'],
  scoringConfig,
  validationCases,
  formulaVersion: 'fras-russian-adaptation-gusarova-odintsova-sorokova-2021-v1',
};
