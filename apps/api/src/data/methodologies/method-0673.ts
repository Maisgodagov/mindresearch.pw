import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'Совершенно не согласен' },
  { value: '1', label: 'Скорее не согласен' },
  { value: '2', label: 'Нечто среднее' },
  { value: '3', label: 'Скорее согласен' },
  { value: '4', label: 'Совершенно согласен' },
];

const statements = [
  'Даже если мое мнение противоречит мнениям других, я не боюсь его отстаивать',
  'Новые проблемы способны поставить меня в тупик',
  'Жажда деятельности — это точно про меня',
  'Я чувствую себя бодрым большую часть времени',
  'Чаще всего я решаю свои проблемы без посторонней помощи',
  'Я не склонен к болезням больше, чем другие',
  'Меня тяготит необходимость делать выбор самостоятельно',
  'Меня вполне можно назвать инициатором новых начинаний',
  'Обычно мои решения зависят от других людей',
  'Я стараюсь сам организовывать свою жизнь так, как я этого хочу',
  'Проблемы со здоровьем не позволяют мне добиться большего в жизни',
  'Часто я чувствую, что ничего не могу изменить в своей жизни сам',
  'Обычно я могу работать долго, не уставая',
  'Непредвиденные препятствия мешают мне довести задуманное до конца',
  'Я часто жалуюсь на какие-либо заболевания',
  'Как правило, я нахожу что-то новое и интересное для себя',
  'Обычно я чувствую слабость и недомогание',
  'Мне трудно определиться, с чего начать выполнение задуманного проекта',
];

const questions: SeedSection['questions'] = statements.map((text, index) => ({
  code: `test_704_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_704',
  title: 'Методика самоактивации личности',
  description: 'Опросник оценивает самоактивацию как личностный ресурс через самостоятельность при решении жизненно важных задач, физическую активацию и психологическую активность. Подходит для исследования взрослых; методика также применялась у подростков от 14 лет. При интерпретации нормативных результатов следует учитывать возраст и наличие инвалидности.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 4,
  scales: [
    { key: 'independence', label: 'Самостоятельность', items: [1, 5, 7, 9, 10, 12], reverseItems: [7, 9, 12], aggregation: 'sum' },
    { key: 'physical_activation', label: 'Физическая активация', items: [4, 6, 11, 13, 15, 17], reverseItems: [11, 15, 17], aggregation: 'sum' },
    { key: 'psychological_activation', label: 'Психологическая активация', items: [2, 3, 8, 14, 16, 18], reverseItems: [2, 14, 18], aggregation: 'sum' },
    { key: 'self_activation_total', label: 'Самоактивация (итог)', items: Array.from({ length: 18 }, (_, index) => index + 1), reverseItems: [2, 7, 9, 11, 12, 14, 15, 17, 18], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка обратного ключа: все ответы «совершенно согласен»',
    answers: Object.fromEntries(Array.from({ length: 18 }, (_, index) => [String(index + 1), 4])),
    expected: { independence: 12, physical_activation: 12, psychological_activation: 12, self_activation_total: 36 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'odintsova-radchikova-self-activation-18items-0to4-v1',
};
