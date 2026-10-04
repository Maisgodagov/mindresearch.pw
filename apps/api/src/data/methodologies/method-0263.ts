import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Не согласен' },
  { value: '2', label: 'Скорее не согласен' },
  { value: '3', label: 'Скорее согласен' },
  { value: '4', label: 'Согласен' },
];

const items = [
  'Я чувствую себя одиноким.',
  'Когда рядом со мной никого нет, я испытываю скуку.',
  'Я люблю оставаться наедине с самим собой.',
  'Есть люди, с которыми я могу поговорить.',
  'Нет никого, к кому бы я мог обратиться.',
  'Мне трудно найти людей, с которыми можно было бы поделиться моими мыслями.',
  'В одиночестве приходят интересные идеи.',
  'Мне трудно быть вдали от людей.',
  'Бывают чувства, ощутить которые можно лишь наедине с собой.',
  'Есть люди, которые по-настоящему понимают меня.',
  'Я не люблю оставаться один.',
  'Чтобы понять какие-то важные вещи, человеку необходимо остаться одному.',
  'Когда я остаюсь один, я не испытываю неприятных чувств.',
  'Я чувствую себя покинутым.',
  'В одиночестве голова работает лучше.',
  'Люди вокруг меня, но не со мной.',
  'В одиночестве человек познает самого себя.',
  'Я плохо выношу отсутствие компании.',
  'В одиночестве я чувствую себя самим собой.',
  'Худшее, что можно сделать с человеком, — это оставить его одного.',
  'Мне кажется, что меня никто не понимает.',
  'Мне хорошо дома, когда я один.',
  'Когда я остаюсь один, я испытываю дискомфорт.',
  'В одиночестве каждый видит в себе то, что он есть на самом деле.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_295_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_295',
  title: 'Дифференциальный опросник переживания одиночества (ДОПО-3к)',
  description: 'Краткая версия ДОПО оценивает общее переживание одиночества, зависимость от общения (неприятие уединения) и позитивное отношение к уединению как ресурсу. Подходит для русскоязычной взрослой и подростковой аудитории; публикация сообщает об апробации в возрастных группах начиная с 14 лет.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 4,
  scales: [
    { key: 'generalLoneliness', label: 'Общее переживание одиночества (ОО)', items: [1, 4, 5, 6, 10, 14, 16, 21], reverseItems: [4, 10], aggregation: 'sum' },
    { key: 'communicationDependence', label: 'Зависимость от общения (ЗО)', items: [2, 8, 11, 13, 18, 20, 23], reverseItems: [13], aggregation: 'sum' },
    { key: 'positiveSolitude', label: 'Позитивное одиночество (ПО)', items: [3, 7, 9, 12, 15, 17, 19, 22, 24], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная сверка: все пункты отмечены ответом 1, реверсивные 4, 10 и 13 инвертированы',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { generalLoneliness: 10, communicationDependence: 9, positiveSolitude: 9 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'dopo-3k-osin-leontiev-2013-v1',
};
