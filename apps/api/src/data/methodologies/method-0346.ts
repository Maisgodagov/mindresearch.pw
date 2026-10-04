import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'Полностью не согласен' },
  { value: '1', label: 'Не согласен' },
  { value: '2', label: 'Частично согласен' },
  { value: '3', label: 'Согласен' },
  { value: '4', label: 'Полностью согласен' },
];

const items = [
  'Для меня важно не выглядеть нервным.',
  'Когда я не могу сосредоточиться на задаче, я беспокоюсь, что схожу с ума.',
  'Меня пугает, когда мое сердце быстро бьется.',
  'Когда у меня болит живот, я беспокоюсь, что могу быть серьезно болен.',
  'Меня пугает, когда я не в состоянии сконцентрироваться на задаче.',
  'Когда я весь дрожу от страха в присутствии других людей, я боюсь того, что они подумают обо мне.',
  'Когда я чувствую напряжение в груди, мне страшно, что я не смогу нормально дышать.',
  'Когда у меня болит в груди, я беспокоюсь, что у меня вот-вот случится сердечный приступ.',
  'Я беспокоюсь, что другие люди заметят мою тревожность.',
  'Когда у меня возникает ощущение рассеянности или отсутствия сосредоточенности, я беспокоюсь, что могу быть психически больным.',
  'Меня пугает, когда я краснею перед людьми.',
  'Когда я замечаю, что мое сердце бьется неравномерно, я беспокоюсь, что со мной что-то серьезно не так.',
  'Когда я начинаю потеть на глазах у других, я боюсь, что люди подумают обо мне плохо.',
  'Когда мне кажется, что мои мысли начинают «скакать», я беспокоюсь, что я могу сойти с ума.',
  'Когда я ощущаю, как мое горло сжимается, я беспокоюсь, что могу задохнуться.',
  'Когда я не могу мыслить ясно, я беспокоюсь, что со мной что-то не так.',
  'Я думаю, что для меня было бы ужасно потерять сознание на публике.',
  'Когда я впадаю в ступор, я беспокоюсь, что со мной случилось что-то страшное.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_377_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_377',
  title: 'Индекс чувствительности к тревоге — 3 (ASI-3), русскоязычная версия',
  description: 'ASI-3 оценивает чувствительность к тревоге — склонность воспринимать проявления тревоги как опасные. Три подшкалы охватывают страх последствий телесных симптомов, когнитивных затруднений и заметных для окружающих проявлений тревоги. Русскоязычная версия апробирована на студенческой выборке 18–29 лет; результаты вне этой группы требуют дополнительной проверки.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 4,
  scales: [
    { key: 'social', label: 'Социальные опасения', items: [1, 6, 9, 11, 13, 17], reverseItems: [], aggregation: 'sum' },
    { key: 'cognitive', label: 'Когнитивные опасения', items: [2, 5, 10, 14, 16, 18], reverseItems: [], aggregation: 'sum' },
    { key: 'physical', label: 'Физические опасения', items: [3, 4, 7, 8, 12, 15], reverseItems: [], aggregation: 'sum' },
    { key: 'total', label: 'Интегральный показатель ASI-3', items: Array.from({ length: 18 }, (_, index) => index + 1), reverseItems: [], aggregation: 'sum' },
  ],
};

const answers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Все ответы минимальны', answers: answers(0), expected: { social: 0, cognitive: 0, physical: 0, total: 0 } },
  { title: 'Все ответы максимальны', answers: answers(4), expected: { social: 24, cognitive: 24, physical: 24, total: 72 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'asi-3-merzlyakov-chelnokova-savitskaya-2024-ru-v1',
};
