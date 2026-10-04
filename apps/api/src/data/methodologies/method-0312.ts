import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Да' },
  { value: '0', label: 'Нет' },
  { value: '-1', label: 'Не знаю' },
];

const items = [
  'Обычно я рассчитываю на успех в своих делах.',
  'Большую часть времени я нахожусь в подавленном настроении.',
  'Со мной большинство ребят советуются (считаются).',
  'У меня отсутствует уверенность в себе.',
  'Я примерно так же способен и находчив, как большинство окружающих меня людей (ребят в классе).',
  'Временами я чувствую себя никому не нужным.',
  'Я всё делаю хорошо (любое дело).',
  'Мне кажется, что я ничего не достигну в будущем (после школы).',
  'В любом деле я считаю себя правым.',
  'Я делаю много такого, о чём впоследствии жалею.',
  'Когда я узнаю об успехах кого-нибудь, кого я знаю, то ощущаю это как собственное поражение.',
  'Мне кажется, что окружающие смотрят на меня осуждающе.',
  'Меня мало беспокоят возможные неудачи.',
  'Мне кажется, что успешному выполнению поручений или дел мне мешают различные препятствия, которые мне не преодолеть.',
  'Я редко жалею о том, что уже сделал.',
  'Окружающие меня люди гораздо более привлекательны, чем я сам.',
  'Я сам думаю, что я постоянно кому-нибудь необходим.',
  'Мне кажется, что я занимаюсь гораздо хуже, чем остальные.',
  'Мне чаще везёт, чем не везёт.',
  'В жизни я всегда чего-то боюсь.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_344_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_344',
  title: 'Изучение общей самооценки (Г. Н. Казанцева)',
  description: 'Опросник оценивает общий уровень самооценки школьников-подростков по суждениям об уверенности и успешности, настроении, собственной значимости и сравнении себя с окружающими. Подходит для подростковой версии Казанцевой; итоговый показатель отражает баланс позитивных и негативных ответов.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 1,
  scales: [
    { key: 'general_self_esteem', label: 'Общая самооценка (−10…+10)', items: Array.from({ length: 20 }, (_, index) => index + 1), reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  { title: 'Все ответы «нет» (баланс согласий равен нулю)', answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 0])), expected: { general_self_esteem: 0 } },
  { title: 'Согласие только с нечётными пунктами (10 − 0)', answers: Object.fromEntries(items.map((_, index) => [String(index + 1), index % 2 === 0 ? 1 : 0])), expected: { general_self_esteem: 10 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'kazantseva-general-self-esteem-1996-ru-v1',
};
