import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const itemTexts = [
  'Я начинаю бегло смотреть в телефон, когда нахожусь в компании малознакомых людей.',
  'Я всегда занят своим мобильным телефоном, когда нахожусь со своими друзьями.',
  'Люди жалуются, когда я сижу в своем мобильном телефоне.',
  'Я занят своим мобильным телефоном, когда нахожусь со своими друзьями.',
  'Я не думаю, что раздражаю своего партнера, когда я сижу в своем мобильном телефоне.',
  'Мой телефон всегда под рукой.',
  'Когда я просыпаюсь утром, я сначала проверяю сообщения на своем телефоне.',
  'Я чувствую себя неполноценным без моего мобильного телефона.',
  'Мое пользование мобильным телефоном растет с каждым днем.',
  'Время, отведенное на социальную, личную или профессиональную деятельность, уменьшается из-за моего пользования мобильным телефоном.',
];

const responseOptions = [
  { value: '1', label: 'Никогда' },
  { value: '2', label: 'Редко' },
  { value: '3', label: 'Иногда' },
  { value: '4', label: 'Часто' },
  { value: '5', label: 'Всегда' },
];

const questions: SeedSection['questions'] = itemTexts.map((text, index) => ({
  code: `test_2493_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: responseOptions,
}));

export const instrument: SeedSection = {
  code: 'test_2493',
  title: 'Шкала фаббинга',
  description: 'Шкала оценивает частоту фаббинга — отвлечения на мобильный телефон и пренебрежения непосредственным общением. Охватывает нарушения коммуникации во время общения и «одержимость» телефоном (постоянную доступность и использование вне общения). Русская адаптация предназначена для взрослых активных пользователей смартфонов; психометрическая проверка проводилась на выборке 18–35 лет.',
  categoryIds: ['cyberpsychology'],
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'communicationDisturbance', label: 'Нарушение коммуникации', items: [1, 2, 3, 4, 10], reverseItems: [], aggregation: 'sum' },
    { key: 'phoneObsession', label: 'Одержимость телефоном', items: [5, 6, 7, 8, 9], reverseItems: [], aggregation: 'sum' },
    { key: 'phubbingTotal', label: 'Фаббинг', items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ключ: ответ «никогда» на все пункты даёт минимальные суммы',
    answers: Object.fromEntries(itemTexts.map((_, index) => [String(index + 1), 1])),
    expected: { communicationDisturbance: 5, phoneObsession: 5, phubbingTotal: 10 },
  },
  {
    title: 'Проверка факторного ключа: 1–4 и 10 относятся к нарушению коммуникации, 5–9 — к одержимости телефоном',
    answers: Object.fromEntries(itemTexts.map((_, index) => [String(index + 1), index + 1 <= 5 ? 5 : 1])),
    expected: { communicationDisturbance: 21, phoneObsession: 9, phubbingTotal: 30 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['cyberpsychology'],
  scoringConfig,
  validationCases,
  formulaVersion: 'karadag-phubbing-scale-ekimchik-kryukova-2022-v1',
};
