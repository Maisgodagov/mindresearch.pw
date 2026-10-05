import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const items = [
  'Тяжелые мысли или воспоминания о событии приходили мне в голову против моей воли',
  'Мне снились тяжелые сны о том, что со мной случилось',
  'Я вдруг замечал(а), что действую и чувствую себя так, как будто бы ситуация повторяется снова',
  'Когда что-то напоминает мне об этом событии, я чувствую себя подавленным',
  'Когда что-то напоминало мне о случившемся, я испытывал(а) неприятные физические ощущения (потливость, сбой дыхания, тошноту, учащение пульса и др.)',
  'У меня нарушен сон (трудности засыпания или частые пробуждения)',
  'Я чувствовал(а) постоянное раздражение и гнев',
  'Мне было сложно сосредоточиться',
  'Я стал более осведомлён о потенциальных опасностях для себя и других',
  'Я все время был(а) напряжен(а) и вздрагивал(а), если что-то внезапно пугало меня',
];

const yesNo = [
  { value: '1', label: 'Да' },
  { value: '0', label: 'Нет' },
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1073_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: yesNo,
}));

export const instrument: SeedSection = {
  code: 'test_1073',
  title: 'Опросник на скрининг ПТСР (TSQ)',
  description: 'Краткий скрининг посттравматических симптомов у людей, переживших травматическое событие. Охватывает повторное переживание события и симптомы повышенного физиологического возбуждения; помогает автору опроса выявлять случаи, которым может потребоваться более полная клиническая оценка, но не предназначен для постановки диагноза.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 1,
  scales: [
    { key: 'total', label: 'Число отмеченных симптомов TSQ', items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], reverseItems: [], aggregation: 'sum' },
  ],
};

const answers = (selected: number[]) => Object.fromEntries(items.map((_, index) => [String(index + 1), selected.includes(index + 1) ? 1 : 0]));
const validationCases: ValidationCase[] = [
  { title: 'Пять отмеченных симптомов', answers: answers([1, 2, 3, 4, 5]), expected: { total: 5 } },
  { title: 'Шесть отмеченных симптомов — порог положительного скрининга', answers: answers([1, 2, 3, 4, 5, 6]), expected: { total: 6 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'tsq-brewin-2002-ru-v1',
};
