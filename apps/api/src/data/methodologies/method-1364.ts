import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '5', label: 'Полностью соответствует моему мнению' },
  { value: '4', label: 'Скорее соответствует, чем нет' },
  { value: '3', label: 'И да, и нет' },
  { value: '2', label: 'Скорее не соответствует' },
  { value: '1', label: 'Не соответствует' },
];

const items = [
  'Я стремлюсь изучить себя.',
  'Я оставляю время для развития, как бы ни была занята делами.',
  'Возникающие препятствия стимулируют мою активность.',
  'Я ищу обратную связь, так как это помогает мне узнать и оценить себя.',
  'Я рефлексирую свою деятельность, выделяя для этого специальное время.',
  'Я анализирую свои чувства и опыт.',
  'Я много читаю.',
  'Я широко дискутирую по интересующим меня вопросам.',
  'Я верю в свои возможности.',
  'Я стремлюсь быть более открытым человеком.',
  'Я осознаю то влияние, которое оказывают на меня окружающие люди.',
  'Я управляю своим профессиональным развитием и получаю положительные результаты.',
  'Я получаю удовольствие от освоения нового.',
  'Возрастающая ответственность не пугает меня.',
  'Я положительно бы отнеслась к продвижению по службе.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1392_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1392',
  title: 'Оценка потребности педагога в развитии и саморазвитии',
  description: 'Опросник оценивает выраженность способности и потребности педагога в профессиональном и личностном саморазвитии: самоанализ, поиск обратной связи, освоение нового, вера в собственные возможности и отношение к профессиональной ответственности и продвижению. Предназначен для самооценки педагогическими работниками; помогает автору опроса увидеть общую выраженность ориентации на развитие.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'total', label: 'Общая потребность в развитии и саморазвитии', items: Array.from({ length: 15 }, (_, i) => i + 1), reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: минимальная оценка по каждому утверждению',
    answers: Object.fromEntries(Array.from({ length: 15 }, (_, i) => [String(i + 1), 1])),
    expected: { total: 15 },
  },
  {
    title: 'Ручная проверка: максимальная оценка по каждому утверждению',
    answers: Object.fromEntries(Array.from({ length: 15 }, (_, i) => [String(i + 1), 5])),
    expected: { total: 75 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'zvereva-nemova-development-needs-15item-sum-v1',
};
