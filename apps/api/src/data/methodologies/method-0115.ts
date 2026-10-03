import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const responseLabels = [
  'Полностью не согласен',
  'Скорее не согласен',
  'Нечто среднее',
  'Скорее согласен',
  'Полностью согласен',
];

// Русский бланк FAD-Plus (Моспан и Леонтьев, 2021), пункты сохранены в порядке источника.
const items = [
  'Я верю, что будущее уже предопределено судьбой.',
  'Биологические свойства людей определяют их таланты и личность.',
  'Человеческая история управляется в основном случайностями.',
  'Люди полностью контролируют те решения, которые они принимают.',
  'Как бы вы ни старались, вы не можете изменить свою судьбу.',
  'Психологи и психиатры рано или поздно смогут предсказывать всё поведение людей.',
  'Никто не может предвидеть, что произойдет в этом мире.',
  'Люди должны нести полную ответственность за плохие выборы, которые они делают.',
  'У судьбы для каждого есть свой план.',
  'Ваши гены определяют ваше будущее.',
  'Жизнь не более предсказуема, чем кидание монетки или костей.',
  'Люди в состоянии преодолеть любые препятствия, если действительно захотят.',
  'Что случится, то случится, и мы мало что можем с этим поделать.',
  'Наука выяснила, насколько ваш интеллект и личность зависят от среды, в которой вы росли.',
  'Люди непредсказуемы.',
  'Преступники несут полную ответственность за то плохое, что они делают.',
  'Нравится это людям или нет, их жизнью управляют скрытые силы.',
  'Поведение людей, как и остальных животных, всегда подчиняется законам природы.',
  'Жизнь трудно предвидеть, потому что она полна случайностей.',
  'Удача играет большую роль в жизни людей.',
  'Люди обладают полной свободой воли.',
  'Характер родителей определяет характер их детей.',
  'Люди всегда сами виноваты в своих дурных поступках.',
  'От среды, в которой вы росли в детстве, зависят ваши успехи во взрослом возрасте.',
  'То, что происходит с людьми, зависит от случая.',
  'Сила рассудка всегда может преодолеть желания тела.',
  'Наше будущее нельзя предвидеть.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_153_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: responseLabels.map((label, optionIndex) => ({ value: String(optionIndex + 1), label })),
}));

export const instrument: SeedSection = {
  code: 'test_153',
  title: 'Вера в свободу/детерминизм (FAD-Plus)',
  description: "Шкала оценивает убеждения о свободе воли и детерминизме: насколько человек считает поведение результатом личного выбора, предопределённых причин или влияния обстоятельств. Профиль отражает философские представления респондента, а не его психическое здоровье.",
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'fatalisticDeterminism', label: 'Фаталистический детерминизм', items: [1, 5, 9, 13, 17], reverseItems: [], aggregation: 'sum' },
    { key: 'freeWill', label: 'Свобода воли', items: [4, 8, 12, 16, 21, 23, 26], reverseItems: [], aggregation: 'sum' },
    { key: 'unpredictability', label: 'Непредсказуемость', items: [3, 7, 11, 15, 19, 20, 25, 27], reverseItems: [], aggregation: 'sum' },
    { key: 'scientificDeterminism', label: 'Научный детерминизм', items: [2, 6, 10, 14, 18, 22, 24], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы равны 1: суммы равны числу пунктов каждой шкалы',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { fatalisticDeterminism: 5, freeWill: 7, unpredictability: 8, scientificDeterminism: 7 },
  },
  {
    title: 'Все ответы равны 5: суммы равны пяти баллам за каждый пункт шкалы',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 5])),
    expected: { fatalisticDeterminism: 25, freeWill: 35, unpredictability: 40, scientificDeterminism: 35 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'fad-plus-mospan-leontiev-2021-four-subscale-sums-v1',
};
