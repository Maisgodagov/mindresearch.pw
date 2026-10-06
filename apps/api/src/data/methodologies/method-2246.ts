import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Да' },
  { value: '0', label: 'Нет' },
];

const items = [
  'Я готов показать высокий результат.',
  'К этим соревнованиям я готов лучше, чем мои соперники.',
  'В этих соревнованиях я хочу показать высокий результат.',
  'Я боюсь подвести команду.',
  'Физически я хорошо готов к этим соревнованиям.',
  'На этих соревнованиях будет много равных соперников.',
  'Это очень важные для меня соревнования.',
  'У меня сейчас натянутые отношения с тренером.',
  'Я нахожусь в хорошей спортивной форме.',
  'Я плохо знаю своих соперников.',
  'На этих соревнованиях многое для меня решится.',
  'Конфликты с товарищами по команде мешают мне как следует настроиться на предстоящие соревнования.',
  'Я уверен, что смогу выполнить задачу, поставленную передо мной в этих соревнованиях.',
  'Я не боюсь своих соперников.',
  'Думаю, что это будут трудные соревнования.',
  'Мое успешное выступление на этих соревнованиях важно для всей команды (клуба, общества, города, республики, страны).',
  'Я доволен результатом последних соревнований.',
  'На предстоящих соревнованиях у меня будут «неудобные» соперники.',
  'В этих соревнованиях мне очень важно хорошо выступить.',
  'Мне кажется, что товарищи по команде не верят в мой успех.',
  'Я уверен в своих силах.',
  'Я уже выигрывал у своих соперников.',
  'Я постоянно думаю о предстоящих соревнованиях.',
  'На этих соревнованиях я боюсь подвести своего тренера.',
  'Технически я хорошо готов к предстоящим соревнованиям.',
  'Среди моих соперников есть такие, которых я совсем не знаю.',
  'Я с нетерпением жду предстоящих соревнований.',
  'Тренер высоко оценивает мою готовность к этим соревнованиям.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2264_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2264',
  title: 'Шкала отношения к предстоящему соревнованию (ОПС), Ю. Л. Ханин',
  description: 'Шкала ОПС оценивает отношение спортсмена к ближайшему соревнованию по четырём аспектам: уверенности в собственных возможностях, восприятию готовности соперников, личной значимости старта и отражённой оценке со стороны тренера и команды. Предназначена для спортсменов, представляющих конкретное предстоящее соревнование; результаты показывают профиль предсоревновательного отношения по компонентам.',
  categoryIds: ['sport'],
  questions,
};

const scaleItems = [
  { key: 'confidence', label: 'Уверенность в себе (Ув)', items: [1, 5, 9, 13, 17, 21, 25] },
  { key: 'opponents', label: 'Восприятие и оценка возможностей соперников (Сп)', items: [2, 6, 10, 14, 18, 22, 26] },
  { key: 'importance', label: 'Желание участвовать и значимость соревнования (Зн)', items: [3, 7, 11, 15, 19, 23, 27] },
  { key: 'reflected', label: 'Зеркальная самооценка (Др)', items: [4, 8, 12, 16, 20, 24, 28] },
];

// The published answer stencil awards a point for the keyed response. With Да=1,
// the items keyed Нет are reverse scored.
const keyedNo = [1, 2, 5, 9, 13, 14, 17, 21, 22, 25, 28];
const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 1,
  scales: scaleItems.map(({ key, label, items }) => ({
    key,
    label,
    items,
    reverseItems: items.filter(item => keyedNo.includes(item)),
    aggregation: 'sum',
  })),
};

const allAnswers = (value: string) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  {
    title: 'Ручная сверка ключа: все ответы «Да»; баллы по четырём шкалам',
    answers: allAnswers('1'),
    expected: { confidence: 0, opponents: 4, importance: 7, reflected: 6 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'hanin-ops-1977-binary-key-v1',
};
