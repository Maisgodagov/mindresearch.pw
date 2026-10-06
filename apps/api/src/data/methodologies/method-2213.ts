import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Совсем не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Частично согласен, частично не согласен' },
  { value: '4', label: 'Согласен' },
  { value: '5', label: 'Полностью согласен' },
];

const items = [
  'Я беспокоюсь, что из-за развития технологий моя профессия в будущем будет не нужна',
  'Я беспокоюсь, что моя профессия может исчезнуть из-за автоматизации труда и применения других технологий',
  'Существует риск, что мне придется сменить свою профессию из-за автоматизации и применения других технологий',
  'Я беспокоюсь, что в дальнейшем (через 5-10 лет) мне придется сменить профессию из-за развития технологий',
  'Я думаю, что моя профессия претерпит существенные изменения в связи с развитием технологий',
  'Некоторые из задач, которые я выполняю в рамках своей профессии, в будущем будут не актуальны',
  'Я уверен, что до того, как я выйду на пенсию, мои профессиональные обязанности значительно модифицируются из-за технологических изменений',
  'В будущем в рамках моей профессии мне нужно будет выполнять задачи, к которым я на данный момент недостаточно подготовлен',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2229_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2229',
  title: 'Шкала ненадежности профессии (русскоязычная адаптация OCIS)',
  description: 'Методика измеряет психологическую ненадежность профессии в условиях технологических изменений по двум отдельным аспектам: беспокойству о будущем и возможной утрате профессии, а также ожиданию существенных изменений ее задач и обязанностей. Подходит для опросов работающих взрослых о восприятии влияния автоматизации и других технологий на их профессию; это русскоязычная адаптация Дёмина и соавторов 2025 года.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'futureConcern', label: 'Беспокойство о будущем профессии', items: [1, 2, 3, 4], reverseItems: [], aggregation: 'mean' },
    { key: 'contentChange', label: 'Ожидание содержательных изменений в профессии', items: [5, 6, 7, 8], reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  { title: 'Ручная проверка: минимальное согласие по всем пунктам', answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])), expected: { futureConcern: 1, contentChange: 1 } },
  { title: 'Ручная проверка: максимальное согласие по всем пунктам', answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 5])), expected: { futureConcern: 5, contentChange: 5 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['cyberpsychology'],
  scoringConfig,
  validationCases,
  formulaVersion: 'ocis-ru-demin-2025-two-subscale-means-v1',
  details: {
    title: instrument.title,
    author: 'L. C. Roll, H. De Witte, H.-J. Wang; русскоязычная адаптация: А. Н. Дёмин, Е. И. Зыкова, А. В. Рендакова, С. А. Погорелов',
    version: 'Русскоязычная адаптация, 8 пунктов',
    year: 2025,
    summary: instrument.description!,
    adaptation: 'Перевод и адаптация Occupation Insecurity Scale; использованы 8 пунктов русскоязычной версии после психометрического сокращения.',
    rightsNote: 'Формулировки русскоязычной адаптации приведены по приложению к научной статье Дёмина и соавторов, опубликованной по лицензии CC BY-NC 4.0.',
    steps: ['Для каждого утверждения выберите степень согласия от «Совсем не согласен» до «Полностью согласен».'],
    keys: [
      { label: 'Беспокойство о будущем профессии', value: 'Среднее ответов на пункты 1–4' },
      { label: 'Ожидание содержательных изменений в профессии', value: 'Среднее ответов на пункты 5–8' },
    ],
    notes: ['Две субшкалы отражают разные аспекты и не объединяются в общий показатель. Обратных пунктов нет.', 'В статье для описательной группировки указано: среднее выше 3 означает высокую оценку ненадежности; это не диагностический порог.'],
    sources: [
      { title: 'Дёмин А. Н., Зыкова Е. И., Рендакова А. В., Погорелов С. А. Шкала ненадежности профессии: русскоязычная адаптация и валидизация (2025)', url: 'https://journals.rudn.ru/psychology-pedagogics/article/view/46370' },
      { title: 'Русский бланк OCIS: прохождение шкалы на PsyTests', url: 'https://psytests.org/cyber/ocis-run.html' },
      { title: 'Roll L. C., De Witte H., Wang H.-J. Conceptualization and Validation of the Occupation Insecurity Scale (OCIS) (2023)', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9916280/' },
    ],
  },
};
