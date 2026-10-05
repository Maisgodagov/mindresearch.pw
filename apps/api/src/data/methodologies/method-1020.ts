import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const items = [
  'Мне будет стыдно за себя, если я не буду читать.',
  'Читать интересно.',
  'Я не хочу огорчать родителей и учителей.',
  'Я получаю удовольствие от чтения.',
  'Я буду чувствовать себя виноватым, если не буду этого делать.',
  'Я думаю, что чтение увлекательно.',
  'Я должен доказать себе, что могу получать хорошие оценки по чтению.',
  'Я думаю, что чтение — это интересно.',
  'Именно этого от меня ожидают родители.',
  'Я думаю, что чтение наполнено смыслом.',
  'Взрослые будут хвалить меня, только если я буду читать.',
  'Я считаю, что чтение очень полезно для меня.',
  'Старшие накажут меня, если я не буду читать.',
  'Для меня важно читать.',
  'Я не читаю в свободное время, так как не вижу в этом смысла.',
  'Я не понимаю, зачем мне читать в свободное время.',
  'Раньше я понимал, зачем мне читать, а сейчас не вижу в этом смысла.',
  'Я не люблю читать, мне это неинтересно.',
];

const options = [
  { value: '1', label: 'Совершенно не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Скорее не согласен' },
  { value: '4', label: 'Ни то, ни другое' },
  { value: '5', label: 'Скорее согласен' },
  { value: '6', label: 'Согласен' },
  { value: '7', label: 'Полностью согласен' },
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1050_${index + 1}`,
  text: index < 14
    ? `Я читаю в свободное время, потому что… ${text}`
    : text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1050',
  title: 'Опросник мотивации чтения школьников (5–9-е классы)',
  description: 'Опросник оценивает мотивацию чтения школьников 5–9-х классов в логике теории самодетерминации: автономную мотивацию, контролируемую мотивацию и амотивацию. Профиль помогает исследователю или автору опроса описать источники вовлечённости в чтение и оценивать изменения после мероприятий по её развитию.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'autonomous', label: 'Автономная мотивация', items: [2, 4, 6, 8, 10, 12, 14], reverseItems: [], aggregation: 'mean' },
    { key: 'controlled', label: 'Контролируемая мотивация', items: [1, 3, 5, 7, 9, 11, 13], reverseItems: [], aggregation: 'mean' },
    { key: 'amotivation', label: 'Амотивация', items: [15, 16, 17, 18], reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: одинаковые ответы по всем пунктам дают такое же среднее по каждой шкале',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), index % 7 + 1])),
    expected: { autonomous: 4, controlled: 4, amotivation: 4 },
  },
  {
    title: 'Ручная проверка: минимальный ответ по всем пунктам',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { autonomous: 1, controlled: 1, amotivation: 1 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'omcsh-sychev-et-al-2026-v1',
};
