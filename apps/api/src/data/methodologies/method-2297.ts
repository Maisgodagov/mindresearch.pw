import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Никогда' },
  { value: '2', label: 'Редко' },
  { value: '3', label: 'Иногда' },
  { value: '4', label: 'Часто' },
  { value: '5', label: 'Очень часто' },
];

const statements = [
  'Во время приема пищи, когда мы с партнером проводим время вместе, мой партнер достает и проверяет свой мобильный телефон.',
  'Когда мы вместе, мой партнер кладет свой мобильный телефон так, чтобы он мог его видеть.',
  'Мой партнер держит свой мобильный телефон в руке, когда он со мной.',
  'Когда сотовый телефон моего партнера звонит или подает звуковой сигнал, он достает его, даже если мы уже общаемся.',
  'Мой партнер смотрит на свой мобильный телефон, когда разговаривает со мной.',
  'В свободное время, когда мы с моим партнером вместе, он использует свой мобильный телефон.',
  'Мой партнер не использует свой телефон, когда мы говорим.',
  'Мой партнер использует свой мобильный телефон, когда мы не вместе.',
  'Когда мы находимся вместе, но молчим, мой партнер проверяет свой телефон.',
];

const questions: SeedSection['questions'] = statements.map((text, index) => ({
  code: `test_2315_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2315',
  title: 'Шкала партнерского фаббинга (Pphubbing), русская адаптация',
  description: 'Шкала измеряет, насколько часто человек воспринимает поведение романтического партнера как отвлечение на смартфон и пренебрежение общением в близких отношениях. Пункты охватывают использование телефона рядом во время совместной еды и досуга, его доступность и проверку при сигнале или паузе, а также использование телефона в разговоре и вне совместного времени. Русская адаптация предназначена для взрослых активных пользователей смартфонов и оценивает восприятие фаббинга именно в близких партнерских отношениях.',
  categoryIds: ['cyberpsychology'],
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'partner_phubbing', label: 'Партнерский фаббинг (средний балл)', items: [1, 2, 3, 4, 5, 6, 7, 8, 9], reverseItems: [7], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  { title: 'Ручная проверка: все ответы «Никогда», реверсивный пункт также преобразуется в 5', answers: Object.fromEntries(Array.from({ length: 9 }, (_, i) => [String(i + 1), 1])), expected: { partner_phubbing: 13 / 9 } },
  { title: 'Ручная проверка: все ответы «Очень часто», реверсивный пункт преобразуется в 1', answers: Object.fromEntries(Array.from({ length: 9 }, (_, i) => [String(i + 1), 5])), expected: { partner_phubbing: 41 / 9 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['cyberpsychology'],
  scoringConfig,
  validationCases,
  formulaVersion: 'pphubbing-roberts-david-ekimchik-kryukova-2022-mean-1-to-5-reverse-7-v1',
};
