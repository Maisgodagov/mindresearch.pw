import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Абсолютно не отражают' },
  { value: '2', label: 'Не отражают' },
  { value: '3', label: 'Нечто среднее' },
  { value: '4', label: 'Отражают' },
  { value: '5', label: 'Полностью отражают' },
];

const items = [
  'Когда я думаю о Боге, я испытываю благодарность.',
  'Когда я думаю о Боге, я испытываю чувство близости.',
  'Когда я думаю о Боге, я испытываю чувство безопасности.',
  'Когда я думаю о Боге, я испытываю страх быть отвергнутым.',
  'Когда я думаю о Боге, я испытываю страх того, что я недостаточно хороший.',
  'Когда я думаю о Боге, я испытываю страх наказания.',
  'Когда я думаю о Боге, я испытываю чувство покинутости, брошенности.',
  'Бог терпелив по отношению ко мне.',
  'Бог направляет меня.',
  'Бог освобождает меня от чувства вины.',
  'Бог утешает меня.',
  'Бог даёт мне силы.',
  'Бог помогает мне расти.',
  'Бог заслуживает доверия.',
  'Бог даёт мне чувство безопасности.',
  'Бог обладает властью.',
  'Бог наказывает.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1203_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1203',
  title: 'Опросник репрезентаций Бога, QGR-17 (русская адаптация)',
  description: 'QGR-17 оценивает эмоциональные и когнитивные представления о Боге: позитивные чувства, тревогу и гнев, воспринимаемые поддерживающие, властные или карающие действия и пассивность Бога. Русская версия предназначена прежде всего для исследовательской работы со взрослыми религиозными респондентами; российская адаптационная публикация предлагает интерпретировать два фактора — позитивное и негативное отношение — и сообщает, что исходная шестишкальная структура на русскоязычной выборке не подтвердилась.',
  questions,
};

const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i);

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'POS', label: 'Позитивные чувства к Богу', items: [1, 2, 3], reverseItems: [], aggregation: 'sum' },
    { key: 'ANX', label: 'Тревога по отношению к Богу', items: [4, 5, 6], reverseItems: [], aggregation: 'sum' },
    { key: 'ANG', label: 'Гнев по отношению к Богу', items: [7, 8, 9], reverseItems: [], aggregation: 'sum' },
    { key: 'SUP', label: 'Поддерживающие действия Бога', items: [10, 11, 12], reverseItems: [], aggregation: 'sum' },
    { key: 'RULP', label: 'Властные и карающие действия Бога', items: [16, 17], reverseItems: [], aggregation: 'sum' },
    { key: 'PAS', label: 'Пассивность Бога', items: [13, 14, 15], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная сверка по ключу: все ответы 1 дают число пунктов каждой подшкалы',
    answers: Object.fromEntries(range(1, 17).map(item => [String(item), 1])),
    expected: { POS: 3, ANX: 3, ANG: 3, SUP: 3, RULP: 2, PAS: 3 },
  },
  {
    title: 'Ручная сверка по диапазону: все ответы 5 дают пятикратную сумму пунктов',
    answers: Object.fromEntries(range(1, 17).map(item => [String(item), 5])),
    expected: { POS: 15, ANX: 15, ANG: 15, SUP: 15, RULP: 10, PAS: 15 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'qgr-17-schaap-jonker-vrijmoeth-2024-russian-ru-v1',
};
