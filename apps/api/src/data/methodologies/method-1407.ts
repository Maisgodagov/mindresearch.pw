import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = Array.from({ length: 11 }, (_, score) => ({ value: String(score), label: String(score) }));

const groups = [
  { key: 'vision', label: 'Зрение', prompt: 'Представьте себе, как выглядит', items: ['Костер', 'Закат', 'Кошка, забирающаяся на дерево', 'Входная дверь в ваш дом'] },
  { key: 'sound', label: 'Слух', prompt: 'Представьте себе звук', items: ['Аплодисментов', 'Сирены скорой помощи', 'Играющих детей', 'Мяуканья кошки'] },
  { key: 'smell', label: 'Обоняние', prompt: 'Представьте себе запах', items: ['Свежескошенной травы', 'Горящих поленьев', 'Розы', 'Свежей краски', 'Душной комнаты'] },
  { key: 'taste', label: 'Вкус', prompt: 'Представьте себе вкус', items: ['Черного перца', 'Лимона', 'Горчицы', 'Зубной пасты', 'Морской воды'] },
  { key: 'touch', label: 'Прикосновение', prompt: 'Представьте себе, что прикасаетесь к', items: ['Меху', 'Теплому песку', 'Мягкому полотенцу', 'Ледяной воде', 'Кончику булавки'] },
  { key: 'body', label: 'Телесные ощущения', prompt: 'Представьте себе телесное ощущение от', items: ['Расслабления в теплой ванной', 'Быстрой ходьбы в холодный день', 'Прыжка в бассейн', 'Больного горла', 'Вдевания нитки в иголку'] },
  { key: 'emotion', label: 'Эмоции', prompt: 'Представьте себе чувство', items: ['Взволнованности', 'Облегчения', 'Страха', 'Гнева'] },
];

const itemGroups = groups.flatMap((group, groupIndex) => group.items.map((text, index) => ({ groupIndex, text, localIndex: index })));
const questions: SeedSection['questions'] = itemGroups.map(({ groupIndex, text }, index) => ({
  code: `test_1435_${index + 1}`,
  text: `${groups[groupIndex].prompt}: ${text.toLowerCase()}.`,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1435',
  title: 'Плимутский опросник сенсорных образов (Psi-Q), русская полная версия',
  description: 'Опросник измеряет субъективную яркость мысленных образов у русскоязычных респондентов: отдельно для зрения, слуха, обоняния, вкуса, прикосновения, телесных ощущений и эмоций. Подходит исследователям, которым нужен профиль образности по семи модальностям и общий показатель; регистрация соответствует полной русской версии адаптации Разваляевой (32 пункта, выборка 17–50 лет).',
  questions,
};

const itemNumbersForGroup = (groupIndex: number) => itemGroups.flatMap((item, index) => item.groupIndex === groupIndex ? [index + 1] : []);
const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 10,
  scales: [
    ...groups.map((group, index) => ({ key: group.key, label: group.label, items: itemNumbersForGroup(index), reverseItems: [], aggregation: 'mean' as const })),
    { key: 'overall', label: 'Общая яркость образов', items: itemGroups.map((_, index) => index + 1), reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  { title: 'Все ответы равны нулю', answers: Object.fromEntries(itemGroups.map((_, index) => [String(index + 1), 0])), expected: Object.fromEntries([...groups.map(group => group.key), 'overall'].map(key => [key, 0])) },
  { title: 'Все ответы равны десяти', answers: Object.fromEntries(itemGroups.map((_, index) => [String(index + 1), 10])), expected: Object.fromEntries([...groups.map(group => group.key), 'overall'].map(key => [key, 10])) },
  { title: 'Ручная проверка: костер 10, прочие пункты 0', answers: Object.fromEntries(itemGroups.map((_, index) => [String(index + 1), index === 0 ? 10 : 0])), expected: { vision: 2.5, sound: 0, smell: 0, taste: 0, touch: 0, body: 0, emotion: 0, overall: 2.5 / 7 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'psiq-ru-razvalyaeva-2024-full-32-v1',
};
