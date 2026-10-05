import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Да' },
  { value: '0', label: 'Нет' },
];

const items = [
  'Что бы со мной ни случилось, я всё переживу.',
  'Я должен(должна) выжить, несмотря ни на что.',
  'Когда я (я) взбешен(а), вид крови может успокоить меня.',
  'Многое меня просто «бесит».',
  'Мне глубоко безразлично, что дальше со мной будет.',
  'Мне кажется, что я просто невыносимо устаю от такой жизни.',
  'Иногда хочется заснуть и не проснуться.',
  'Стараюсь никогда не падать духом.',
  'Мне на всё хочется наплевать.',
  'Мне хочется уйти и не вернуться.',
  'Мне очень трудно сейчас жить.',
  'В трудных ситуациях стараюсь не падать духом.',
  'Из любой ситуации всегда найду выход.',
  'Все мои усилия бессмысленны.',
  'Нет смысла жить.',
  'Нет сил терпеть всё это.',
  'Чувствую: «Я уже не жилец на этом свете».',
  'Я люблю жизнь.',
  'Ко мне многие хорошо относятся.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1711_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1711',
  title: 'Суицидная личность, СЛ-19',
  description: 'Методика П. И. Юнацкевича оценивает выраженность признаков суицидального риска по самоотчётным утверждениям о переживании жизненных трудностей, истощении и безразличии, раздражительности, стремлении к выживанию, надежде и отношении к жизни. Авторская версия содержит мужской и женский варианты; формулировки здесь объединены в доступную гендерно-инклюзивную форму для взрослых респондентов. Балл служит материалом для профессиональной оценки, а не самостоятельным прогнозом или диагнозом.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 1,
  scales: [
    {
      key: 'suicideRisk',
      label: 'Суицидальный риск (сумма совпадений с ключом)',
      items: Array.from({ length: 19 }, (_, index) => index + 1),
      reverseItems: [1, 2, 8, 12, 13, 18, 19],
      aggregation: 'sum',
      itemScores: Object.fromEntries(Array.from({ length: 19 }, (_, index) => {
        const item = index + 1;
        const riskYes = [3, 4, 5, 6, 7, 9, 10, 11, 14, 15, 16, 17].includes(item);
        return [item, { '1': riskYes ? 1 : 0, '0': riskYes ? 0 : 1 }];
      })),
    },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная сверка: ответы совпадают с ключом на всех пунктах',
    answers: Object.fromEntries(Array.from({ length: 19 }, (_, index) => {
      const item = index + 1;
      return [String(item), [3, 4, 5, 6, 7, 9, 10, 11, 14, 15, 16, 17].includes(item) ? '1' : '0'];
    })),
    expected: { suicideRisk: 19 },
  },
  {
    title: 'Ручная сверка: противоположные ключу ответы',
    answers: Object.fromEntries(Array.from({ length: 19 }, (_, index) => {
      const item = index + 1;
      return [String(item), [3, 4, 5, 6, 7, 9, 10, 11, 14, 15, 16, 17].includes(item) ? '0' : '1'];
    })),
    expected: { suicideRisk: 0 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'sl-19-yunatskevich-2018-table-2-2-v1',
};
