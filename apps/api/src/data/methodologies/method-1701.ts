import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '4', label: 'Всегда' },
  { value: '3', label: 'Часто' },
  { value: '2', label: 'Иногда' },
  { value: '1', label: 'Редко' },
  { value: '0', label: 'Никогда' },
];

const items = [
  'На работе я остро чувствую нехватку времени, нет времени на передышки, чувствую постоянный цейтнот.',
  'Я теряю отсчет времени: время словно проваливается куда-то.',
  'На работе время течет спокойно и размеренно.',
  'Я нервничаю из-за того, что мне не хватает времени на задуманное (запланированное).',
  'На работе я ощущаю напряженность времени.',
  'На работе и после нее мое время максимально спрессовано.',
  'Я чувствую свое бессилие перед ограниченностью, утечкой и скоротечностью времени.',
  'Из-за бестолковости (непредприимчивости) моих подчиненных и их непродуктивной траты рабочего времени меня охватывает раздражение (тихое или бурное бешенство).',
  'У меня портится настроение, когда время тратится попусту.',
  'Для достижения результатов работы я трачу намного больше времени, чем мои подчиненные.',
  'На работе мне приходится делать несколько дел в одно и то же время.',
  'Я нахожусь в сильном напряжении потому, что время летит слишком быстро, я словно кручу педали впустую.',
  'Мысли о работе не покидают меня даже дома.',
  'Моя работа «выжимает» из меня всю энергию, силы и чувства.',
  'Моя управленческая работа не оставляет мне времени на полноценный отдых, должное внимание к семье и встречи с друзьями или близкими людьми.',
  'К концу рабочего дня я чувствую раздражение из-за того, что запланированное не было выполнено.',
  'Я сомневаюсь в том, что мои подчиненные выкладываются в полную силу и выполняют все свои обязанности.',
  'Я не верю в преданность моих подчиненных (сотрудников моей группы).',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1718_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1718',
  title: 'Тайм-синдром менеджера',
  description: 'Опросник Н. Е. Водопьяновой оценивает переживания дефицита времени в профессиональной деятельности менеджеров при решении управленческих задач. Он охватывает ощущение нехватки и напряженности времени, эмоциональную реакцию на его дефицит, продуктивность использования времени, зависимость от работы и агрессию в условиях цейтнота. Подходит для опросов менеджеров и руководителей; опубликованные шкальные ориентиры получены на выборке менеджеров среднего звена.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 4,
  scales: [
    { key: 'time_limitedness', label: 'Переживание ограниченности времени (дискретность)', items: [1, 2, 3], reverseItems: [3], aggregation: 'mean' },
    { key: 'time_pressure', label: 'Напряженность дефицита времени', items: [4, 5, 6], reverseItems: [], aggregation: 'mean' },
    { key: 'emotional_time', label: 'Эмоциональное переживание дефицита времени', items: [7, 8, 9], reverseItems: [], aggregation: 'mean' },
    { key: 'time_productivity', label: 'Продуктивность использования личного времени', items: [10, 11, 12], reverseItems: [], aggregation: 'mean' },
    { key: 'work_dependency', label: 'Зависимость от работы', items: [13, 14, 15], reverseItems: [], aggregation: 'mean' },
    { key: 'aggression', label: 'Агрессия', items: [16, 17, 18], reverseItems: [], aggregation: 'mean' },
    { key: 'total', label: 'Интегральный показатель (сумма шести субшкал)', items: Array.from({ length: 18 }, (_, i) => i + 1), reverseItems: [3], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка обратного пункта: все ответы «никогда», кроме пункта 3 «всегда»',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), index === 2 ? 4 : 0])),
    expected: { time_limitedness: 0, time_pressure: 0, emotional_time: 0, time_productivity: 0, work_dependency: 0, aggression: 0, total: 0 },
  },
  {
    title: 'Все прямые пункты «всегда», обратный пункт 3 «никогда»',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), index === 2 ? 0 : 4])),
    expected: { time_limitedness: 4, time_pressure: 4, emotional_time: 4, time_productivity: 4, work_dependency: 4, aggression: 4, total: 72 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'vodopyanova-time-syndrome-manager-2009-18item-six-mean-subscales-v1',
};
