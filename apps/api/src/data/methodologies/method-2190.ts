import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Неверно' },
  { value: '2', label: 'Не совсем верно' },
  { value: '3', label: 'Затрудняюсь ответить' },
  { value: '4', label: 'В целом верно' },
  { value: '5', label: 'Совершенно верно' },
];

const prompts = [
  'Есть во мне чувство превосходства, благодаря которому я верю, что могу достичь всего, к чему стремлюсь.',
  'Я знаю, когда время праздновать победу, но также я знаю, когда нужно остановиться и сосредоточиться на следующих задачах.',
  'Мой бойцовский характер помогает мне выгодно использовать момент, когда я знаю, что могу победить.',
  'Я знаю, что нужно сделать, чтобы достичь того уровня спортивного мастерства, что необходим для победы.',
  'Я обладаю терпением и дисциплиной, чтобы правильно прикладывать усилия, шаг за шагом продвигаясь к победе.',
  'Даже несмотря на усталость, я всё равно продолжаю тренироваться, чтобы достичь своей цели.',
  'Я использую все особенности и трудности тренировочного процесса в своих интересах.',
  'Я способен выкладываться и работать изо всех сил, когда это необходимо для победы.',
  'Когда на моем пути возникают препятствия, я всегда нахожу способ преодолеть их.',
  'Я принимаю и даже приветствую те элементы тренировки, которые считаются болезненными и некомфортными.',
  'Я полностью отдаюсь своей спортивной цели, пока есть хоть один шанс победить.',
];

const questions: SeedSection['questions'] = prompts.map((text, index) => ({
  code: `test_2204_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2204',
  title: 'Шкала ментальной прочности спортсмена (MTS), русскоязычная адаптация',
  description: 'Одномерная шкала оценивает ментальную прочность спортсмена через уверенность в достижении целей, сосредоточенность на следующих задачах, бойцовский настрой, дисциплину, усилия и преодоление препятствий в тренировках и соревнованиях. Подходит для опросов спортсменов; эта версия содержит русскоязычную адаптацию Бочавер, Бондарева и Довжик (2023) одиннадцатипунктовой MTS.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [{
    key: 'mental_toughness',
    label: 'Ментальная прочность спортсмена',
    items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    reverseItems: [],
    aggregation: 'sum',
  }],
};

export const validationCases: ValidationCase[] = [
  {
    title: 'Ручная сверка: все ответы «Неверно» дают сумму 11',
    answers: Object.fromEntries(Array.from({ length: 11 }, (_, index) => [String(index + 1), 1])),
    expected: { mental_toughness: 11 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'madrigal-hamill-gill-mts-ru-adaptation-2023-11item-sum-v1',
};
