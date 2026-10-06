import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Полностью не согласен' },
  { value: '2', label: 'В целом не согласен' },
  { value: '3', label: 'Не совсем согласен' },
  { value: '4', label: 'В целом согласен' },
  { value: '5', label: 'Полностью согласен' },
];

const items = [
  'Я всегда полностью выполняю поставленную передо мной начальником задачу',
  'Выбирая военную профессию, я хорошо знал ее содержание и условия несения службы',
  'Я беру на себя ответственность за совместное с другими военнослужащими выполнение задания',
  'Я хорошо выполняю как интересную работу, так и ту, которая меня не заинтересовала',
  'Я достигну успеха в деятельности военнослужащего',
  'Я всегда знаю, какие задачи я должен выполнить по службе и сроки их выполнения',
  'Деятельность военнослужащего для меня очень интересна',
  'В сложных и опасных ситуациях службы я не теряюсь и контролирую свои действия',
  'Я хочу добиться повышения в должности (хочу стать офицером, командиром подразделения и т.д.)',
  'Я хорошо прогнозирую возможное изменение ситуации при выполнении боевой задачи и эффективно действую в этих условиях',
  'Мне нравится моя военная деятельность',
  'Армейская дисциплина не представляет для меня трудность',
  'Я хочу, чтобы окружающие считали меня профессионалом в военном деле',
  'Профессия военнослужащего престижна и важна',
  'Я с удовольствием выполняю те задания, которые ставятся передо мной на военной службе',
  'В опасных и сложных ситуациях мне важнее выполнить боевую задачу, чем сохранить свою жизнь',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2561_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2561',
  title: 'Экспресс-оценка психологической готовности военнослужащих к выполнению служебной деятельности',
  description: 'Опросник оценивает целостную психологическую готовность военнослужащих к служебной деятельности по мотивационному, познавательному, эмоциональному и волевому компонентам. Профиль помогает автору опроса увидеть сильные стороны готовности и области, связанные с интересом и стремлением к успеху, пониманием служебных задач, ответственностью и уверенностью, а также самоконтролем и мобилизацией в сложных условиях; версия предназначена для военнослужащих.',
  categoryIds: ['work-service'],
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'motivation', label: 'Мотивационный компонент готовности', items: [1, 5, 9, 13], reverseItems: [], aggregation: 'mean' },
    { key: 'cognitive', label: 'Познавательный компонент готовности', items: [2, 6, 10, 14], reverseItems: [], aggregation: 'mean' },
    { key: 'emotional', label: 'Эмоциональный компонент готовности', items: [3, 7, 11, 15], reverseItems: [], aggregation: 'mean' },
    { key: 'volitional', label: 'Волевой компонент готовности', items: [4, 8, 12, 16], reverseItems: [], aggregation: 'mean' },
    { key: 'overall', label: 'Готовность к деятельности', items: [1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15, 4, 8, 12, 16], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: ответы 1–5 по порядку; компоненты 3, 3.5, 4, 4.5; общий показатель 60',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), (index % 5) + 1])),
    expected: { motivation: 3, cognitive: 3.5, emotional: 4, volitional: 4.5, overall: 60 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['work-service'],
  scoringConfig,
  validationCases,
  formulaVersion: 'akimova-sozinova-eopgv-2019-v1',
};
