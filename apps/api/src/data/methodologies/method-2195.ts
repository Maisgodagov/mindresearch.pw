import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Не согласен' },
  { value: '2', label: 'Скорее не согласен' },
  { value: '3', label: 'Ни то, ни другое' },
  { value: '4', label: 'Скорее согласен' },
  { value: '5', label: 'Согласен' },
];

// Русский перевод и модификация авторов исследования онлайн-гейминга.
const items = [
  'Потому что в них хочется играть.',
  'Чтобы получить удовольствие от использования новых возможностей игры.',
  'Ради чувства успешности, которое я испытываю, когда играю.',
  'Чтобы приобрести мощные и уникальные предметы, виртуальные деньги, исследовать еще не исследованные элементы игры.',
  'Потому что быть хорошим игроком — престижно.',
  'Чтобы получать награды, призы, опыт.',
  'Потому что это хороший способ развить в себе важные качества.',
  'Потому что это хороший способ развить мышление и навыки общения.',
  'Потому что онлайн-игры много значат для меня лично.',
  'Потому что онлайн-игры — это часть меня.',
  'Потому что это часть моей жизни.',
  'Потому что они являются для меня ценностью.',
  'Потому что я чувствую необходимость регулярно играть.',
  'Потому что мне необходимо играть, чтобы нормально себя чувствовать.',
  'Потому что я расстраиваюсь, если не играю.',
  'Да уже и не знаю, иногда я задаю себе вопрос: нужно ли мне это?',
  'Раньше были ясные причины, а сейчас я спрашиваю себя: стоит ли продолжать?',
  'Честно говоря, я не знаю; у меня такое ощущение, что я просто теряю время.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2209_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2209',
  title: 'Шкала мотивации гейминга (GAMS), русская модификация онлайн-гейминга',
  description: 'Оценивает глубинные причины игры в онлайн-игры в рамках теории самодетерминации: интерес и удовольствие от игры, интеграцию игры в образ жизни, личную значимость, внутреннее давление, внешние награды и признание, а также амотивацию. Подходит для изучения мотивационного профиля игроков; опубликованная русская модификация исследовалась на игроках массовых многопользовательских онлайн-игр.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'intrinsic', label: 'Внутренняя мотивация', items: [1, 2, 3], reverseItems: [], aggregation: 'sum' },
    { key: 'external', label: 'Внешняя регуляция', items: [4, 5, 6], reverseItems: [], aggregation: 'sum' },
    { key: 'identified', label: 'Идентифицированная регуляция', items: [7, 8, 9], reverseItems: [], aggregation: 'sum' },
    { key: 'integrated', label: 'Интегративная (встроенная) регуляция', items: [10, 11, 12], reverseItems: [], aggregation: 'sum' },
    { key: 'introjected', label: 'Интроецированная регуляция', items: [13, 14, 15], reverseItems: [], aggregation: 'sum' },
    { key: 'amotivation', label: 'Амотивация', items: [16, 17, 18], reverseItems: [], aggregation: 'sum' },
  ],
};

const allAnswers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Все пункты отмечены нейтральным средним ответом', answers: allAnswers(3), expected: { intrinsic: 9, external: 9, identified: 9, integrated: 9, introjected: 9, amotivation: 9 } },
  { title: 'Проверка ключа: только первый пункт максимален, остальные минимальны', answers: { ...allAnswers(1), '1': 5 }, expected: { intrinsic: 13, external: 3, identified: 3, integrated: 3, introjected: 3, amotivation: 3 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'gams-18-ivanova-et-al-2016-russian-online-gaming-v1',
};
