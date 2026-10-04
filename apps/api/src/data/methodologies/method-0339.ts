import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const aspirationTexts = [
  'Жить в согласии с собой, своими ценностями и интересами.',
  'Иметь хороших друзей, на которых я могу рассчитывать.',
  'Работать ради улучшения общества.',
  'Добиться того, чтобы люди отмечали, как привлекательно я выгляжу.',
  'Быть знаменитым (знаменитой).',
  'Быть влиятельным человеком.',
  'Выбирать, что мне делать, а не быть вынужденным что-то делать.',
  'Иметь надежные близкие отношения.',
  'Помогать людям, которые в этом нуждаются, ничего не прося взамен.',
  'Следовать моде в прическе и одежде.',
  'Быть известным (известной), видеть, что мое имя часто появляется в средствах массовой информации.',
  'Занимать важное положение в обществе.',
  'Заниматься тем, что имеет для меня важный смысл.',
  'Чувствовать, что есть люди, которые действительно любят меня и которых люблю я.',
  'Помогать другим улучшать их жизнь.',
  'Иметь внешний вид, который другие находят привлекательным.',
  'Видеть, что мной восхищаются многие люди.',
  'Стать тем, кому подчиняются другие люди.',
];

const questions: SeedSection['questions'] = aspirationTexts.map((text, index) => ({
  code: `test_371_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: [
    { value: '1', label: 'Совсем не (важна и т. д.)' },
    { value: '2', label: '2' },
    { value: '3', label: '3' },
    { value: '4', label: 'Умеренно' },
    { value: '5', label: '5' },
    { value: '6', label: '6' },
    { value: '7', label: 'Очень (важна и т. д.)' },
  ],
}));

export const instrument: SeedSection = {
  code: 'test_371',
  title: 'Индекс стремлений (краткая русская версия, ИС-К)',
  description: 'Краткая русская версия оценивает значимость жизненных стремлений у старшеклассников: внутренние цели самовыражения, отношений и вклада в сообщество, а также внешние цели привлекательной внешности, известности и влиятельности. Профиль помогает автору опроса описать приоритеты жизненных целей; исходная апробация опубликованной версии проведена на учащихся 10–11-х классов 16–18 лет.',
  questions,
};

const groups = [
  { key: 'self_expression', label: 'Самовыражение', items: [1, 7, 13] },
  { key: 'relationships', label: 'Отношения', items: [2, 8, 14] },
  { key: 'community', label: 'Сообщество', items: [3, 9, 15] },
  { key: 'appearance', label: 'Внешность', items: [4, 10, 16] },
  { key: 'fame', label: 'Известность', items: [5, 11, 17] },
  { key: 'influence', label: 'Влиятельность', items: [6, 12, 18] },
];

const mean = (answers: Record<string, number>, items: number[]) => items.reduce((sum, item) => sum + answers[String(item)], 0) / items.length;
const validationAnswers = Object.fromEntries(Array.from({ length: 18 }, (_, i) => [String(i + 1), i + 1]));
const validationInternal = mean(validationAnswers, [1, 2, 3, 7, 8, 9, 13, 14, 15]);
const validationExternal = mean(validationAnswers, [4, 5, 6, 10, 11, 12, 16, 17, 18]);
const validationRelativeIntrinsic = validationInternal - validationExternal;

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    ...groups.map(({ key, label, items }) => ({ key, label, items, reverseItems: [], aggregation: 'mean' as const })),
    { key: 'intrinsic', label: 'Внутренние стремления', items: [1, 2, 3, 7, 8, 9, 13, 14, 15], reverseItems: [], aggregation: 'mean' },
    { key: 'extrinsic', label: 'Внешние стремления', items: [4, 5, 6, 10, 11, 12, 16, 17, 18], reverseItems: [], aggregation: 'mean' },
    { key: 'relative_intrinsic', label: 'Относительная выраженность внутренних стремлений (ОВВС)', items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18], reverseItems: [], aggregation: 'sum', weights: Object.fromEntries([1, 2, 3, 7, 8, 9, 13, 14, 15].map(item => [item, 1 / 9]).concat([4, 5, 6, 10, 11, 12, 16, 17, 18].map(item => [item, -1 / 9]))) },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Вручную проверено по ключу статьи: ответы 1–18 дают суммы шкал по трем целям и разность внутренних и внешних средних',
    answers: validationAnswers,
    expected: {
      self_expression: mean(validationAnswers, [1, 7, 13]),
      relationships: mean(validationAnswers, [2, 8, 14]),
      community: mean(validationAnswers, [3, 9, 15]),
      appearance: mean(validationAnswers, [4, 10, 16]),
      fame: mean(validationAnswers, [5, 11, 17]),
      influence: mean(validationAnswers, [6, 12, 18]),
      intrinsic: validationInternal,
      extrinsic: validationExternal,
      relative_intrinsic: validationRelativeIntrinsic,
    },
  },
  {
    title: 'Вручную проверено: равные оценки по всем пунктам дают одинаковые шкалы и нулевую относительную разность',
    answers: Object.fromEntries(Array.from({ length: 18 }, (_, i) => [String(i + 1), 4])),
    expected: {
      self_expression: 4,
      relationships: 4,
      community: 4,
      appearance: 4,
      fame: 4,
      influence: 4,
      intrinsic: 4,
      extrinsic: 4,
      relative_intrinsic: 0,
    },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'gordeeva-sychev-egorov-aspirations-index-short-2023-v1',
};
