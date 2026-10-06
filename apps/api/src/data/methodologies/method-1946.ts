import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const answers = ['Никогда', 'Редко', 'Иногда', 'Часто', 'Очень часто'].map((label, index) => ({
  value: String(index),
  label,
}));

const items = [
  'Мне важно чувствовать себя частью коллектива',
  'Мне нравится участвовать в делах класса и внеклассных мероприятиях',
  'Я всегда понимаю, как вести себя в разных социальных ситуациях',
  'Во взаимодействии со сверстниками я проявляю свою индивидуальность и не стремлюсь быть похожим на других',
  'Я стремлюсь к саморазвитию',
  'Я знаю, как себя вести в обществе других людей',
  'Я умею находить баланс между индивидуальными и общественными ценностями',
  'В общении со сверстниками я следую социальным нормам',
  'Я думаю о последствиях своих действий',
  'Мне важно, как окружающие меня оценивают',
  'Я поступаю так, чтобы не навредить другим',
  'Я обладаю знаниями и пониманием стратегий и техник, необходимых для успешной адаптации в новом коллективе',
  'Мне легко общаться с людьми, у которых взгляды на жизнь отличаются от моих',
  'Мне легко понимать намерения и эмоции других людей.',
  'Мне легко выражать свои мысли и чувства в процессе общения',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1962_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: answers,
}));

export const instrument: SeedSection = {
  code: 'test_1962',
  title: 'Трудности социализации',
  description: 'Опросник оценивает выраженность трудностей социализации у подростков через ценностно-мотивационный, когнитивный и поведенческий (деятельностный) компоненты. Он помогает исследователю или автору опроса увидеть профиль субъективных затруднений во взаимодействии с социальным окружением; опубликованная версия предназначена для подростков 12–17 лет.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 4,
  scales: [
    { key: 'value_motivation', label: 'Ценностно-мотивационный компонент', items: [1, 5, 7, 10, 13], reverseItems: [], aggregation: 'sum' },
    { key: 'cognitive', label: 'Когнитивный компонент', items: [3, 6, 9, 12, 14], reverseItems: [], aggregation: 'sum' },
    { key: 'behavioral', label: 'Поведенческий (деятельностный) компонент', items: [2, 4, 8, 11, 15], reverseItems: [], aggregation: 'sum' },
    { key: 'total', label: 'Общий балл', items: Array.from({ length: 15 }, (_, index) => index + 1), reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы «Никогда» дают нулевые суммы',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 0])),
    expected: { value_motivation: 0, cognitive: 0, behavioral: 0, total: 0 },
  },
  {
    title: 'По одному максимальному ответу в каждом компоненте',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), [1, 3, 5].includes(index + 1) ? 4 : 0])),
    expected: { value_motivation: 4, cognitive: 4, behavioral: 4, total: 12 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'samokhvalova-socialization-difficulties-adolescent-2025-v1',
};
