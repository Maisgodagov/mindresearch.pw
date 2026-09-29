import type { SeedSection } from '../types.js';

// Russian adult validation by Knyazev et al. retained 14 of the translated items.
// The four fillers and six items excluded after factor analysis are not scored here.
const items = [
  { text: 'Я стараюсь изо всех сил, чтобы получить то, что хочу.', scale: 'drive' },
  { text: 'Когда мне что-то хорошо удается, мне хочется это продолжить.', scale: 'reward' },
  { text: 'Когда я получаю то, что хочу, я чувствую возбуждение и прилив энергии.', scale: 'reward' },
  { text: 'Критика или брань сильно задевают меня.', scale: 'bis' },
  { text: 'Если я чего-то хочу, я обычно выкладываюсь на все сто, чтобы это получить.', scale: 'drive' },
  { text: 'Я часто делаю что-нибудь только потому, что это может меня развлечь.', scale: 'fun' },
  { text: 'Если я вижу возможность получить то, что хочу, я тут же хватаюсь за нее.', scale: 'drive' },
  { text: 'Если я думаю или знаю, что кто-то злится на меня, я сильно расстраиваюсь и беспокоюсь.', scale: 'bis' },
  { text: 'Я часто действую под влиянием момента.', scale: 'fun' },
  { text: 'Если я думаю, что должно случиться что-то неприятное, я обычно начинаю сильно нервничать.', scale: 'bis' },
  { text: 'Если со мной случается что-то хорошее, это сильно на меня действует.', scale: 'reward' },
  { text: 'Я беспокоюсь, когда думаю, что сделал(а) плохо что-нибудь важное.', scale: 'bis' },
  { text: 'По сравнению с моими друзьями у меня очень мало страхов.', scale: 'bis' },
  { text: 'Я беспокоюсь о том, что могу сделать ошибки.', scale: 'bis' },
];

const options = [
  { value: '1', label: '1 — Для меня совершенно неверно' },
  { value: '2', label: '2 — Для меня скорее неверно' },
  { value: '3', label: '3 — Для меня скорее верно' },
  { value: '4', label: '4 — Для меня совершенно верно' },
];

export const bisBasRuInstrument: SeedSection = {
  code: 'test_34',
  title: 'Опросник Карвера—Уайта, BIS/BAS — русская адаптация',
  description: '14 утверждений русской версии, вошедших в факторную модель адаптации Князева и соавторов. Оцените, насколько каждое утверждение верно для вас.',
  questions: items.map(({ text }, index) => ({ code: `test_34_${index + 1}`, text, type: 'single', required: true, options })),
};

const scaleDefinitions = [
  { key: 'bis', label: 'BIS — торможение поведения / чувствительность к негативным стимулам', items: [4, 8, 10, 12, 13, 14], reverseItems: [13] },
  { key: 'drive', label: 'BAS — драйв / настойчивость в достижении цели', items: [1, 5, 7], reverseItems: [] },
  { key: 'reward_responsiveness', label: 'BAS — реактивность на стимулы награды', items: [2, 3, 11], reverseItems: [] },
  { key: 'fun_seeking', label: 'BAS — поиск развлечений', items: [6, 9], reverseItems: [] },
];

export const bisBasRuScoring = {
  min: 1,
  max: 4,
  scales: scaleDefinitions.map(({ key, label, items, reverseItems }) => ({ key, label, items, reverseItems, aggregation: 'sum' as const })),
};

export const bisBasRuValidationCases = [
  {
    title: 'Минимальные ответы и реверсирование пункта о малом количестве страхов',
    answers: Object.fromEntries(Array.from({ length: 14 }, (_, index) => [String(index + 1), 1])),
    expected: { bis: 9, drive: 3, reward_responsiveness: 3, fun_seeking: 2 },
  },
  {
    title: 'Максимальные ответы и реверсирование пункта о малом количестве страхов',
    answers: Object.fromEntries(Array.from({ length: 14 }, (_, index) => [String(index + 1), 4])),
    expected: { bis: 21, drive: 12, reward_responsiveness: 12, fun_seeking: 8 },
  },
  {
    title: 'Контрольные ответы для отдельных подшкал',
    answers: Object.fromEntries(Array.from({ length: 14 }, (_, index) => [String(index + 1), index % 4 + 1])),
    expected: { bis: 20, drive: 5, reward_responsiveness: 8, fun_seeking: 3 },
  },
];
