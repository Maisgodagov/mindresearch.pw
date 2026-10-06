import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Совершенно не согласен' },
  { value: '2', label: 'Умеренно не согласен' },
  { value: '3', label: 'Слегка не согласен' },
  { value: '4', label: 'Слегка согласен' },
  { value: '5', label: 'Умеренно согласен' },
  { value: '6', label: 'Полностью согласен' },
];

const statements = [
  'Мне трудно принимать решения.',
  'Мне трудно сказать «нет».',
  'Мне трудно принимать комплименты как что-то заслуженное.',
  'Иногда я почти скучаю, если нет проблем, на которых следует сосредоточиться.',
  'Я обычно не делаю для других то, что они сами могут для себя сделать.',
  'Если я делаю для себя что-то приятное, то испытываю чувство вины.',
  'Я не тревожусь слишком много.',
  'Я говорю себе, что всё у меня будет лучше, когда окружающие меня близкие изменятся, перестанут делать то, что сейчас делают.',
  'Похоже, что в моих взаимоотношениях я всегда всё делаю для других, а они редко что-нибудь делают для меня.',
  'Иногда я фокусируюсь на другом человеке до такой степени, что предаю забвению другие взаимоотношения и то, за что мне следовало бы отвечать.',
  'Похоже, что я часто оказываюсь вовлеченным во взаимоотношения, которые мне причиняют боль.',
  'Свои истинные чувства я скрываю от окружающих.',
  'Когда меня кто-то обидит, я долго ношу это в себе, а потом однажды могу взорваться.',
  'Чтобы избежать конфликтов, я могу заходить как угодно далеко.',
  'У меня часто возникает страх или чувство грозящей беды.',
  'Я часто потребности других ставлю выше своих собственных.',
];

const questions: SeedSection['questions'] = statements.map((text, index) => ({
  code: `test_2415_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

const instrument: SeedSection = {
  code: 'test_2415',
  title: 'Шкала созависимости Спанн-Фишер',
  description: '16-пунктовая шкала оценивает выраженность созависимых моделей отношений: чрезмерную сосредоточенность на других, трудности выражения чувств и самоотказ в отношениях. Подходит для самооценки взрослых и исследовательских опросов; результат отражает общий балл по исходному русскому переводу В. Д. Москаленко, а не отдельные субшкалы.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 6,
  scales: [{
    key: 'codependency',
    label: 'Созависимость',
    items: Array.from({ length: 16 }, (_, index) => index + 1),
    reverseItems: [5, 7],
    aggregation: 'sum',
  }],
};

const allOnes = Object.fromEntries(Array.from({ length: 16 }, (_, index) => [String(index + 1), 1]));
const allSixes = Object.fromEntries(Array.from({ length: 16 }, (_, index) => [String(index + 1), 6]));
const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: единицы по всем пунктам; пункты 5 и 7 реверсируются в 6',
    answers: allOnes,
    expected: { codependency: 24 },
  },
  {
    title: 'Ручная проверка: шестерки по всем пунктам; пункты 5 и 7 реверсируются в 1',
    answers: allSixes,
    expected: { codependency: 88 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['clinical-addictive'],
  scoringConfig,
  validationCases,
  formulaVersion: 'spann-fischer-moskalenko-2002-total-v1',
};
