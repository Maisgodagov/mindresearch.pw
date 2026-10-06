import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const answers = [
  { value: '1', label: 'Полностью согласен' },
  { value: '2', label: 'В целом согласен' },
  { value: '3', label: 'Скорее согласен' },
  { value: '4', label: 'Скорее не согласен' },
  { value: '5', label: 'В целом не согласен' },
  { value: '6', label: 'Категорически не согласен' },
];

const items = [
  'Молитва Богу не приносит мне особого удовлетворения.',
  'Я не знаю кто я, откуда я или куда я двигаюсь.',
  'Я верю, что Бог любит меня и заботится обо мне.',
  'Я чувствую, что жизнь для меня – это положительный опыт.',
  'Я верю, что Бог безразличен и Ему не интересны мои повседневные дела.',
  'Я беспокоюсь по поводу своего будущего.',
  'Мои отношения с Богом имеют особенно важное значение для меня.',
  'Я чувствую себя наполненным и довольным жизнью.',
  'Бог не является для меня источником поддержки и сил.',
  'Я ощущаю благополучие по поводу того куда движется моя жизнь.',
  'Я верю, что Бог обеспокоен моими проблемами.',
  'Я не получаю особого удовольствия от жизни.',
  'У меня нет отношений с Богом, которые бы удовлетворяли меня лично.',
  'Я c оптимизмом (с позитивом) смотрю в будущее.',
  'Мои отношения с Богом помогают мне не чувствовать себя одиноким.',
  'Я чувствую, что жизнь полна конфликтов и несчастья.',
  'Наибольшее удовлетворение я получаю от тесного общения с Богом.',
  'Жизнь не имеет особого смысла.',
  'Мои отношения с Богом способствуют моему ощущению благополучия.',
  'Я верю, что в моей жизни есть какая-то истинная цель.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2140_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: answers,
}));

export const instrument: SeedSection = {
  code: 'test_2140',
  title: 'Шкала духовного благополучия (SWBS)',
  description: 'Оценивает субъективное духовное благополучие по двум аспектам: религиозному благополучию, связанному с воспринимаемыми отношениями с Богом, и экзистенциальному благополучию, связанному с удовлетворённостью жизнью, её направлением и смыслом. Русскоязычная адаптация Бакушкина и Ершовой (2025), валидированная на русскоязычной взрослой выборке; подходит для исследований в религиозном, межконфессиональном и нерелигиозном контексте.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 6,
  scales: [
    { key: 'total', label: 'Духовное благополучие', items: Array.from({ length: 20 }, (_, i) => i + 1), reverseItems: [1, 2, 5, 6, 9, 12, 13, 16, 18], aggregation: 'sum' },
    { key: 'religious', label: 'Религиозное благополучие (RWBS)', items: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19], reverseItems: [1, 5, 9, 13], aggregation: 'sum' },
    { key: 'existential', label: 'Экзистенциальное благополучие (EWBS)', items: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20], reverseItems: [2, 6, 12, 16, 18], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы «полностью согласен»: реверсивные пункты дают 1, прямые — 6',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { total: 69, religious: 32, existential: 37 },
  },
  {
    title: 'Все ответы «категорически не согласен»: реверсивные пункты дают 6, прямые — 1',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 6])),
    expected: { total: 71, religious: 28, existential: 43 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'swbs-bakushkin-ershova-2025-ru-v1',
};
