import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const answers = [
  { value: '1', label: 'Абсолютно не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Скорее не согласен' },
  { value: '4', label: 'Нечто среднее' },
  { value: '5', label: 'Скорее согласен' },
  { value: '6', label: 'Согласен' },
  { value: '7', label: 'Абсолютно согласен' },
];

const items = [
  'Характер и способности [название группы] у них в крови.',
  'Только [название группы] способен понять мысли и чувства другого [название группы].',
  'В толпе прохожих [название группы] виден невооруженным глазом.',
  'Ты либо [название группы], либо нет — третьего не дано, нельзя быть «немного [название группы]».',
  'Несмотря на то что [название группы] отличаются друг от друга по поведению и внешности, по существу они очень похожи.',
  'Всех [название группы] объединяет что-то глубинное, без чего они бы не были [название группы].',
  'Можно многое сказать о человеке, узнав, что он [название группы].',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2356_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: answers,
}));

export const instrument: SeedSection = {
  code: 'test_2356',
  title: 'Шкала психологического эссенциализма',
  description: 'Русскоязычная шкала оценивает, насколько человек воспринимает принадлежность к заданной социальной группе как врожденную, неизменную и основанную на общей сущности. Пункты охватывают представления о врожденных свойствах, дискретных границах членства, сходстве и глубинном единстве членов группы, а также выводах о человеке по его групповой принадлежности. Версия из разработки Агадуллиной и Чумаковой предназначена для исследований восприятия социальных групп у взрослых; конкретную оцениваемую группу указывают вместо шаблона [название группы].',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [{
    key: 'essentialism',
    label: 'Психологический эссенциализм',
    items: [1, 2, 3, 4, 5, 6, 7],
    reverseItems: [],
    aggregation: 'mean',
  }],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Вручную проверено: все семь ответов минимальны; среднее равно 1',
    answers: { '1': 1, '2': 1, '3': 1, '4': 1, '5': 1, '6': 1, '7': 1 },
    expected: { essentialism: 1 },
  },
  {
    title: 'Вручную проверено: ответы 1–7 дают сумму 28 и среднее 4',
    answers: { '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7 },
    expected: { essentialism: 4 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['social-culture'],
  scoringConfig,
  validationCases,
  formulaVersion: 'agadullina-chumakova-psychological-essentialism-2017-7item-mean-v1',
};
