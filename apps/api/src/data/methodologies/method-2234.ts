import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Абсолютно не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Затрудняюсь с ответом' },
  { value: '4', label: 'Согласен' },
  { value: '5', label: 'Полностью согласен' },
];

const items = [
  'Я часто сравниваю собственные жизненные достижения с достижениями других людей.',
  'Если я хочу узнать больше о чём-то, я стараюсь разузнать мнение других людей по этому вопросу.',
  'Когда я что-то делаю, я уделяю много внимания тому, как это делают другие, и сравниваю.',
  'Я часто сравниваю близких мне людей (друга, подругу, членов семьи и пр.) с другими людьми.',
  'Я всегда хочу знать, как поступили бы другие люди в ситуации, подобной моей.',
  'Я не тот, кто постоянно сравнивает себя с другими.',
  'Если я хочу понять, насколько хорошо я справился с чем-либо, я сравниваю свой результат с результатами других людей.',
  'Я часто стараюсь узнать, что думают другие люди, сталкиваясь с проблемами, подобными моим.',
  'Я люблю обмениваться с другими людьми опытом или мнениями.',
  'Я никогда не сравниваю происходящее в моей жизни с тем, что происходит у других.',
  'Я часто сравниваю своё социальное положение (социальные навыки, популярность) с аналогичными показателями других людей.',
];

const reverseItems = [6, 10];
const questionSet: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2252_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

const instrument: SeedSection = {
  code: 'test_2252',
  title: 'Шкала ориентации на социальные сравнения (INCOM), русская версия Гаранян',
  description: 'INCOM оценивает индивидуальную склонность сравнивать себя с другими людьми. Русская версия включает сравнения достижений, способностей, мнений, опыта и социального положения; опубликованная адаптация проверялась на российской студенческой молодёжи. Шкала полезна авторам опросов, изучающим межличностные различия в ориентации на социальную информацию; баллы сами по себе не являются клиническим заключением.',
  questions: questionSet,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'total', label: 'Общая ориентация на социальные сравнения', items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], reverseItems, aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: нейтральные ответы дают 33 балла после реверса',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 3])),
    expected: { total: 33 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['trait-interpersonal'],
  scoringConfig,
  validationCases,
  formulaVersion: 'incom-ru-garanyan-2016-reverse-6-10-v1',
};
