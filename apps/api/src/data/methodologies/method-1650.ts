import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'никогда' },
  { value: '2', label: 'редко' },
  { value: '3', label: 'иногда' },
  { value: '4', label: 'часто' },
  { value: '5', label: 'всегда' },
];

const items = [
  'приветствует мой вклад в наши обсуждения;',
  'относится негативно к моим идеям и инициативам;',
  'выступает как наставник, заботится о моем прогрессе как исследователя;',
  'дает непонятную обратную связь, либо вовсе ее не дает;',
  'реагирует с энтузиазмом на мои идеи и инициативы;',
  'слишком многого от меня ожидает и требует;',
  'проводит совместную рефлексию сделанных ошибок;',
  'критикует мою работу и идеи, не объясняя, что и как нужно исправить;',
  'проявляет надежду, ободрение и оптимизм в отношении результатов моей деятельности;',
  'активно на меня давит, побуждая работать в заданном направлении;',
  'предоставляет помощь и поддержку в работе, когда они необходимы;',
  'не обучает меня специфике научной работы;',
  'довольно жестко меня контролирует;',
  'помогает мне разобраться в море научных идей, проблем и исследований.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1667_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

const instrument: SeedSection = {
  code: 'test_1667',
  title: 'Стили научного руководства (СТИНАРУ)',
  description: 'Опросник оценивает воспринимаемый студентом или аспирантом стиль своего научного руководителя по четырем аспектам: поддержка автономии, контроль, структурирование исследовательской работы и хаотичность руководства. Подходит для вузовских студентов и аспирантов, ведущих научную работу, включая подготовку курсовых, выпускных квалификационных и диссертационных работ.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'autonomySupport', label: 'Поддержка автономии', items: [1, 5, 9], aggregation: 'mean' },
    { key: 'controlling', label: 'Контролирующий стиль', items: [2, 6, 10, 13], aggregation: 'mean' },
    { key: 'structuring', label: 'Структурирующий стиль', items: [3, 7, 11, 14], aggregation: 'mean' },
    { key: 'chaotic', label: 'Хаотичный стиль', items: [4, 8, 12], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: одинаковый ответ на всех пунктах',
    answers: Object.fromEntries(Array.from({ length: 14 }, (_, i) => [String(i + 1), 3])),
    expected: { autonomySupport: 3, controlling: 3, structuring: 3, chaotic: 3 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'stinaru-gordeeva-marchuk-butenko-2024-mean-v1',
};
