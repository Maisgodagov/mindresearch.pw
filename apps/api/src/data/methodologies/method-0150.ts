import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'Никто' },
  { value: '1', label: 'Меньшинство' },
  { value: '2', label: 'Половина' },
  { value: '3', label: 'Большинство' },
  { value: '4', label: 'Все' },
];

const itemTexts = [
  'Ради того, чтобы принять участие в обсуждении важных вопросов',
  'Чтобы лучше узнать о том, что радует и беспокоит одноклассников',
  'Потому что собрание будут снимать для телевидения',
  'Потому что вашему классу поручено оформление зала, где будет происходить общешкольное мероприятие',
  'Если на собрании будут обсуждаться интересные вопросы',
  'Если явка строго обязательна и будет проверка',
  'Ради того, чтобы купить на заработанные деньги игрушки для детского сада',
  'Чтобы вместе потрудиться и после вместе отдохнуть',
  'Чтобы поддержать честь своего класса, организующего этот десант',
  'Ради денег, которые выплатят каждому участнику',
  'Потому что работа будет интересной',
  'Если явка строго обязательна и контролируется',
  'Чтобы заработать деньги для перечисления их в детский дом',
  'Чтобы и летом иметь возможность общаться с одноклассниками',
  'Ради денег, которые будут получены за работу каждым учащимся',
  'Если в лагерь труда и отдыха решили ехать всем классом',
  'Ради интересной жизни в лагере',
  'Если поездка в лагерь обязательна',
  'Если его цель – сбор краеведческого материала для музея',
  'Ради того, чтобы побыть вместе на природе',
  'Если каждый участник получит памятный значок туриста',
  'Если поход – часть турслета, который организует ваш коллектив',
  'Просто потому, что интересно',
  'Если участие в нем строго контролируется',
  'Потому что вечер запланирован для ветеранов войны',
  'Чтобы и после уроков побыть вместе',
  'Если во время вечера будет устроено чаепитие',
  'Если коллектив вашего класса приложил много сил для его подготовки',
  'Потому что программа вечера очень интересна',
  'Если явка строго обязательна',
];

const questions: SeedSection['questions'] = itemTexts.map((text, index) => ({
  code: `test_187_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_187',
  title: 'Выявление мотивов участия учащихся в делах коллектива',
  description: 'Модифицированный вариант методики О. В. Лишина. Ответьте, сколько одноклассников примет участие в каждом из перечисленных дел: никто, меньшинство, половина, большинство или все.',
  questions,
};

const scales = [
  { key: 'publicSignificance', label: 'Общественно полезная значимость', items: [1, 7, 13, 19, 25] },
  { key: 'personalBenefit', label: 'Личная выгода', items: [3, 10, 15, 21, 27] },
  { key: 'communicationInterest', label: 'Интерес к общению', items: [2, 8, 14, 20, 26] },
  { key: 'collectiveSignificance', label: 'Значимость для коллектива', items: [4, 9, 16, 22, 28] },
  { key: 'activityInterest', label: 'Интерес к содержанию деятельности', items: [5, 11, 17, 23, 29] },
  { key: 'compulsion', label: 'Обязательность как принуждение', items: [6, 12, 18, 24, 30] },
];

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 4,
  scales: scales.map(({ key, label, items }) => ({ key, label, items, reverseItems: [], aggregation: 'sum' })),
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы «Никто»',
    answers: Object.fromEntries(itemTexts.map((_, index) => [String(index + 1), 0])),
    expected: Object.fromEntries(scales.map(({ key }) => [key, 0])),
  },
  {
    title: 'Проверка ключа и шести блоков',
    answers: Object.fromEntries(itemTexts.map((_, index) => [String(index + 1), index === 0 ? 4 : index === 6 ? 3 : 0])),
    expected: { publicSignificance: 7, personalBenefit: 0, communicationInterest: 0, collectiveSignificance: 0, activityInterest: 0, compulsion: 0 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'lishin-class-collective-motives-30-ru-v1',
};
