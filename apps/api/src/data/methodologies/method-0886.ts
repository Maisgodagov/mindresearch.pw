import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const answerOptions = [
  { value: '1', label: 'Совершенно не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Согласен' },
  { value: '4', label: 'Совершенно согласен' },
];

const items = [
  'Когда в моем присутствии начинают смеяться, я настораживаюсь.',
  'Я стараюсь уклоняться от публичных выступлений, потому что мне кажется, что другие люди почувствуют мою неуверенность и будут насмехаться надо мной.',
  'Когда посторонние люди в моем присутствии начинают смеяться, мне часто кажется, что они смеются надо мной.',
  'Мне трудно поддерживать контакт глаз, потому что я боюсь услышать пренебрежительный комментарий в свой адрес.',
  'Когда мне делают шутливые замечания, я становлюсь словно парализованным.',
  'Я контролирую себя, чтобы ненароком не попасть в неприятную, досадную ситуацию и не стать из-за этого объектом насмешки.',
  'Мне кажется, что на других я произвожу странное впечатление.',
  'Несмотря на то, что я часто чувствую себя одиноким, я стараюсь избегать общественных мероприятий, чтобы уберечь себя от возможных высмеиваний и насмешек.',
  'Если однажды где-нибудь я вел себя особенно неловко, я стараюсь избегать этого места.',
  'Если бы у меня не возникало страха быть смешным на публике, я бы выступал публично.',
  'Если у кого-то я однажды вызвал смех, я никогда больше не смогу непринужденно общаться с этим человеком.',
  'Мне требуется очень много времени, чтобы прийти в себя после шутки в свой адрес (насмешки).',
  'Во время танцев я чувствую себя некомфортно, поскольку убежден, что я из тех людей, которые вызывают смех и насмешки.',
  'Даже когда я чувствую себя вполне спокойно, у меня возрастает страх попасть в неприятную ситуацию и показаться странным.',
  'Если я оказываюсь в неловкой ситуации, я цепенею и не могу адекватно себя вести.',
];

const socialReactionItems = [1, 3, 4, 5, 9, 11, 12, 13, 15];
const selfPerceptionItems = [2, 6, 7, 8, 10, 14];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_916_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: answerOptions,
}));

export const instrument: SeedSection = {
  code: 'test_916',
  title: 'Опросник гелотофобии GELOPH-15',
  description: 'Русскоязычная версия GELOPH-15 оценивает выраженность гелотофобии — страха выглядеть смешным и стать объектом насмешек. Пункты охватывают настороженность к чужому смеху, поведение и эмоциональные реакции в ситуациях возможного осмеяния, а также самовосприятие и ожидания негативного впечатления. Предназначена для субъективной оценки взрослых респондентов; результат отражает выраженность признака, а не устанавливает диагноз.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 4,
  scales: [
    { key: 'social_reaction', label: 'Гелотофобичное социальное реагирование', items: socialReactionItems, reverseItems: [], aggregation: 'mean' },
    { key: 'self_perception', label: 'Гелотофобичное самовосприятие', items: selfPerceptionItems, reverseItems: [], aggregation: 'mean' },
    { key: 'total', label: 'Общий показатель гелотофобии', items: Array.from({ length: 15 }, (_, i) => i + 1), reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы «Совершенно не согласен»',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { social_reaction: 1, self_perception: 1, total: 1 },
  },
  {
    title: 'Все ответы «Совершенно согласен»',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 4])),
    expected: { social_reaction: 4, self_perception: 4, total: 4 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'geloph15-russian-stefanenko-2011-v1',
};
