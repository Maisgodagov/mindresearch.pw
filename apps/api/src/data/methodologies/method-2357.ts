import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Почти никогда' },
  { value: '2', label: 'Иногда' },
  { value: '3', label: 'Часто' },
  { value: '4', label: 'Почти всегда' },
];

const items = [
  'Думаете, как одиноко Вы себя чувствуете',
  'Думаете «Я не смогу делать свою работу, если не выйду из этого состояния»',
  'Думаете, каким больным и усталым (какой больной и усталой) Вы себя чувствуете',
  'Думаете, как Вам трудно сосредоточиться',
  'Думаете «Чем я заслужил/заслужила это?»',
  'Думаете, каким апатичным и безразличным (какой апатичной и безразличной) Вы себя чувствуете',
  'Анализируете недавние события, пытаясь понять причину своего состояния',
  'Думаете о том, что Вы уже никогда ничего не сможете чувствовать',
  'Думаете «Почему я не могу выйти из этого состояния?»',
  'Думаете «Почему я всегда реагирую таким образом?»',
  'Уходите от всех и думаете, почему Вы так себя чувствуете',
  'Записываете свои мысли и анализируете их',
  'Обдумываете недавнюю ситуацию и жалеете, что она разрешилась не лучшим образом',
  'Думаете «Я не смогу сосредоточиться, если и дальше буду так себя чувствовать»',
  'Думаете «Почему у меня проблемы, которых нет у других людей?»',
  'Думаете «Почему я не могу справляться с таким состоянием лучше?»',
  'Думаете о том, как Вам грустно',
  'Думаете обо всех Ваших недостатках, неудачах, промахах и ошибках',
  'Думаете о том, что Вам не хочется ничего делать',
  'Анализируете Вашу личность, пытаясь понять, почему Вы в таком состоянии',
  'Уединяетесь, чтобы обдумать свои чувства',
  'Думаете о том, как Вы недовольны собой',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2375_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2375',
  title: 'Шкала руминаций (RRS), русскоязычная версия',
  description: 'Полная 22-пунктовая русскоязычная версия RRS оценивает склонность к руминированию в печальном или подавленном состоянии. Она охватывает депрессивные руминации, тягостные навязчивые размышления и рефлексивный анализ состояния. Подходит для исследовательской и специалистской оценки взрослых и подростков от 16 лет; показатели могут ситуативно колебаться и сами по себе не являются диагнозом.',
  categoryIds: ['framework-cbt'],
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 4,
  scales: [
    { key: 'total', label: 'Общий показатель руминаций', items: Array.from({ length: 22 }, (_, i) => i + 1), reverseItems: [], aggregation: 'mean' },
    { key: 'burdensome', label: 'Тягостные навязчивые размышления', items: [5, 10, 13, 15, 16], reverseItems: [], aggregation: 'mean' },
    { key: 'depressive', label: 'Руминации, связанные с депрессией', items: [1, 2, 3, 4, 6, 8, 14, 17, 18, 19, 22], reverseItems: [], aggregation: 'mean' },
    { key: 'reflexive', label: 'Рефлексивные руминации', items: [7, 11, 12, 20, 21], reverseItems: [], aggregation: 'mean' },
  ],
};

const answers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Ручная проверка: все ответы «Почти никогда» дают средние 1', answers: answers(1), expected: { total: 1, burdensome: 1, depressive: 1, reflexive: 1 } },
  { title: 'Ручная проверка: все ответы «Почти всегда» дают средние 4', answers: answers(4), expected: { total: 4, burdensome: 4, depressive: 4, reflexive: 4 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'rrs-22-ru-dorosheva-2025-v1',
};
