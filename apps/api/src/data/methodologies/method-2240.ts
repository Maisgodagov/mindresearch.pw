import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const answers = [
  { value: '1', label: 'Полностью не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Где-то посередине' },
  { value: '4', label: 'Согласен' },
  { value: '5', label: 'Полностью согласен' },
];

const items = [
  'Когда я строю планы, я уверен, что смогу их осуществить.',
  'Я обычно верю, что все получится.',
  'Я думаю, я контролирую, в каком направлении развивается моя жизнь.',
  'Я очень рад будущим возможностям и сложным задачам.',
  'У меня много идей и планов на будущее.',
  'Иногда мне страшно и мне кажется, я теряю контроль, когда думаю о том, что жизнь может мне принести.',
  'Я спокойно принимаю, что в жизни со мной будут происходить и хорошие, и плохие вещи.',
  'Я знаю, что могу преодолеть препятствия, с которыми сталкиваюсь в жизни.',
  'Для меня каждый день – это новая возможность.',
  'Я чувствую надежду на то, что может принести будущее.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2258_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: answers,
}));

const instrument: SeedSection = {
  code: 'test_2258',
  title: 'Шкала открытости будущему (OFS), русскоязычная адаптация',
  description: 'Однофакторная шкала оценивает позитивную открытость человека будущему: ожидания и надежду, ощущение контроля и способности справляться с препятствиями, принятие неопределенности, вовлеченность в жизнь и планы. Русскоязычная адаптация предназначена для взрослых и подростков; опубликованная проверка включала общую выборку и социально уязвимые группы, поэтому нормативные выводы для широкой популяции ограничены.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [{
    key: 'openness_to_future',
    label: 'Открытость будущему',
    items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    reverseItems: [6],
    aggregation: 'sum',
  }],
};

const allAnswers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Минимальные ответы, включая обратное кодирование пункта 6', answers: allAnswers(1), expected: { openness_to_future: 14 } },
  { title: 'Максимальные ответы, включая обратное кодирование пункта 6', answers: allAnswers(5), expected: { openness_to_future: 46 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['trait-goal'],
  scoringConfig,
  validationCases,
  formulaVersion: 'ofs-khegay-zolotareva-2023-ru-v1',
};
