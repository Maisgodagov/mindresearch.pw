import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Категорически не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Ни согласен, ни не согласен' },
  { value: '4', label: 'Согласен' },
  { value: '5', label: 'Категорически согласен' },
];

const statements = [
  'Я получаю удовольствие от еды',
  'Я часто решаю, что мне не нравится та или иная еда, еще не попробовав',
  'Я получаю удовольствие от процесса поедания пищи',
  'Я с нетерпением жду времени приема пищи',
  'Я ем больше, когда раздражен',
  'Я часто замечаю урчание в животе',
  'Я отказываюсь от новых продуктов поначалу',
  'Я ем больше, когда волнуюсь',
  'Если я пропускаю прием пищи, то я становлюсь раздражительным',
  'Я ем больше, когда расстроен',
  'Я часто оставляю еду на своей тарелке',
  'Мне нравится пробовать новую еду',
  'Я часто испытываю чувство сильного аппетита, когда нахожусь рядом с тем, кто ест',
  'Я часто заканчиваю еду последним',
  'Я ем меньше, когда волнуюсь',
  'Я ем больше, когда испытываю тревогу',
  'Если бы был выбор, я бы ел почти всегда',
  'Я ем меньше, когда злюсь',
  'Мне интересно попробовать новые блюда, которые я раньше не пробовал',
  'Я ем меньше, когда расстроен',
  'Я ем больше, когда сержусь',
  'Я постоянно думаю о еде',
  'Я часто наедаюсь еще до завершения приема пищи',
  'Я люблю разнообразную пищу',
  'Я ем все медленнее и медленнее во время еды',
  'Я ем не спеша',
  'Я ем меньше, когда раздражен',
  'Я часто чувствую себя настолько голодным, что мне обязательно нужно что-нибудь съесть в эту же минуту',
  'Я часто быстро заканчиваю еду',
  'Я не могу есть, если незадолго до этого перекусил',
  'Я быстро наедаюсь',
  'Я часто испытываю чувство голода',
  'Когда я вижу или чувствую запах понравившейся мне еды, мне хочется есть',
  'Если я не успеваю вовремя поесть, у меня начинается головокружение',
  'Я ем меньше, когда испытываю тревогу',
];

const questions: SeedSection['questions'] = statements.map((text, index) => ({
  code: `test_1134_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1134',
  title: 'Опросник пищевого поведения взрослых (AEBQ_Rus)',
  description: 'Русскоязычная версия для взрослых оценивает восемь особенностей аппетита и пищевого поведения: голод, реакцию на еду, эмоциональное переедание, наслаждение едой, реакцию на сытость, эмоциональное недоедание, привередливость и медлительность при еде. Профиль субшкал помогает автору опроса описать склонность к пищевому подходу и избеганию пищи; версия валидировалась на русскоговорящих студентах 19–26 лет.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'hunger', label: 'Голод', items: [6, 9, 28, 32, 34], reverseItems: [], aggregation: 'mean' },
    { key: 'food_responsiveness', label: 'Реакция на еду', items: [13, 17, 22, 33], reverseItems: [], aggregation: 'mean' },
    { key: 'emotional_overeating', label: 'Эмоциональное переедание', items: [5, 8, 10, 16, 21], reverseItems: [], aggregation: 'mean' },
    { key: 'enjoyment_of_food', label: 'Наслаждение едой', items: [1, 3, 4], reverseItems: [], aggregation: 'mean' },
    { key: 'satiety_responsiveness', label: 'Чувство сытости', items: [11, 23, 30, 31], reverseItems: [], aggregation: 'mean' },
    { key: 'emotional_undereating', label: 'Эмоциональное недоедание', items: [15, 18, 20, 27, 35], reverseItems: [], aggregation: 'mean' },
    { key: 'food_fussiness', label: 'Привередливость в еде', items: [2, 7, 12, 19, 24], reverseItems: [12, 19, 24], aggregation: 'mean' },
    { key: 'slowness_in_eating', label: 'Медлительность в приеме пищи', items: [14, 25, 26, 29], reverseItems: [29], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: все ответы 3 дают среднее 3 по каждой субшкале, включая реверсивные пункты',
    answers: Object.fromEntries(Array.from({ length: 35 }, (_, index) => [String(index + 1), 3])),
    expected: {
      hunger: 3,
      food_responsiveness: 3,
      emotional_overeating: 3,
      enjoyment_of_food: 3,
      satiety_responsiveness: 3,
      emotional_undereating: 3,
      food_fussiness: 3,
      slowness_in_eating: 3,
    },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'koch-et-al-aebq-rus-2025-v1',
};
