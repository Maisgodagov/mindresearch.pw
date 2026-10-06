import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Почти всегда неверно' },
  { value: '2', label: 'Обычно неверно' },
  { value: '3', label: 'Иногда верно, иногда неверно' },
  { value: '4', label: 'Обычно верно' },
  { value: '5', label: 'Почти всегда верно' },
];

const items = [
  'Мне тяжело заканчивать дела вовремя.',
  'Я могу придерживаться своих планов и целей.',
  'Мне легко по-настоящему сосредоточиться на домашних заданиях.',
  'Перед тем как начать домашние задания я некоторое время чем-нибудь забавляюсь, даже если этого делать не надо.',
  'Мне легко хранить секрет.',
  'Мне тяжело переключиться, когда в школе я перехожу с одного урока на другой.',
  'Чем больше я пытаюсь прекратить делать то, что не следует, тем больше я делаю это.',
  'Когда я пытаюсь учиться, мне трудно отключиться и сосредоточиться в шумной обстановке.',
  'Я заканчиваю домашние задания до назначенного срока.',
  'Если мне надо сделать трудное задание, я принимаюсь за него тотчас же.',
  'Я хорошо отслеживаю несколько разных вещей, происходящих вокруг меня.',
  'Я откладываю работу над проектом до последнего момента.',
  'Когда кто-либо говорит мне прекратить что-то делать, мне легко остановиться.',
  'Я склонен бросить дело на полпути и взяться за что-либо другое.',
  'Мне тяжело не раскрывать подарки раньше, чем положено.',
  'Когда кто-нибудь говорит мне как что-то делать, я уделяю этому пристальное внимание.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2337_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2337',
  title: 'Шкала произвольной регуляции у подростков (EATQ-R, русская версия)',
  description: 'Русская подростковая версия шкалы произвольного контроля из EATQ-R оценивает способность поддерживать внимание, тормозить неподходящие реакции и начинать или продолжать требуемые действия. Охватывает регуляцию активности и общий компонент тормозного контроля/внимания; предназначена для самоотчёта подростков 10–17 лет и помогает описывать темпераментальные ресурсы саморегуляции.',
  questions,
};

const activity = [1, 4, 9, 10, 12];
const inhibitoryAttention = [2, 3, 5, 6, 7, 8, 13, 14, 15, 16];
const reverse = [1, 4, 5, 6, 7, 8, 12, 14, 15];

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'effortful_control', label: 'Произвольная регуляция', items: [...activity, ...inhibitoryAttention], reverseItems: reverse, aggregation: 'mean' },
    { key: 'activation_control', label: 'Регуляция активности', items: activity, reverseItems: [1, 4, 12], aggregation: 'mean' },
    { key: 'inhibitory_attention', label: 'Тормозный контроль / внимание', items: inhibitoryAttention, reverseItems: [5, 6, 7, 8, 14, 15], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Вручную проверено: нейтральные ответы 3 дают среднее 3 по всем шкалам',
    answers: Object.fromEntries(Array.from({ length: 16 }, (_, index) => [String(index + 1), 3])),
    expected: { effortful_control: 3, activation_control: 3, inhibitory_attention: 3 },
  },
  {
    title: 'Все ответы 5: обратные пункты перекодируются в 1',
    answers: Object.fromEntries(Array.from({ length: 16 }, (_, index) => [String(index + 1), 5])),
    expected: { effortful_control: 2.6, activation_control: 2.6, inhibitory_attention: 2.6 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['trait-regulation'],
  scoringConfig,
  validationCases,
  formulaVersion: 'eatqr-effortful-control-rippinen-slobodskaya-2018-ru-v1',
};
