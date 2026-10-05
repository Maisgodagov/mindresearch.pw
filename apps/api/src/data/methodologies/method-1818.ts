import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const answers = [
  { value: '1', label: 'Никогда' },
  { value: '2', label: 'Редко' },
  { value: '3', label: 'Иногда' },
  { value: '4', label: 'Часто' },
  { value: '5', label: 'Постоянно' },
];

const items = [
  'На работе я чувствую душевную усталость.',
  'Всё, что я делаю на работе, требует от меня больших усилий.',
  'После рабочего дня мне трудно восстановить свои силы.',
  'На работе я чувствую физическую усталость.',
  'Просыпаясь утром, я чувствую нехватку сил для нового рабочего дня.',
  'Я хочу быть активным(ой) на работе, но почему-то мне это не удаётся.',
  'Когда я прилагаю усилия к работе, я быстро устаю.',
  'В конце рабочего дня я чувствую себя внутренне опустошённым(ой) и выжатым(ой).',
  'Мне трудно найти в себе энтузиазм к моей работе.',
  'На работе я не задумываюсь о том, что делаю, работаю на автопилоте.',
  'Я чувствую сильное отвращение к моей работе.',
  'Я чувствую, что моя работа мне безразлична.',
  'Я сомневаюсь, что моя работа имеет для кого-то значение.',
  'На работе мне сложно оставаться собранным(ой).',
  'Во время работы мне с трудом удаётся мыслить ясно.',
  'На работе я забывчив(а) и рассеян(на).',
  'Когда я работаю, мне сложно сконцентрироваться.',
  'Я делаю ошибки в процессе работы, потому что думаю о других вещах.',
  'На работе я чувствую, что не способен(на) контролировать свои эмоции.',
  'Я не узнаю себя в том, как я эмоционально реагирую на работе.',
  'Во время работы я раздражаюсь, если дела идут не так, как я хочу.',
  'Я расстраиваюсь и огорчаюсь на работе, сам(а) не зная почему.',
  'На работе я могу слишком остро реагировать, сам(а) того не желая.',
  'Мне трудно заснуть или мой сон прерывистый.',
  'Я испытываю беспокойство.',
  'Я нахожусь в напряжении и стрессе.',
  'Я тревожусь и/или испытываю приступы паники.',
  'Меня беспокоят шум и большое количество людей.',
  'Меня беспокоят сердцебиения или боли в груди.',
  'Меня беспокоят проблемы с желудком или кишечником.',
  'Меня беспокоят головные боли.',
  'Меня беспокоят боли в мышцах (например, шеи, плеч или спины).',
  'Я часто болею.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1835_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: answers,
}));

export const instrument: SeedSection = {
  code: 'test_1835',
  title: 'Тест оценки выгорания BAT — рабочая версия (BAT-23)',
  description: 'BAT-23 оценивает связанные с работой основные проявления выгорания: истощение, внутреннее дистанцирование от работы, когнитивные и эмоциональные затруднения; отдельно описывает психологические и психосоматические жалобы. Подходит для опроса работающих взрослых и анализа профиля жалоб на выгорание; баллы сами по себе не являются диагнозом.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'exhaustion', label: 'Истощение', items: [1, 2, 3, 4, 5, 6, 7, 8], reverseItems: [], aggregation: 'mean' },
    { key: 'mental_distance', label: 'Внутреннее дистанцирование', items: [9, 10, 11, 12, 13], reverseItems: [], aggregation: 'mean' },
    { key: 'cognitive_impairment', label: 'Когнитивные затруднения', items: [14, 15, 16, 17, 18], reverseItems: [], aggregation: 'mean' },
    { key: 'emotional_impairment', label: 'Эмоциональные затруднения', items: [19, 20, 21, 22, 23], reverseItems: [], aggregation: 'mean' },
    { key: 'core_symptoms', label: 'Основные симптомы (общий балл)', items: Array.from({ length: 23 }, (_, i) => i + 1), reverseItems: [], aggregation: 'mean' },
    { key: 'psychological_complaints', label: 'Психологические жалобы', items: [24, 25, 26, 27, 28], reverseItems: [], aggregation: 'mean' },
    { key: 'psychosomatic_complaints', label: 'Психосоматические жалобы', items: [29, 30, 31, 32, 33], reverseItems: [], aggregation: 'mean' },
    { key: 'secondary_symptoms', label: 'Вторичные симптомы (общий балл)', items: Array.from({ length: 10 }, (_, i) => i + 24), reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Вручную проверено: ответы 1 на все основные симптомы и 2 на все вторичные',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), index < 23 ? 1 : 2])),
    expected: {
      exhaustion: 1, mental_distance: 1, cognitive_impairment: 1, emotional_impairment: 1,
      core_symptoms: 1, psychological_complaints: 2, psychosomatic_complaints: 2, secondary_symptoms: 2,
    },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'bat-23-work-related-schaufeli-de-witte-desart-2019-ru-v1',
};
