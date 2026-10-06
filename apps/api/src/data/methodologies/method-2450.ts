import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'Совершенно нет' },
  { value: '1', label: 'Слегка' },
  { value: '2', label: 'Умеренно' },
  { value: '3', label: 'В большой степени' },
  { value: '4', label: 'Абсолютно точно' },
];

const items = [
  'Я начинаю нервничать, если мне приходится говорить с кем-то, имеющим власть (учителем, начальником и т. п.).',
  'Мне трудно устанавливать зрительный контакт.',
  'Я становлюсь напряженным, если мне приходится рассказывать о себе или своих чувствах.',
  'Мне трудно свободно общаться с коллегами на работе.',
  'Я с легкостью завожу дружеские отношения с людьми своего возраста.',
  'Я напрягаюсь, если встречаю знакомых на улице.',
  'Мне некомфортно общаться в социальных ситуациях.',
  'Я чувствую себя напряженно, когда нахожусь один на один с человеком.',
  'Я легко знакомлюсь с людьми на вечеринках и в других местах.',
  'Мне трудно разговаривать с другими людьми.',
  'Я легко нахожу темы для разговоров.',
  'Я беспокоюсь о том, как себя вести, если окажусь в неловкой ситуации.',
  'Мне сложно выражать несогласие с чужим мнением.',
  'Мне сложно разговаривать с привлекательными женщинами.',
  'Я переживаю, что не буду знать, что сказать, если со мной заведут разговор.',
  'Я нервничаю, общаясь с людьми, которых плохо знаю.',
  'В разговоре я чувствую, что могу сказать что-то неловкое, за что будет стыдно.',
  'Находясь в компании, я переживаю, что меня будут игнорировать.',
  'Я напряжен, когда общаюсь в компании.',
  'Я не уверен, стоит ли здороваться с кем-то, кого я едва знаю.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2468_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2468',
  title: 'Шкала тревоги при социальном взаимодействии (SIAS)',
  description: 'SIAS оценивает тревогу и дискомфорт в обычных межличностных контактах — разговорах, зрительном контакте, общении один на один и в группах. Пункты охватывают напряжение при знакомстве, самораскрытии, несогласии и опасения неловкости или игнорирования; версия предназначена для взрослых и соответствует 20-пунктовой русской форме psytests.org.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 4,
  scales: [
    { key: 'total', label: 'Тревога при социальном взаимодействии', items: Array.from({ length: 20 }, (_, index) => index + 1), reverseItems: [5, 9, 11], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка реверсивных пунктов: по 1 баллу во всех прямых и по 3 в обратных',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), [5, 9, 11].includes(index + 1) ? 3 : 1])),
    expected: { total: 20 },
  },
  {
    title: 'Все ответы 0; три реверсивных пункта после пересчета дают по 4',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 0])),
    expected: { total: 12 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'sias-20-ru-psytests-2024-v1',
  categoryIds: ['mood-anxiety'],
};
