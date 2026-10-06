import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Меньше всего' },
  { value: '2', label: 'Очень слабо' },
  { value: '3', label: 'Слабо' },
  { value: '4', label: 'В средней степени' },
  { value: '5', label: 'Сильнее всего' },
];

const items = [
  'Задумываюсь о том, каким будет мое будущее.',
  'Осознаю, что сегодняшний выбор определяет мое будущее.',
  'Готовлюсь к будущему.',
  'Понимаю, какие решения я должен принять в области образовательного и профессионального выбора.',
  'Планирую, как достичь свои цели.',
  'Задумываюсь о своей карьере.',
  'Стараюсь не унывать.',
  'Принимаю решения самостоятельно.',
  'Беру на себя ответственность за свои действия.',
  'Отстаиваю свои убеждения.',
  'Рассчитываю на себя.',
  'Делаю то, что мне по душе.',
  'Исследую мое окружение.',
  'Ищу возможности для личностного роста.',
  'Изучаю варианты, прежде чем сделать выбор.',
  'Рассматриваю различные способы выполнения той или иной работы.',
  'Глубоко вникаю в суть вопросов, которые у меня возникают.',
  'Интересуюсь новыми возможностями.',
  'Эффективно выполняю задачи.',
  'Стараюсь делать всё хорошо.',
  'Приобретаю новые навыки.',
  'Работаю в меру своих способностей.',
  'Преодолеваю препятствия.',
  'Решаю проблемы.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2170_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2170',
  title: 'Шкала карьерно-адаптационных способностей (CAAS), русскоязычная версия',
  description: 'Методика оценивает карьерную адаптивность и четыре ресурса построения профессионального пути: заинтересованность в будущем, контроль и ответственность, любознательность к возможностям и уверенность в преодолении задач. Русская адаптация проверена на учащихся старших классов 15–19 лет; результаты описывают ресурсы карьерного развития и не являются нормативным заключением для других возрастных групп.',
  questions,
};

const six = (from: number) => Array.from({ length: 6 }, (_, index) => from + index);

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'concern', label: 'Заинтересованность', items: six(1), reverseItems: [], aggregation: 'sum' },
    { key: 'control', label: 'Контроль', items: six(7), reverseItems: [], aggregation: 'sum' },
    { key: 'curiosity', label: 'Любознательность', items: six(13), reverseItems: [], aggregation: 'sum' },
    { key: 'confidence', label: 'Уверенность', items: six(19), reverseItems: [], aggregation: 'sum' },
    { key: 'career_adaptability', label: 'Карьерная адаптивность', items: Array.from({ length: 24 }, (_, index) => index + 1), reverseItems: [], aggregation: 'sum' },
  ],
};

const answers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Все ответы минимальные: вручная проверка суммы 6 × 1 по каждой субшкале', answers: answers(1), expected: { concern: 6, control: 6, curiosity: 6, confidence: 6, career_adaptability: 24 } },
  { title: 'Все ответы максимальные: вручная проверка суммы 6 × 5 по каждой субшкале', answers: answers(5), expected: { concern: 30, control: 30, curiosity: 30, confidence: 30, career_adaptability: 120 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'caas-ru-kondratyuk-2021-v1',
};
