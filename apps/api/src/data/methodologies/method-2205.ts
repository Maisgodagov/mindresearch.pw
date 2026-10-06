import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const responseOptions = [
  { value: '1', label: 'Не согласен(-на)' },
  { value: '2', label: 'Редко' },
  { value: '3', label: 'Иногда' },
  { value: '4', label: 'Часто' },
  { value: '5', label: 'Полностью согласен(-на)' },
];

const items = [
  'Я чувствую себя единым целым с другими людьми',
  'Полагаю, что не вношу значимый вклад во что-либо',
  'У меня есть уверенность, что я влияю на ход событий в моей жизни',
  'Среди своего окружения я ощущаю себя лишним',
  'Люди прислушиваются к моему мнению',
  'В любой ситуации я чувствую поддержку хоть одного человека',
  'Я ощущаю себя изгоем',
  'Я совершенно точно управляю всем в своей жизни',
  'Мне кажется, большинство из моего окружения невысокого обо мне мнения',
  'Порой, кажется, что всё зависит от чьей-то чужой воли',
  'Общаясь с людьми, я чувствую себя неуверенно',
  'Такое ощущение, что общение с людьми — не моя сильная сторона',
  'Думаю, что общество, в котором я живу, принимает меня',
  'Я контролирую свою жизнь',
  'Я переживаю, что люди плохо думают обо мне',
  'Мне кажется, что моё участие в жизни окружающих очень важно',
  'Порой я ощущаю себя невидимкой',
  'Временами мне кажется, что от меня людям нет никакого толка',
  'Думаю, мое участие в чем-либо всегда полезно',
  'Такое ощущение, что у меня впереди еще много разных возможностей',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2226_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: responseOptions,
}));

export const instrument: SeedSection = {
  code: 'test_2226',
  title: 'Шкала нарушенных потребностей — Остракизм (ШНПО-ПМ)',
  description: 'Методика оценивает фрустрацию четырёх потребностей, связанных с переживанием социального остракизма: принадлежности (принятия), самоуважения, контроля и осмысленного существования. Подходит для подростков 14–18 лет и молодёжи 19–25 лет; профиль субшкал помогает автору опроса увидеть, какие именно стороны социального благополучия затронуты.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'belonging', label: 'Потребность в принятии (принадлежность)', items: [1, 4, 6, 7, 13], reverseItems: [4, 7], aggregation: 'mean' },
    { key: 'selfEsteem', label: 'Потребность в самоуважении', items: [5, 9, 11, 12, 15], reverseItems: [9, 11, 12, 15], aggregation: 'mean' },
    { key: 'control', label: 'Потребность в контроле', items: [3, 8, 10, 14, 20], reverseItems: [10], aggregation: 'mean' },
    { key: 'meaningfulExistence', label: 'Потребность в осмысленном существовании', items: [2, 16, 17, 18, 19], reverseItems: [2, 17, 18], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  { title: 'Все ответы «Не согласен(-на)»', answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])), expected: { belonging: 1.6, selfEsteem: 4.2, control: 1.8, meaningfulExistence: 3.4 } },
  { title: 'Все ответы «Полностью согласен(-на)»', answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 5])), expected: { belonging: 4.4, selfEsteem: 1.8, control: 4.2, meaningfulExistence: 2.6 } },
];

export const methodology: MethodologyRegistration = {
  categoryIds: ["social-loneliness"],
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'shnpo-pm-boykina-et-al-2024-v1',
};
