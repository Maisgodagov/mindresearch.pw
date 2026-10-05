import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'Нет такого опыта' },
  { value: '1', label: 'Совершенно не переживал из-за этого' },
  { value: '2', label: 'Практически не переживал' },
  { value: '3', label: 'Скорее не переживал' },
  { value: '4', label: 'Трудно сказать' },
  { value: '5', label: 'Скорее переживал' },
  { value: '6', label: 'Довольно сильно переживал' },
  { value: '7', label: 'Очень сильно переживал из-за этого' },
];

const items = [
  'В школе я был жертвой бойкота.',
  'В моей жизни случилось предательство со стороны друга (друзей).',
  'В школе бывало и такое, что сам учитель давал мне какое-то нелепое прозвище.',
  'Бывало, что человек, с которым я общался, внезапно прерывал со мной контакт без объяснения причин.',
  'Иногда случается, что люди, общением с которыми я дорожу, во время нашего разговора сидят, уткнувшись в телефон.',
  'В школе ко мне плохо относились из-за особенностей моей внешности.',
  'В школе другие дети иногда меня дразнили и обзывали.',
  'В моей жизни бывало такое, что кто-то из родственников относился ко мне незаслуженно плохо.',
  'Что такое буллинг, травля в школе, мне известно не понаслышке, а из собственного печального опыта.',
  'Я сталкивался с плохим отношением из-за того, что беден или плохо одет.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1426_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1426',
  title: 'Переживание социального исключения (ПСИ)',
  description: 'Опросник оценивает наличие и интенсивность переживания социального исключения в межличностных отношениях: школьной травли, отвержения в диаде и исключения со стороны статусных фигур. Предназначен для исследовательского и прикладного обсуждения опыта взрослых респондентов; исходная апробация проводилась преимущественно на студенческих выборках, отдельные возрастные адаптации требуют самостоятельной проверки.',
  questions,
};

const scales = [
  { key: 'school_bullying', label: 'Переживание школьной травли (буллинга)', items: [1, 6, 7, 9] },
  { key: 'dyadic_rejection', label: 'Переживание отвержения в диаде', items: [2, 4, 5] },
  { key: 'status_figures', label: 'Переживание исключения со стороны статусных фигур', items: [3, 8, 10] },
  { key: 'total', label: 'Индекс переживания социального исключения в межличностных отношениях', items: Array.from({ length: 10 }, (_, index) => index + 1) },
];

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 7,
  scales: scales.map(scale => ({ ...scale, reverseItems: [], aggregation: 'sum' })),
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка ключа: по одному баллу на соответствующие пункты трёх шкал',
    answers: Object.fromEntries(Array.from({ length: 10 }, (_, index) => [String(index + 1), [1, 2, 3].includes(index + 1) ? 1 : 0])),
    expected: { school_bullying: 1, dyadic_rejection: 1, status_figures: 1, total: 3 },
  },
  {
    title: 'Нулевой ответ «нет такого опыта» даёт ноль по всем шкалам',
    answers: Object.fromEntries(Array.from({ length: 10 }, (_, index) => [String(index + 1), 0])),
    expected: { school_bullying: 0, dyadic_rejection: 0, status_figures: 0, total: 0 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'semenova-vek-i-rudykhina-psi-2022-v1',
};
