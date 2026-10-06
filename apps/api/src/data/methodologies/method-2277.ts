import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const responseOptions = [
  { value: '0', label: 'Никогда или очень редко' },
  { value: '1', label: 'Иногда' },
  { value: '2', label: 'Часто' },
  { value: '3', label: 'Очень часто' },
];

const items = [
  'Неспособен удерживать внимание на деталях из-за чего допускает ошибки при выполнении школьных заданий и других видах деятельности',
  'Проявляет бесцельную двигательную активность: бегает, прыгает, пытается куда-то залезть часто в неприемлемых ситуациях',
  'Теряет свои вещи',
  'Не может тихо спокойно играть или заниматься чем-либо на досуге',
  'Способен концентрировать внимание только на вещах, представляющих интерес',
  'При необходимости сидеть на одном месте крутится, вертится, беспокойно двигает руками или ногами',
  'Обычно не заканчивает начатое дело до конца',
  'Болтлив, часто говорит взахлеб, болтовней надоедает окружающим',
  'Легко отвлекается на посторонние раздражители',
  'Предпочитает подвижные игры, во время которых неадекватно шумен (кричит, топает ногами, хлопает в ладоши и т.п.)',
  'Избегает (выражает недовольство) при выполнении заданий, требующих длительного сохранения внимания',
  'На вопросы отвечает не задумываясь, часто не выслушав их до конца',
  'Неспособен придерживаться инструкций и выполнить до конца задание без организующей помощи взрослых',
  'Неспособен ждать, дожидаться своей очереди в различных групповых ситуациях',
  'Временами не слушает обращенную к нему речь, кажется, что он не слышит',
  'Вмешивается в разговоры старших или игры других детей, перебивает, мешает',
  'Забывчив в повседневной деятельности, без злого умысла нарушает одни и те же правила, требования распорядка дня',
  'Нетерпелив, возникшее желание немедленно реализует или настаивает на выполнении другими',
] as const;

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2295_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: responseOptions,
}));

export const instrument: SeedSection = {
  code: 'test_2295',
  title: 'Шкала оценки СДВГ по критериям МКБ-10 (родительская версия)',
  description: 'Шкала Сухотиной и Егоровой оценивает наблюдаемые родителями симптомы невнимательности, гиперактивности и импульсивности у детей 6–13 лет в повседневных ситуациях. Профиль субшкал и общий балл помогают автору опроса описать выраженность этих проявлений и отслеживать их динамику; результаты предназначены для скрининговой и клинической оценки специалистом, а не для самостоятельной постановки диагноза.',
  categoryIds: ['clinical-adhd'],
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 3,
  scales: [
    { key: 'inattention', label: 'Невнимательность', items: [1, 3, 5, 7, 9, 11, 13, 15, 17], reverseItems: [], aggregation: 'sum' },
    { key: 'hyperactivity', label: 'Гиперактивность', items: [2, 4, 6, 8, 10], reverseItems: [], aggregation: 'sum' },
    { key: 'impulsivity', label: 'Импульсивность', items: [12, 14, 16, 18], reverseItems: [], aggregation: 'sum' },
    { key: 'total', label: 'Общий балл', items: Array.from({ length: 18 }, (_, index) => index + 1), reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: по ключу пункты 1, 2, 12 получают 3, 2, 1 балл; остальные — 0',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), index === 0 ? 3 : index === 1 ? 2 : index === 11 ? 1 : 0])),
    expected: { inattention: 3, hyperactivity: 2, impulsivity: 1, total: 6 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'sukhotina-egorova-2008-icd10-parent-18-0to3-domain-sums-v1',
};
