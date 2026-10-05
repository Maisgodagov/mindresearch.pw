import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const answers = [
  { value: '1', label: 'Полностью соответствует' },
  { value: '2', label: 'Частично соответствует' },
  { value: '3', label: 'Несколько / частично не соответствует' },
  { value: '4', label: 'Совершенно не соответствует' },
];

const items = [
  'Когда нужно прощаться, я чувствую себя неуверенно и волнуюсь.',
  'Я переживаю из-за того, какое впечатление произвожу на окружающих.',
  'Если бы окружающие знали, какой я на самом деле, я бы им не понравился.',
  'Я не злюсь на других, потому что боюсь обидеть их.',
  'После ссоры с другом я чувствую себя не в своей тарелке, пока не помирюсь.',
  'Я переживаю, когда меня критикуют за мои слова и поступки.',
  'Мне кажется, что обычно я нравлюсь людям.',
  'Я скорее сделаю что-то, что не хочу, чем обижу или расстрою кого-то.',
  'Я верю в свои успехи, если только их кто-то подтверждает.',
  'Мне тревожно и беспокойно при расставании.',
  'Я боюсь, что другие не вынесут моих чувств.',
  'Я волнуюсь, если приходится критиковать окружающих.',
  'Я сильно расстраиваюсь, если меня критикуют.',
  'Если бы окружающие знали, какой я на самом деле, они бы стали меньше уважать меня.',
  'Я бы не хотел, чтобы окружающие знали, какой я на самом деле.',
  'Если кто-то меня расстраивает или огорчает, я долго не могу выбросить это из головы.',
  'Я чувствую, что другие меня не понимают.',
  'Меня волнует мнение окружающих обо мне.',
  'Я не чувствую себя счастливым, если люди, которых я знаю, мной не восхищаются.',
  'Я беспокоюсь, что могу ранить чувства других людей.',
  'Моя ценность как человека сильно зависит от того, что думают обо мне другие.',
  'Я дорожу мнением окружающих обо мне.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1039_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: answers,
}));

export const instrument: SeedSection = {
  code: 'test_1039',
  title: 'Опросник межличностной чувствительности (IPSM), русскоязычная трёхфакторная версия',
  description: 'Русскоязычная адаптация IPSM оценивает межличностную чувствительность у взрослых: зависимость от оценок окружающих, страх отвержения и беспокойство в межличностных отношениях. Подходит для описания самоотчётных особенностей переживания критики, принятия и взаимодействия; адаптационная выборка публикации включала участников 18–35 лет.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 4,
  scales: [
    { key: 'evaluation_dependence', label: 'Зависимость от оценок окружающих', items: [2, 6, 9, 13, 16, 18, 19, 21, 22], reverseItems: [], aggregation: 'sum' },
    { key: 'rejection_fear', label: 'Страх отвержения', items: [3, 7, 11, 14, 15, 17], reverseItems: [7], aggregation: 'sum' },
    { key: 'interpersonal_anxiety', label: 'Беспокойство в межличностных отношениях', items: [1, 4, 5, 8, 10, 12, 20], reverseItems: [], aggregation: 'sum' },
    { key: 'total', label: 'Общая межличностная чувствительность', items: Array.from({ length: 22 }, (_, index) => index + 1), reverseItems: [7], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы «полностью соответствует»; обратный пункт 7 перекодируется в 1',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { evaluation_dependence: 36, rejection_fear: 21, interpersonal_anxiety: 28, total: 85 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'ipsm-russian-three-factor-razvalyaeva-polskaya-2021-v1',
};
