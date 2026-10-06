import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Определенно ложно' },
  { value: '2', label: 'В основном ложно' },
  { value: '3', label: 'До определенной степени ложно' },
  { value: '4', label: 'Немного ближе к тому, что это ложно' },
  { value: '5', label: 'Немного ближе к тому, что это правда' },
  { value: '6', label: 'До определенной степени правда' },
  { value: '7', label: 'В основном правда' },
  { value: '8', label: 'Определенно правда' },
];

const items = [
  'Я могу придумать много путей выхода из затруднительного положения.',
  'Я энергично добиваюсь своих целей.',
  'Я часто чувствую себя усталым.',
  'Есть много способов обойти проблему.',
  'Меня легко победить в споре.',
  'Я могу найти много способов добиться в жизни того, что для меня важно.',
  'Я беспокоюсь о своем здоровье.',
  'Даже когда другие сдаются, я знаю, что я могу найти способ решить проблему.',
  'Мой прошлый опыт хорошо подготовил меня к будущему.',
  'Я очень успешен в жизни.',
  'Я часто переживаю по разным поводам.',
  'Я добиваюсь целей, которые я себе поставил.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2124_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2124',
  title: 'Шкала диспозиционной надежды (AHS), русскоязычная версия Елшанского и соавторов',
  description: 'Шкала оценивает диспозиционную надежду у взрослых как связанный с целями мотивационно-когнитивный ресурс. Она охватывает агентность — ощущение энергии и способности двигаться к целям — и мышление путей, то есть умение находить способы их достижения; четыре пункта-наполнителя в показатель надежды не входят. Автору опроса она помогает описать эти два аспекта целенаправленного мышления в русскоязычной версии шкалы.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 8,
  scales: [
    { key: 'agency', label: 'Агентность (мышление действия)', items: [2, 9, 10, 12], reverseItems: [], aggregation: 'sum' },
    { key: 'pathways', label: 'Мышление путей', items: [1, 4, 6, 8], reverseItems: [], aggregation: 'sum' },
    { key: 'hope', label: 'Общая шкала надежды (8 оцениваемых пунктов)', items: [1, 2, 4, 6, 8, 9, 10, 12], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: все оцениваемые ответы равны 4, наполнители не учитываются',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 4])),
    expected: { agency: 16, pathways: 16, hope: 32 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'ahs-ru-yelshansky-et-al-2014-v1',
};
