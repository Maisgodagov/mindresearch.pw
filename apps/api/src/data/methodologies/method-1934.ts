import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = Array.from({ length: 11 }, (_, value) => ({
  value: String(value),
  label: String(value),
}));

const items = [
  'Мне порой не хватает выдержки.',
  'Если мои желания мешают мне, то я умею их подавлять.',
  'Родители (как более взрослые люди) должны устраивать семейную жизнь своих детей.',
  'Я иногда преувеличиваю свою роль в каких-либо событиях.',
  'Меня провести нелегко.',
  'Мне бы понравилось быть воспитателем.',
  'Бывает, мне хочется подурачиться, как маленькому.',
  'Думаю, что я правильно понимаю все происходящие события.',
  'Каждый должен выполнять свой долг.',
  'Нередко я поступаю не как надо, а как хочется.',
  'Принимая решение, я стараюсь продумать его последствия.',
  'Младшее поколение должно учиться у старших, как ему следует жить.',
  'Я, как и многие люди, бываю обидчив.',
  'Мне удается видеть в людях больше, чем они говорят о себе.',
  'Дети должны беспрекословно следовать указаниям родителей.',
  'Я — увлекающийся человек.',
  'Мой основной критерий оценки человека — объективность.',
  'Мои взгляды непоколебимы.',
  'Бывает, что я не уступаю в споре лишь потому, что не хочу уступать.',
  'Правила оправданны лишь до тех пор, пока они полезны.',
  'Люди должны соблюдать все правила независимо от обстоятельств.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1950_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1950',
  title: 'Трансактный анализ общения',
  description: 'Опросник описывает, какое из трёх эго-состояний чаще проявляется в общении: Дитя (непосредственные и эмоциональные реакции), Взрослый (рациональная оценка и учёт последствий) или Родитель (нормативность, наставничество и контроль). Подходит для саморефлексии взрослых и общего обсуждения стилей межличностного общения; результаты показывают относительное сочетание трёх позиций, а не диагноз.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 10,
  scales: [
    { key: 'child', label: 'Дитя (Д)', items: [1, 4, 7, 10, 13, 16, 19], reverseItems: [], aggregation: 'sum' },
    { key: 'adult', label: 'Взрослый (В)', items: [2, 5, 8, 11, 14, 17, 20], reverseItems: [], aggregation: 'sum' },
    { key: 'parent', label: 'Родитель (Р)', items: [3, 6, 9, 12, 15, 18, 21], reverseItems: [], aggregation: 'sum' },
  ],
};

const answers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Ручная проверка: одинаковые ответы дают по 7 × ответ на каждой шкале', answers: answers(4), expected: { child: 28, adult: 28, parent: 28 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'litvintseva-transactional-analysis-communication-21items-sums-v1',
};
