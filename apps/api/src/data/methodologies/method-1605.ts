import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'Совсем не было' },
  { value: '1', label: 'Иногда' },
  { value: '2', label: 'Часто' },
  { value: '3', label: 'Почти всегда' },
];

const items = [
  'Беспокойство о ребенке / беременности',
  'Страх, что ребенку будет причинен вред',
  'Чувство страха, что случится что-то плохое',
  'Беспокойство о многих вещах',
  'Беспокойство о будущем',
  'Чувство подавленности',
  'Очень сильный страх игл, крови, родов, боли и т. п.',
  'Внезапные приступы сильного страха или дискомфорта',
  'Повторяющиеся мысли, которые трудно остановить или контролировать',
  'Трудности со сном, даже когда у меня есть возможность поспать',
  'Приходится делать что-то определенным образом или в определенном порядке',
  'Желание, чтобы всё было идеально',
  'Необходимость контролировать ситуацию',
  'Трудно перестать проверять или переделывать что-либо снова и снова',
  'Нервничаю или меня легко напугать',
  'Беспокойство по поводу повторяющихся мыслей',
  'Всегда начеку или вынуждена следить за некоторыми вещами',
  'Огорчение по поводу повторяющихся воспоминаний, снов или ночных кошмаров',
  'Волнуюсь о том, что я опозорю себя перед другими',
  'Страх, что другие будут оценивать меня негативно',
  'Чувствую себя очень неловко в толпе',
  'Избегаю общественной деятельности, потому что могу начать нервничать',
  'Избегаю вещей, которые меня тревожат',
  'Ощущение отстраненности, как будто смотришь на себя в кино',
  'Теряю счет времени и не могу вспомнить, что произошло',
  'Трудности в адаптации к новым изменениям',
  'Тревога лишает меня способности чем-либо заниматься',
  'Скачущие мысли мешают мне сосредоточиться',
  'Страх потерять контроль',
  'Чувство паники',
  'Чувство возбуждения',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1622_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1622',
  title: 'Скрининговая шкала перинатальной тревоги (PASS-R)',
  description: 'PASS-R оценивает выраженность тревожных симптомов у женщин во время беременности и в течение 12 месяцев после родов. 31 пункт охватывает острую и навязчивую тревогу, социальную тревогу, навязчивый перфекционизм, специфические страхи, а также трудности адаптации и диссоциативные переживания. Результаты помогают специалисту выявлять профиль и выраженность симптомов и отслеживать их динамику; шкала является скрининговой и не устанавливает диагноз.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 3,
  scales: [
    { key: 'acute_intrusive', label: 'Острая и навязчивая тревога', items: [6, 8, 9, 10, 15, 16, 18, 27, 28, 29, 30, 31], reverseItems: [], aggregation: 'sum' },
    { key: 'social', label: 'Социальная тревога', items: [19, 20, 21, 22], reverseItems: [], aggregation: 'sum' },
    { key: 'perfectionism_control', label: 'Навязчивый перфекционизм', items: [11, 12, 13, 14, 17], reverseItems: [], aggregation: 'sum' },
    { key: 'specific_fears', label: 'Специфические страхи', items: [1, 2, 3, 4, 5], reverseItems: [], aggregation: 'sum' },
    { key: 'adaptation', label: 'Проблемы адаптации (диссоциация)', items: [23, 24, 25, 26], reverseItems: [], aggregation: 'sum' },
    { key: 'total', label: 'Общий балл PASS-R', items: Array.from({ length: 31 }, (_, index) => index + 1), reverseItems: [], aggregation: 'sum' },
  ],
};

const answers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Все ответы «Совсем не было»', answers: answers(0), expected: { acute_intrusive: 0, social: 0, perfectionism_control: 0, specific_fears: 0, adaptation: 0, total: 0 } },
  { title: 'Все ответы «Почти всегда»', answers: answers(3), expected: { acute_intrusive: 36, social: 12, perfectionism_control: 15, specific_fears: 15, adaptation: 12, total: 93 } },
  { title: 'Только ответ по пункту 7 максимальный', answers: { ...answers(0), '7': 3 }, expected: { acute_intrusive: 0, social: 0, perfectionism_control: 0, specific_fears: 0, adaptation: 0, total: 3 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'pass-r-korgozha-evmenenko-2021-v1',
};



