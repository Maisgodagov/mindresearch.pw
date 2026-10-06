import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: ' +3' },
  { value: '2', label: ' +2' },
  { value: '3', label: ' +1' },
  { value: '4', label: '0' },
  { value: '5', label: ' −1' },
  { value: '6', label: ' −2' },
  { value: '7', label: ' −3' },
];

const items = [
  ['Избыточная', 'Недостаточная'],
  ['Динамичная', 'Статичная'],
  ['Разнородная', 'Однородная'],
  ['Понятная', 'Непонятная'],
  ['Точная', 'Размытая'],
  ['Ясная', 'Запутанная'],
  ['Правильная', 'Ошибочная'],
  ['Полезная', 'Ненужная'],
  ['Позитивная', 'Негативная'],
];

const questions: SeedSection['questions'] = items.map(([left, right], index) => ({
  code: `test_2023_${index + 1}`,
  text: `${index < 3 ? 'Как бы Вы описали воспринимаемую Вами информацию?' : index < 6 ? 'Как бы Вы охарактеризовали воспринятую Вами информацию?' : 'Как Вы бы оценили используемую Вами информацию?'}\n${left} — ${right}`,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2023',
  title: 'Характеристики информационно-смыслового поля',
  description: 'Опросник К. В. Злоказова, С. Н. Ениколопова и М. Р. Бабиковой оценивает субъективные характеристики взаимодействия человека с повседневной информацией по трём аспектам: её получение (объём, динамичность и разнообразие), обработка (понятность, точность и ясность) и применение (правильность, полезность и эмоциональная оценка). Опубликованная версия содержит девять парных критериев; исследование валидизации проводилось преимущественно на молодежи и взрослых, поэтому применение к другим возрастным группам требует отдельной проверки. Показатели помогают изучать субъективные трудности и ресурсы информационного потребления, понимания и использования сведений.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'information_acquisition', label: 'Получение информации', items: [1, 2, 3], reverseItems: [1, 2, 3], aggregation: 'sum' },
    { key: 'information_processing', label: 'Обработка информации', items: [4, 5, 6], reverseItems: [4], aggregation: 'sum' },
    { key: 'information_application', label: 'Применение информации', items: [7, 8, 9], reverseItems: [8], aggregation: 'sum' },
    { key: 'total', label: 'Суммарный показатель', items: [1, 2, 3, 4, 5, 6, 7, 8, 9], reverseItems: [1, 2, 3, 4, 8], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: все ответы 1; реверсивные пункты преобразуются в 7',
    answers: Object.fromEntries(Array.from({ length: 9 }, (_, index) => [String(index + 1), 1])),
    expected: { information_acquisition: 21, information_processing: 13, information_application: 9, total: 43 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'hisp-zlokazov-enikolopov-babikova-2025-v1',
};
