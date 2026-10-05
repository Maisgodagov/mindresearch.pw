import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Абсолютно не согласен/-сна' },
  { value: '2', label: 'Не согласен/-сна' },
  { value: '3', label: 'Скорее не согласен/-сна' },
  { value: '4', label: 'Нейтральное мнение' },
  { value: '5', label: 'Скорее согласен/-сна' },
  { value: '6', label: 'Согласен/-сна' },
  { value: '7', label: 'Абсолютно согласен/-сна' },
];

const statements = [
  'У меня высокий уровень ожиданий по поводу моих результатов в работе или в учебе.',
  'Я – организованный человек.',
  'Я часто расстраиваюсь из-за того, что не могу достичь своих целей.',
  'Аккуратность важна для меня.',
  'Если не требовать от себя многого, то я никогда не достигну успеха.',
  'Мои лучшие успехи мне никогда не кажутся достаточно хорошими.',
  'Я считаю, что все вещи должны находиться на своих местах.',
  'У меня высокие ожидания в отношении себя.',
  'Я редко оправдываю свои высокие ожидания.',
  'Мне нравится быть всегда организованным/-ой и дисциплинированным/-ой.',
  'Мои лучшие достижения никогда не бывают достаточно хороши.',
  'Я устанавливаю для себя высокую планку стандартов.',
  'Я никогда не удовлетворен/-а своими достижениями.',
  'Я ожидаю от себя самого лучшего.',
  'Я часто беспокоюсь, что не дотягиваю до уровня своих стандартов.',
  'Мои результаты редко достигают уровня моих стандартов.',
  'Я не испытываю удовлетворения, даже когда знаю, что сделал/-а всё, что мог/-ла.',
  'Я стараюсь сделать максимально хорошо всё, чем я занят/-а.',
  'Я редко могу соответствовать высокому уровню своих ожиданий по поводу результатов.',
  'Я редко когда удовлетворен/-а своими результатами.',
  'Я редко когда чувствую, что то, что я сделал/-а, достаточно хорошо.',
  'У меня сильная потребность стремиться к превосходным успехам.',
  'Я часто испытываю разочарование после завершения задания, потому что я знаю, что мог/-ла бы выполнить его лучше.',
];

const questions: SeedSection['questions'] = statements.map((text, index) => ({
  code: `test_1459_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1459',
  title: 'Почти совершенная шкала (APS-R), русская версия',
  description: 'APS-R оценивает три компонента личностного перфекционизма: высокие стандарты результатов, предпочтение порядка и переживание несоответствия между собственными требованиями и достижениями. Профиль помогает автору опроса различать высокие устремления и самокритичное ощущение, что результатов недостаточно; русская версия подходит для исследовательского применения у взрослых и студентов.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'standards', label: 'Высокие стандарты', items: [1, 5, 8, 12, 14, 18, 22], reverseItems: [], aggregation: 'sum' },
    { key: 'order', label: 'Порядок', items: [2, 4, 7, 10], reverseItems: [], aggregation: 'sum' },
    { key: 'discrepancy', label: 'Несоответствие', items: [3, 6, 9, 11, 13, 15, 16, 17, 19, 20, 21, 23], reverseItems: [], aggregation: 'sum' },
  ],
};

const uniformAnswers = (value: number) => Object.fromEntries(statements.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Ручная сверка по официальному ключу: все ответы 1', answers: uniformAnswers(1), expected: { standards: 7, order: 4, discrepancy: 12 } },
  { title: 'Ручная сверка границ шкал: все ответы 7', answers: uniformAnswers(7), expected: { standards: 49, order: 28, discrepancy: 84 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'aps-r-slaney-russian-permyakova-sheveleva-7point-sum-v1',
};
