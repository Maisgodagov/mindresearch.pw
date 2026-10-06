import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const responseOptions = [
  { value: '0', label: 'Всегда неверно' },
  { value: '1', label: 'Редко, когда это верно' },
  { value: '2', label: 'Иногда это верно' },
  { value: '3', label: 'Чаще всего это верно' },
  { value: '4', label: 'Всегда верно' },
];

const statements = [
  'Я расстраиваюсь, когда у меня появляется чувство, которое я не могу объяснить.',
  'В школе я хожу с урока на урок, не замечая то, что я делаю.',
  'Я себе нахожу занятия, чтобы не замечать своих мыслей и чувств.',
  'Я сам себя убеждаю, что я не должен чувствовать то, что я чувствую.',
  'Я отгоняю от себя мысли, которые мне не нравятся.',
  'Мне тяжело концентрироваться на чем-то одном.',
  'Я думаю о событиях, которые происходили в прошлом, вместо того, чтобы думать о том, что происходит сейчас.',
  'Меня расстраивают некоторые мои мысли.',
  'Я думаю, что некоторые из моих чувств — плохие и что мне не следует их иметь.',
  'Я подавляю в себе чувства, которые мне не нравятся.',
];

const questions: SeedSection['questions'] = statements.map((text, index) => ({
  code: `test_2125_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: responseOptions,
}));

const instrument: SeedSection = {
  code: 'test_2125',
  title: 'Шкала диспозиционной осознанности подростков (ШДОП; русскоязычная версия CAMM)',
  description: 'Методика оценивает диспозиционную осознанность подростков: внимание к происходящему в настоящем и отношение к собственным мыслям и чувствам, включая их принятие, оценивание и избегание. Может помочь автору опроса изучить эти особенности у подростков 13–15 лет; русская адаптация проверялась на этой возрастной группе.',
  questions,
};

const allItems = statements.map((_, index) => index + 1);
const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 4,
  scales: [{
    key: 'mindfulness',
    label: 'Диспозиционная осознанность',
    items: allItems,
    reverseItems: allItems,
    aggregation: 'sum',
  }],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы «всегда неверно»: после реверсирования сумма равна 40',
    answers: Object.fromEntries(allItems.map(item => [String(item), '0'])),
    expected: { mindfulness: 40 },
  },
  {
    title: 'Все ответы «иногда это верно»: нейтральные значения остаются 2, сумма равна 20',
    answers: Object.fromEntries(allItems.map(item => [String(item), '2'])),
    expected: { mindfulness: 20 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'camm-russian-adolescent-zotova-2020-reverse-all-sum-v1',
};
