import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Совершенно не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Скорее не согласен' },
  { value: '4', label: 'Нечто среднее' },
  { value: '5', label: 'Скорее согласен' },
  { value: '6', label: 'Согласен' },
  { value: '7', label: 'Полностью согласен' },
];

const items = [
  'Два года в будущем кажутся мне коротким периодом времени',
  'Принимая решения, я тщательно обдумываю, как мой выбор может повлиять на будущее',
  'Я ценю те виды деятельности, которые могут принести мне пользу в долгосрочной перспективе',
  'Для меня то, что произойдет через два года, кажется относительно близким',
  'Когда я думаю о том, что произойдет через два года, мне кажется, что впереди еще уйма времени',
  'Когда я чего-то хочу, я тщательно обдумываю, что мне нужно сделать, чтобы достичь этого в будущем',
  'Я осознаю связь между тем, что я делаю сейчас, и тем, что может случиться со мной в будущем',
  'Я жертвую чем-то в настоящем, если думаю, что это может принести мне пользу в будущем',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2096_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2096',
  title: 'Шкала временной ориентации на будущее (FTOS), русскоязычная версия',
  description: 'Шкала оценивает, насколько представление о психологическом будущем влияет на решения и поведение человека в настоящем. Она охватывает влияние будущих последствий на текущий выбор и действия («Воздействие»), а также субъективную временную близость будущего («Дистанция»). Русскоязычная адаптация подходит для исследовательской и практической оценки взрослых респондентов; опубликованная адаптационная выборка имела средний возраст около 27 лет.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'impact', label: 'Воздействие', items: [2, 3, 6, 7, 8], reverseItems: [], aggregation: 'mean' },
    { key: 'distance', label: 'Дистанция', items: [1, 4, 5], reverseItems: [5], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: ответы 1 по прямым и 7 по обратному пункту дают минимальные средние',
    answers: { '1': 1, '2': 1, '3': 1, '4': 1, '5': 7, '6': 1, '7': 1, '8': 1 },
    expected: { impact: 1, distance: 1 },
  },
  {
    title: 'Ручная проверка: ответы 7 по прямым и 1 по обратному пункту дают максимальные средние',
    answers: { '1': 7, '2': 7, '3': 7, '4': 7, '5': 1, '6': 7, '7': 7, '8': 7 },
    expected: { impact: 7, distance: 7 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'ftos-ru-gagarina-2026-two-scales-reverse-5-v1',
};
