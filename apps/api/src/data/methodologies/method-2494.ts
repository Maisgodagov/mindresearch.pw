import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const items = [
  'Сегодня я всё ещё задаюсь вопросом о смысле жизни.',
  'Моё отношение к религии/духовности, скорее всего, изменится в соответствии с моим жизненным опытом.',
  'Способность сомневаться в убеждениях и пересматривать их — это хорошее качество.',
  'Мне кажется, что сомнение является важным в экзистенциальных вопросах.',
  'Мой взгляд на мир обязательно изменится снова.',
  'Моё мнение различается по многим вопросам.',
  'Я очень хорошо знаю свою цель в жизни.',
  'Годы идут, но мой взгляд на мир не меняется.',
  'Я часто пересматриваю свои религиозные/духовные убеждения.',
];

const options = [
  { value: '1', label: 'Абсолютно нет' },
  { value: '2', label: 'В основном нет' },
  { value: '3', label: 'Скорее, нет' },
  { value: '4', label: 'Ни да, ни нет' },
  { value: '5', label: 'Скорее, да' },
  { value: '6', label: 'В основном да' },
  { value: '7', label: 'Абсолютно да' },
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2512_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2512',
  title: 'Шкала экзистенциального поиска',
  description: 'Русскоязычная адаптация для взрослых респондентов оценивает гибкость экзистенциальных убеждений и мировоззрения: готовность задаваться вопросами о смысле и цели жизни, ценить сомнение и пересматривать взгляды, в том числе религиозные или духовные. Помогает автору опроса изучать открытость человека к изменению глубинных убеждений; единый суммарный балл отражает выраженность экзистенциального поиска.',
  categoryIds: ['meaning-existential'],
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [{
    key: 'total',
    label: 'Экзистенциальный поиск',
    items: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    reverseItems: [7, 8],
    aggregation: 'sum',
  }],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Минимум после реверса пунктов 7 и 8',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), index === 6 || index === 7 ? 7 : 1])),
    expected: { total: 9 },
  },
  {
    title: 'Максимум после реверса пунктов 7 и 8',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), index === 6 || index === 7 ? 1 : 7])),
    expected: { total: 63 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'eqs-ru-smirnov-makarova-kostromina-2025-v1',
};
