import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Никогда' },
  { value: '2', label: 'Один раз' },
  { value: '3', label: 'Несколько раз' },
  { value: '4', label: 'Часто' },
  { value: '5', label: 'Каждый день' },
];

const items = [
  'Я говорил приятные/дружеские слова кому-то.',
  'Кто-то сказал приятные/дружеские слова мне.',
  'Я говорил приятные/дружеские слова о ком-то.',
  'Кто-то говорил приятные/дружеские слова обо мне.',
  'Я помог кому-то или предложил помощь.',
  'Кто-то помог или предложил помощь мне.',
  'Я поднял настроение кому-то.',
  'Кто-то поднял настроение мне.',
  'Я дал понять кому-то, что он мне нравится.',
  'Кто-то дал понять мне, что я ему нравлюсь.',
  'Я сообщил, что мне что-то нравится (например, послал смайлик).',
  'Кто-то дал мне знать, что ему/ей понравилось то, что сделал я.',
  'Я сделал комплимент кому-то или поздравил кого-то.',
  'Кто-то сделал мне комплимент или поздравил меня.',
  'Я помог кому-то с домашним заданием.',
  'Кто-то помог с домашним заданием мне.',
  'Я поддержал кого-то.',
  'Кто-то поддержал меня.',
  'Я утешил кого-то.',
  'Кто-то утешил меня.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_836_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_836',
  title: 'Онлайн-просоциальное поведение (OPBS)',
  description: 'Шкала OPBS оценивает частоту просоциальных действий подростка в цифровом общении за последний месяц и частоту получения такой поддержки от других. Две подшкалы охватывают оказание помощи, доброжелательные слова, поддержку, утешение, одобрение и эмоциональное подкрепление. Версия предназначена для изучения онлайн-взаимодействия подростков и позволяет отдельно описать собственные действия и опыт полученной поддержки.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'performing', label: 'Оказание онлайн-просоциального поведения', items: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19], reverseItems: [], aggregation: 'mean' },
    { key: 'receiving', label: 'Получение онлайн-просоциального поведения', items: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20], reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: минимальные ответы дают минимум обеих подшкал',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { performing: 1, receiving: 1 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'erreygers-online-prosocial-behavior-scale-russian-lantsova-2024-means-v1',
};
