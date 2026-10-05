import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'Совершенно не согласен' },
  { value: '1', label: 'Не согласен' },
  { value: '2', label: 'Скорее не согласен' },
  { value: '3', label: 'Затрудняюсь ответить' },
  { value: '4', label: 'Скорее согласен' },
  { value: '5', label: 'Согласен' },
  { value: '6', label: 'Совершенно согласен' },
];

const items = [
  'Организация ценит мой вклад в её процветание.',
  'Организация не в состоянии оценить любое дополнительное усилие с моей стороны.',
  'Организация игнорировала бы любую жалобу с моей стороны.',
  'Организация действительно заботится о моём благосостоянии.',
  'Даже если бы я сделал работу лучше, чем возможно, организация была бы не в состоянии заметить это.',
  'Организация заботится о том, чтобы я был доволен своей работой.',
  'Организация очень мало обо мне заботится.',
  'Организация гордится моими успехами в работе.',
];

const reverseItems = [2, 3, 5, 7];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_964_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_964',
  title: 'Опросник для определения уровня воспринимаемой организационной поддержки (SPOS)',
  description: 'Краткая русскоязычная версия SPOS измеряет обобщённое восприятие работником того, насколько организация ценит его вклад и заботится о его благополучии. Утверждения охватывают признание вклада и усилий, внимание к жалобам, благосостоянию и удовлетворённости работой. Подходит для работающих взрослых, оценивающих организацию, в которой они работают; версия из 8 пунктов в переводе и адаптации А. Ю. Смирновой.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 6,
  scales: [
    { key: 'total', label: 'Общий уровень воспринимаемой организационной поддержки', items: [1, 2, 3, 4, 5, 6, 7, 8], reverseItems, aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: нулевые ответы преобразуются по реверсивному ключу',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 0])),
    expected: { total: 24 },
  },
  {
    title: 'Ручная проверка: одинаковые нейтральные ответы дают 24 балла',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 3])),
    expected: { total: 24 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'spos-smirnova-2015-8item-0to6-reverse-2-3-5-7-v1',
};
