import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const responseOptions = [
  { value: '1', label: 'Да' },
  { value: '2', label: 'Отчасти верно' },
  { value: '3', label: 'Нет' },
];

const itemTexts = [
  'В своей жизни я, как правило, достигаю тех целей, которые ставлю перед собой.',
  'Хорошо знающие меня люди говорят, что я легко сержусь (выхожу из себя).',
  'Моя работа — это то, чем я всегда хотел(а) заниматься.',
  'Если бы у меня всегда была необходимая сумма денег, я бы предпочел(а) не работать.',
  'Обычно я хорошо сплю.',
  'Пока я не обладаю глубокими профессиональными знаниями в области порученного дела.',
  'Для меня любимое дело ценнее, чем деньги.',
  'Я не всегда чувствую в себе силы для преодоления жизненных невзгод.',
  'Коллеги считают меня профессионалом в своем деле.',
  'Я ошибся(лась) в выборе профессии и профиля деятельности (не на своем месте).',
  'Я остро переживаю моменты, когда не совершаю ничего значительного.',
  'Моя работа тяготит меня.',
  'Человек всегда должен заниматься только тем, что ему интересно.',
  'Совершив какой-то промах, я быстро отвлекаюсь от мыслей о нем.',
  'Я занимаю довольно высокую должность в своей организации.',
  'Я бы сменил(а) работу, если бы представился более выгодный вариант.',
  'Закончив разговор, я, бывает, продолжаю его мысленно, приводя все новые и новые аргументы в защиту своей точки зрения.',
  'Я не удовлетворен(а) своим материальным положением.',
  'Я могу увлечься работой настолько, что забываю о времени и о себе.',
  'Конфликты и разногласия с сотрудниками отнимают у меня много сил и эмоций.',
  'Как правило, мой рабочий день проходит спокойно и легко.',
  'Отсутствие денег для меня — сильное потрясение.',
  'Я точно знаю, какие качества мне нужны, чтобы стать лучшим в своем деле.',
  'За последние годы я не добился(лась) особых успехов в своей профессии.',
  'Мне доставляет удовольствие не только результат, но и процесс моей работы.',
  'В моей жизни неудач гораздо больше, чем успехов.',
  'Я работаю лучше других людей, занимающих аналогичную должность.',
  'Высокий заработок важнее, чем удовлетворение, получаемое от работы.',
  'Из меня мог бы выйти неплохой актер.',
  'Мне часто не хватает времени, чтобы качественно выполнить свою работу.',
  'Если бы у меня было больше свободного времени, я бы использовал(а) его для самообразования.',
  'Моя внешность меня не устраивает.',
  'Результаты моей работы отличаются исключительно высоким качеством.',
  'Мне не известна цель моей жизни.',
  'Люди, с которыми я работаю, уважают меня.',
  'Занимаемое мною служебное положение не соответствует моим способностям.',
  'Часто я ставлю общественные интересы выше личных.',
  'Я часто смущаюсь, когда мне говорят комплименты.',
  'Меня интересуют все новшества в моей профессиональной сфере.',
  'Придет время, когда я заживу по-настоящему, не так, как сейчас.',
  'Моя жизнь лучше, чем у большинства других.',
  'Я не доволен(а) своим положением на работе и в обществе.',
  'Я имею четкое представление о целях моей работы.',
  'Я не слишком расстраиваюсь, если не удается достичь совершенства в том, что я делаю.',
  'Я вижу, что моя работа приносит пользу людям.',
  'Плохо оплачиваемая работа не приносит удовлетворения.',
  'Я чувствую, что могу преодолеть все трудности на пути к поставленной цели.',
  'Я не всегда выполняю свои обязанности настолько хорошо, насколько это возможно.',
  'Я довольно часто читаю газеты, периодические издания, литературные произведения.',
  'Мне не известны все мои способности и таланты.',
  'Я доволен(а) своей судьбой.',
];

const questions: SeedSection['questions'] = itemTexts.map((text, index) => ({
  code: `test_1921_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: responseOptions,
}));

export const instrument: SeedSection = {
  code: 'test_1921',
  title: 'Тип и уровень профессиональной самореализации',
  description: 'Методика Е. А. Гавриловой оценивает профессиональную самореализацию работающего человека через целевой компонент (ценности, смыслы и цели профессионального пути), ресурсный компонент (энергетические ресурсы и профессиональное самосознание) и феноменологический компонент (профессионализм, положение, продуктивность и удовлетворенность трудом). Результаты помогают автору опроса описать профиль и общий уровень самореализации субъекта профессиональной деятельности; опубликованная версия предназначена для работающих людей разных возрастов, стажа, образования, областей деятельности и карьерных уровней.',
  questions,
};

const allItems = Array.from({ length: 51 }, (_, index) => index + 1);
const componentItems = [
  { key: 'target', label: 'Целевой компонент', items: allItems.filter(item => item % 3 === 1) },
  { key: 'resource', label: 'Ресурсный компонент', items: allItems.filter(item => item % 3 === 2) },
  { key: 'phenomenological', label: 'Феноменологический компонент', items: allItems.filter(item => item % 3 === 0) },
];

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 3,
  scales: [
    ...componentItems.map(({ key, label, items }) => ({
      key,
      label,
      items,
      reverseItems: items.filter(item => item % 2 === 0),
      aggregation: 'formula' as const,
      formula: 'sum(response points: direct item Yes/Partly/No = 2/1/0; reverse item Yes/Partly/No = 0/1/2)',
    })),
    {
      key: 'total',
      label: 'Общий уровень профессиональной самореализации (S)',
      items: allItems,
      reverseItems: allItems.filter(item => item % 2 === 0),
      aggregation: 'formula',
      formula: 'sum(response points: direct item Yes/Partly/No = 2/1/0; reverse item Yes/Partly/No = 0/1/2); S is the sum of target, resource, and phenomenological components; 0–25 primitive-executive, 26–51 individual-executive, 52–77 role-and-norm realization in organization, 78–102 meaning-and-value realization',
    },
  ],
};

const scoreAnswer = (item: number, option: number) => item % 2 === 1 ? 3 - option : option - 1;
const expectedFor = (answers: Record<string, string>) => {
  const numericAnswers = Object.fromEntries(Object.entries(answers).map(([item, value]) => [item, Number(value)]));
  const scores = componentItems.map(({ key, items }) => [key, items.reduce((sum, item) => sum + scoreAnswer(item, numericAnswers[String(item)]), 0)] as const);
  return Object.fromEntries([...scores, ['total', scores.reduce((sum, [, value]) => sum + value, 0)]]);
};
const answerPattern = (fn: (item: number) => number) => Object.fromEntries(allItems.map(item => [String(item), String(fn(item))]));

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная сверка ключа: все ответы «Да» дают 2 балла прямым и 0 обратным пунктам',
    answers: answerPattern(() => 1),
    expected: expectedFor(answerPattern(() => 1)),
  },
  {
    title: 'Ручная сверка крайних ответов: прямые «Да», обратные «Нет» дают по 2 балла за каждый пункт',
    answers: answerPattern(item => item % 2 === 1 ? 1 : 3),
    expected: expectedFor(answerPattern(item => item % 2 === 1 ? 1 : 3)),
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'gavrilova-professional-self-realization-2015-v1',
};
