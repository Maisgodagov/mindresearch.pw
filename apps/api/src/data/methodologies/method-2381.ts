import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: 'A', label: 'Согласен' },
  { value: 'B', label: 'Склонен согласиться' },
  { value: 'C', label: 'Ни да, ни нет' },
  { value: 'D', label: 'Склонен не согласиться' },
  { value: 'E', label: 'Не согласен' },
];

const itemTexts = [
  'Я хороший сексуальный партнер.',
  'Меня угнетают сексуальные аспекты моей жизни.',
  'Я всё время думаю о сексе.',
  'Я бы оценил свои сексуальные способности достаточно высоко.',
  'Я совершенно спокоен по поводу своей сексуальности.',
  'Я думаю о сексе больше, чем о чём-то другом.',
  'В сексе я лучше большинства людей.',
  'Я неудовлетворен качеством моей сексуальной жизни.',
  'Я не грежу эротическими сценами.',
  'Иногда я сомневаюсь в собственной компетентности по части секса.',
  'Мысли о сексе доставляют мне радость.',
  'Меня, пожалуй, можно назвать сексуально озабоченным.',
  'Во время интимных свиданий я чувствую себя не слишком уверенно.',
  'Я получаю от секса удовольствие и наслаждение.',
  'Я постоянно думаю о занятии сексом.',
  'Считаю себя очень хорошим сексуальным партнером.',
  'Моя сексуальная жизнь приводит меня в уныние.',
  'Я думаю о сексе большую часть времени.',
  'Я невысоко себя оцениваю как сексуального партнера.',
  'Характер моих сексуальных отношений вызывает у меня чувство горечи.',
  'Я редко думаю о сексе.',
  'Я уверен в себе как в сексуальном партнере.',
  'Мне нравится моя сексуальная жизнь.',
  'Я едва ли когда-то фантазирую по поводу любовных утех.',
  'Я не особенно уверен в своих сексуальных способностях.',
  'Когда я вспоминаю себя в постели, мне становится грустно.',
  'Я, пожалуй, думаю о сексе реже, чем большинство людей.',
  'Иногда я сомневаюсь в своей искушенности в вопросах секса.',
  'Секс меня не пугает.',
  'Я не очень часто думаю о сексе.',
];

const questions: SeedSection['questions'] = itemTexts.map((text, index) => ({
  code: `test_2399_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2399',
  title: 'Шкала сексуальности (Sexuality Scale)',
  description: 'Русский перевод К. Ткаченко полной 30-пунктовой шкалы Уильяма Снелла и Денниса Папини описывает три отдельные стороны субъективного сексуального опыта: сексуальную самооценку, подавленность/неудовлетворённость сексуальной жизнью и поглощённость мыслями о сексе. Подходит для исследовательского самоописания взрослых респондентов обоих полов; автор опроса может использовать субшкалы для сопоставления этих аспектов, не трактуя баллы как диагноз или единую оценку сексуальности.',
  categoryIds: ['sexuality'],
  questions,
};

// The displayed A–E choices map to source scores +2, +1, 0, −1, −2;
// negative-keyed statements are reversed into the positive direction of each construct.
const keyedScores = { A: 2, B: 1, C: 0, D: -1, E: -2 };
const reversedScores = { A: -2, B: -1, C: 0, D: 1, E: 2 };
const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 4,
  scales: [
    { key: 'sexualEsteem', label: 'Сексуальная самооценка', items: [1, 4, 7, 10, 13, 16, 19, 22, 25, 28], reverseItems: [10, 13, 19, 25, 28], aggregation: 'sum', itemScores: Object.fromEntries([1, 4, 7, 10, 13, 16, 19, 22, 25, 28].map(item => [item, [10, 13, 19, 25, 28].includes(item) ? reversedScores : keyedScores])) },
    { key: 'sexualDepression', label: 'Подавленность в сфере сексуальной жизни', items: [2, 5, 8, 17, 20, 23, 26, 29], reverseItems: [5, 23, 29], aggregation: 'sum', itemScores: Object.fromEntries([2, 5, 8, 17, 20, 23, 26, 29].map(item => [item, [5, 23, 29].includes(item) ? reversedScores : keyedScores])) },
    { key: 'sexualPreoccupation', label: 'Поглощённость мыслями о сексе', items: [3, 6, 9, 12, 15, 18, 21, 24, 27, 30], reverseItems: [9, 21, 24, 27, 30], aggregation: 'sum', itemScores: Object.fromEntries([3, 6, 9, 12, 15, 18, 21, 24, 27, 30].map(item => [item, [9, 21, 24, 27, 30].includes(item) ? reversedScores : keyedScores])) },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка ключа: все варианты C дают ноль по каждой шкале',
    answers: Object.fromEntries(Array.from({ length: 30 }, (_, index) => [String(index + 1), 'C'])),
    expected: { sexualEsteem: 0, sexualDepression: 0, sexualPreoccupation: 0 },
  },
  {
    title: 'Ручная проверка реверса: A на положительных и E на обратных пунктах дают максимум',
    answers: Object.fromEntries(Array.from({ length: 30 }, (_, index) => [String(index + 1), ([10, 13, 19, 25, 28, 5, 23, 29, 9, 21, 24, 27, 30].includes(index + 1) ? 'E' : 'A')])),
    expected: { sexualEsteem: 20, sexualDepression: 16, sexualPreoccupation: 20 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'snell-papini-1989-sexuality-scale-30item-tkachenko-ru-v1',
};
