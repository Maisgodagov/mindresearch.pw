import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const statements = [
  'Я знаю, как изменить то, что я хочу изменить в своей жизни',
  'Я хорошо чувствую, куда ведет меня жизнь',
  'Если я хочу что-то изменить в моей жизни, то я это делаю',
  'Я могу выбрать роль, которую хотел бы играть в группе',
  'Я знаю, что мне нужно сделать, чтобы начать движение к поставленной цели',
  'У меня есть конкретный план действий, который поможет мне достичь поставленных целей',
  'Я несу ответственность за свою жизнь',
  'Я знаю, какой уникальный вклад и во что я могу сделать',
  'У меня есть план того, как сделать мою жизнь более сбалансированной',
];

const options = [
  { value: '1', label: 'Определенно не согласен' },
  { value: '2', label: 'В целом не согласен' },
  { value: '3', label: 'До определенной степени (в чем-то) не согласен' },
  { value: '4', label: 'До определенной степени (в чем-то) согласен' },
  { value: '5', label: 'В целом согласен' },
  { value: '6', label: 'Определенно согласен' },
];

const questions: SeedSection['questions'] = statements.map((text, index) => ({
  code: `test_2162_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2162',
  title: 'Шкала инициативы к личностному росту (PGIS), русскоязычная версия',
  description: 'Оценивает выраженность инициативы человека в позитивных изменениях и личностном росте: понимание желаемых изменений, направленность, готовность действовать, целеполагание и планирование, ответственность и представление о личном вкладе. Русскоязычная версия для взрослых; опубликованное исследование включало участников 17–66 лет.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 6,
  scales: [{ key: 'total', label: 'Общая инициатива к личностному росту', items: [1, 2, 3, 4, 5, 6, 7, 8, 9], reverseItems: [], aggregation: 'sum' }],
};

const answers = (value: number) => Object.fromEntries(statements.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Все ответы — определенно не согласен', answers: answers(1), expected: { total: 9 } },
  { title: 'Все ответы — определенно согласен', answers: answers(6), expected: { total: 54 } },
  { title: 'Проверка смешанных ответов', answers: { '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 1, '8': 2, '9': 3 }, expected: { total: 27 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'pgis-ru-semenov-elshansky-2016-v1',
};
