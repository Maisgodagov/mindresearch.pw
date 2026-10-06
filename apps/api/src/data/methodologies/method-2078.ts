import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Абсолютно неверно' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
  { value: '6', label: '6' },
  { value: '7', label: 'Абсолютно верно' },
];

const items = [
  'Я чувствую себя спокойнее после пребывания там.',
  'После посещения этого места явно возрастает моя способность к сосредоточенности и концентрации внимания.',
  'Там я получаю энергию и энтузиазм для повседневной жизни.',
  'После посещения этого места я всегда чувствую себя отдохнувшим или отдохнувшей и более расслабленным или расслабленной.',
  'Там я могу забыть о повседневных заботах.',
  'Посещение этого места — это способ прояснить и «очистить» мои мысли.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2092_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2092',
  title: 'Шкала восстановительного эффекта (ROS), русская адаптация',
  description: 'Шкала оценивает субъективный когнитивно-аффективный эффект восстановления, который человек переживает при контакте с природой: спокойствие, восстановление внимания и ясность мышления, энергию, расслабление и освобождение от повседневных забот. Русская версия Шаталовой предназначена для оценки типичного опыта пребывания на природе.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'restoration', label: 'Восстановительный эффект', items: [1, 2, 3, 4, 5, 6], reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы минимальные: среднее равно нижней границе шкалы',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { restoration: 1 },
  },
  {
    title: 'Ручная проверка: сумма 26 по шести пунктам, среднее 26/6',
    answers: { '1': 1, '2': 2, '3': 3, '4': 6, '5': 7, '6': 7 },
    expected: { restoration: 26 / 6 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'ros-shatalova-2024-6item-mean-v1',
};
