import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const statements = [
  'Посещение мечети (или церкви, или костела и т.п.) во время богослужения для меня – самое важное в жизни',
  'У меня возникают конфликты с моими ближними из-за количества времени, которое я провожу в мечети (или в церкви и т.д.)',
  'Я иду в мечеть (или в церковь и т.д.), чтобы испытать радость, отвлечься от моих проблем',
  'В последнее время я провожу все больше времени с верующими людьми (на богослужениях, на служении людям нашей общины, на молитвенных мероприятиях и т.д.)',
  'Если по какой-то причине я не могу посетить богослужение, то испытываю уныние, раздражительность, упадок сил',
  'Я понимаю, что в жизни есть и другие важные вещи: работа, семья, образование и т.д., поэтому время от времени пытаюсь сократить время, которое уделяю на духовную деятельность',
];

const options = [
  { value: '1', label: 'я далек от этого' },
  { value: '2', label: 'это не про меня' },
  { value: '3', label: 'иногда думаю, что это так' },
  { value: '4', label: 'узнаю себя' },
  { value: '5', label: 'да, это обо мне' },
];

const allItems = statements.map((_, index) => index + 1);
const questions: SeedSection['questions'] = statements.map((statement, index) => ({
  code: `test_1202_${index + 1}`,
  text: statement,
  type: 'single',
  required: true,
  options,
}));

const instrument: SeedSection = {
  code: 'test_1202',
  title: 'Опросник религиозной аддикции (Н. Н. Телепова)',
  description: 'Шестипунктовый опросник оценивает признаки зависимого отношения к религиозной практике и сообществу: центральность богослужений, конфликты из-за времени, использование религиозной активности для облегчения переживаний, нарастание вовлечённости, реакцию на невозможность посещения и попытки ограничить духовную деятельность. Предназначен для самоотчёта; в опубликованном бланке результат используется как ориентировочный признак высокой вероятности религиозной аддикции.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [{ key: 'religiousAddiction', label: 'Суммарный балл (6–30)', items: allItems, aggregation: 'sum' }],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: все ответы «я далек от этого» дают 6 баллов',
    answers: Object.fromEntries(allItems.map(item => [String(item), 1])),
    expected: { religiousAddiction: 6 },
  },
  {
    title: 'Ручная проверка порога: четыре ответа 5 и два ответа 4 дают 28 баллов',
    answers: { '1': 5, '2': 5, '3': 5, '4': 5, '5': 4, '6': 4 },
    expected: { religiousAddiction: 28 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'telepova-religious-addiction-6-ru-v1',
};
