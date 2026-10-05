import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Абсолютно не согласен' },
  { value: '2', label: 'Скорее не согласен' },
  { value: '3', label: 'Скорее согласен, чем не согласен' },
  { value: '4', label: 'Скорее согласен' },
  { value: '5', label: 'Согласен' },
  { value: '6', label: 'Полностью согласен' },
];

const items = [
  'Когда я завидую другим, я думаю о том, как стать таким же успешным в будущем',
  'Я хочу, чтобы люди, которые в чем-то меня превосходят, потеряли свои преимущества',
  'Если я замечаю, что другой человек лучше меня, я стараюсь стать лучше сам',
  'Зависть к другим помогает мне достигать собственных целей',
  'Если у других людей есть что-то, что я хочу себе, у меня возникает желание лишить их этого',
  'Я испытываю враждебность к людям, которым я завидую',
  'Если кто-то достиг большего, чем я, то я стремлюсь добиться того же',
  'Если я завидую другому человеку, то у меня возникает к нему неприязнь',
  'Если чьи-то личные качества, достижения или имущество лучше, чем у меня, я стараюсь добиться того же',
  'Когда я вижу достижения других людей, это вызывает у меня возмущение',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1021_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1021',
  title: 'Опросник конструктивной и деструктивной зависти (BeMaS), русская адаптация',
  description: 'Опросник оценивает две относительно самостоятельные диспозиционные формы зависти: конструктивную, связанную с мотивацией улучшать собственные результаты, и деструктивную, связанную с враждебностью к тому, кому завидуют. Профиль из двух шкал помогает автору опроса изучать эмоциональные и мотивационные различия у взрослых и старших подростков; русская адаптация Люсина и Амираслановой проверялась на выборке участников от 17 лет.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 6,
  scales: [
    { key: 'benignEnvy', label: 'Конструктивная зависть', items: [1, 3, 4, 7, 9], reverseItems: [], aggregation: 'mean' },
    { key: 'maliciousEnvy', label: 'Деструктивная зависть', items: [2, 5, 6, 8, 10], reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: постоянное значение по всем пунктам',
    answers: Object.fromEntries(Array.from({ length: 10 }, (_, index) => [String(index + 1), 4])),
    expected: { benignEnvy: 4, maliciousEnvy: 4 },
  },
  {
    title: 'Ручная проверка: отдельные средние двух шкал',
    answers: { '1': 1, '2': 6, '3': 2, '4': 3, '5': 5, '6': 4, '7': 4, '8': 3, '9': 5, '10': 2 },
    expected: { benignEnvy: 3, maliciousEnvy: 4 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'bemas-russian-lyusin-amiraslanova-2022-v1',
};
