import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const answerOptions = [
  { value: '1', label: 'Никогда' },
  { value: '2', label: 'Редко' },
  { value: '3', label: 'Часто' },
  { value: '4', label: 'Всегда' },
];

const items = [
  'Мне трудно сконцентрироваться на процессе.',
  'Мне сложно сконцентрироваться на цели своего выступления.',
  'Во время выступления я теряю концентрацию.',
  'Я не могу ясно мыслить во время соревнований.',
  'Мне сложно сфокусироваться на том, что говорит мне тренер.',
  'Мое тело напряжено.',
  'Я чувствую напряжение в области живота.',
  'Я ощущаю тремор в мышцах.',
  'Мои мышцы напряжены из-за волнения.',
  'Я переживаю, что плохо выступлю.',
  'Я переживаю, что могу подвести других.',
  'Я беспокоюсь, что неудачно выступлю.',
  'Я переживаю, что допущу ошибку.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2436_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: answerOptions,
}));

export const instrument: SeedSection = {
  code: 'test_2436',
  title: 'Шкала спортивной тревоги (SAS-2), русскоязычная версия',
  description: 'Опросник оценивает спортивную тревогу спортсменов в соревновательном контексте по трём аспектам: когнитивной тревоге, физиологическому напряжению и трудностям концентрации. Русскоязычная адаптация апробирована на спортсменах разных видов спорта и возрастов; полезна авторам опросов для описания профиля переживаний, которые могут сопровождать подготовку и выступление.',
  categoryIds: ['sport'],
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 4,
  scales: [
    { key: 'cognitive_anxiety', label: 'Когнитивная тревога', items: [10, 11, 12, 13], reverseItems: [], aggregation: 'sum' },
    { key: 'physiological_anxiety', label: 'Физиологическая тревога', items: [6, 7, 8, 9], reverseItems: [], aggregation: 'sum' },
    { key: 'concentration_difficulties', label: 'Трудности концентрации', items: [1, 2, 3, 4, 5], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: минимальные ответы дают минимальные суммы по подшкалам',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { cognitive_anxiety: 4, physiological_anxiety: 4, concentration_difficulties: 5 },
  },
  {
    title: 'Ручная проверка: ответы 1..13 по возрастанию',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), ((index + 1) % 4) + 1])),
    expected: { cognitive_anxiety: 10, physiological_anxiety: 10, concentration_difficulties: 11 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'sas-2-yakushina-ru-13item-sum-v1',
};
