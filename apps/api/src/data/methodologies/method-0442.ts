import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const responseOptions = [
  { value: '1', label: 'Совершенно не согласен(а)' },
  { value: '2', label: 'Скорее не согласен(а)' },
  { value: '3', label: 'Ни да, ни нет' },
  { value: '4', label: 'Скорее согласен(а)' },
  { value: '5', label: 'Полностью согласен(а)' },
];

const items = [
  'Я очень привязан(а) к своему городу.',
  'Я очень похож(а) на свой город.',
  'Мой город — особенное место для меня.',
  'Ни одно другое место не может сравниться с моим городом.',
  'Мой город — лучшее место заниматься тем, что мне нравится.',
  'Я бы не променял(а) свой город и то, что я здесь делаю, ни на что другое.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_478_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: responseOptions,
}));

export const instrument: SeedSection = {
  code: 'test_478',
  title: 'Краткая шкала привязанности к месту (APAS), русскоязычная адаптация',
  description: 'Краткая шкала оценивает привязанность человека к выбранному месту по двум аспектам: эмоционально-символической идентификации с местом и функциональной зависимости от него. Подходит для исследований русскоязычных взрослых жителей; адаптированная версия апробирована на жителях Челябинской области и Санкт-Петербурга. Формулировку «мой город» следует заменить названием исследуемого места, если это требуется дизайном опроса.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'place_identity', label: 'Идентификация с местом', items: [1, 2, 3], reverseItems: [], aggregation: 'mean' },
    { key: 'place_dependence', label: 'Зависимость от места', items: [4, 5, 6], reverseItems: [], aggregation: 'mean' },
    { key: 'place_attachment', label: 'Общая привязанность к месту', items: [1, 2, 3, 4, 5, 6], reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: минимальное согласие по всем пунктам',
    answers: { '1': 1, '2': 1, '3': 1, '4': 1, '5': 1, '6': 1 },
    expected: { place_identity: 1, place_dependence: 1, place_attachment: 1 },
  },
  {
    title: 'Ручная проверка: максимальное согласие по всем пунктам',
    answers: { '1': 5, '2': 5, '3': 5, '4': 5, '5': 5, '6': 5 },
    expected: { place_identity: 5, place_dependence: 5, place_attachment: 5 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'apas-ivanova-zabelina-2024-v1',
};
