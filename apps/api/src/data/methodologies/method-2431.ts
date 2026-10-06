import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const responseOptions = [
  { value: '0', label: 'Никогда' },
  { value: '1', label: 'Редко' },
  { value: '2', label: 'Иногда' },
  { value: '3', label: 'Часто' },
];

const items = [
  'Я нахожусь в ладу с окружающими меня людьми.',
  'Я испытываю недостаток в дружеском общении.',
  'Нет никого, к кому я мог бы обратиться за поддержкой или помощью.',
  'Я чувствую себя одиноким.',
  'Я ощущаю поддержку близких мне людей.',
  'У меня много общего со многими людьми.',
  'Я предпочитаю оставаться наедине со своими переживаниями.',
  'Никто из окружающих не разделяет моих интересов и мыслей.',
  'Вокруг меня нет людей, кто искренне готов меня поддержать.',
  'Есть люди, к которым я испытываю глубокие чувства.',
  'Я чувствую себя покинутым и одиноким.',
  'У меня нет глубоких привязанностей (глубоких чувств).',
  'Никто не знает меня по-настоящему, не понимает меня, не разделяет мои интересы.',
  'Я чувствую себя изолированным от других.',
  'Я могу найти друзей (приятелей), как только я этого захочу.',
  'Я верю, что есть люди, способные понять меня.',
  'Я несчастен оттого, что мне не хватает общения с понимающими и интересными мне людьми.',
  'Люди вокруг меня, но не со мной.',
  'Есть люди, с которыми я могу «отвести душу».',
  'На самом деле мне не с кем поделиться своим сокровенным.',
  'Я доволен своей семейной жизнью.',
];

const reverseItems = [1, 5, 6, 10, 15, 16, 19, 21];
const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2449_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: responseOptions,
}));

export const instrument: SeedSection = {
  code: 'test_2449',
  title: 'Шкала субъективного ощущения одиночества',
  description: 'Методика Н. Е. Водопьяновой оценивает выраженность субъективного одиночества через переживания социальной разобщённости, недостатка дружеского общения и поддержки, отсутствия понимания и близких связей. Подходит для опросов взрослых респондентов; включает модификацию UCLA-R с дополнительным пунктом об удовлетворённости семейной жизнью.',
  categoryIds: ['social-loneliness'],
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 3,
  scales: [
    { key: 'loneliness', label: 'Общий индекс одиночества', items: Array.from({ length: 21 }, (_, index) => index + 1), reverseItems, aggregation: 'sum' },
  ],
};

const allAnswers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Все ответы «никогда»', answers: allAnswers(0), expected: { loneliness: 24 } },
  { title: 'Все ответы «часто»', answers: allAnswers(3), expected: { loneliness: 39 } },
  { title: 'Контрольный смешанный профиль', answers: Object.fromEntries(items.map((_, index) => [String(index + 1), index % 4])), expected: { loneliness: 27 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['social-loneliness'],
  scoringConfig,
  validationCases,
  formulaVersion: 'vodopyanova-loneliness-21-2009-key-0-3-reverse-v1',
};
