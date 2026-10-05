import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: 'a', label: 'Согласен с этим' },
  { value: 'b', label: 'Не согласен' },
  { value: 'в', label: 'Затрудняюсь ответить' },
];

const itemOptions: SeedSection['questions'][number]['options'][] = [
  options,
  [
    { value: 'a', label: 'По совести' },
    { value: 'b', label: 'Строго в соответствии с трудовым правом и должностями' },
    options[2]!,
  ],
  options,
  [
    { value: 'a', label: 'Улучшалась жизнь большинства населения' },
    { value: 'b', label: 'Защищать права каждого человека' },
    options[2]!,
  ],
  [
    { value: 'a', label: 'Правительство обязано обеспечить всем нормальный уровень жизни' },
    { value: 'b', label: 'Каждый должен сам о себе думать' },
    options[2]!,
  ],
  [
    { value: 'a', label: 'Морально безупречные, справедливые люди' },
    { value: 'b', label: 'Профессионалы своего дела' },
    options[2]!,
  ],
  options,
  [
    { value: 'a', label: 'Сильная государственная власть' },
    { value: 'b', label: 'Общественное самоуправление' },
    options[2]!,
  ],
  options,
  [
    { value: 'a', label: 'Уметь отстаивать свои права' },
    { value: 'b', label: 'Выполнять свои обязанности' },
    options[2]!,
  ],
  options,
  [
    { value: 'a', label: 'Понятиями чести и справедливости' },
    { value: 'b', label: 'Правовыми нормами' },
    options[2]!,
  ],
  [
    { value: 'a', label: 'Регулирующая' },
    { value: 'b', label: 'Карательная' },
    options[2]!,
  ],
];

const items = [
  'Несправедливому закону следует подчиняться…',
  'Важно, чтобы руководитель поступал…',
  'Сколько людей, столько и представлений о том, что справедливо, а что – несправедливо…',
  'Законы создаются, чтобы…',
  'Я считаю, что…',
  'Во главе государства должны стоять…',
  'Рядовой гражданин не обязан знать существенные законы, для этого есть юристы…',
  'Мой идеал общества…',
  'В основе законов должны лежать ценностно-нормативные установки доминирующей нации…',
  'В нашем государстве каждому необходимо, в первую очередь…',
  'Если человек, не зная, случайно нарушил закон, его нельзя привлекать к ответственности…',
  'В стране будет беспорядок, если граждане будут руководствоваться, в первую очередь…',
  'Основная функция законов…',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1841_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: itemOptions[index],
}));

export const instrument: SeedSection = {
  code: 'test_1841',
  title: 'Тест правового и гражданского сознания (ТПГС)',
  description: 'Методика Л. А. Ясюковой для старшеклассников и подростков оценивает общий уровень правового сознания, готовность учитывать правовые нормы в бытовых, профессионально-деловых и социально-гражданских ситуациях, а также правовые знания. Профиль по сферам помогает автору опроса увидеть, в каких контекстах правовые установки сформированы неодинаково.',
  questions,
};

const answerKey = ['b', 'b', 'a', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'b', 'a'];
const range = (first: number, last: number) => Array.from({ length: last - first + 1 }, (_, index) => first + index);
const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 2,
  scales: [
    { key: 'overall', label: 'Общий уровень правового сознания', items: range(1, 13), reverseItems: [], aggregation: 'sum', itemScores: Object.fromEntries(answerKey.map((key, index) => [index + 1, { [key]: 2, в: 1, [key === 'a' ? 'b' : 'a']: 0 }])) },
    { key: 'everyday', label: 'Бытовая сфера', items: [1, 3, 7, 11], reverseItems: [], aggregation: 'sum', itemScores: Object.fromEntries([1, 3, 7, 11].map(item => [item, { [answerKey[item - 1]!]: 2, в: 1, [answerKey[item - 1] === 'a' ? 'b' : 'a']: 0 }])) },
    { key: 'business', label: 'Профессионально-деловая сфера', items: [2, 6, 9, 12], reverseItems: [], aggregation: 'sum', itemScores: Object.fromEntries([2, 6, 9, 12].map(item => [item, { [answerKey[item - 1]!]: 2, в: 1, [answerKey[item - 1] === 'a' ? 'b' : 'a']: 0 }])) },
    { key: 'civic', label: 'Социально-гражданская сфера', items: [4, 5, 8, 10], reverseItems: [], aggregation: 'sum', itemScores: Object.fromEntries([4, 5, 8, 10].map(item => [item, { [answerKey[item - 1]!]: 2, в: 1, [answerKey[item - 1] === 'a' ? 'b' : 'a']: 0 }])) },
    { key: 'legalKnowledge', label: 'Правовые знания', items: [4, 11, 12, 13], reverseItems: [], aggregation: 'sum', itemScores: Object.fromEntries([4, 11, 12, 13].map(item => [item, { [answerKey[item - 1]!]: 2, в: 1, [answerKey[item - 1] === 'a' ? 'b' : 'a']: 0 }])) },
  ],
};

const answersFor = (answer: string) => Object.fromEntries(items.map((_, index) => [String(index + 1), answer]));
const validationCases: ValidationCase[] = [
  { title: 'Все ответы совпадают с ключом', answers: Object.fromEntries(answerKey.map((answer, index) => [String(index + 1), answer])), expected: { overall: 26, everyday: 8, business: 8, civic: 8, legalKnowledge: 8 } },
  { title: 'Все ответы затруднительные', answers: answersFor('в'), expected: { overall: 13, everyday: 4, business: 4, civic: 4, legalKnowledge: 4 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'yasyukova-tpgs-2005-v1',
};
