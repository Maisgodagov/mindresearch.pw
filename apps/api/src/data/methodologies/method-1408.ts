import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'никогда' },
  { value: '1', label: 'редко' },
  { value: '2', label: 'иногда' },
  { value: '3', label: 'часто' },
  { value: '4', label: 'всегда' },
];

const items = [
  'Как часто вы думаете о том, чтобы отомстить своим обидчикам?',
  'Как часто у вас возникают идеи относительно новых способов наказания тех людей, которые этого заслуживают?',
  'Как часто у вас возникают идеи о том, как избавиться от тех, кто мешает осуществлению ваших планов?',
  'Как часто вы наносите вред кому-либо новым, оригинальным способом?',
  'Как часто у вас появляются мысли о новых способах причинения вреда другим в этом грубом, жестоком мире?',
  'Как часто вы обманываете других для того, чтобы решить проблемную ситуацию?',
  'Как часто вы придумываете отговорки, чтобы оправдать собственные поступки?',
  'Как часто у вас появляется беспокойство, что при обмане кого-либо ваша ложь может быть раскрыта?',
  'Как часто вы думаете о том, чтобы скрыть неблаговидные поступки от окружающих?',
  'Как часто у вас возникают мысли зло пошутить?',
  'Как часто вы пытаетесь злыми шутками отомстить другим?',
  'Как часто у вас возникают идеи нарушить правила, когда общепринятые способы не работают?',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1436_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1436',
  title: 'Поведенческие особенности антисоциальной креативности (MCBS)',
  description: 'Русскоязычная адаптация MCBS оценивает поведенческие проявления вредоносного креативного потенциала по трём аспектам: нанесение вреда, ложь и злые шутки. Версия опубликована для исследовательского и практического применения; использовалась на разнородных выборках взрослых и учащихся, включая студентов, школьников старших классов, кадетов и профессиональные группы. Баллы описывают частоту поведения и не являются диагностическим заключением.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 4,
  scales: [
    { key: 'harm', label: 'Нанесение вреда', items: [1, 2, 3, 4, 5, 6], reverseItems: [], aggregation: 'sum' },
    { key: 'lies', label: 'Ложь', items: [7, 8, 9, 12], reverseItems: [], aggregation: 'sum' },
    { key: 'meanJokes', label: 'Злые шутки', items: [10, 11, 12], reverseItems: [], aggregation: 'sum' },
    { key: 'total', label: 'Интегральный показатель антисоциальной креативности', items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  { title: 'Все ответы «никогда»', answers: Object.fromEntries(items.map((_, i) => [String(i + 1), 0])), expected: { harm: 0, lies: 0, meanJokes: 0, total: 0 } },
  { title: 'Все ответы «всегда»', answers: Object.fromEntries(items.map((_, i) => [String(i + 1), 4])), expected: { harm: 24, lies: 16, meanJokes: 12, total: 48 } },
  { title: 'Ручная сверка: только пункт 12 отмечен «часто»', answers: Object.fromEntries(items.map((_, i) => [String(i + 1), i === 11 ? 3 : 0])), expected: { harm: 0, lies: 3, meanJokes: 3, total: 3 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'mcbs-ru-meshkova-enikolopov-2018-v1',
};
