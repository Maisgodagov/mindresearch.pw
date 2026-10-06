import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  'Абсолютно неверно',
  'В целом неверно',
  'Не совсем верно',
  'Скорее верно',
  'В целом верно',
  'Абсолютно верно',
].map((label, index) => ({ value: String(index + 1), label }));

const items = [
  'Я часто думаю, что мои эмоциональные реакции отличаются от реакций других людей.',
  'Это неправильно — испытывать некоторые чувства.',
  'Во мне есть что-то, чего я просто не понимаю.',
  'Я считаю, что это важно — позволять себе плакать для того, чтобы дать чувствам выплеснуться наружу.',
  'Я боюсь, что могу потерять контроль, если позволю себе испытывать некоторые чувства.',
  'Окружающие люди понимают и принимают мои чувства.',
  'Я не понимаю своих чувств.',
  'Если бы другие люди изменились, то я бы чувствовал себя гораздо лучше.',
  'Иногда я опасаюсь, что если я позволю себе испытывать сильные эмоции, то они не прекратятся.',
  'Я стыжусь своих эмоций и чувств.',
  'То, что беспокоит других людей, не беспокоит меня.',
  'Мои чувства безразличны для окружающих.',
  'Для меня более важно быть разумным и прагматичным, чем чувствительным и открытым по отношению к своим эмоциям.',
  'Когда мне грустно, я стараюсь думать о более важных вещах в жизни, которые я ценю.',
  'Я чувствую, что могу открыто выражать свои чувства.',
  'Я часто спрашиваю себя: «Что со мной не так?»',
  'Я беспокоюсь, что буду не в состоянии контролировать свои эмоции.',
  'Следует остерегаться появления некоторых чувств и эмоций.',
  'Сильные эмоции длятся недолго.',
  'Я часто чувствую себя в эмоциональном ступоре, как будто у меня нет никаких чувств.',
  'Другие люди заставляют меня испытывать неприятные эмоции.',
  'Когда у меня плохое настроение, я часто сижу в одиночестве и думаю о том, как плохо я себя чувствую.',
  'Я предпочитаю однозначно понимать, что я чувствую в отношении другого человека.',
  'Я принимаю свои чувства.',
  'Я думаю, что испытываю те же чувства, которые могут испытывать и другие люди.',
  'В жизни существуют более высокие ценности, к которым нужно стремиться, несмотря на неприятные эмоции.',
  'Я считаю, что это важно — быть рациональным и логичным практически во всём.',
  'Я предпочитаю однозначно понимать, что я чувствую в отношении себя.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2524_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2524',
  title: 'Шкала эмоциональных схем Лихи, LESS II_RUS',
  description: 'Русскоязычная 28-пунктовая версия LESS II оценивает представления человека о собственных эмоциях и эмоциях других людей. Профиль 14 аспектов охватывает принятие и выражение эмоций, их понятность, контролируемость и длительность, вину, руминацию, рациональность, эмоциональную пустоту, обесценивание и переживание отличия от других. Методика может помочь автору опроса описать эмоциональные убеждения взрослых респондентов в исследовательском или КПТ-контексте; российская адаптация проверялась на выборке студентов.',
  categoryIds: ['framework-cbt'],
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 6,
  scales: [
    { key: 'invalidation', label: 'Инвалидация', items: [6, 12], reverseItems: [6], aggregation: 'mean' },
    { key: 'incomprehensibility', label: 'Непонятность', items: [3, 7], reverseItems: [], aggregation: 'mean' },
    { key: 'guilt', label: 'Вина', items: [2, 10], reverseItems: [], aggregation: 'mean' },
    { key: 'simplistic_view', label: 'Слишком упрощённое видение эмоций', items: [23, 28], reverseItems: [], aggregation: 'mean' },
    { key: 'devalued', label: 'Обесценивание', items: [14, 26], reverseItems: [14, 26], aggregation: 'mean' },
    { key: 'loss_control', label: 'Потеря контроля', items: [5, 17], reverseItems: [], aggregation: 'mean' },
    { key: 'numbness', label: 'Пустота', items: [11, 20], reverseItems: [], aggregation: 'mean' },
    { key: 'overly_rational', label: 'Чрезмерная рациональность', items: [13, 27], reverseItems: [], aggregation: 'mean' },
    { key: 'duration', label: 'Продолжительность', items: [9, 19], reverseItems: [19], aggregation: 'mean' },
    { key: 'low_consensus', label: 'Низкий консенсус', items: [1, 25], reverseItems: [25], aggregation: 'mean' },
    { key: 'non_acceptance', label: 'Неприятие чувств', items: [18, 24], reverseItems: [24], aggregation: 'mean' },
    { key: 'rumination', label: 'Руминация', items: [16, 22], reverseItems: [], aggregation: 'mean' },
    { key: 'low_expression', label: 'Слабое выражение', items: [4, 15], reverseItems: [4, 15], aggregation: 'mean' },
    { key: 'blame', label: 'Обвинение', items: [8, 21], reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: нейтральные ответы 3 дают 3 по всем шкалам после учёта реверсивных пунктов',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 3])),
    expected: {
      invalidation: 3, incomprehensibility: 3, guilt: 3, simplistic_view: 3,
      devalued: 4, loss_control: 3, numbness: 3, overly_rational: 3,
      duration: 4, low_consensus: 4, non_acceptance: 4, rumination: 3,
      low_expression: 4, blame: 3,
    },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'leahy-less-ii-rus-28-psytests-leahy-2012-v1',
};
