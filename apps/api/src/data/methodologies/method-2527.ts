import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const responseOptions = [
  { value: '1', label: 'Абсолютно не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Скорее не согласен' },
  { value: '4', label: 'Нечто среднее' },
  { value: '5', label: 'Скорее согласен' },
  { value: '6', label: 'Согласен' },
  { value: '7', label: 'Абсолютно согласен' },
];

const items = [
  'Мой взгляд мечтательно устремлен вдаль, когда я думаю о значимом для меня человеке.',
  'Я чувствую, что могу рассчитывать на значимого для меня человека.',
  'Когда я рядом со значимым для меня человеком, у меня трясутся колени.',
  'Я готов поделиться со значимым для меня человеком всем, что имею.',
  'Без значимого для меня человека я бы чувствовал себя одиноко.',
  'Я теряю аппетит из-за чувств к значимому для меня человеку.',
  'Мне сложно сконцентрироваться на чем-то другом из-за мыслей о значимом для меня человеке.',
  'Значимый для меня человек — моя вторая половина.',
  'Я боюсь сказать что-нибудь не то в разговоре со значимым для меня человеком.',
  'Значимый для меня человек знает обо мне всё.',
  'Я надеюсь, что мои чувства к значимому для меня человеку никогда не закончатся.',
  'Когда я рядом со значимым для меня человеком, у меня потеют ладони.',
  'Я чувствую эмоциональную связь со значимым для меня человеком.',
  'Я становлюсь напряженным, когда нахожусь рядом со значимым для меня человеком.',
  'Значимый для меня человек может успокоить меня, когда я расстроен.',
  'Я с трудом засыпаю, потому что думаю о значимом для меня человеке.',
  'Я ищу альтернативный смысл в словах значимого для меня человека.',
  'Значимый для меня человек может сделать меня самым счастливым.',
  'Значимый для меня человек — часть моих планов на будущее.',
  'В присутствии значимого для меня человека я застенчив.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2545_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: responseOptions,
}));

export const instrument: SeedSection = {
  code: 'test_2545',
  title: 'Шкалы страсти и привязанности (IAS)',
  description: 'Опросник измеряет два самостоятельных компонента романтической любви: страсть (влюбленность) и эмоциональную привязанность к значимому человеку. Шкала страсти охватывает захваченность мыслями, физиологическое волнение и застенчивость; шкала привязанности — надежность, эмоциональную связь и включение человека в планы на будущее. Предназначен для самоотчета о чувствах к конкретному значимому человеку; русский перевод psytests.org не заявлен как отдельная психометрическая адаптация.',
  categoryIds: ['close-love'],
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'infatuation', label: 'Страсть (влюбленность)', items: [1, 3, 6, 7, 9, 12, 14, 16, 17, 20], reverseItems: [], aggregation: 'mean' },
    { key: 'attachment', label: 'Привязанность', items: [2, 4, 5, 8, 10, 11, 13, 15, 18, 19], reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Минимум по всем пунктам',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { infatuation: 1, attachment: 1 },
  },
  {
    title: 'Проверка ключа: страсть 3, привязанность 5',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), [2, 4, 2, 4, 4, 2, 4, 4, 2, 4, 4, 2, 4, 2, 4, 2, 2, 4, 4, 2][index]])),
    expected: { infatuation: 2.4, attachment: 4 },
  },
  {
    title: 'Максимум по всем пунктам',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 7])),
    expected: { infatuation: 7, attachment: 7 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'ias-langeslag-muris-franken-2013-psytests-ru-v1',
};
