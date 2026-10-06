import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  'Неверно',
  'Скорее неверно',
  'Нечто среднее',
  'Скорее верно',
  'Верно',
].map((label, index) => ({ value: String(index + 1), label }));

// Russian adaptation item numbers from the publication; excluded items are
// omitted from the published 29-item short form, and numbering remains source-based.
const sourceItems: { number: number; text: string; scale: string }[] = [
  { number: 1, scale: 'values', text: 'Я часто сомневаюсь в том, что значит для меня жизнь.' },
  { number: 3, scale: 'values', text: 'Я не знаю, почему мои мысли часто столь отличны от мнений других людей.' },
  { number: 4, scale: 'values', text: 'Мои родители и лучшие друзья (сверстники) порой имеют иные взгляды по некоторым вопросам, и мне всегда трудно дается обсуждение.' },
  { number: 8, scale: 'values', text: 'Меня вечно мучают противоречивые идеи.' },
  { number: 9, scale: 'values', text: 'Я не живу так, как хочу, и меня это расстраивает.' },
  { number: 11, scale: 'aspirations', text: 'Общество несправедливо ко мне.' },
  { number: 12, scale: 'aspirations', text: 'Я бы хотел(-а), чтобы моя семья была лучше, но не могу изменить это по определенным причинам.' },
  { number: 13, scale: 'aspirations', text: 'Я бы хотел(-а), чтобы у меня был шанс получить лучшее образование, но не могу реализовать это желание по определенным причинам.' },
  { number: 16, scale: 'aspirations', text: 'Мое качество жизни не такое высокое, как было раньше.' },
  { number: 17, scale: 'aspirations', text: 'Я бы хотел(-а) изменить свои текущие условия жизни, но не могу.' },
  { number: 18, scale: 'aspirations', text: 'Я бы хотел(-а) достичь высшей цели моей жизни, но не могу.' },
  { number: 19, scale: 'aspirations', text: 'Я бы хотел(-а) быть успешным(-ой), но в моей жизни слишком многое препятствует этому.' },
  { number: 21, scale: 'deprivation', text: 'По сравнению с другими людьми в моем районе, я бедный человек.' },
  { number: 22, scale: 'deprivation', text: 'По сравнению с другими семьями в моем окружении, моя семья бедная.' },
  { number: 23, scale: 'deprivation', text: 'Я верю, что я достаточно компетентен(-на), но я не удовлетворен(-а) тем, как со мной обращаются другие.' },
  { number: 24, scale: 'deprivation', text: 'У моей семьи нет денег, чтобы дать мне возможность учиться.' },
  { number: 26, scale: 'deprivation', text: 'Я обладаю теми же качествами, что и мои коллеги, но им платят гораздо больше, чем мне.' },
  { number: 27, scale: 'deprivation', text: 'У большинства людей вокруг меня лучшие и более комфортные условия работы.' },
  { number: 28, scale: 'deprivation', text: 'Я работаю усердно и мои результаты превосходны, но меня не ценят и не повышают, как других, кто не так хорошо справляется со своей работой.' },
  { number: 29, scale: 'deprivation', text: 'По сравнению с другими, мне труднее зарабатывать деньги.' },
  { number: 30, scale: 'deprivation', text: 'Я работал(-а) слишком много, а достиг(-ла) слишком мало.' },
  { number: 31, scale: 'coping', text: 'Для меня так важна моя репутация, что я готов(-а) на все, чтобы сохранить лицо, даже на самоубийство.' },
  { number: 32, scale: 'coping', text: 'Я не могу справляться со слишком многими проблемами одновременно.' },
  { number: 33, scale: 'coping', text: 'Когда я сталкиваюсь с кризисом, мой мозг обычно отключается.' },
  { number: 35, scale: 'coping', text: 'Я не могу забыть неприятный опыт, и чем больше я о нем думаю, тем хуже мне становится.' },
  { number: 36, scale: 'coping', text: 'Даже если проблемы незначительные, порой мне становится грустно и у меня опускаются руки.' },
  { number: 37, scale: 'coping', text: 'Когда у меня проблемы, мне трудно засыпать и я теряю аппетит.' },
  { number: 38, scale: 'coping', text: 'Когда я сталкиваюсь с трудностями, я обычно отказываюсь от задания.' },
  { number: 39, scale: 'coping', text: 'Когда у меня проблема, я всегда остаюсь один(-на) и отдаляюсь от людей.' },
  { number: 40, scale: 'coping', text: 'Справляясь с трудностями, я часто чувствую, что не контролирую ситуацию и не способен(-на) наверстать упущенное.' },
];

const questions: SeedSection['questions'] = sourceItems.map(item => ({
  code: `test_2541_${item.number}`,
  text: item.text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2541',
  title: 'Шкалы психологического напряжения (PSS), русская адаптация, 29 пунктов',
  description: 'Русская адаптация PSS оценивает напряжение, связанное с противоречивым жизненным опытом, в четырёх областях: конфликт ценностей, разрыв между стремлениями и обстоятельствами, относительные лишения и трудности совладания. Профиль помогает автору опроса исследовать эти источники напряжения у русскоязычных подростков старшего возраста и взрослых; опубликованная адаптация проверялась на студенческой и клинической выборках. Показатели не являются самостоятельным прогнозом суицидального поведения.',
  questions,
};

const scaleItems = (scale: string) => sourceItems.flatMap((item, index) => item.scale === scale ? [index + 1] : []);

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'values', label: 'Напряжение ценностей', items: scaleItems('values'), reverseItems: [], aggregation: 'mean' },
    { key: 'aspirations', label: 'Напряжение стремлений', items: scaleItems('aspirations'), reverseItems: [], aggregation: 'mean' },
    { key: 'deprivation', label: 'Напряжение лишений', items: scaleItems('deprivation'), reverseItems: [], aggregation: 'mean' },
    { key: 'coping', label: 'Напряжение совладания', items: scaleItems('coping'), reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: ответ 1 по всем пунктам даёт среднее 1 по четырём шкалам',
    answers: Object.fromEntries(sourceItems.map((_, index) => [String(index + 1), '1'])),
    expected: { values: 1, aspirations: 1, deprivation: 1, coping: 1 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['clinical-s-risk'],
  scoringConfig,
  validationCases,
  formulaVersion: 'zhang-pss-russian-adaptation-29-four-subscales-mean-v1',
};
