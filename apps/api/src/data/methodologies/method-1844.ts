import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const answerOptions = Array.from({ length: 11 }, (_, value) => ({
  value: String(value),
  label: String(value * 10),
}));

const items = [
  'Если я думаю о неприятном событии, вероятность того, что оно случится, повышается.',
  'Если я думаю о нанесении себе вреда, то, в конце концов, сделаю это.',
  'Если я думаю, что мне угрожает опасность, значит, я действительно в опасности.',
  'Наличие плохих мыслей означает, что я сделаю что-то плохое.',
  'Если я думаю о неприятном событии, значит, оно, должно быть, случилось.',
  'Если у меня есть мысли о нанесении вреда кому-то другому, то я так и поступлю.',
  'Если я думаю, что что-то заражено опытом других людей, значит, оно заражено.',
  'Мои мысли сами по себе могут изменить ход событий.',
  'Некоторые объекты излучают плохую энергетику.',
  'Если у меня возникают плохие мысли, это должно означать, что я хочу их иметь.',
  'Мои чувства могут передаваться объектам.',
  'Если я думаю о том, чтобы навредить кому-то, это причинит ему вред.',
  'Мои мысли становятся реальностью. Если я о чем-то думаю, это сбудется.',
  'Мои воспоминания или мысли могут передаваться объектам.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1861_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: answerOptions,
}));

export const instrument: SeedSection = {
  code: 'test_1861',
  title: 'Тест слияния мыслей (TFI)',
  description: 'Оценивает метакогнитивные убеждения о значении, силе и последствиях мыслей, включая представления о влиянии мыслей на события и действия, а также о переносе мыслей и чувств на объекты. Предназначен для применения в метакогнитивной терапии и исследованиях убеждений, связанных прежде всего с обсессивно-компульсивной симптоматикой; русская версия psytests.org обозначена как перевод Е. Анчевской (2021).',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 10,
  scales: [
    {
      key: 'total',
      label: 'Общий балл слияния мыслей',
      items: Array.from({ length: 14 }, (_, index) => index + 1),
      reverseItems: [],
      aggregation: 'sum',
    },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы минимальные',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 0])),
    expected: { total: 0 },
  },
  {
    title: 'Все ответы максимальные',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 10])),
    expected: { total: 140 },
  },
  {
    title: 'Проверка суммирования вручную: пункты 1–14 равны 0–13',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), index % 11])),
    expected: { total: 80 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'tfi-wells-gwilliam-cartwright-hatton-2001-ru-anchevskaya-2021-v1',
};
