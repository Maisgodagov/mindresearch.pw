import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Нет, это совсем не так' },
  { value: '2', label: 'Пожалуй, так' },
  { value: '3', label: 'Верно' },
  { value: '4', label: 'Совершенно верно' },
];

const items = [
  'Я доволен ходом тренировочного процесса.',
  'В методике тренировки я хочу кое-что изменить.',
  'Я надеюсь на успех в этом сезоне.',
  'В тренировке я во всем активен.',
  'Я думаю, что мои замечания вряд ли что изменят.',
  'Я верю, что методика моей тренировки верна.',
  'Происходящее на тренировке не вызывает у меня особого интереса.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2549_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2549',
  title: 'Шкала мотивационного состояния (ШМС, В. Ф. Сопов)',
  description: 'ШМС оценивает актуальную выраженность мотивации спортсмена в отношении тренировочного процесса и помогает отслеживать её динамику на этапах подготовки. Семь утверждений охватывают удовлетворённость тренировками, отношение к их методике, надежду на успех и активность; версия предназначена для спортсменов и оценки состояния в конкретный момент.',
  categoryIds: ['sport'],
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 4,
  scales: [
    { key: 'motivation', label: 'Мотивационное состояние', items: [1, 2, 3, 4, 5, 6, 7], reverseItems: [2, 5, 7], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: все ответы «Нет, это совсем не так»; три обратных пункта инвертированы',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), '1'])),
    expected: { motivation: 16 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'sopov-shms-1985-sum-reverse-2-5-7-v1',
};
