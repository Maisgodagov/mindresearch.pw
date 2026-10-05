import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const responseOptions = [
  { value: '0', label: 'Совсем не согласен' },
  { value: '1', label: 'Скорее не согласен' },
  { value: '2', label: 'И согласен, и не согласен' },
  { value: '3', label: 'Скорее согласен, чем нет' },
  { value: '4', label: 'Полностью согласен' },
];

const items = [
  'Если люди узнают меня поближе, они поймут, какой я на самом деле, и отвергнут меня',
  'Неприятные чувства будут расти и выйдут из-под контроля',
  'Любые признаки напряжения в отношениях говорят о том, что отношения портятся, и тогда следует прекратить их',
  'Я несостоятелен и слаб',
  'Мне нужно, чтобы возле меня был кто-то, кто всегда помогал бы мне выполнять то, что мне нужно сделать, а также на случай, если произойдет что-то плохое',
  'Я беспомощен, если остаюсь один',
  'Я не могу справляться со всем, как другие',
  'Люди причинят мне зло, если я не опережу их и не причиню зло им',
  'На меня обратят внимание, только если я буду вести себя экстремальным образом',
  'Я не могу доверять другим людям',
  'Мне всегда нужно быть начеку',
  'Люди обманут и используют меня, если только я дам им шанс',
  'Люди часто говорят одно, а подразумевают что-то другое',
  'Близкий мне человек может оказаться неверным и предать меня',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_945_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: responseOptions,
}));

export const instrument: SeedSection = {
  code: 'test_945',
  title: 'Опросник дисфункциональных убеждений при ПРЛ (PBQ-BPD), русская адаптация',
  description: '14-пунктовый опросник оценивает выраженность дисфункциональных убеждений, связанных с пограничными чертами: недоверие к другим, зависимость от поддержки и защитные действия для предупреждения эксплуатации или отвержения. Три субшкалы помогают описывать профиль убеждений и намечать темы для дальнейшего клинического обсуждения; русская адаптация проверялась на русскоязычной популяционной выборке и применялась в интернет-опросе.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 4,
  scales: [
    { key: 'distrust', label: 'Недоверие', items: [10, 11, 12, 13, 14], reverseItems: [], aggregation: 'sum' },
    { key: 'dependence', label: 'Зависимость', items: [4, 5, 6, 7], reverseItems: [], aggregation: 'sum' },
    { key: 'protection', label: 'Защита', items: [1, 2, 3, 8, 9], reverseItems: [], aggregation: 'sum' },
    { key: 'total', label: 'Общий балл', items: Array.from({ length: 14 }, (_, i) => i + 1), reverseItems: [], aggregation: 'sum' },
  ],
};

const uniformAnswers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Все ответы «Совсем не согласен»', answers: uniformAnswers(0), expected: { distrust: 0, dependence: 0, protection: 0, total: 0 } },
  { title: 'Все ответы «Полностью согласен»', answers: uniformAnswers(4), expected: { distrust: 20, dependence: 16, protection: 20, total: 56 } },
  { title: 'Проверка шкал по распределению русской адаптации', answers: Object.fromEntries(items.map((_, index) => [String(index + 1), index + 1])), expected: { distrust: 60, dependence: 22, protection: 23, total: 105 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'pbq-bpd-ru-konina-kholmogorova-2016-v1',
};
