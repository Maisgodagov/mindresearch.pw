import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: 'true', label: 'Верно' },
  { value: 'false', label: 'Неверно' },
];

const statements = [
  'Мне трудно имитировать поведение других людей.',
  'Мое поведение обычно является выражением моих подлинных внутренних чувств, установок и убеждений.',
  'На вечеринках и в компаниях я не пытаюсь делать или говорить то, что понравится другим.',
  'Я могу отстаивать только те идеи, в которые действительно верю.',
  'Я могу произнести экспромтом речь даже на темы, о которых почти ничего не знаю.',
  'Думаю, я устраиваю представление, чтобы произвести впечатление на людей или развлечь их.',
  'Когда я не уверен, как вести себя в социальной ситуации, я ориентируюсь на поведение других.',
  'Вероятно, я мог бы стать хорошим актером.',
  'Мне редко нужен совет друзей, чтобы выбрать фильмы, книги или музыку.',
  'Иногда со стороны кажется, что я испытываю более глубокие эмоции, чем на самом деле.',
  'Я смеюсь больше, когда смотрю комедию вместе с другими, чем когда смотрю ее один.',
  'В группе людей я редко оказываюсь в центре внимания.',
  'В разных ситуациях и с разными людьми я часто веду себя совершенно по-разному.',
  'Я не особенно хорошо умею показывать другим то, что они хотят увидеть.',
  'Даже если я не испытываю удовольствия, я часто изображаю его.',
  'Я не всегда являюсь тем, кем кажусь.',
  'Я не изменю своего мнения (или поведения), чтобы понравиться кому-либо или добиться расположения.',
  'Я считаюсь человеком, способным развлекать других.',
  'Чтобы ладить с людьми и нравиться им, я стараюсь быть таким, каким они ожидают меня видеть.',
  'Я никогда не был хорош в играх вроде шарад или в актерской импровизации.',
  'Мне трудно менять свое поведение, чтобы оно соответствовало разным людям и ситуациям.',
  'На вечеринке я предоставляю другим возможность шутить и рассказывать истории.',
  'В компании я чувствую себя немного скованно и не могу показать себя с лучшей стороны.',
  'Я могу смотреть человеку прямо в глаза и лгать с честным лицом, если это нужно для дела.',
  'Я могу обманывать людей, демонстрируя дружеское отношение к ним, хотя на самом деле они мне не нравятся.',
];

const questions: SeedSection['questions'] = statements.map((text, index) => ({
  code: `test_2378_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2378',
  title: 'Шкала социального самоконтроля (самомониторинга) Снайдера, адаптация Рукавишникова и Соколовой',
  description: 'Шкала оценивает социальный самомониторинг: чувствительность к социальным сигналам, гибкость самопредъявления и способность регулировать выразительное поведение в общении. Пункты охватывают адаптацию поведения к людям и ситуациям, внимание к реакциям окружающих и управление производимым впечатлением. Русская адаптация Рукавишникова и Соколовой предназначена для подростков от 14 лет и взрослых; полезна авторам опросов, изучающим индивидуальные различия в социальном взаимодействии.',
  categoryIds: ['trait-presentation'],
  questions,
};

const keyedTrue = [5, 6, 7, 8, 10, 11, 13, 15, 16, 18, 19, 24, 25];
const keyedFalse = [1, 2, 3, 4, 9, 12, 14, 17, 20, 21, 22, 23];

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 1,
  scales: [{
    key: 'SMS',
    label: 'Социальный самомониторинг',
    items: Array.from({ length: 25 }, (_, index) => index + 1),
    reverseItems: keyedFalse,
    aggregation: 'sum',
  }],
};

const allTrue = Object.fromEntries(Array.from({ length: 25 }, (_, index) => [String(index + 1), 'true']));
const allFalse = Object.fromEntries(Array.from({ length: 25 }, (_, index) => [String(index + 1), 'false']));
const aligned = Object.fromEntries(Array.from({ length: 25 }, (_, index) => {
  const item = index + 1;
  return [String(item), keyedTrue.includes(item) ? 'true' : 'false'];
}));

export const validationCases: ValidationCase[] = [
  { title: 'Все ключевые ответы совпадают', answers: aligned, expected: { SMS: 25 } },
  { title: 'Все ответы противоположны ключу', answers: Object.fromEntries(Object.entries(aligned).map(([item, value]) => [item, value === 'true' ? 'false' : 'true'])), expected: { SMS: 0 } },
  { title: 'Все ответы «Верно»', answers: allTrue, expected: { SMS: keyedTrue.length } },
  { title: 'Все ответы «Неверно»', answers: allFalse, expected: { SMS: keyedFalse.length } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'snyder-self-monitoring-rukavishnikov-sokolova-1999-v1',
};
