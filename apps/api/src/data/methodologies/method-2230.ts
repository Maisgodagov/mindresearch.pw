import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Совсем нет' },
  { value: '2', label: 'Редко' },
  { value: '3', label: 'Иногда' },
  { value: '4', label: 'Часто' },
  { value: '5', label: 'Очень часто' },
];

const items = [
  'Я считаю, что моя компания говорит одно, а делает другое',
  'Стратегия, задачи и действия моей организации имеют мало общего между собой',
  'Когда моя компания заявляет, что хочет что-то предпринять, я удивлюсь, если это произойдет на самом деле',
  'Моя организация ожидает от своих сотрудников одного, а вознаграждает за другое',
  'Я вижу мало общего между тем, что моя организация обещает сделать и что делает на самом деле',
  'Как часто вы испытываете раздражение, когда думаете о своей компании?',
  'Как часто вы испытываете напряжение, думая о своей компании?',
  'Как часто вы испытываете беспокойство, думая о своей компании?',
  'Я жалуюсь на то, что происходит в моей организации, друзьям, которые в ней не работают',
  'Бывает, я обмениваюсь со своими коллегами понимающими взглядами',
  'Я часто обсуждаю с другими, как обстоят дела в моей компании',
  'Я критикую действия и стратегию своей компании при других людях',
  'Порой я ловлю себя на том, что высмеиваю лозунг и инициативы моей компании',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2249_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

const instrument: SeedSection = {
  code: 'test_2249',
  title: 'Шкала организационного цинизма (русскоязычная адаптация)',
  description: 'Русскоязычная адаптация оценивает негативное отношение работающего человека к своей организации по когнитивному (восприятие ее честности и последовательности), эмоциональному (раздражение, напряжение и беспокойство) и поведенческому (критика и обсуждение организации) аспектам. Подходит для исследований работников разных профессий и анализа организационной среды; валидизация проведена на русскоязычной выборке взрослых работников.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'cognitive', label: 'Когнитивный аспект', items: [1, 2, 3, 4, 5], reverseItems: [], aggregation: 'sum' },
    { key: 'emotional', label: 'Эмоциональный аспект', items: [6, 7, 8], reverseItems: [], aggregation: 'sum' },
    { key: 'behavioral', label: 'Поведенческий аспект', items: [9, 10, 11, 12, 13], reverseItems: [], aggregation: 'sum' },
    { key: 'total', label: 'Общий показатель организационного цинизма', items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  { title: 'Ручная проверка: все ответы минимальные', answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])), expected: { cognitive: 5, emotional: 3, behavioral: 5, total: 13 } },
  { title: 'Ручная проверка: максимум по шкалам', answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 5])), expected: { cognitive: 25, emotional: 15, behavioral: 25, total: 65 } },
  { title: 'Ручная проверка смешанных ответов', answers: Object.fromEntries([1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 1, 2, 3].map((answer, index) => [String(index + 1), answer])), expected: { cognitive: 15, emotional: 6, behavioral: 15, total: 36 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['work'],
  scoringConfig,
  validationCases,
  formulaVersion: 'ocs-pavlova-dzyubenko-nartova-bochaver-2022-v1',
};
