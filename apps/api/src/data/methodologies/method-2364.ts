import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Совсем не похож на меня' },
  { value: '2', label: 'Мало похож на меня' },
  { value: '3', label: 'Немного похож на меня' },
  { value: '4', label: 'Похож на меня' },
  { value: '5', label: 'Очень похож на меня' },
];

const items = [
  'Он считает, что изменения — это путь к успеху.',
  'С его точки зрения сегодняшние потери совсем необязательно плохи для будущего.',
  'Он готов идти на риск ради достижений.',
  'Ему нравится делать все по-своему, оригинально.',
  'Для него важно разнообразие в жизни.',
  'Встреча с неизведанным, новым не пугает его.',
  'Он полагает, что возможности даются только тем, кто их сам активно ищет.',
  'Он творческий человек, всегда стремится создать, придумывать что-то новое.',
  'Он не боится ошибок и конструктивно реагирует на них.',
  'Для него характерна любовь к исследованию нового, любознательность.',
  'Он готов вкладывать деньги в инновации.',
  'Он вполне комфортно чувствует себя в нестабильной среде.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2382_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

const instrument: SeedSection = {
  code: 'test_2382',
  title: 'Шкала самооценки инновативных качеств личности',
  description: 'Шкала Лебедевой и Татарко оценивает установки человека по отношению к инновациям через самооценку инновативных качеств. Три аспекта профиля — креативность, готовность к риску ради успеха и ориентация на будущее; методика исследовалась на студенческих и взрослых выборках, включая организационный контекст.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'creativity', label: 'Креативность', items: [4, 5, 8, 10], reverseItems: [], aggregation: 'mean' },
    { key: 'risk_for_success', label: 'Риск ради успеха', items: [3, 6, 11, 12], reverseItems: [], aggregation: 'mean' },
    { key: 'future_orientation', label: 'Ориентация на будущее', items: [1, 2, 7, 9], reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная сверка по ключу: ответы 1–12 от 1 до 5 по порядку',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), String(index + 1 > 5 ? index + 1 - 5 : index + 1)])),
    expected: { creativity: 3, risk_for_success: 3, future_orientation: 3 },
  },
];

export const methodology: MethodologyRegistration = {
  categoryIds: ["trait-cognitive"],
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'lebedeva-tatarko-innovation-self-rating-2009-v1',
};
