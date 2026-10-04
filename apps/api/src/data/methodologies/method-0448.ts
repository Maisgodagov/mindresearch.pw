import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'Никогда' },
  { value: '1', label: 'Несколько раз' },
  { value: '2', label: 'Иногда' },
  { value: '3', label: 'Часто (каждую неделю)' },
  { value: '4', label: 'Очень часто (большинство дней)' },
];

const items = [
  'Ощущение, продолжительностью менее 20 минут, что вы или окружающее вас пространство движется в определенном направлении',
  'Бросает в жар или холод',
  'Тошнота, рвота',
  'Ощущение, продолжительностью более 20 минут, что вы или окружающее вас пространство движется в определенном направлении',
  'Учащенное сердцебиение',
  'Головокружение, дезориентация и дурнота в течение всего дня',
  'Головная боль или тяжесть в голове',
  'Невозможность стоять или идти без поддержки, отклонение и пошатывание в одну сторону',
  'Затрудненное дыхание, ощущение нехватки воздуха',
  'Неустойчивость, ощущение, что «вот-вот потеряю равновесие», длительностью менее 20 минут',
  'Повышенное потоотделение',
  'Предобморочное состояние',
  'Неустойчивость, ощущение, что «вот-вот потеряю равновесие», длительностью более 20 минут',
  'Боли в области сердца или в груди',
  'Головокружение, дезориентация и дурнота в течение менее 20 минут',
];

const vssV = [1, 3, 4, 6, 8, 10, 13, 15];
const vssA = [2, 5, 7, 9, 11, 12, 14];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_484_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_484',
  title: 'Краткая шкала симптомов головокружения VSS-SF',
  description: 'VSS-SF количественно оценивает частоту симптомов головокружения за последний месяц. Шкала охватывает вестибулярные ощущения и нарушения равновесия, а также сопутствующие вегетативные и тревожные проявления; предназначена для оценки симптомной нагрузки у людей с жалобами на головокружение и для отслеживания её изменений.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 4,
  scales: [
    { key: 'vss_v', label: 'Вестибулярные симптомы и равновесие (VSS-V)', items: vssV, reverseItems: [], aggregation: 'sum' },
    { key: 'vss_a', label: 'Вегетативные и тревожные симптомы (VSS-A)', items: vssA, reverseItems: [], aggregation: 'sum' },
    { key: 'vss_total', label: 'Общая выраженность симптомов (VSS-total)', items: Array.from({ length: 15 }, (_, index) => index + 1), reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: все симптомы отмечены как никогда',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 0])),
    expected: { vss_v: 0, vss_a: 0, vss_total: 0 },
  },
  {
    title: 'Ручная проверка: все ответы максимальны; суммы подшкал сходятся в общий итог',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 4])),
    expected: { vss_v: 32, vss_a: 28, vss_total: 60 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'vss-sf-makarov-2022-15-item-sum-v1',
};
