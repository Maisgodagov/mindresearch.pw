import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Почти никогда' },
  { value: '2', label: 'Иногда' },
  { value: '3', label: 'Часто' },
];

const items = [
  'Соревноваться с другими интересно.',
  'Перед соревнованиями я чувствую себя неспокойно.',
  'Перед соревнованиями я боюсь, что не смогу выступить хорошо.',
  'На соревнованиях я веду себя как настоящий спортсмен.',
  'Соревнуясь, я беспокоюсь, что могу допустить ошибки.',
  'Перед началом соревнований я бываю спокоен.',
  'В соревнованиях важно поставить цель.',
  'Перед началом соревнований у меня в животе возникает странное или неприятное ощущение.',
  'Я замечаю, что перед самым началом соревнований сердце у меня начинает биться чаще, чем обычно.',
  'Мне нравятся игры, требующие большого физического напряжения.',
  'Перед соревнованием я чувствую себя свободно.',
  'Перед началом соревнований я нервничаю.',
  'Командные виды спорта интереснее индивидуальных.',
  'Я начинаю нервничать из-за желания скорее начать соревноваться.',
  'Перед началом соревнований я бываю весь напряжен.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2421_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2421',
  title: 'Шкала соревновательной личностной тревожности (СЛТ, SCAT)',
  description: 'Шкала оценивает устойчивую склонность спортсмена испытывать тревогу в предсоревновательных и соревновательных ситуациях: беспокойство о выступлении и ошибках, нервное напряжение и телесные проявления тревоги. Пять буферных высказываний о предпочтениях и отношении к соревнованиям не входят в итоговый балл. Методика подходит для спортсменов от 10 лет и взрослых и может помогать исследовательскому или спортивно-психологическому опросу описывать индивидуальные различия в реакции на соревновательный стресс.',
  categoryIds: ['sport'],
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 3,
  scales: [
    { key: 'total', label: 'Соревновательная личностная тревожность', items: [2, 3, 5, 6, 8, 9, 11, 12, 14, 15], reverseItems: [6, 11], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы по ключу дают минимальный балл: буферные игнорируются, обратные пункты реверсируются',
    answers: Object.fromEntries(Array.from({ length: 15 }, (_, index) => [String(index + 1), [6, 11].includes(index + 1) ? 3 : 1])),
    expected: { total: 10 },
  },
  {
    title: 'Все ответы по ключу дают максимальный балл: буферные игнорируются, обратные пункты реверсируются',
    answers: Object.fromEntries(Array.from({ length: 15 }, (_, index) => [String(index + 1), [6, 11].includes(index + 1) ? 1 : 3])),
    expected: { total: 30 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['sport'],
  scoringConfig,
  validationCases,
  formulaVersion: 'martens-scat-hanin-ru-1982-v1',
};
