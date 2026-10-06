import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const stateOptions = [
  { value: '1', label: 'Нет, это не так' },
  { value: '2', label: 'Пожалуй, так' },
  { value: '3', label: 'Верно' },
  { value: '4', label: 'Совершенно верно' },
];
const traitOptions = [
  { value: '1', label: 'Почти никогда' },
  { value: '2', label: 'Иногда' },
  { value: '3', label: 'Часто' },
  { value: '4', label: 'Почти всегда' },
];

const itemTexts = [
  'Я спокоен.',
  'Мне ничто не угрожает.',
  'Я нахожусь в напряжении.',
  'Я испытываю сожаление.',
  'Я чувствую себя свободно.',
  'Я расстроен.',
  'Меня волнуют возможные неудачи.',
  'Я чувствую себя отдохнувшим.',
  'Я встревожен.',
  'Я испытываю чувство внутреннего удовлетворения.',
  'Я уверен в себе.',
  'Я нервничаю.',
  'Я не нахожу себе места.',
  'Я взвинчен.',
  'Я не чувствую скованности, напряженности.',
  'Я доволен.',
  'Я озабочен.',
  'Я слишком возбуждён и мне не по себе.',
  'Мне радостно.',
  'Мне приятно.',
  'Я обычно испытываю удовольствие.',
  'Я обычно быстро устаю.',
  'Как правило, я легко могу заплакать.',
  'Я хотел бы быть таким же счастливым, как другие.',
  'Нередко я проигрываю из-за того, что недостаточно быстро принимаю решения.',
  'Обычно я чувствую себя бодрым.',
  'Обычно я спокоен, хладнокровен и собран.',
  'Ожидаемые трудности обычно меня очень тревожат.',
  'Я слишком переживаю из-за пустяков.',
  'Я вполне счастлив.',
  'Я принимаю всё слишком близко к сердцу.',
  'Мне не хватает уверенности в себе.',
  'Обычно я чувствую себя в безопасности.',
  'Я стараюсь избегать критических ситуаций и трудностей.',
  'У меня бывает хандра.',
  'Как правило, я доволен.',
  'Всякие пустяки отвлекают и волнуют меня.',
  'Я так сильно переживаю свои разочарования, что потом долго не могу о них забыть.',
  'Я уравновешенный человек.',
  'Меня охватывает сильное беспокойство, когда я думаю о своих делах и заботах.',
];

const questions: SeedSection['questions'] = itemTexts.map((text, index) => ({
  code: `test_2366_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: index < 20 ? stateOptions : traitOptions,
}));

export const instrument: SeedSection = {
  code: 'test_2366',
  title: 'Шкала реактивной и личностной тревожности Спилбергера — Ханина (STAI)',
  description: 'Шкала оценивает тревожность в двух аспектах: текущее эмоциональное состояние и относительно устойчивую личностную склонность к тревожным переживаниям. Она подходит для подростков от 13 лет и взрослых в версии, представленной русским бланком; результаты помогают автору опроса раздельно анализировать ситуативную и личностную тревожность.',
  categoryIds: ['mood-anxiety'],
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 4,
  scales: [
    { key: 'state_anxiety', label: 'Реактивная (ситуативная) тревожность', items: Array.from({ length: 20 }, (_, i) => i + 1), reverseItems: [1, 2, 5, 8, 10, 11, 13, 16, 19, 20], aggregation: 'sum', weights: { ...Object.fromEntries([1, 2, 5, 8, 10, 11, 13, 16, 19, 20].map(i => [i, -1])), ...Object.fromEntries([3, 4, 6, 7, 9, 12, 14, 15, 17, 18].map(i => [i, 1])) } },
    { key: 'trait_anxiety', label: 'Личностная тревожность', items: Array.from({ length: 20 }, (_, i) => i + 21), reverseItems: [21, 26, 27, 30, 33, 36, 39], aggregation: 'sum', weights: { ...Object.fromEntries([21, 26, 27, 30, 33, 36, 39].map(i => [i, -1])), ...Object.fromEntries([22, 23, 24, 25, 28, 29, 31, 32, 34, 35, 37, 38, 40].map(i => [i, 1])) } },
  ],
};

const allAnswers = Object.fromEntries(itemTexts.map((_, i) => [String(i + 1), 1]));
export const validationCases: ValidationCase[] = [
  { title: 'Все пункты выбраны с минимальным исходным баллом', answers: allAnswers, expected: { state_anxiety: 50, trait_anxiety: 41 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'spielberger-hanin-stai-ru-khanin-1976-v1',
};
