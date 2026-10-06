import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Полностью не согласен' },
  { value: '2', label: 'Умеренно не согласен' },
  { value: '3', label: 'Слегка не согласен' },
  { value: '4', label: 'Нейтрально / не знаю' },
  { value: '5', label: 'Слегка согласен' },
  { value: '6', label: 'Умеренно согласен' },
  { value: '7', label: 'Полностью согласен' },
];

const items = [
  'Я думаю, мы могли бы подружиться.',
  'Было бы тяжело общаться с ним (ней).',
  'Он/она НЕ вписался бы в круг моих друзей.',
  'Мы никогда не смогли бы стать настоящими друзьями.',
  'Я хотел(а) бы поболтать с ним (ней) по-дружески.',
  'Он/она бездельничает, когда нужно заниматься делом.',
  'Я уверен(а) в его/ее способности справиться с делом, задачей.',
  'Я готов(а) положиться на него/нее, если мне будет важно добиться цели.',
  'Я не смог/смогла бы ничего добиться с ним/ней вместе.',
  'Он/она плохо справляется с решением проблем.',
];
const reverseItems = [2, 3, 4, 6, 9, 10];

const questions: SeedSection['questions'] = items.map((item, index) => ({
  code: `test_2203_${index + 1}`,
  text: index === 0
    ? `Пожалуйста, укажите, насколько вы согласны или не согласны с каждым утверждением о партнере, с которым вы только что говорили. Оценивайте утверждения по шкале от «Полностью не согласен» до «Полностью согласен». ${item}`
    : item,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2203',
  title: 'Шкала межличностной привлекательности (русскоязычная версия, 10 пунктов)',
  description: 'Русскоязычная краткая версия оценивает привлекательность конкретного собеседника после разговора по двум аспектам: социальному (возможность дружбы и приятного общения) и рабочему, или деятельностному (воспринимаемые компетентность и надёжность в совместных задачах). Подходит для взрослых участников, оценивающих партнёра, с которым только что общались; физическая привлекательность в этой версии не измеряется.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'social', label: 'Социальная привлекательность', items: [1, 2, 3, 4, 5], reverseItems: [2, 3, 4], aggregation: 'sum' },
    { key: 'task', label: 'Рабочая (деятельностная) привлекательность', items: [6, 7, 8, 9, 10], reverseItems: [6, 9, 10], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: нейтральные ответы дают по 20 баллов в обеих шкалах',
    answers: Object.fromEntries(Array.from({ length: 10 }, (_, index) => [String(index + 1), 4])),
    expected: { social: 20, task: 20 },
  },
  {
    title: 'Ручная проверка реверсивного ключа: согласие со всеми утверждениями',
    answers: Object.fromEntries(Array.from({ length: 10 }, (_, index) => [String(index + 1), 7])),
    expected: { social: 17, task: 17 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'ias-shokhina-mararitsa-2024-10item-v1',
};
