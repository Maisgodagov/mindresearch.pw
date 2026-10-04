import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Полностью не согласен' },
  { value: '2', label: 'В основном не согласен' },
  { value: '3', label: 'Скорее не согласен' },
  { value: '4', label: 'Скорее согласен' },
  { value: '5', label: 'В основном согласен' },
  { value: '6', label: 'Полностью согласен' },
];

const items = [
  'Я считаю, что, по большому счету, заслуживаю того, что происходит со мной.',
  'Как правило, жизнь ко мне справедлива.',
  'Я верю, что обычно получаю то, что заслуживаю.',
  'В моей жизни в общем и целом все происходит справедливо.',
  'В моей жизни несправедливость — скорее исключение, чем правило.',
  'Я считаю, что в целом в моей жизни все справедливо.',
  'Я думаю, что важные решения, которые касаются меня, обычно справедливы.',
  'Я считаю, что в целом мир справедлив.',
  'Я считаю, что, по большому счету, люди получают то, что заслуживают.',
  'Я уверен, что справедливость всегда побеждает несправедливость.',
  'Я убежден, что, если человек пережил несправедливость, в будущем это возместится.',
  'Я твердо уверен, что несправедливость в самых разных жизненных ситуациях (в семье, в учебе и т.д.) — скорее исключение, чем правило.',
  'Я думаю, что все, кто принимает важные решения, стремятся быть справедливыми.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_329_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

const instrument: SeedSection = {
  code: 'test_329',
  title: 'Шкала веры в справедливый мир',
  description: 'Опросник оценивает веру в справедливость мира по отношению к самому человеку и общую веру в справедливость мироустройства. Две субшкалы помогают автору опроса различать ожидание справедливого обращения с собой и представление о том, что люди в целом получают по заслугам; русская версия С. К. Нартовой-Бочавер и соавторов подходит для подростков и взрослых.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 6,
  scales: [
    { key: 'personal', label: 'Вера в справедливость по отношению к себе (ВСМличн)', items: [1, 2, 3, 4, 5, 6, 7], reverseItems: [], aggregation: 'mean' },
    { key: 'general', label: 'Вера в общую справедливость мира (ВСМобщ)', items: [8, 9, 10, 11, 12, 13], reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы на минимальном уровне согласия',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { personal: 1, general: 1 },
  },
  {
    title: 'Личная вера максимальна, общая вера минимальна',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), index < 7 ? 6 : 1])),
    expected: { personal: 6, general: 1 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'dalbert-bjw-nartova-bochaver-2013-13item-two-means-v1',
};
