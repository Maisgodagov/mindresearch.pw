import type { SeedSection } from '../types.js';

export const caasRuOptions = [
  { value: '1', label: 'Меньше всего' },
  { value: '2', label: 'В средней степени' },
  { value: '3', label: 'Сильно' },
  { value: '4', label: 'Очень сильно' },
  { value: '5', label: 'Сильнее всего' },
];

export const caasRuItems = [
  'Задумываюсь о том, каким будет мое будущее',
  'Осознаю, что сегодняшний выбор определяет мое будущее',
  'Готовлюсь к будущему',
  'Понимаю, какие решения я должен принять в области образовательного и профессионального выбора',
  'Планирую, как достичь свои цели',
  'Задумываюсь о своей карьере',
  'Стараюсь не унывать',
  'Принимаю решения самостоятельно',
  'Беру на себя ответственность за свои действия',
  'Отстаиваю свои убеждения',
  'Рассчитываю на себя',
  'Делаю то, что мне по душе',
  'Исследую мое окружение',
  'Ищу возможности для личностного роста',
  'Изучаю варианты, прежде чем сделать выбор',
  'Рассматриваю различные способы выполнения той или иной работы',
  'Глубоко вникаю в суть вопросов, которые у меня возникают',
  'Интересуюсь новыми возможностями',
  'Эффективно выполняю задачи',
  'Стараюсь делать все хорошо',
  'Приобретаю новые навыки',
  'Работаю в меру своих способностей',
  'Преодолеваю препятствия',
  'Решаю проблемы',
];

export const caasRuInstrument: SeedSection = {
  code: 'test_23',
  title: 'Шкала карьерно-адаптационных способностей, ШКАС (CAAS)',
  description: 'Русскоязычная форма, проверенная на российской выборке учащихся 15–19 лет. Предназначена для старшего подросткового возраста; переносить показатели и интерпретацию на другие возрастные группы без отдельной проверки нельзя.',
  questions: caasRuItems.map((text, index) => ({
    code: `test_23_${index + 1}`,
    text,
    type: 'single',
    required: true,
    options: caasRuOptions,
  })),
};

export const caasRuScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'concern', label: 'Заинтересованность', items: [1, 2, 3, 4, 5, 6], reverseItems: [], aggregation: 'sum' as const },
    { key: 'control', label: 'Контроль', items: [7, 8, 9, 10, 11, 12], reverseItems: [], aggregation: 'sum' as const },
    { key: 'curiosity', label: 'Любознательность', items: [13, 14, 15, 16, 17, 18], reverseItems: [], aggregation: 'sum' as const },
    { key: 'confidence', label: 'Уверенность', items: [19, 20, 21, 22, 23, 24], reverseItems: [], aggregation: 'sum' as const },
    { key: 'adaptability', label: 'Карьерная адаптивность', items: Array.from({ length: 24 }, (_, index) => index + 1), reverseItems: [], aggregation: 'sum' as const },
  ],
};

export const caasRuValidationCases = [
  { title: 'Минимальный профиль', answers: Object.fromEntries(Array.from({ length: 24 }, (_, index) => [String(index + 1), 1])), expected: { concern: 6, control: 6, curiosity: 6, confidence: 6, adaptability: 24 } },
  { title: 'Максимальный профиль', answers: Object.fromEntries(Array.from({ length: 24 }, (_, index) => [String(index + 1), 5])), expected: { concern: 30, control: 30, curiosity: 30, confidence: 30, adaptability: 120 } },
  { title: 'Смешанный профиль', answers: Object.fromEntries(Array.from({ length: 24 }, (_, index) => [String(index + 1), index % 5 + 1])), expected: { concern: 16, control: 17, curiosity: 18, confidence: 19, adaptability: 70 } },
];
