import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Совершенно не согласен' },
  { value: '2', label: 'Частично не согласен' },
  { value: '3', label: 'Нейтрально' },
  { value: '4', label: 'Частично согласен' },
  { value: '5', label: 'Полностью согласен' },
];

const items = [
  'Я люблю говорить по-русски.',
  'В своей повседневной жизни я предпочитаю говорить по-русски.',
  'У меня есть несколько русских друзей.',
  'Мне нравится взаимодействовать с русскими людьми.',
  'Мне нравится русская еда.',
  'Я знаю много русских песен.',
  'Мне нравится смотреть русские фильмы и слушать русскую музыку.',
  'Я интересуюсь происходящими в России событиями.',
  'Мне нравится путешествовать по разным местам России.',
  'Мне нравятся главные ценности русских.',
  'Я веду себя в соответствии с нормами и правилами России.',
  'Я отмечаю русские праздники (День Победы, 1 Мая и др.).',
  'Российский образ жизни мне подходит.',
  'Я знаю многих великих людей в истории России (Александр Невский, Петр Первый, Иван Грозный и др.).',
  'Я знаю особенности русского языка и русского алфавита.',
  'Я знаком с русской литературой (А.С. Пушкин, Ф.М. Достоевский, А.П. Чехов и др.).',
  'Я люблю русскую природу.',
  'Я чувствую себя в России как дома.',
  'Я чувствую себя принятым россиянами.',
  'Я хотел бы жить в России много лет.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2061_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2061',
  title: 'Шкала аккультурации к России (ШАР)',
  description: 'Шкала оценивает аккультурацию иностранных студентов в России через отношение к русскому языку и культуре, знание российских реалий, повседневное поведение и социальные связи, а также эмоциональное принятие образа жизни и чувство принадлежности. Подходит для исследовательской оценки иностранных студентов; применение к другим группам мигрантов требует отдельного обоснования.',
  questions,
};

const allItems = Array.from({ length: 20 }, (_, index) => index + 1);
export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'total', label: 'Общий балл аккультурации', items: allItems, reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  { title: 'Ручная проверка: все ответы 1', answers: Object.fromEntries(allItems.map(item => [String(item), 1])), expected: { total: 20 } },
  { title: 'Ручная проверка: все ответы 5', answers: Object.fromEntries(allItems.map(item => [String(item), 5])), expected: { total: 100 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'ardila-et-al-2019-asr-20item-direct-sum-v1',
};
