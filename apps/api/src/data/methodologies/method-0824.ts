import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const yesNo = [
  { value: '1', label: 'Да' },
  { value: '0', label: 'Нет' },
];

const items = [
  'Не может долго работать, не уставая.',
  'Ему трудно сосредоточиться на чём-то.',
  'Любое задание вызывает излишнее беспокойство.',
  'Во время выполнения заданий очень напряжён, скован.',
  'Смущается чаще других.',
  'Часто говорит о напряжённых ситуациях.',
  'Как правило, краснеет в незнакомой обстановке.',
  'Жалуется, что ему снятся страшные сны.',
  'Руки у него обычно холодные и влажные.',
  'У него нередко бывает расстройство стула.',
  'Сильно потеет, когда волнуется.',
  'Не обладает хорошим аппетитом.',
  'Спит беспокойно, засыпает с трудом.',
  'Пуглив, многое вызывает у него страх.',
  'Обычно беспокоен, легко расстраивается.',
  'Часто не может сдержать слёзы.',
  'Плохо переносит ожидание.',
  'Не любит браться за новое дело.',
  'Не уверен в себе, в своих силах.',
  'Боится сталкиваться с трудностями.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_854_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: yesNo,
}));

export const instrument: SeedSection = {
  code: 'test_854',
  title: 'Определение уровня тревожности у ребёнка',
  description: 'Опросник оценивает наблюдаемые признаки тревожности у детей дошкольного и младшего школьного возраста по сведениям родителей, воспитателей или учителей. Он охватывает эмоциональные проявления, напряжение и беспокойство, особенности сна и телесные реакции; сопоставление ответов нескольких взрослых помогает автору опроса получить взгляд на поведение ребёнка в разных условиях.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 1,
  scales: [
    { key: 'anxiety', label: 'Сумма положительных признаков тревожности', items: items.map((_, index) => index + 1), reverseItems: [], aggregation: 'sum' },
  ],
};

const allAnswers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Все признаки отсутствуют', answers: allAnswers(0), expected: { anxiety: 0 } },
  { title: 'Отмечены все признаки', answers: allAnswers(1), expected: { anxiety: 20 } },
  { title: 'Первые шесть признаков отмечены', answers: Object.fromEntries(items.map((_, index) => [String(index + 1), index < 6 ? 1 : 0])), expected: { anxiety: 6 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'lavrentyeva-titarenko-child-anxiety-1992-v1',
};
