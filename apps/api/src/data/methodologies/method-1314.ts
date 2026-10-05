import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Категорически не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Скорее не согласен' },
  { value: '4', label: 'Затрудняюсь ответить' },
  { value: '5', label: 'Скорее согласен' },
  { value: '6', label: 'Согласен' },
  { value: '7', label: 'Полностью согласен' },
];

const items = [
  'Чтобы поднять себе настроение, я изменяю свое отношение к ситуации',
  'Для управления своими эмоциями я сдерживаю их внешние проявления',
  'Когда я сталкиваюсь со стрессовой ситуацией, я стараюсь думать о ней таким образом, чтобы сохранять спокойствие',
  'Для управления своими эмоциями я изменяю отношение к ситуации, в которой нахожусь',
  'Чтобы поднять себе настроение (испытать радость или удовольствие), я начинаю думать о чем-нибудь другом',
  'Когда я испытываю положительные эмоции, я слежу за тем, чтобы их не показывать',
  'Чтобы справиться с отрицательными эмоциями, я изменяю свое отношение к ситуации',
  'Я держу свои эмоции при себе',
  'Когда я испытываю отрицательные эмоции, я делаю все, чтобы их не показывать',
  'Чтобы справиться с отрицательными эмоциями (такими как грусть или злость), я начинаю думать о чем-нибудь другом',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1342_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1342',
  title: 'Опросник эмоциональной регуляции ERQ',
  description: 'Русскоязычная версия ERQ для взрослых оценивает привычное использование двух стратегий регуляции эмоций: когнитивной переоценки ситуации и подавления внешнего выражения эмоций. Раздельные показатели помогают описать, как респондент меняет интерпретацию ситуации и насколько сдерживает выражение уже возникших эмоций.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'reappraisal', label: 'Когнитивная переоценка', items: [1, 3, 4, 5, 7, 10], reverseItems: [], aggregation: 'mean' },
    { key: 'suppression', label: 'Подавление экспрессии', items: [2, 6, 8, 9], reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы 1 — нижняя граница обеих шкал',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { reappraisal: 1, suppression: 1 },
  },
  {
    title: 'Проверка ключа по пунктам: переоценка 7, подавление 2',
    answers: { '1': 7, '2': 2, '3': 7, '4': 7, '5': 7, '6': 2, '7': 7, '8': 2, '9': 2, '10': 7 },
    expected: { reappraisal: 7, suppression: 2 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'erq-ru-pankratova-kornienko-2017-v1',
};
