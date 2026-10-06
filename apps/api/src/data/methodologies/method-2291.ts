import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Никогда' },
  { value: '2', label: 'Редко' },
  { value: '3', label: 'Иногда' },
  { value: '4', label: 'Часто' },
  { value: '5', label: 'Всегда' },
];

const items = [
  'Меня беспокоит усталость.',
  'Я очень быстро устаю.',
  'Я не делаю много дел в течение дня.',
  'У меня достаточно энергии для повседневной жизни.',
  'Я чувствую физическое истощение.',
  'Мне трудно начать что-нибудь делать.',
  'Мне трудно думать четко и ясно.',
  'У меня нет никакого желания что-нибудь делать.',
  'Я чувствую умственное истощение.',
  'Когда я делаю что-нибудь, я могу довольно хорошо сконцентрироваться.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2309_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2309',
  title: 'Шкала оценки усталости (Fatigue Assessment Scale, FAS), русская версия',
  description: 'FAS оценивает выраженность общей усталости, охватывая физические проявления утомления и снижения активности, а также умственные проявления — трудности начала деятельности, ясного мышления и концентрации. Русскоязычная версия предназначена для взрослых и клинических групп; её можно использовать для описания симптома и его выраженности в медицинских опросах.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [{
    key: 'fatigue',
    label: 'Общая усталость',
    items: items.map((_, index) => index + 1),
    reverseItems: [4, 10],
    aggregation: 'sum',
  }],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ответ 1 по всем пунктам: обратные пункты перекодируются в 5; сумма 18',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { fatigue: 18 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['clinical-somatic'],
  scoringConfig,
  validationCases,
  formulaVersion: 'fatigue-assessment-scale-russian-v1',
};
