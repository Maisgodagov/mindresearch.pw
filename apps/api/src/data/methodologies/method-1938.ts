import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Совершенно не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Скорее не согласен' },
  { value: '4', label: 'Не могу определиться' },
  { value: '5', label: 'Скорее согласен' },
  { value: '6', label: 'Согласен' },
  { value: '7', label: 'Полностью согласен' },
];

const items = [
  'Я чувствую себя беспомощным среди людей.',
  'Я использую людей в своих интересах прежде, чем они используют меня.',
  'Я склонен бросить все свои дела, если другие нуждаются в помощи.',
  'Я чувствую дискомфорт, если приходится просить о чем-то для себя.',
  'Я накажу человека, если он скажет в мой адрес что-то оскорбительное.',
  'Я чувствую вину, если у меня нет времени на помощь другим.',
  'Другие люди некомпетентны и слабы.',
  'Я слишком великодушный и щедрый.',
  'У меня такое ощущение, что я ничего не могу сделать как положено.',
  'Мне нравится спасать людей и исправлять положение.',
  'Я ставлю нужды других прежде своих собственных.',
  'Я нуждаюсь в посторонней помощи, чтобы решить свои проблемы.',
  'Я являюсь хозяином положения, когда взаимодействую с другими.',
  'Люди склонны оставлять, отвергать или бросать меня.',
  'Радовать других важнее, чем радовать себя.',
  'Я извиняюсь, даже когда моей неправоты нет.',
  'Я изо всех сил стараюсь сделать окружающих счастливыми.',
  'Доминировать над людьми очень просто.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1954_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1954',
  title: 'Драматический треугольник Карпмана (Drama Triangle Scale, DTS)',
  description: 'Шкала оценивает выраженность трех межличностных ролей в повторяющихся напряженных взаимодействиях: Жертвы (беспомощность и потребность в поддержке), Спасателя (чрезмерная помощь и приоритет чужих нужд) и Преследователя (доминирование и использование других). Профиль помогает автору опроса исследовать привычные сценарии общения взрослых людей; это исследовательский самоотчетный инструмент, а не диагностическое заключение.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'victim', label: 'Жертва', items: [1, 4, 9, 12, 14, 16], reverseItems: [], aggregation: 'mean' },
    { key: 'rescuer', label: 'Спасатель', items: [3, 6, 8, 10, 11, 15, 17], reverseItems: [], aggregation: 'mean' },
    { key: 'persecutor', label: 'Преследователь', items: [2, 5, 7, 13, 18], reverseItems: [], aggregation: 'mean' },
  ],
};

const allAnswers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), String(value)]));
const validationCases: ValidationCase[] = [
  { title: 'Все пункты оценены минимальным значением', answers: allAnswers(1), expected: { victim: 1, rescuer: 1, persecutor: 1 } },
  { title: 'Все пункты оценены максимальным значением', answers: allAnswers(7), expected: { victim: 7, rescuer: 7, persecutor: 7 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'lac-donaldson-drama-triangle-scale-18-item-2020-v1',
};
