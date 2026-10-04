import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const frequencyOptions = [
  { value: '1', label: 'Никогда или очень редко' },
  { value: '2', label: 'Промежуточная неназванная градация' },
  { value: '3', label: 'Промежуточная неназванная градация' },
  { value: '4', label: 'Промежуточная неназванная градация' },
  { value: '5', label: 'Очень часто' },
];
const agreementOptions = [
  { value: '1', label: 'Совершенно не согласен' },
  { value: '2', label: 'Промежуточная неназванная градация' },
  { value: '3', label: 'Промежуточная неназванная градация' },
  { value: '4', label: 'Промежуточная неназванная градация' },
  { value: '5', label: 'Совершенно согласен' },
];
const items = [
  'Обычно я добиваюсь того, чего хочу',
  'Переходили ли вы в детстве границы дозволенного, делая то, что ваши родители вам запрещали?',
  'Как часто завершение какого-либо дела вдохновляло вас на дальнейшее продолжение работы в этом направлении?',
  'Как часто вы «играли на родительских нервах», когда были ребенком?',
  'Слушались ли вы ваших родителей?',
  'Как часто в детстве вы совершали поступки, которые ваши родители явно не одобряли?',
  'Как часто вы преуспеваете в ваших начинаниях?',
  'Я бываю неосторожен',
  'Как часто при решении важной для вас задачи вам кажется, что вы справляетесь хуже, чем хотели бы?',
  'Я чувствую, что двигаюсь к достижению успеха в своей жизни',
  'В моей жизни мало хобби и увлечений, отвечающих моим интересам, заниматься которыми мне действительно хочется',
];
const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_281_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: index < 9 ? frequencyOptions : agreementOptions,
}));

export const instrument: SeedSection = {
  code: 'test_281',
  title: 'Диагностика фокуса регуляции (RFQ), русскоязычная адаптация',
  description: 'Опросник измеряет выраженность двух мотивационных систем саморегуляции: фокуса продвижения, связанного с достижением желаемых результатов и успеха, и фокуса профилактики, связанного с соблюдением требований и избеганием нежелательных исходов. Пункты охватывают переживания и поведение в текущих и детских ситуациях. Русскоязычная адаптация Гершкович и соавторов предназначена для юношей и девушек 17–23 лет; результаты помогают автору опроса описать мотивационные ориентации, а не поставить диагноз.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'promotion', label: 'Фокус продвижения', items: [1, 3, 7, 9, 10, 11], reverseItems: [9, 11], aggregation: 'sum' },
    { key: 'prevention', label: 'Фокус профилактики', items: [2, 4, 5, 6, 8], reverseItems: [2, 4, 6, 8], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [{
  title: 'Вручную проверено по формулам ключа: promotion=18, prevention=14',
  answers: { '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 1, '7': 2, '8': 3, '9': 4, '10': 5, '11': 1 },
  expected: { promotion: 18, prevention: 14 },
}];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'rfq-ru-gershkovich-moroshkina-kulieva-nasledov-2019-v1',
};
