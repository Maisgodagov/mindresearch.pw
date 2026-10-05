import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const responseOptions = [
  { value: '1', label: 'Категорически не подходит' },
  { value: '2', label: 'Не подходит' },
  { value: '3', label: 'Затрудняюсь ответить' },
  { value: '4', label: 'Подходит' },
  { value: '5', label: 'Определенно подходит' },
];

const items = [
  'У меня были трудности с засыпанием, даже когда мой ребенок спал',
  'Я чувствовала себя совсем одинокой',
  'Я много плакала без видимой причины',
  'Я не могла сконцентрироваться на чем-либо',
  'Я не знала, кто я есть',
  'Я ощущала себя плохой матерью',
  'Я начала думать, что лучше бы мне умереть',
  'Я потеряла аппетит',
  'Я чувствовала себя перегруженной',
  'Я боялась, что никогда не буду счастлива снова',
  'Я чувствовала, что теряла свой разум',
  'Мне казалось, будто я стала чужой себе',
  'Я чувствовала, что многие матери были лучше меня',
  'Я думала, что смерть может быть единственным выходом из этого кошмара',
  'Я просыпалась среди ночи и не могла заснуть снова',
  'Я ощущала, что выскакиваю из кожи вон',
  'Я чувствовала, что мои эмоции берут верх надо мной',
  'Мне казалось, что я схожу с ума',
  'Я боялась, что никогда не буду нормальной снова',
  'Я чувствовала вину, т.к. не ощущала достаточной любви к ребенку',
  'Мне хотелось повредить себя',
  'Я ворочалась и крутилась длительное время ночью в надежде заснуть',
  'Я беспокоилась по малейшему поводу, касающемуся моего ребенка',
  'Я была очень раздражена',
  'Я испытывала трудности, принимая даже простое решение',
  'Я чувствовала, что была не такой, как обычно',
  'Я чувствовала, что должна скрывать мысли и чувства относительно ребенка',
  'Мне казалось, что моему ребенку будет лучше без меня',
  'Я знала, что должна есть, но не могла',
  'Я чувствовала, что должна что-нибудь постоянно делать',
  'Я чувствовала, что полна гневом, готова взорваться',
  'Мне было трудно сосредоточиться над заданием',
  'Я не ощущала реальности',
  'Я чувствовала, что не была той матерью, которой мне хотелось быть',
  'Мне хотелось оставить этот мир',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1620_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: responseOptions,
}));

export const instrument: SeedSection = {
  code: 'test_1620',
  title: 'Скрининг-шкала постнатальной депрессии (СШПД, PDSS), русская адаптация В. В. Голубович',
  description: 'Скрининговый самоопросник для оценки выраженности признаков постнатальной депрессии у женщин после родов. Охватывает нарушения сна и аппетита, тревогу, эмоциональную неустойчивость, когнитивные трудности, потерю ощущения себя, вину и мысли о самоповреждении. Результат помогает описать профиль симптомов и определить необходимость клинической оценки; предназначен для русской адаптации Голубович (2003), оценка относится к последним двум неделям.',
  questions,
};

const itemRange = (start: number) => [start, start + 7, start + 14, start + 21, start + 28];
const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: минимальный балл по всем пунктам',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), '1'])),
    expected: { total: 35, sleep_appetite: 5, anxiety: 5, emotional_lability: 5, cognitive_difficulties: 5, loss_of_self: 5, guilt: 5, self_harm_thoughts: 5 },
  },
  {
    title: 'Ручная проверка: максимальный балл по всем пунктам',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), '5'])),
    expected: { total: 175, sleep_appetite: 25, anxiety: 25, emotional_lability: 25, cognitive_difficulties: 25, loss_of_self: 25, guilt: 25, self_harm_thoughts: 25 },
  },
];

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'total', label: 'Общий балл СШПД', items: Array.from({ length: 35 }, (_, index) => index + 1), reverseItems: [], aggregation: 'sum' },
    { key: 'sleep_appetite', label: 'Нарушения сна и аппетита', items: itemRange(1), reverseItems: [], aggregation: 'sum' },
    { key: 'anxiety', label: 'Тревога', items: itemRange(2), reverseItems: [], aggregation: 'sum' },
    { key: 'emotional_lability', label: 'Эмоциональная неустойчивость', items: itemRange(3), reverseItems: [], aggregation: 'sum' },
    { key: 'cognitive_difficulties', label: 'Когнитивные трудности', items: itemRange(4), reverseItems: [], aggregation: 'sum' },
    { key: 'loss_of_self', label: 'Потеря себя', items: itemRange(5), reverseItems: [], aggregation: 'sum' },
    { key: 'guilt', label: 'Вина', items: itemRange(6), reverseItems: [], aggregation: 'sum' },
    { key: 'self_harm_thoughts', label: 'Суицидальные тенденции', items: itemRange(7), reverseItems: [], aggregation: 'sum' },
  ],
};

export { validationCases };

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'pdss-golubovich-2003-35-item-direct-sum-v1',
};
