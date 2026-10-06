import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Никогда' },
  { value: '2', label: 'Редко' },
  { value: '3', label: 'Иногда' },
  { value: '4', label: 'Часто' },
  { value: '5', label: 'Всегда' },
];

const items = [
  'Я уважаю свое тело.',
  'Я доволен своим телом.',
  'Я чувствую, что мое тело имеет, по крайней мере, некоторые положительные характеристики.',
  'Я отношусь к своему телу положительно.',
  'Я внимателен к потребностям моего тела.',
  'Я чувствую любовь к своему телу.',
  'Я ценю отличительные и уникальные особенности своего тела.',
  'Мое позитивное отношение к моему телу проявляется в моем поведении: например, я хожу с высоко поднятой головой и часто улыбаюсь.',
  'Мне комфортно в моем теле.',
  'Я чувствую, что я красив, несмотря на то, что могу отличаться от медийных образов привлекательных людей (известных моделей, актеров).',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2333_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2333',
  title: 'Шкала принятия своего тела BAS-2',
  description: 'BAS-2 оценивает позитивное отношение человека к собственному телу: принятие и уважение, положительную оценку, внимание к потребностям тела, комфорт и устойчивость к нереалистичным медийным идеалам внешности. Одномерная версия предназначена для взрослых женщин и мужчин; русскоязычные формулировки представлены в адаптации Борисенко и Белогай.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'body_appreciation', label: 'Принятие и позитивное отношение к телу', items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: все ответы «Никогда» дают среднее 1',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { body_appreciation: 1 },
  },
  {
    title: 'Ручная проверка: ответы от 1 до 5 дают среднее 3',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), (index % 5) + 1])),
    expected: { body_appreciation: 3 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['clinical-body'],
  scoringConfig,
  validationCases,
  formulaVersion: 'bas-2-tylka-wood-barcalow-2015-borisenko-belogai-ru-v1',
};
