import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: 'yes', label: 'Да' },
  { value: 'no', label: 'Нет' },
  { value: 'unsure', label: 'Сомневаюсь' },
];

const statements = [
  'С удовольствием ухаживаю за растениями, животными',
  'Могу подолгу мастерить что-нибудь',
  'Люблю ходить в музеи, театры, на выставки',
  'Мне нравится что-нибудь вычислять, чертить',
  'Легко знакомлюсь с людьми',
  'Охотно читаю о растениях, животных',
  'Моё техническое творчество обычно вызывает интерес у товарищей, старших',
  'Обычно делаю мало ошибок в письменных работах',
  'Знакомые считают, что у меня есть художественные способности',
  'С удовольствием общаюсь с самыми разными людьми',
  'Я хорошо себя чувствую наедине с растениями или животными',
  'Принимаю участие в спектаклях, концертах',
  'Люблю читать об устройстве механизмов, приборов, машин',
  'Подолгу могу разгадывать головоломки, задачи, ребусы',
  'Легко улаживаю разногласия между людьми',
  'Мне кажется, что я чувствую состояние растений и животных',
  'Считают, что у меня есть способности к работе с техникой',
  'Я могу ясно излагать свои мысли в письменной форме',
  'Знакомым нравится, как я пою, танцую, рисую, пишу стихи (хотя бы одно)',
  'Я почти никогда ни с кем не ссорюсь',
  'Охотно наблюдаю за растениями или животными',
  'Люблю разбираться в устройстве механизмов, приборов',
  'Без особого труда усваиваю иностранные языки',
  'Стараюсь понять секреты мастерства и пробую свои силы в живописи, музыке и т. п.',
  'Мне часто случается помогать даже незнакомым людям',
];

const questions: SeedSection['questions'] = statements.map((text, index) => ({
  code: `test_1794_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1794',
  title: 'Тест на определение типа будущей профессии (модификация Г. В. Резапкиной)',
  description: 'Профориентационный опросник для школьников, прежде всего учащихся 7-го класса, оценивает выраженность интереса к пяти предметам труда по классификации Е. А. Климова: природа, техника, знаковые системы, художественный образ и человек. Профиль помогает автору опроса увидеть предпочтительные направления профессиональной деятельности и использовать их как основу для обсуждения выбора профессии.',
  questions,
};

const scaleItems = {
  nature: [1, 6, 11, 16, 21],
  technology: [2, 7, 12, 17, 22],
  signs: [3, 8, 13, 18, 23],
  art: [4, 9, 14, 19, 24],
  people: [5, 10, 15, 20, 25],
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 5,
  scales: [
    { key: 'nature', label: 'Природа', items: scaleItems.nature, reverseItems: [], aggregation: 'count-option', optionValue: 'yes' },
    { key: 'technology', label: 'Техника', items: scaleItems.technology, reverseItems: [], aggregation: 'count-option', optionValue: 'yes' },
    { key: 'signs', label: 'Знаковая система', items: scaleItems.signs, reverseItems: [], aggregation: 'count-option', optionValue: 'yes' },
    { key: 'art', label: 'Художественный образ (искусство)', items: scaleItems.art, reverseItems: [], aggregation: 'count-option', optionValue: 'yes' },
    { key: 'people', label: 'Человек', items: scaleItems.people, reverseItems: [], aggregation: 'count-option', optionValue: 'yes' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: по одному ответу «Да» в каждой шкале',
    answers: Object.fromEntries(Array.from({ length: 25 }, (_, index) => [String(index + 1), index % 5 === 0 ? 'yes' : 'no'])),
    expected: { nature: 1, technology: 1, signs: 1, art: 1, people: 1 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'rezapkina-future-profession-type-25-v1',
};
