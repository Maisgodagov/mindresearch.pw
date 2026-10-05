import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const responseOptions = [
  { value: '0', label: 'Никогда' },
  { value: '1', label: 'Редко' },
  { value: '2', label: 'Иногда' },
  { value: '3', label: 'Часто' },
  { value: '4', label: 'Постоянно' },
];

const itemTexts = [
  'Боитесь ли Вы, что вирусная вспышка будет продолжаться бесконечно?',
  'Опасаетесь ли Вы, что Ваше здоровье ухудшится в связи с вирусной инфекцией?',
  'Беспокоитесь ли Вы, что можете заразиться?',
  'Обращаете ли Вы больше, чем обычно, внимание на небольшие признаки (симптомы) своего физического самочувствия?',
  'Беспокоитесь ли Вы, что окружающие могут избегать общения с Вами, несмотря на то что риск заражения был сведен к минимуму?',
  'Стали ли Вы более скептичны к своей работе после получения настоящего опыта?',
  'После настоящего опыта думаете ли Вы, что будете избегать лечить больных с вирусными заболеваниями?',
  'Беспокоитесь ли Вы, что члены Вашей семьи или друзья могут заразиться от Вас?',
  'Думаете ли Вы, что у Ваших коллег будет больше работы, если Вы будете отсутствовать вследствие возможного карантина, и они могут обвинять Вас?',
];

const questions: SeedSection['questions'] = itemTexts.map((text, index) => ({
  code: `test_1692_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: responseOptions,
}));

export const instrument: SeedSection = {
  code: 'test_1692',
  title: 'Стресс и тревога во время вирусной эпидемии (SAVE-9), русская версия',
  description: 'SAVE-9 оценивает выраженность тревоги и социального, связанного с работой стресса медицинских работников во время вирусной эпидемии. Пункты охватывают опасения по поводу продолжительности вспышки, собственного здоровья и заражения, телесных симптомов, стигматизации и последствий работы с инфекцией для коллег и пациентов. Русская версия валидировалась на медицинских работниках в период пандемии COVID-19.',
  questions,
};

const itemNumbers = Array.from({ length: 9 }, (_, index) => index + 1);
const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 4,
  scales: [
    { key: 'anxietySomatic', label: 'Тревога и соматические симптомы', items: [2, 3, 4, 8], reverseItems: [], aggregation: 'sum' },
    { key: 'socialWorkStress', label: 'Социальный стресс', items: [1, 5, 6, 7, 9], reverseItems: [], aggregation: 'sum' },
    { key: 'total', label: 'Общий балл SAVE-9', items: itemNumbers, reverseItems: [], aggregation: 'sum' },
  ],
};

const answers = (value: number) => Object.fromEntries(itemNumbers.map(item => [String(item), value]));
const validationCases: ValidationCase[] = [
  { title: 'Все ответы «никогда»', answers: answers(0), expected: { anxietySomatic: 0, socialWorkStress: 0, total: 0 } },
  { title: 'Все ответы «постоянно»', answers: answers(4), expected: { anxietySomatic: 16, socialWorkStress: 20, total: 36 } },
  {
    title: 'Проверка ручного подсчёта: ответы 0–4 по порядку',
    answers: { '1': 0, '2': 1, '3': 2, '4': 3, '5': 4, '6': 0, '7': 1, '8': 2, '9': 3 },
    expected: { anxietySomatic: 8, socialWorkStress: 8, total: 16 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'save-9-russian-mosolova-2022-raw-sum-v1',
};
