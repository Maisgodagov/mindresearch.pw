import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const statements = [
  'Я забываю о работе.',
  'Я совсем не думаю о своей работе.',
  'Я дистанцируюсь от своей работы.',
  'Я отдыхаю от требований своей работы.',
  'Я отдыхаю и расслабляюсь.',
  'Я занимаюсь расслабляющими вещами.',
  'Я использую свободное время для расслабления.',
  'Я уделяю время досугу.',
  'Я учусь чему-нибудь новому',
  'Я стремлюсь к интеллектуальным вызовам.',
  'Я занимаюсь вещами, которые ставят передо мной новые вызовы.',
  'Я занимаюсь вещами, которые помогают мне расширить кругозор.',
  'Я чувствую, что сам могу решать, чем заняться',
  'Я сам регулирую своё расписание.',
  'Я сам решаю, как потратить своё время.',
  'Я занимаюсь делами так, как хочу.',
];

const responseOptions = [
  { value: '1', label: 'Полностью не согласен' },
  { value: '2', label: 'Скорее не согласен' },
  { value: '3', label: 'И согласен, и не согласен' },
  { value: '4', label: 'Скорее согласен' },
  { value: '5', label: 'Полностью согласен' },
];

const questions: SeedSection['questions'] = statements.map((text, index) => ({
  code: `test_1096_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: responseOptions,
}));

export const instrument: SeedSection = {
  code: 'test_1096',
  title: 'Опросник опыта восстановления (REQ-R)',
  description: 'Русскоязычная адаптация для работающих взрослых оценивает опыт восстановления после работы в нерабочее время по четырём аспектам: психологическая отстранённость от рабочих задач, расслабление, освоение новых навыков и контроль над свободным временем. Профиль подшкал помогает автору опроса изучить, какие именно переживания восстановления связаны с рабочей нагрузкой и благополучием.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'detachment', label: 'Психологическая отстранённость', items: [1, 2, 3, 4], reverseItems: [], aggregation: 'sum' },
    { key: 'relaxation', label: 'Расслабление', items: [5, 6, 7, 8], reverseItems: [], aggregation: 'sum' },
    { key: 'mastery', label: 'Мастерство', items: [9, 10, 11, 12], reverseItems: [], aggregation: 'sum' },
    { key: 'control', label: 'Контроль', items: [13, 14, 15, 16], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Проверенный по ключу профиль: минимальные ответы дают нижнюю границу каждой подшкалы',
    answers: Object.fromEntries(statements.map((_, index) => [String(index + 1), 1])),
    expected: { detachment: 4, relaxation: 4, mastery: 4, control: 4 },
  },
  {
    title: 'Верхняя граница: согласие по всем пунктам даёт 20 баллов на каждой подшкале',
    answers: Object.fromEntries(statements.map((_, index) => [String(index + 1), 5])),
    expected: { detachment: 20, relaxation: 20, mastery: 20, control: 20 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'req-r-shumeiko-rodionova-2025-subscale-sums-v1',
};
