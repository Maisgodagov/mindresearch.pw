import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Совершенно не согласен' },
  { value: '2', label: 'Скорее не согласен' },
  { value: '3', label: 'В чем-то согласен, в чем-то нет' },
  { value: '4', label: 'Скорее согласен' },
  { value: '5', label: 'Совершенно согласен' },
];

const statements = [
  'Говорить про свою национальную гордость у меня никогда не получалось.',
  'Есть народы, которые у меня вызывают отвращение.',
  'Когда я думаю о своей национальности, я испытываю чувства гордости и любви.',
  'Это не очень правильно — разделять людей по национальной принадлежности.',
  'Я ощущаю родство с людьми своей национальности.',
  'Разделение на национальности вредит обществу.',
  'Национальность. Да, она у меня есть, но она для меня ничего не определяет, не решает.',
  'Есть такие национальности, среди которых почти все плохие люди.',
  'Мне не нравится, когда рядом какой-то человек начинает говорить на своем (не нашем) языке.',
  'Люди моей национальности как «родственные души» воспринимаются.',
  'Деление людей на национальности порождает непонимание, беспорядок, конфликты.',
  'Есть такие национальности, к которым я испытываю презрение.',
  'Для меня моя национальность не играет роли в повседневной жизни.',
  'Национальность есть, но это не очень важно.',
];

const questions: SeedSection['questions'] = statements.map((text, index) => ({
  code: `test_2526_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2526',
  title: 'Шкала этнонациональных установок',
  description: 'Методика измеряет установки по отношению к национальности как этничности: неприязнь к представителям других национальностей, гордость и чувство родства со своей группой, нейтральность к собственной национальной принадлежности и отрицание значимости деления на национальности. Четыре отдельных показателя помогают автору опроса описывать профиль межгрупповых установок в российском контексте. Опубликованная версия проверялась преимущественно на подростках и молодых взрослых; статья сообщает выборки от 14 лет и указывает, что скалярная инвариантность по полу не была достигнута.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'nationalistic', label: 'Националистические установки', items: [2, 8, 9, 12], reverseItems: [], aggregation: 'mean' },
    { key: 'patriotic', label: 'Патриотические установки', items: [1, 3, 5, 10], reverseItems: [1], aggregation: 'mean' },
    { key: 'neutral', label: 'Нейтральные этнонациональные установки', items: [7, 13, 14], reverseItems: [], aggregation: 'mean' },
    { key: 'negativistic', label: 'Негативистские этнонациональные установки', items: [4, 6, 11], reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: нейтральный ответ во всех пунктах; обратный пункт 1 перекодируется в 3',
    answers: Object.fromEntries(Array.from({ length: 14 }, (_, index) => [String(index + 1), 3])),
    expected: { nationalistic: 3, patriotic: 3, neutral: 3, negativistic: 3 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['social-culture'],
  scoringConfig,
  validationCases,
  formulaVersion: 'khukhlaev-kuznetsov-tkachenko-2018-enas-v1',
};
