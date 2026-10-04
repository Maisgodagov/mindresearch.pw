import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const answerOptions = [
  { value: '1', label: 'совершенно не согласен' },
  { value: '2', label: 'не согласен' },
  { value: '3', label: 'скорее не согласен' },
  { value: '4', label: 'не знаю, нечто среднее' },
  { value: '5', label: 'скорее согласен' },
  { value: '6', label: 'согласен' },
  { value: '7', label: 'полностью согласен' },
];

const itemTexts = [
  'Из меня никудышный инвестор',
  'Инвестиции — это сложно',
  'Я боюсь инвестировать',
  'Чтобы начать инвестировать, требуется крупная сумма денег',
  'У меня нет средств, которые я могу инвестировать',
  'Невозможно знать заранее, какое вложение будет прибыльным',
  'Сейчас не лучшее время для того, чтобы вкладывать свои средства куда-либо',
  'Высокие доходы от инвестиций получают только мошенники',
  'Инвестиции — хороший способ получения постоянного дохода',
  'Я считаю разумным принимать на себя риск для получения прибыли',
  'Инвестировать нужно всю жизнь',
  'Инвестировать деньги разумнее, чем хранить их «под подушкой»',
  'Тема инвестиций мне интересна',
  'Лучше потратить деньги сейчас, чем пытаться их приумножить',
];

const questions: SeedSection['questions'] = itemTexts.map((text, index) => ({
  code: `test_350_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: answerOptions,
}));

export const instrument: SeedSection = {
  code: 'test_350',
  title: 'Инвестиционные аттитюды',
  description: 'Методика оценивает психологические установки, связанные с инвестиционным поведением: тревожность и неуверенность при инвестировании, пессимистичную оценку финансовых возможностей и инвестиционной ситуации, а также интерес, положительное отношение и готовность к риску. Разработана для изучения российских граждан и индивидуальных инвесторов; исходная публикация предупреждает, что применимость к разным группам населения требует дальнейшей проверки.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'investment_anxiety', label: 'Инвестиционная тревожность', items: [1, 2, 3], reverseItems: [], aggregation: 'sum' },
    { key: 'investment_pessimism', label: 'Инвестиционный пессимизм', items: [4, 5, 6, 7, 8], reverseItems: [], aggregation: 'sum' },
    { key: 'investment_propensity', label: 'Склонность к инвестированию', items: [9, 10, 11, 12, 13, 14], reverseItems: [14], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы минимальные: обратный пункт преобразуется в максимум',
    answers: Object.fromEntries(itemTexts.map((_, index) => [String(index + 1), 1])),
    expected: { investment_anxiety: 3, investment_pessimism: 5, investment_propensity: 12 },
  },
  {
    title: 'Все ответы максимальные: обратный пункт преобразуется в минимум',
    answers: Object.fromEntries(itemTexts.map((_, index) => [String(index + 1), 7])),
    expected: { investment_anxiety: 21, investment_pessimism: 35, investment_propensity: 36 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'boyarkin-deyneka-investment-attitudes-2023-14item-seven-point-sum-reverse-14-v1',
};
