import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const itemTexts = [
  'В школе всегда стараюсь изо всех сил.',
  'Я активно работаю на уроках.',
  'Когда мне что-то непонятно — задаю вопросы.',
  'Принимаю участие в школьных мероприятиях (например, в кружках, спортивных соревнованиях, школьных праздниках).',
  'Обдумываю, как буду выполнять домашнюю работу.',
  'Я проверяю свою самостоятельную работу, прежде чем сдать ее учителю.',
  'Я продолжаю искать решение, даже когда «застреваю» на каком-то вопросе при выполнении учебной работы.',
  'В школе я усердно учусь, несмотря на возникающие проблемы / трудности.',
  'Стараюсь понять, что я сделал неправильно, когда вижу свои ошибки в выполненном задании.',
  'Хорошая успеваемость в школе важна для моего будущего.',
  'Мне весело в школе.',
  'Я счастлив в школе.',
  'Я горжусь своей школой.',
  'Мне интересно, что мы изучаем в школе.',
  'Я помогаю друзьям, когда им трудно.',
  'Мне нравится участвовать в школьных делах со сверстниками.',
  'С одноклассниками мы учимся друг у друга, когда занимаемся вместе.',
  'Легко завожу новых друзей в школе.',
  'Мне нравится проводить время со сверстниками в школе.',
  'Во время работы в классе обычно «валяю дурака».',
  'Нахожу способы опоздать в школу.',
  'Нахожу причины, чтобы выйти из класса во время урока.',
  'Нарушаю правила поведения в школе.',
  'В школе у меня проблемы с поведением.',
  'Я не выполняю домашнюю работу.',
  'Я часто отвлекаюсь на уроках.',
  'На уроках в школе я невнимателен.',
  'Если я не понимаю задачу, я сразу сдаюсь.',
  'Выполнить домашнюю работу быстро для меня важнее, чем сделать ее правильно.',
  'Я нервничаю в школе.',
  'Я перегружен в школе.',
  'В школе чувствую себя некомфортно.',
  'Школа меня раздражает.',
  'У меня нет друзей в школе.',
  'В школе на меня не обращают внимания.',
  'Отношения с одноклассниками не очень важны для меня.',
  'В школе мне ни до кого нет дела.',
];

const options = [
  { value: '1', label: 'Совсем на меня не похоже' },
  { value: '2', label: 'Скорее не похоже' },
  { value: '3', label: 'Нечто среднее' },
  { value: '4', label: 'Скорее похоже' },
  { value: '5', label: 'Очень на меня похоже' },
];

const questions: SeedSection['questions'] = itemTexts.map((text, index) => ({
  code: `test_735_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_735',
  title: 'Многомерная шкала школьной вовлеченности (MSES), русская адаптация',
  description: 'Русская адаптация MSES оценивает школьную вовлеченность и безучастность учащихся, охватывая поведенческие, когнитивные, эмоциональные и социальные проявления в учебной и школьной жизни. Подходит для учащихся 5–11 классов; профиль помогает автору опроса описать сильные стороны включенности и области отстраненности, не сводя безучастность к просто низкой вовлеченности.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'engagement_behavioral', label: 'Вовлеченность: поведенческая', items: [1, 2, 3, 4], reverseItems: [], aggregation: 'sum' },
    { key: 'engagement_cognitive', label: 'Вовлеченность: когнитивная', items: [5, 6, 7, 8, 9], reverseItems: [], aggregation: 'sum' },
    { key: 'engagement_emotional', label: 'Вовлеченность: эмоциональная', items: [10, 11, 12, 13, 14], reverseItems: [], aggregation: 'sum' },
    { key: 'engagement_social', label: 'Вовлеченность: социальная', items: [15, 16, 17, 18, 19], reverseItems: [], aggregation: 'sum' },
    { key: 'engagement_total', label: 'Вовлеченность: общая', items: Array.from({ length: 19 }, (_, index) => index + 1), reverseItems: [], aggregation: 'sum' },
    { key: 'disengagement_behavioral', label: 'Безучастность: поведенческая', items: [20, 21, 22, 23, 24, 25, 26, 27], reverseItems: [], aggregation: 'sum' },
    { key: 'disengagement_cognitive', label: 'Безучастность: когнитивная', items: [28, 29], reverseItems: [], aggregation: 'sum' },
    { key: 'disengagement_emotional', label: 'Безучастность: эмоциональная', items: [30, 31, 32, 33], reverseItems: [], aggregation: 'sum' },
    { key: 'disengagement_social', label: 'Безучастность: социальная', items: [34, 35, 36, 37], reverseItems: [], aggregation: 'sum' },
    { key: 'disengagement_total', label: 'Безучастность: общая', items: Array.from({ length: 18 }, (_, index) => index + 20), reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: все ответы по вовлеченности равны 5, по безучастности равны 1',
    answers: Object.fromEntries(itemTexts.map((_, index) => [String(index + 1), index < 19 ? 5 : 1])),
    expected: {
      engagement_behavioral: 20, engagement_cognitive: 25, engagement_emotional: 25, engagement_social: 25, engagement_total: 95,
      disengagement_behavioral: 8, disengagement_cognitive: 2, disengagement_emotional: 4, disengagement_social: 4, disengagement_total: 18,
    },
  },
  {
    title: 'Ручная проверка ключа: ответы 1–5 повторяются циклом; каждое значение суммируется по ключевым пунктам',
    answers: Object.fromEntries(itemTexts.map((_, index) => [String(index + 1), (index % 5) + 1])),
    expected: {
      engagement_behavioral: 10, engagement_cognitive: 15, engagement_emotional: 15, engagement_social: 15, engagement_total: 55,
      disengagement_behavioral: 24, disengagement_cognitive: 6, disengagement_emotional: 7, disengagement_social: 10, disengagement_total: 47,
    },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'mses-fomina-morosanova-2019-five-point-subscale-and-total-sums-v1',
};
