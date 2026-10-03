import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'Нет' },
  { value: '1', label: 'Да' },
];

const items = [
  'Учитель умеет точно предсказать успехи своих учеников.',
  'Мне трудно ладить с учителем.',
  'Учитель — справедливый человек.',
  'Учитель умело готовит меня к контрольным и экзаменам.',
  'Учителю явно не хватает чуткости в отношениях с людьми.',
  'Слово учителя для меня закон.',
  'Учитель тщательно планирует работу со мной.',
  'Я вполне доволен учителем.',
  'Учитель недостаточно требователен ко мне.',
  'Учитель всегда может дать разумный совет.',
  'Я полностью доверяю учителю.',
  'Оценка учителя очень важна для меня.',
  'Учитель в основном работает по шаблону.',
  'Работать с учителем — одно удовольствие.',
  'Учитель уделяет мне мало внимания.',
  'Учитель, как правило, не учитывает моих индивидуальных особенностей.',
  'Учитель плохо чувствует мое настроение.',
  'Учитель всегда выслушивает мое мнение.',
  'У меня нет сомнений в правильности и необходимости методов и средств, которые применяет учитель.',
  'Я не стану делиться с учителем своими мыслями.',
  'Учитель наказывает меня за малейший проступок.',
  'Учитель хорошо знает мои слабые и сильные стороны.',
  'Я хотел бы стать похожим на учителя.',
  'У нас с учителем чисто деловые отношения.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_120_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_120',
  title: 'Анкета «Учитель — ученик»',
  description: "Анкета описывает отношение учащегося к конкретному учителю по трём сторонам: пониманию и оценке учителя, эмоциональному отношению и поведению во взаимодействии. Профиль помогает увидеть, какие стороны контакта воспринимаются положительно или проблемно.",
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 1,
  scales: [
    { key: 'gnostic', label: 'Гностический параметр', items: [1, 4, 7, 10, 13, 16, 19, 22], reverseItems: [13, 16], aggregation: 'sum' },
    { key: 'emotional', label: 'Эмоциональный параметр', items: [2, 5, 8, 11, 14, 17, 20, 23], reverseItems: [2, 5, 17, 20], aggregation: 'sum' },
    { key: 'behavioral', label: 'Поведенческий параметр', items: [3, 6, 9, 12, 15, 18, 21, 24], reverseItems: [9, 15, 21, 24], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: все ответы «Нет»; баллы равны количеству ключевых ответов «Нет» по каждой шкале',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 0])),
    expected: { gnostic: 2, emotional: 4, behavioral: 4 },
  },
  {
    title: 'Ручная проверка: все ответы «Да»; баллы равны количеству ключевых ответов «Да» по каждой шкале',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { gnostic: 6, emotional: 4, behavioral: 4 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'rogov-teacher-student-24-item-binary-key-v1',
};
