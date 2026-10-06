import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'Полностью не согласен' },
  { value: '1', label: 'Не согласен' },
  { value: '2', label: 'Согласен' },
  { value: '3', label: 'Полностью согласен' },
];

const texts = [
  'В целом я доволен собой',
  'Временами мне кажется, что я не совсем хорош',
  'Думаю, у меня есть ряд достоинств',
  'Многие вещи я способен делать не хуже большинства других людей',
  'Мне кажется, что мне нечем гордиться',
  'Иногда я чувствую себя бесполезным',
  'Я считаю себя достойным и равным другим человеком',
  'Мне бы хотелось больше уважать себя',
  'По большому счету я считаю себя неудачником',
  'Я хорошо отношусь к себе',
];

const instrument: SeedSection = {
  code: 'test_2394',
  title: 'Шкала самоуважения Розенберга (RSES), русская версия Золотарёвой',
  description: 'Десятипунктовая шкала оценивает глобальное самоуважение — общее чувство собственной ценности и отношение человека к себе. Пункты охватывают позитивное самоотношение и сомнения в собственной ценности; русская версия Золотарёвой проверялась на русскоязычных студентах 16–24 лет и подходит для исследовательской экспресс-оценки этой группы. Результат представляет единый суммарный показатель, без нормативной интерпретации.',
  categoryIds: ['self-esteem'],
  questions: texts.map((text, index) => ({
    code: `test_2394_${index + 1}`,
    text,
    type: 'single',
    required: true,
    options,
  })),
};

const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 3,
  scales: [{
    key: 'global_self_esteem',
    label: 'Глобальное самоуважение',
    items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    reverseItems: [2, 5, 6, 8, 9],
    aggregation: 'sum',
  }],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: полное согласие со всеми утверждениями; пять обратных пунктов инвертированы',
    answers: Object.fromEntries(Array.from({ length: 10 }, (_, index) => [String(index + 1), '3'])),
    expected: { global_self_esteem: 15 },
  },
  {
    title: 'Ручная проверка: максимальный итог при положительном и отрицательном содержании пунктов',
    answers: { '1': '3', '2': '0', '3': '3', '4': '3', '5': '0', '6': '0', '7': '3', '8': '0', '9': '0', '10': '3' },
    expected: { global_self_esteem: 30 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'rosenberg-self-esteem-zolotareva-2020-ru-v1',
};
