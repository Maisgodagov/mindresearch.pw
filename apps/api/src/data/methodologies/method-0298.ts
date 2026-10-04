import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const items = [
  'Мне приятно, если я должен высказывать свое мнение по какому-то делу, не зная, что другие думают об этом.',
  'Я придаю большое значение тому, что другие обо мне думают.',
  'Мне легче тогда, когда мне говорят, что нужно сделать, чем в том случае, когда я сам должен руководить.',
  'Я легко отказываюсь от намерения, если другие об этом невысокого мнения.',
  'Мне лучше, если я могу присоединиться к мнению других.',
  'Я присоединяюсь к мнению моего трудового коллектива, как правило, лишь тогда, когда большинство его одобрит.',
  'На производственных совещаниях я охотнее присоединяюсь к мнению начальства.',
  'Если в моем трудовом коллективе возникают разногласия, я держусь в стороне.',
  'Прежде чем высказывать свое мнение, я сначала проверяю, что об этом думают другие.',
  'Я лучше примирюсь с чем-то, чем дам дойти делу до спора.',
  'Когда меня несправедливо критикуют, я скорее с этим соглашаюсь, чем защищаюсь.',
  'Я чаще всего признаю правоту других, хотя и не разделяю их мнения.',
  'Я избегаю критиковать своего начальника, хотя иногда это необходимо.',
  'Я не утаиваю своего мнения.',
];

const options = [
  { value: '1', label: 'Нет' },
  { value: '2', label: 'Да' },
];

export const instrument: SeedSection = {
  code: 'test_330',
  title: 'Измерение конформности',
  description: 'Методика оценивает личностное стремление к конформности: значимость чужого мнения, готовность присоединяться к позиции группы или начальства, уступать и избегать разногласий. Подходит для исследования взрослых в контексте трудового коллектива; пункты авторской версии 2018 года включают рабочие ситуации.',
  questions: items.map((text, index) => ({
    code: `test_330_${index + 1}`,
    text,
    type: 'single',
    required: true,
    options,
  })),
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 2,
  scales: [
    { key: 'conformity', label: 'Личностное стремление к конформности', items: items.map((_, index) => index + 1), reverseItems: [1, 14], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: все ответы «нет»; пункты 1 и 14 после реверса дают 2, остальные — 1; сумма 16',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { conformity: 16 },
  },
  {
    title: 'Ручная проверка: все ответы «да»; пункты 1 и 14 после реверса дают 1, остальные — 2; сумма 26',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 2])),
    expected: { conformity: 26 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'maslak-kovaleva-kozina-conformity-14item-binary-sum-reverse-1-14-v1',
};
