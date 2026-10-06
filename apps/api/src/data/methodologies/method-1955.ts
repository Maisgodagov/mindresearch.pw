import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Полностью не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Скорее не согласен' },
  { value: '4', label: 'Скорее согласен' },
  { value: '5', label: 'Согласен' },
  { value: '6', label: 'Полностью согласен' },
];

const statements = [
  'Чем старше я становлюсь, тем лучше мне кажется жизнь.',
  'Сейчас я проживаю самый унылый период моей жизни.',
  'Я счастлив так же, как и в молодости.',
  'Моя жизнь нравилась бы мне больше, если бы она не была такой скучной.',
  'Моя жизнь могла бы быть счастливее, чем сейчас.',
  'Все, что я делаю, кажется мне скучным или однообразным.',
  'Я надеюсь, что в будущем меня ждут интересные и радостные события.',
  'Мои повседневные дела интересны мне так же, как и прежде.',
  'Моя жизнь прекрасна.',
  'Мои дела в полном порядке.',
  'Оглядываясь на прошлое, я испытываю чувство удовлетворения.',
  'Мне нравится все то, чем я сейчас занимаюсь.',
];

const questions: SeedSection['questions'] = statements.map((text, index) => ({
  code: `test_1971_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1971',
  title: 'Удовлетворенность жизнью в «третьем возрасте» (LSITA-SF)',
  author: 'L. L. Barrett и P. H. Murk; русская адаптация — Е. В. Золотарева и соавторы',
  version: 'Русская адаптация краткой формы LSITA-SF, 2022',
  description: 'Краткая шкала оценивает общую удовлетворенность жизнью у русскоязычных людей в «третьем возрасте» (от 50 лет). Пункты охватывают оценку настоящего и прошлого, интерес к повседневным занятиям, бодрость/скуку и ожидания будущего; суммарный показатель помогает автору опроса изучать субъективное благополучие этой возрастной группы.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 6,
  scales: [
    { key: 'life_satisfaction', label: 'Удовлетворенность жизнью в «третьем возрасте»', items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], reverseItems: [2, 4, 5, 6], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: все ответы 1; четыре обратных пункта преобразуются в 6, сумма равна 44',
    answers: Object.fromEntries(statements.map((_, index) => [String(index + 1), 1])),
    expected: { life_satisfaction: 44 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'lsita-sf-ru-2022-reverse-2-4-5-6-v1',
};
