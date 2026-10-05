import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Да' },
  { value: '0', label: 'Нет' },
  { value: '2', label: 'Не знаю / Не хочу отвечать' },
];

const items = [
  'Ребятам нравится учиться в нашем классе.',
  'Дети в классе всегда дерутся друг с другом.',
  'В нашем классе каждый ученик – мой друг.',
  'Некоторые ученики в нашем классе несчастливы.',
  'Некоторые дети в нашем классе являются «середнячками».',
  'С некоторыми детьми в нашем классе я не дружу.',
  'Ребята нашего класса с удовольствием ходят в школу.',
  'Многие дети в нашем классе любят драться.',
  'Все ученики в нашем классе – друзья.',
  'Некоторые ученики не любят свой класс.',
  'Отдельные ученики всегда стремятся настоять на своем.',
  'Все ученики в нашем классе хорошо относятся друг к другу.',
  'Наш класс весёлый.',
  'Дети в нашем классе много ссорятся.',
  'Дети в нашем классе любят друг друга как друзья.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_755_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_755',
  title: 'Мой класс',
  description: 'Опросник Ю. З. Гильбуха оценивает восприятие школьниками удовлетворённости школьной жизнью, конфликтности и сплочённости своего класса. Подходит учащимся II–VII классов; индивидуальные результаты также можно обобщать для характеристики класса.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 3,
  scales: [
    { key: 'satisfaction', label: 'Удовлетворённость школьной жизнью (У)', items: [1, 4, 7, 10, 13], reverseItems: [4, 10], aggregation: 'sum', weights: { 1: 2, 4: 2, 7: 2, 10: 2, 13: 2 } },
    { key: 'conflict', label: 'Конфликтность в классе (К)', items: [2, 5, 8, 11, 14], reverseItems: [2, 11, 14], aggregation: 'sum' },
    { key: 'cohesion', label: 'Сплочённость класса (С)', items: [3, 6, 9, 12, 15], reverseItems: [3, 6, 9], aggregation: 'sum' },
  ],
};

// Published teacher key assigns items 10, 13–15 points 2 when no explicit
// key marker is printed in the extracted table. Encode these weights as 2.
scoringConfig.scales[0].weights = { 1: 2, 4: 2, 7: 2, 10: 2, 13: 2 };
scoringConfig.scales[1].weights = { 2: 2, 5: 2, 8: 2, 11: 2, 14: 2 };
scoringConfig.scales[2].weights = { 3: 2, 6: 2, 9: 2, 12: 2, 15: 2 };

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: все ответы «Да»; обратные утверждения получают 1, прямые — 3',
    answers: Object.fromEntries(Array.from({ length: 15 }, (_, i) => [String(i + 1), '1'])),
    expected: { satisfaction: 11, conflict: 9, cohesion: 9 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'gilbukh-my-class-15items-key-1-3-2-v1',
};
