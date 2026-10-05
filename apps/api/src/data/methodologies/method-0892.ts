import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const responseOptions = [
  { value: '0', label: 'Очень редко или никогда' },
  { value: '1', label: 'Иногда' },
  { value: '2', label: 'Значительную часть времени' },
  { value: '3', label: 'Практически всё время' },
];

const items = [
  'Я нервничаю по поводу того, что раньше меня не беспокоило.',
  'Я не получаю удовольствия от еды, у меня плохой аппетит.',
  'Несмотря на помощь друзей и членов моей семьи, мне не удается избавиться от чувства тоски.',
  'Мне кажется, что я не хуже других.',
  'Мне трудно сконцентрироваться на том, чем приходится заниматься.',
  'Я чувствую подавленность.',
  'Всё, что я делаю, требует от меня дополнительных усилий.',
  'Я надеюсь на хорошее будущее.',
  'Мне кажется, что моя жизнь сложилась неудачно.',
  'Я испытываю беспокойство, страхи.',
  'У меня плохой ночной сон.',
  'Я чувствую себя счастливым человеком.',
  'Кажется, что я стал меньше говорить.',
  'Меня беспокоит чувство одиночества.',
  'Окружающие настроены недружелюбно ко мне.',
  'Жизнь доставляет мне удовольствие.',
  'Я легко могу заплакать.',
  'Я испытываю грусть, хандру.',
  'Мне кажется, люди меня не любят.',
  'У меня нет сил и желания начинать что-либо делать.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_922_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: responseOptions,
}));

export const instrument: SeedSection = {
  code: 'test_922',
  title: 'Опросник депрессивности CES-D',
  description: 'CES-D — скрининговая шкала самоотчёта для оценки выраженности депрессивных симптомов за последнюю неделю. Двадцать пунктов охватывают сниженное настроение и тоску, положительный аффект, соматические проявления и усилия/активность, а также межличностное неблагополучие. Эта русская редакция предназначена для взрослых и подростков примерно с 10–11 лет; результат отражает выраженность симптомов и не устанавливает диагноз.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 3,
  scales: [
    {
      key: 'depression',
      label: 'Выраженность депрессивных симптомов (CES-D)',
      items: Array.from({ length: 20 }, (_, index) => index + 1),
      reverseItems: [4, 8, 12, 16],
      aggregation: 'sum',
    },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Минимальная выраженность: отрицательные пункты редко, положительные часто',
    answers: Object.fromEntries(Array.from({ length: 20 }, (_, index) => [String(index + 1), [4, 8, 12, 16].includes(index + 1) ? 3 : 0])),
    expected: { depression: 0 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'ces-d-radloff-1977-russian-psytests-form-v1',
};
