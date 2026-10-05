import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Полностью не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Скорее не согласен' },
  { value: '4', label: 'Нечто среднее' },
  { value: '5', label: 'Скорее согласен' },
  { value: '6', label: 'Согласен' },
  { value: '7', label: 'Полностью согласен' },
];

const items = [
  'Я интересуюсь искусством.',
  'В свободное время я занимаюсь вещами, связанными с искусством.',
  'Я часто посещаю художественные выставки.',
  'Мне нравились уроки ИЗО в школе.',
  'В свободное время / по учебе я посещаю события, тематикой которых являются искусство / история искусств.',
  'Я всегда в поиске новых средств художественной выразительности и опыта.',
  'Мне нравится вести беседы об искусстве.',
  'Мне нравится читать статьи, написанные художниками либо в целом посвященные искусству.',
  'Художественные объекты, встречающиеся в повседневной жизни, привлекают мое внимание и вызывают восхищение.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_993_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_993',
  title: 'Опросник интереса к искусству (Questionnaire on Art Interest)',
  description: 'Опросник оценивает общий интерес и вовлеченность в искусство: личный интерес, участие в художественной деятельности и событиях, посещение выставок, интерес к обсуждению и чтению об искусстве, а также внимание к художественным объектам. Русская адаптация 2024 года предназначена для оценки индивидуальных различий у взрослых участников исследований; показатель может использоваться как характеристика интереса к искусству в исследованиях эстетического опыта.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'artInterest', label: 'Интерес к искусству', items: [1, 2, 3, 4, 5, 6, 7, 8, 9], reverseItems: [], aggregation: 'mean' },
  ],
};

const allAnswers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Все ответы на минимальном уровне согласия', answers: allAnswers(1), expected: { artInterest: 1 } },
  { title: 'Все ответы на максимальном уровне согласия', answers: allAnswers(7), expected: { artInterest: 7 } },
  { title: 'Ручная проверка среднего (ответы 1–9)', answers: { '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 1, '9': 7 }, expected: { artInterest: 4 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'questionnaire-on-art-interest-leder-2006-shestova-2024-mean-v1',
};
