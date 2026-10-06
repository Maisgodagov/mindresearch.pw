import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Нет, это на меня совсем не похоже' },
  { value: '2', label: 'Нет, это на меня не очень похоже' },
  { value: '3', label: 'Я затрудняюсь ответить' },
  { value: '4', label: 'Да, это немного похоже на меня' },
  { value: '5', label: 'Да, это на меня очень похоже' },
];

const items = [
  'Я человек эмоциональный.',
  'Мне трудно контролировать свои импульсы.',
  'Я часто расстраиваюсь.',
  'Я срываюсь на крик реже, чем большинство людей моего возраста.',
  'Когда я пугаюсь, то впадаю в панику.',
  'Многие вещи меня раздражают.',
  'Я склонен быстро перескакивать с одного увлечения на другое.',
  'Меня трудно испугать.',
  'Я известен как «горячий» и «темпераментный» человек.',
  'По сравнению с другими людьми я легче переживаю неудачи.',
  'Обычно я легко могу на что-то решиться.',
  'Когда я рассержен, я сразу даю это понять окружающим.',
  'Меня трудно вывести из себя.',
  'Я легко впадаю в скуку.',
  'Я почти всегда спокоен — ничто не беспокоит меня.',
];

const reverseItems = [4, 8, 10, 11, 13, 15];
const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2520_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2520',
  title: 'Шкала эмоциональной возбудимости (ШЭВ)',
  description: 'Шкала оценивает эмоциональную возбудимость как черту личности и её проявления в общей эмоциональности, гневе, робости и контроле эмоциональных импульсов. Русская адаптация Рукавишникова и Соколовой предназначена для подростков от 14 лет и взрослых; результаты могут быть полезны в исследовательской, учебной, профессиональной и консультативной оценке индивидуальных различий.',
  categoryIds: ['trait-emotional'],
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'total', label: 'Общая эмоциональная возбудимость', items: Array.from({ length: 15 }, (_, index) => index + 1), reverseItems, aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: минимальные ответы дают 15 после реверса шести пунктов',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { total: 21 },
  },
  {
    title: 'Все максимальные ответы дают 69 после реверса шести пунктов',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 5])),
    expected: { total: 69 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['trait-emotional'],
  scoringConfig,
  validationCases,
  formulaVersion: 'braithwaite-sea-rukavishnikov-sokolova-1996-russian-v1',
};
