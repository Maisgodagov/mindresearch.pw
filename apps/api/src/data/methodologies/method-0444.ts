import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Категорически не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Отношусь нейтрально' },
  { value: '4', label: 'Согласен' },
  { value: '5', label: 'Полностью согласен' },
];

const items = [
  'Я довольно быстро прихожу в себя после неудач и жизненных трудностей.',
  'Я тяжело переживаю стрессовые ситуации.',
  'Мне не нужно много времени, чтобы оправиться после стрессовой ситуации.',
  'Я с трудом восстанавливаюсь, после того как случается что-то плохое.',
  'Обычно я справляюсь с проблемными ситуациями без лишних переживаний.',
  'Мне нужно много времени, чтобы вернуться в форму после серьезных жизненных неудач.',
];

const reverseItems = [2, 4, 6];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_480_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_480',
  title: 'Краткая шкала резилентности (BRS), русскоязычная версия',
  description: 'BRS измеряет субъективную способность быстро восстанавливаться после стресса, травмирующих событий, неудач и неблагоприятных обстоятельств. Шесть утверждений охватывают скорость восстановления и трудности возвращения к обычному состоянию; шкала подходит для русскоязычных респондентов, включая взрослые выборки, изученные при адаптации (студенты и родители).',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'brs', label: 'Резилентность (способность восстанавливаться)', items: [1, 2, 3, 4, 5, 6], reverseItems, aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: все ответы нейтральные, среднее равно 3',
    answers: { '1': 3, '2': 3, '3': 3, '4': 3, '5': 3, '6': 3 },
    expected: { brs: 3 },
  },
  {
    title: 'Ручная проверка: согласие с прямыми и несогласие с обратными утверждениями дают максимум',
    answers: { '1': 5, '2': 1, '3': 5, '4': 1, '5': 5, '6': 1 },
    expected: { brs: 5 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'brs-smith-2008-zolotareva-alexandrova-markova-2022-mean-reverse-2-4-6-v1',
};
