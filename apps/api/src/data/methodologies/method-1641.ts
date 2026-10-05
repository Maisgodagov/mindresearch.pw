import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Неверно' },
  { value: '2', label: 'Пожалуй, неверно' },
  { value: '3', label: 'Затрудняюсь ответить' },
  { value: '4', label: 'Пожалуй, верно' },
  { value: '5', label: 'Верно' },
];

const items = [
  'Не строю планы на будущее, так как обстоятельства могут их изменить.',
  'Для успеха дела мне необходима программа действий.',
  'В конце дня подвожу итоги того, что было сделано.',
  'Не всегда вовремя замечаю изменения обстоятельств и из-за этого терплю неудачи.',
  'Люблю перемены в жизни, смену обстановки и образа жизни.',
  'Как правило, мне трудно работать, когда я расстроен.',
  'Всегда добиваюсь удовлетворяющего меня результата.',
  'Цели на будущее детально планирую.',
  'Накануне Нового года оцениваю, что удалось сделать в уходящем году.',
  'Я всегда замечаю изменение ситуации и использую это в своих интересах.',
  'Начиная работу, не считаю необходимым заранее продумать свои действия и их последовательность.',
  'Без труда переключаюсь на новое дело.',
  'После ссоры с близким человеком не могу следовать намеченному на день плану.',
  'Проявляю упорство в решении сложной задачи.',
  'Не задумываюсь много о жизненных целях, скорее «плыву по течению».',
  'Принимаясь за выполнение сложного дела, делю его на этапы.',
  'Не оцениваю промежуточные итоги работы, считая это необязательным.',
  'Мне трудно вовремя учесть изменение обстоятельств.',
  'Переход на новую систему работы не причиняет мне особых неудобств.',
  'Результат моей работы часто зависит от моего настроения.',
  'Не отступаюсь от начатого дела в любых условиях.',
  'Заранее планирую свою жизнь.',
  'Мне не свойственно подводить итоги того, что было сделано за день.',
  'Не всегда удается определить главные условия достижения задуманного.',
  'Легко адаптируюсь в новых ситуациях.',
  'Для выполнения дела мне нужно определить последовательность своих действий.',
  'Допускаю много ошибок, когда волнуюсь.',
  'Настойчиво стремлюсь добиться нужного результата.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1658_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

const instrument: SeedSection = {
  code: 'test_1658',
  title: 'Стиль саморегуляции поведения — ССПМ-2020',
  description: 'Опросник оценивает осознанную саморегуляцию поведения и её профиль у взрослых: планирование целей, моделирование значимых условий, программирование действий, оценивание результатов, гибкость, надёжность и настойчивость. Подходит для описания индивидуальных различий в произвольной активности и достижения целей в разных жизненных ситуациях.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'planning', label: 'Планирование целей', items: [1, 8, 15, 22], reverseItems: [1, 15], aggregation: 'sum' },
    { key: 'modeling', label: 'Моделирование значимых условий достижения целей', items: [4, 10, 18, 24], reverseItems: [4, 18, 24], aggregation: 'sum' },
    { key: 'programming', label: 'Программирование действий', items: [2, 11, 16, 26], reverseItems: [11], aggregation: 'sum' },
    { key: 'results', label: 'Оценивание результатов', items: [3, 9, 17, 23], reverseItems: [17, 23], aggregation: 'sum' },
    { key: 'flexibility', label: 'Гибкость', items: [5, 12, 19, 25], reverseItems: [], aggregation: 'sum' },
    { key: 'reliability', label: 'Надёжность', items: [6, 13, 20, 27], reverseItems: [6, 13, 20, 27], aggregation: 'sum' },
    { key: 'persistence', label: 'Настойчивость', items: [7, 14, 21, 28], reverseItems: [], aggregation: 'sum' },
    { key: 'overall', label: 'Общий уровень саморегуляции', items: Array.from({ length: 28 }, (_, index) => index + 1), reverseItems: [1, 4, 6, 11, 13, 15, 17, 18, 20, 23, 24, 27], aggregation: 'sum' },
  ],
};

const allAnswers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Вручную проверено: все ответы «3», реверсные пункты остаются равны 3', answers: allAnswers(3), expected: { planning: 12, modeling: 12, programming: 12, results: 12, flexibility: 12, reliability: 12, persistence: 12, overall: 84 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'sspm-2020-morosanova-kondratyuk-2020-v1',
};
