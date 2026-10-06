import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Всегда' },
  { value: '2', label: 'Часто' },
  { value: '3', label: 'Не очень часто' },
  { value: '4', label: 'Редко' },
  { value: '5', label: 'Никогда' },
];

const prompts = [
  'Я курю для того, чтобы не дать себе расслабиться.',
  'Частичное удовольствие от курения я получаю еще до закуривания, разминая сигарету.',
  'Курение доставляет мне удовольствие и позволяет расслабиться.',
  'Я закуриваю сигарету, когда выхожу из себя, сержусь на что-либо.',
  'Когда у меня кончаются сигареты, мне кажется невыносимым тот промежуток времени, пока я их не достану.',
  'Я закуриваю автоматически, даже не замечая этого.',
  'Я курю для того, чтобы стимулировать себя, поднять свой тонус.',
  'Частично удовольствие мне доставляет сам процесс закуривания.',
  'Курение доставляет мне удовольствие.',
  'Я закуриваю сигарету, когда мне не по себе или я расстроен чем-нибудь.',
  'Я очень хорошо ощущаю те моменты, когда я не курю.',
  'Я закуриваю новую сигарету, не замечая, что предыдущая еще не догорела в пепельнице.',
  'Я закуриваю сигарету, чтобы «подстегнуть» себя.',
  'Когда я курю, частичное удовольствие я получаю, выпуская дым и наблюдая за ним.',
  'Я хочу закурить, когда удобно устроюсь и расслаблюсь.',
  'Я закуриваю, когда чувствую себя подавленным, хочу забыть о своих неприятностях.',
  'Если я некоторое время не курил, меня начинает мучить самое настоящее чувство «голода» по сигарете.',
  'Почувствовав во рту сигарету, я не могу вспомнить, когда я ее закурил.',
];

const questions: SeedSection['questions'] = prompts.map((text, index) => ({
  code: `test_1922_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1922',
  title: 'Тип курительного поведения (анкета Д. Хорна)',
  description: 'Анкета описывает шесть мотивов курения у курящих: стимуляцию, игру с сигаретой, расслабление, эмоциональную поддержку, жажду сигареты и автоматическую привычку. Профиль помогает автору опроса понять, какую функцию курение выполняет для респондента; это не диагностическая шкала никотиновой зависимости и не средство постановки диагноза.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'stimulation', label: 'Стимуляция', items: [1, 7, 13], reverseItems: [1, 7, 13], aggregation: 'sum' },
    { key: 'cigarette_play', label: 'Игра с сигаретой', items: [2, 8, 14], reverseItems: [2, 8, 14], aggregation: 'sum' },
    { key: 'relaxation', label: 'Расслабление', items: [3, 9, 15], reverseItems: [3, 9, 15], aggregation: 'sum' },
    { key: 'support', label: 'Поддержка', items: [4, 10, 16], reverseItems: [4, 10, 16], aggregation: 'sum' },
    { key: 'craving', label: 'Жажда', items: [5, 11, 17], reverseItems: [5, 11, 17], aggregation: 'sum' },
    { key: 'reflex', label: 'Рефлекс', items: [6, 12, 18], reverseItems: [6, 12, 18], aggregation: 'sum' },
  ],
};

const answers = (value: number) => Object.fromEntries(Array.from({ length: 18 }, (_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Все ответы «Всегда»: после приведения к шкале 1–5 получаем по 15 баллов на мотив', answers: answers(1), expected: { stimulation: 15, cigarette_play: 15, relaxation: 15, support: 15, craving: 15, reflex: 15 } },
  { title: 'Все ответы «Никогда»: после приведения к шкале 1–5 получаем по 3 балла на мотив', answers: answers(5), expected: { stimulation: 3, cigarette_play: 3, relaxation: 3, support: 3, craving: 3, reflex: 3 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'horn-smoking-behavior-six-motives-18-item-russian-v1',
};
