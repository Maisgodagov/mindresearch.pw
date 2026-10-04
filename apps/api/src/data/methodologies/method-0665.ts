import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const responseOptions = [
  { value: '1', label: 'Категорически не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Скорее не согласен, чем согласен' },
  { value: '4', label: 'Скорее согласен, чем не согласен' },
  { value: '5', label: 'Согласен' },
  { value: '6', label: 'Полностью согласен' },
];

const items = [
  'Виртуальный профиль уникален для каждого человека, и я знаю точно, каким должен быть мой профиль в виртуальном мире',
  'Я точно знаю, в каком направлении самореализоваться в виртуальном мире',
  'Я понимаю, каким должно быть мое поведение в Интернете, и следую этому',
  'Теперь я точно знаю, что хочу от Интернета и виртуальности',
  'Я часто размышляю о своей виртуальной жизни и своем Интернет-поведении',
  'Сейчас понимаю, какие профиль и поведение должны быть у меня в онлайн-среде',
  'Я часто пытаюсь узнать, что другие люди думают обо мне на тех сайтах, онлайн-платформах и виртуальных ресурсах, которые я посещаю',
  'Я часто разговариваю о себе в виртуальных сообществах',
  'Виртуальный мир помогает мне чувствовать уверенность в себе',
  'В виртуальном окружении я чувствую себя в безопасности и оптимистично смотрю в будущее',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_696_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: responseOptions,
}));

export const instrument: SeedSection = {
  code: 'test_696',
  title: 'Методика оценки статусов виртуальной идентичности («Статус ВИ»)',
  description: 'Методика оценивает виртуальную идентичность по двум аспектам: интенсивности поиска и осмысленности принятия виртуального образа Я; их сочетание описывает статусы диффузии, моратория, предрешенности и достигнутой идентичности. Разработана и проверена на студентах 17–25 лет; полезна для исследовательских опросов о становлении идентичности в цифровой среде.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 6,
  scales: [
    { key: 'meaningfulAcceptance', label: 'Осмысленность принятия виртуальной идентичности', items: [1, 2, 3, 4, 6], reverseItems: [], aggregation: 'sum' },
    { key: 'searchIntensity', label: 'Интенсивность поиска виртуальной идентичности', items: [5, 7, 8, 9, 10], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы минимальные: обе суммы равны 5',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { meaningfulAcceptance: 5, searchIntensity: 5 },
  },
  {
    title: 'Ответы 1–10 по порядку: проверка ключей шкал',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), index + 1])),
    expected: { meaningfulAcceptance: 16, searchIntensity: 35 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'klementyeva-status-vi-2024-v1',
};
