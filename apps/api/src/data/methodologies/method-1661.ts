import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Не делал(а) этого' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: 'Делал(а) это регулярно' },
];

const items = [
  'Следил(а) за уровнями разных видов жиров в организме (на основании результатов медицинских анализов и консультаций с врачами)',
  'Проходил(а) дополнительное обучение',
  'Старался(лась) не нервничать по пустякам',
  'Старался(лась) отпускать проблемы текущего дня, когда ложился(лась) спать',
  'Старался(лась) сознательно регулировать режим сна (например, ложиться и вставать в определенное время)',
  'Старался(лась) не использовать гаджеты (в том числе телевизор) перед сном',
  'Старался(лась) правильно питаться',
  'Старался(лась) соблюдать водный баланс (пить достаточное количество жидкости в день)',
  'Старался(лась) «загружать» свой мозг (решать сложные задачи)',
  'Много читал(а)',
  'Изучал(а) иностранные языки',
  'Старался(лась) приобретать новые впечатления',
  'Задумывался(лась) о работе своих памяти, внимания, мышления',
  'Задумывался(лась) о том, как у меня работают разные процессы (психические, эмоциональные, физиологические)',
  'Учился(лась) управлять своими эмоциями',
  'Старался(лась) разобраться в себе, что я за человек, почему я веду себя так, как веду',
  'Старался(лась) передавать свой опыт следующим поколениям',
  'Старался(лась) помогать другим',
  'Высыпался(лась)',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1678_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

const instrument: SeedSection = {
  code: 'test_1678',
  title: 'Стратегии конструирования старения',
  description: 'Методика оценивает, как часто взрослый человек использует повседневные стратегии, связанные с формированием благополучного старения: заботу о здоровье, сон, питание и эмоциональную регуляцию, самопонимание, обучение и новые впечатления, передачу опыта и помощь другим. Подходит для взрослых; опубликованная проверка проводилась на выборке 40–75 лет. Пункты можно оценивать для актуального или выбранного ретроспективного периода.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'health', label: 'Стратегии сохранения здоровья', items: [1, 3, 4, 5, 6, 7, 8, 19], reverseItems: [], aggregation: 'sum' },
    { key: 'metacognitive', label: 'Метакогнитивные стратегии', items: [13, 14, 15, 16], reverseItems: [], aggregation: 'sum' },
    { key: 'selfDevelopment', label: 'Стратегии саморазвития', items: [2, 9, 10, 11, 12], reverseItems: [], aggregation: 'sum' },
    { key: 'generative', label: 'Генеративные стратегии', items: [17, 18], reverseItems: [], aggregation: 'sum' },
    { key: 'total', label: 'Общий показатель', items: Array.from({ length: 19 }, (_, index) => index + 1), reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: все ответы на минимальном значении',
    answers: Object.fromEntries(Array.from({ length: 19 }, (_, index) => [String(index + 1), 1])),
    expected: { health: 8, metacognitive: 4, selfDevelopment: 5, generative: 2, total: 19 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'strizhitskaya-petrash-construction-of-aging-strategies-2024-v1',
};
