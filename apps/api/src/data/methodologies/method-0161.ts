import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Совершенно не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Скорее не согласен' },
  { value: '4', label: 'Скорее согласен' },
  { value: '5', label: 'Согласен' },
  { value: '6', label: 'Полностью согласен' },
];

const itemTexts = [
  'Мне кажется, что весь мир — одна большая деревня.',
  'Мне кажется, что мои личные поступки могут повлиять на кого-то, кто живет в другой части земного шара.',
  'Когда я задумываюсь о людях из других стран, мне кажется, что мы с ними как будто «соседи по лестничной площадке».',
  'Я чувствую себя связанным с другими людьми на земном шаре, словно они являются частью моей семьи.',
  'Мне кажется, что у людей из разных стран больше сходства, чем различий.',
  'Я думаю о себе как о гражданине мира.',
  'Я чувствую, что моя судьба связана с будущим остального человечества.',
];

const questions: SeedSection['questions'] = itemTexts.map((text, index) => ({
  code: `test_196_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_196',
  title: 'Глобальная идентичность',
  description: 'Шкала оценивает выраженность глобальной идентификации: ощущение связи с людьми разных стран, сходства с ними, взаимного влияния и принадлежности к человечеству. Подходит для взрослых респондентов; русская версия адаптирована Т. А. Нестиком и апробирована на российской выборке.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 6,
  scales: [{ key: 'globalIdentity', label: 'Глобальная идентичность', items: [1, 2, 3, 4, 5, 6, 7], reverseItems: [], aggregation: 'mean' }],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы на минимальном значении',
    answers: Object.fromEntries(itemTexts.map((_, index) => [String(index + 1), 1])),
    expected: { globalIdentity: 1 },
  },
  {
    title: 'Проверка среднего и отсутствия реверсивных пунктов',
    answers: { '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 6 },
    expected: { globalIdentity: 27 / 7 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'ghis-der-karabetian-ruiz-1997-nestik-2018-v1',
};
