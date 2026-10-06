import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: 'trusting', label: 'Большинству людей можно доверять / стремятся быть полезными другим / вели бы себя по-честному' },
  { value: 'wary', label: 'Во взаимодействии с другими нужно соблюдать осторожность / думают только о себе / попытались бы обмануть' },
];

const questions: SeedSection['questions'] = [
  {
    code: 'test_2136_1',
    text: 'В целом, могли бы вы сказать, что большинству людей можно доверять, или во взаимодействии с другими нужно соблюдать осторожность?',
    type: 'single', required: true, options,
  },
  {
    code: 'test_2136_2',
    text: 'Могли бы вы сказать, что чаще всего люди стремятся быть полезным другим, или они просто думают только о себе?',
    type: 'single', required: true, options,
  },
  {
    code: 'test_2136_3',
    text: 'Как вы думаете, большинство людей попытались бы обмануть вас, если бы им предоставилась такая возможность, или вели бы себя по-честному?',
    type: 'single', required: true, options,
  },
];

const instrument: SeedSection = {
  code: 'test_2136',
  title: 'Шкала доверия Розенберга (Trust in People Scale), трёхпунктовая версия',
  description: 'Краткая шкала обобщённого межличностного доверия: оценивает ожидания относительно доверительности, доброжелательности и честности большинства людей. Подходит для опросов взрослых и общественных выборок; трёхпунктовая версия использовалась в американских национальных исследованиях. Результат — число доверительных ответов, а не клиническая оценка.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 3,
  scales: [{
    key: 'generalized_trust',
    label: 'Обобщённое доверие к людям',
    items: [1, 2, 3],
    reverseItems: [],
    aggregation: 'sum',
    itemScores: {
      1: { trusting: 1, wary: 0 },
      2: { trusting: 1, wary: 0 },
      3: { trusting: 1, wary: 0 },
    },
  }],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все три ответа выражают доверие: три балла',
    answers: { '1': 'trusting', '2': 'trusting', '3': 'trusting' },
    expected: { generalized_trust: 3 },
  },
  {
    title: 'Только ответ о честности выражает доверие: один балл',
    answers: { '1': 'wary', '2': 'wary', '3': 'trusting' },
    expected: { generalized_trust: 1 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'rosenberg-trust-in-people-three-item-1964-v1',
};
