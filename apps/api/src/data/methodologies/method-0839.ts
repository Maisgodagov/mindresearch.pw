import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const yesNo = [
  { value: 'yes', label: 'Да' },
  { value: 'no', label: 'Нет' },
];

const items = [
  'S — тошнота: Вызываете ли Вы рвоту, когда чувствуете себя переевшим?',
  'C — контроль: Беспокоит ли Вас утрата контроля над тем, сколько Вы едите?',
  'O — более: Не было ли у Вас потери веса более 14 фунтов (6,35 кг) за последние три месяца?',
  'F — толстый: Не считаете ли Вы себя толстым, в то время как окружающие говорят, что Вы слишком худой?',
  'F — еда: Можете ли Вы сказать, что еда доминирует в Вашей жизни?',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_869_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: yesNo,
}));

export const instrument: SeedSection = {
  code: 'test_869',
  title: 'Опросник SCOFF — скрининг нарушений пищевого поведения',
  description: 'Краткий скрининг возможных признаков нервной анорексии и нервной булимии. Пять пунктов охватывают вызов рвоты после переедания, утрату контроля над количеством пищи, быструю потерю веса, неудовлетворённое восприятие собственного веса и доминирование еды в жизни. Версия предназначена для скринингового применения у взрослых; положительный результат указывает на необходимость дальнейшей профессиональной оценки и не является диагнозом.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 1,
  scales: [
    { key: 'total', label: 'Количество положительных ответов SCOFF', items: [1, 2, 3, 4, 5], reverseItems: [], aggregation: 'count-option', optionValue: 'yes' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: два положительных ответа дают два балла',
    answers: { '1': 'yes', '2': 'yes', '3': 'no', '4': 'no', '5': 'no' },
    expected: { total: 2 },
  },
  {
    title: 'Ручная проверка: все отрицательные ответы дают ноль баллов',
    answers: { '1': 'no', '2': 'no', '3': 'no', '4': 'no', '5': 'no' },
    expected: { total: 0 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'scoff-ru-leonov-2023-five-yes-count-v1',
};
