import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const steps = [
  'Самые хорошие ребята',
  'Хорошие ребята',
  'Хорошие ребята',
  'Ни хорошие, ни плохие ребята',
  'Плохие ребята',
  'Плохие ребята',
  'Самые плохие ребята',
];

const options = steps.map((label, index) => ({ value: String(index + 1), label }));

const questions: SeedSection['questions'] = [{
  code: 'test_666_1',
  text: 'Если на лесенке расположить всех ребят: на первой ступеньке будут самые хорошие ребята, на второй и третьей — хорошие, на четвёртой — ни хорошие, ни плохие, на пятой и шестой — плохие, на седьмой — самые плохие. На какую ступеньку ты поставишь себя?',
  type: 'single',
  required: true,
  options,
}];

export const instrument: SeedSection = {
  code: 'test_666',
  title: 'Методика «Лесенка»',
  description: 'Методика изучает самооценку младших школьников через выбор ребёнком места среди условно ранжированных сверстников — от «самых хороших» до «самых плохих». Подходит для группового или индивидуального первичного изучения самооценки детей младшего школьного возраста; индивидуальная беседа помогает понять причины выбора.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'selfEsteem', label: 'Самооценка (ступенька)', items: [1], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная сверка: выбор четвёртой ступеньки соответствует опубликованной интерпретации',
    answers: { '1': 4 },
    expected: { selfEsteem: 4 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'shkuricheva-lesenka-2009-seven-step-v1',
};
