import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Очень редко' },
  { value: '2', label: 'Редко' },
  { value: '3', label: 'Иногда' },
  { value: '4', label: 'Часто' },
  { value: '5', label: 'Очень часто' },
];

const items = [
  'Как часто за последний год ты тратил много времени, размышляя о том, как использовать социальные сети, и планируя действия в них?',
  'Как часто за последний год ты испытывал потребность всё больше и больше пользоваться социальными сетями?',
  'Как часто за последний год ты использовал социальные сети, чтобы забыть о личных проблемах?',
  'Как часто за последний год ты безуспешно пытался сократить использование социальных сетей?',
  'Как часто за последний год ты беспокоился или волновался, если тебе запретили пользоваться социальными сетями?',
  'Как часто за последний год ты пользовался социальными сетями настолько часто, что это отрицательно сказалось на делах, учебе?',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_128_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_128',
  title: 'Бергенская шкала зависимости от социальных сетей (BSMAS)',
  description: "Шкала оценивает выраженность признаков проблемного использования социальных сетей: значимость сети, изменения настроения, рост времени использования и трудности контроля. Результат является скрининговым показателем, а не диагнозом зависимости.",
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [{
    key: 'total',
    label: 'Общий показатель зависимости от социальных сетей',
    items: [1, 2, 3, 4, 5, 6],
    reverseItems: [],
    aggregation: 'sum',
  }],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: минимальный ответ по всем шести пунктам',
    answers: { '1': 1, '2': 1, '3': 1, '4': 1, '5': 1, '6': 1 },
    expected: { total: 6 },
  },
  {
    title: 'Ручная проверка: максимальный ответ по всем шести пунктам',
    answers: { '1': 5, '2': 5, '3': 5, '4': 5, '5': 5, '6': 5 },
    expected: { total: 30 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'bsmas-kornienko-ru-2023-sum-6-v1',
};
