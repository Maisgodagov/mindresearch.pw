import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Полностью не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Ни то, ни другое' },
  { value: '4', label: 'Согласен' },
  { value: '5', label: 'Полностью согласен' },
];

const items = [
  'Я могу быть целиком поглощен размышлениями о моих делах.',
  'Меня легко задеть насмешками и пренебрежением.',
  'Входя в аудиторию, я становлюсь застенчивым и ощущаю на себе взгляды других людей.',
  'Мне не нравится разделять свои достижения и успехи с другими людьми.',
  'Я считаю, что у меня и так достаточно забот и дел, чтобы думать о проблемах других.',
  'Мне кажется, что я отличаюсь от большинства людей.',
  'Я часто принимаю на свой счет замечания других людей.',
  'Я легко погружаюсь в свои дела, забывая о существовании других людей.',
  'Мне неуютно быть в группе, когда я не уверен, что нравлюсь хотя бы одному человеку.',
  'Меня раздражает, когда люди обращаются ко мне со своими проблемами, желая получить помощь и поддержку.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2403_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

const instrument: SeedSection = {
  code: 'test_2403',
  title: 'Шкала сензитивного нарциссизма (HSNS)',
  description: 'HSNS оценивает выраженность сензитивного (уязвимого, скрытого) нарциссизма в неклиническом диапазоне личностных различий. Пункты охватывают чувствительность к насмешкам и оценке окружающих, застенчивость, погружённость в собственные заботы и интересы, потребность в признании и нежелание делить успехи или откликаться на проблемы других. Русский вариант адаптирован Корниенко и Ничепорук (2025); исходная шкала разработана для исследований взрослых, в том числе студенческих выборок. Результат отражает черту и сам по себе не является клиническим диагнозом.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'hsns_total', label: 'Сензитивный нарциссизм — общий балл', items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], reverseItems: [], aggregation: 'sum' },
  ],
};

const answers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Все ответы — 1 (минимальная сумма)', answers: answers(1), expected: { hsns_total: 10 } },
  { title: 'Все ответы — 5 (максимальная сумма)', answers: answers(5), expected: { hsns_total: 50 } },
  { title: 'Ручная проверка суммы: 1–10 по порядку', answers: Object.fromEntries(items.map((_, index) => [String(index + 1), index + 1 <= 5 ? 1 : 2])), expected: { hsns_total: 15 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['trait-dark'],
  scoringConfig,
  validationCases,
  formulaVersion: 'hsns-ru-kornienko-nicheporuk-2025-v1',
};
