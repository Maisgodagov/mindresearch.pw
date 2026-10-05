import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Категорически не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Ни согласен, ни не согласен' },
  { value: '4', label: 'Согласен' },
  { value: '5', label: 'Полностью согласен' },
];

const items = [
  'У меня крепкая связь с этим устройством, оснащенным ИИ.',
  'Меня беспокоит, когда ИИ пренебрегает моими потребностями.',
  'Когда я предоставляю информацию ИИ, я обычно ожидаю что-то взамен.',
  'Мне нравится вести беседу с ИИ.',
  'Я готов предоставить ИИ личную информацию, такую как имя, адрес электронной почты и номер телефона.',
  'Это устройство с ИИ очень важно для меня.',
  'При принятии решений я учитываю потребности и чувства ИИ.',
  'Когда люди получают пользу от ИИ, они должны сразу отблагодарить его.',
  'Общаться с ИИ весело и приятно.',
  'Я готов поделиться с ИИ своей финансовой информацией, включая номера банковских карт.',
  'Мне кажется, что у нас с этим устройством, обладающим ИИ, схожие черты.',
  'Я считаю, что ИИ должен стараться быть полезным.',
  'Лучше всего следить за тем, чтобы отношения с ИИ всегда были «честными» и сбалансированными.',
  'Разговор с ИИ увлекательный.',
  'Я готов предоставить ИИ информацию о себе.',
  'Я ожидаю, что известный мне ИИ будет реагировать на мои потребности и чувства.',
  'Я погружаюсь в беседу с ИИ.',
  'Я готов сообщить ИИ информацию о своих потребностях в товарах.',
  'Я часто прилагаю дополнительные усилия, чтобы взаимодействовать с ИИ.',
  'Мне больше нравится выбирать товары, когда они рекомендуются ИИ, чем когда я выбираю их сам.',
  'Когда у меня возникает потребность, я обращаюсь за помощью к ИИ.',
  'Когда ИИ игнорирует мою потребность, мне больно.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1578_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1578',
  title: 'Самораскрывающееся поведение с ИИ',
  description: 'Опросник оценивает особенности отношений потребителя с ИИ и готовность раскрывать ему личную информацию. Он охватывает привязанность к ИИ, коммунальные и обменные отношения, удовольствие от взаимодействия и готовность делиться персональными, финансовыми и потребительскими сведениями. Версия предназначена для взрослых потребителей, оценивающих взаимодействие с устройством или сервисом на основе ИИ.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'attachment', label: 'Привязанность к ИИ', items: [1, 6, 11], reverseItems: [], aggregation: 'mean' },
    { key: 'communal_relationship', label: 'Коммунальные отношения', items: [2, 7, 12, 16, 19, 21, 22], reverseItems: [], aggregation: 'mean' },
    { key: 'exchange_relationship', label: 'Обменные отношения', items: [3, 8, 13], reverseItems: [], aggregation: 'mean' },
    { key: 'perceived_enjoyment', label: 'Воспринимаемое удовольствие', items: [4, 9, 14, 17, 20], reverseItems: [], aggregation: 'mean' },
    { key: 'self_disclosure', label: 'Готовность к самораскрытию', items: [5, 10, 15, 18], reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: одинаковые ответы 1 по всем пунктам возвращают среднее 1 для каждой шкалы',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: {
      attachment: 1,
      communal_relationship: 1,
      exchange_relationship: 1,
      perceived_enjoyment: 1,
      self_disclosure: 1,
    },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'pelau-et-al-2025-ai-self-disclosure-ru-kislyakov-saenko-v1',
};
