import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const responseOptions = [
  { value: '1', label: 'Есть и всегда было' },
  { value: '2', label: 'Есть уже длительное время' },
  { value: '3', label: 'Появилось в последнее время' },
  { value: '4', label: 'Было в прошлом, но сейчас нет' },
  { value: '5', label: 'Нет и не было' },
];

const itemTexts = [
  'Бывают ли у вас такие состояния? Боли в животе или его расстройство, отрыжка, изжога.',
  'Боли, тяжесть, дискомфортные ощущения в области сердца.',
  'Боли, одышка или дискомфортные ощущения связанные с дыханием, кашель.',
  'Боли, дискомфортные ощущения в области почек, или связанные с мочеиспусканием.',
  'Насморк, простуды, боли в горле.',
  'Головокружения, шаткость походки, потеря сознания или обмороки.',
  'Судорожные припадки при высокой температуре тела, после физической нагрузки, нервном перенапряжении, при чувстве голода или в других ситуациях.',
  'Синяки, легко возникающие кровотечения.',
  'Онемение рук и ног.',
  'Боли, дискомфортные ощущения в мышцах, суставах, позвоночнике или связанные с движением.',
  'Отеки на ногах, лице.',
  'Высыпания на коже, изменения ее цвета, уплотнения на коже или под ней, кожные или подкожные опухоли.',
  'Головные боли.',
  'Аллергические реакции – крапивница, зуд, волдыри.',
  'Чувство общего недомогания.',
  'Чувство резкой слабости и голода.',
  'Зубная боль, воспаление десен.',
];

const questions: SeedSection['questions'] = itemTexts.map((text, index) => ({
  code: `test_2298_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: responseOptions,
}));

export const instrument: SeedSection = {
  code: 'test_2298',
  title: 'Шкала оценки соматической адаптации',
  description: 'Опросник И. Н. Гурвича оценивает снижение субъективно воспринимаемого соматического здоровья по наличию и истории 17 групп телесных жалоб и состояний: от пищеварительных, сердечно-дыхательных и неврологических до кожных, аллергических и общих проявлений. Подходит для исследовательского описания соматического неблагополучия у взрослых; интерпретация результатов предназначена специалисту и не заменяет медицинскую диагностику.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'somatic_adaptation', label: 'Снижение соматического здоровья (сумма ответов)', items: Array.from({ length: 17 }, (_, index) => index + 1), reverseItems: [], aggregation: 'sum' },
  ],
};

const allAnswers = (value: number) => Object.fromEntries(itemTexts.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Все ответы «есть и всегда было»', answers: allAnswers(1), expected: { somatic_adaptation: 17 } },
  { title: 'Все ответы «нет и не было»', answers: allAnswers(5), expected: { somatic_adaptation: 85 } },
];

export const methodology: MethodologyRegistration = {
  instrument: { ...instrument, categoryIds: ['clinical-somatic'] },
  categoryIds: ['clinical-somatic'],
  scoringConfig,
  validationCases,
  formulaVersion: 'gurvich-somatic-adaptation-ru-v1',
};
