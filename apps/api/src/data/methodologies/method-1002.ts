import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const yesNo = [
  { value: '1', label: 'Да' },
  { value: '0', label: 'Нет' },
];

const items = [
  'Я думаю, что я аккуратен.',
  'Я любил(а) знать, что делается в других классах школы.',
  'Я любил(а) посещать новые места вместе с родителями, а не один.',
  'Я люблю быть лучшим(ей) в чем-либо.',
  'Если я имел(а) сладости, то стремился(ась) их все сохранить у себя.',
  'Я очень волнуюсь, если работа, которую я делаю, не лучшая, не может быть мною сделана наилучшим образом.',
  'Я хочу понять, как все происходит вокруг, найти причину.',
  'В детстве я не был(а) особенно популярен(на) среди детей.',
  'Я иногда поступаю по-детски.',
  'Когда я что-либо хочу сделать, то ничего не может меня остановить.',
  'Я предпочитаю работать с другими и не могу работать один.',
  'Я знаю, когда я могу сделать что-либо по-настоящему хорошее.',
  'Если даже я уверен(на), что прав(а), я стараюсь менять свою точку зрения, если со мной не соглашаются другие.',
  'Я очень беспокоюсь и переживаю, когда делаю ошибки.',
  'Я часто скучаю.',
  'Я буду значимым и известным, когда вырасту.',
  'Я люблю смотреть на красивые вещи.',
  'Я предпочитаю знакомые игры, чем новые.',
  'Я люблю исследовать, что произойдет, если я что-либо сделаю.',
  'Когда я играю, то стараюсь как можно меньше рисковать.',
  'Я предпочитаю смотреть телевизор, чем его делать.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1032_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: yesNo,
}));

export const instrument: SeedSection = {
  code: 'test_1032',
  title: 'Опросник личностной склонности к творчеству по Г. Дэвису',
  description: 'Школьная версия оценивает личностную склонность к творческому поведению у подростков 12–17 лет. Пункты охватывают любознательность и исследовательский интерес, самостоятельность и настойчивость, отношение к новизне и риску, воображение, эстетическую восприимчивость и социальные особенности. Результат может помочь автору опроса описать выраженность этих склонностей; он не является диагнозом.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 1,
  scales: [
    {
      key: 'creativity_tendency',
      label: 'Личностная склонность к творчеству',
      items: Array.from({ length: 21 }, (_, index) => index + 1),
      reverseItems: [1, 3, 5, 11, 13, 14, 15, 18, 20, 21],
      aggregation: 'sum',
    },
  ],
};

const allAnswers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Все ответы «Нет»', answers: allAnswers(0), expected: { creativity_tendency: 10 } },
  { title: 'Все ответы «Да»', answers: allAnswers(1), expected: { creativity_tendency: 11 } },
  {
    title: 'Ручная проверка: ключевые ответы дают балл, остальные — нет',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), [2, 4, 6, 7, 8, 9, 10, 12, 16, 17, 19].includes(index + 1) ? 1 : 0])),
    expected: { creativity_tendency: 21 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'davis-pashnev-school-12-17-2010-v1',
};
