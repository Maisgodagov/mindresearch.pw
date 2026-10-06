import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const fearOptions = [
  { value: '0', label: 'Страх и тревога отсутствуют' },
  { value: '1', label: 'Легкий уровень' },
  { value: '2', label: 'Средний уровень' },
  { value: '3', label: 'Сильный страх или тревога' },
];
const avoidanceOptions = [
  { value: '0', label: 'Никогда' },
  { value: '1', label: 'Редко' },
  { value: '2', label: 'Часто' },
  { value: '3', label: 'Всегда' },
];

const situations = [
  'Говорить по телефону в общественных местах.',
  'Участвовать в деятельности небольшой группы.',
  'Есть в общественных местах.',
  'Пить в общественных местах.',
  'Говорить с вышестоящим лицом.',
  'Выступать перед публикой.',
  'Идти в гости.',
  'Работать, когда за мной наблюдают.',
  'Писать, когда за мной наблюдают.',
  'Звонить малознакомому человеку.',
  'Говорить с глазу на глаз с малознакомым человеком.',
  'Встречаться с незнакомыми людьми.',
  'Справлять нужду в общественном туалете.',
  'Входить в комнату, где уже сидят другие люди.',
  'Находиться в центре внимания.',
  'Высказываться на собрании без предварительной подготовки.',
  'Проходить тест, сдавать экзамен.',
  'Высказывать свое неодобрение и несогласие малознакомому человеку.',
  'Смотреть прямо в глаза малознакомому человеку.',
  'Выступать с подготовленной речью перед группой людей.',
  'Пытаться завести романтическое знакомство.',
  'Возвращать товар в магазин.',
  'Приглашать гостей.',
  'Не поддаваться уговорам продавца, делая покупки.',
];

// Separate response variables preserve the LSAS's two ratings for each situation.
const questions: SeedSection['questions'] = situations.flatMap((situation, index) => [
  {
    code: `test_2431_${index + 1}_fear`,
    text: `Насколько вам страшно или тревожно: ${situation}`,
    type: 'single' as const,
    required: true,
    options: fearOptions,
  },
  {
    code: `test_2431_${index + 1}_avoidance`,
    text: `Как часто вы избегаете: ${situation}`,
    type: 'single' as const,
    required: true,
    options: avoidanceOptions,
  },
]);

export const instrument: SeedSection = {
  code: 'test_2431',
  title: 'Шкала социальной тревожности Либовица (LSAS)',
  description: 'Методика оценивает выраженность социальной тревожности через страх и избегание в ситуациях межличностного общения и публичного выполнения действий под наблюдением. Охватывает повседневные, формальные и ситуационные контакты; подходит для оценки взрослых и исследовательского/скринингового описания профиля, но сама по себе не устанавливает диагноз.',
  categoryIds: ['mood-anxiety'],
  questions,
};

const interaction = [5, 7, 10, 11, 12, 18, 19, 21, 22, 23, 24];
const performance = [1, 2, 3, 4, 6, 8, 9, 13, 14, 15, 16, 17, 20];
const fearItems = (situationsList: number[]) => situationsList.map(item => (item - 1) * 2 + 1);
const avoidanceItems = (situationsList: number[]) => situationsList.map(item => (item - 1) * 2 + 2);
const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 3,
  scales: [
    { key: 'fear_interaction', label: 'Страх в ситуациях социального взаимодействия', items: fearItems(interaction), reverseItems: [], aggregation: 'sum' },
    { key: 'fear_performance', label: 'Страх в ситуациях выполнения действий под наблюдением', items: fearItems(performance), reverseItems: [], aggregation: 'sum' },
    { key: 'avoidance_interaction', label: 'Избегание ситуаций социального взаимодействия', items: avoidanceItems(interaction), reverseItems: [], aggregation: 'sum' },
    { key: 'avoidance_performance', label: 'Избегание ситуаций выполнения действий под наблюдением', items: avoidanceItems(performance), reverseItems: [], aggregation: 'sum' },
    { key: 'fear_total', label: 'Суммарный страх', items: fearItems(situations.map((_, i) => i + 1)), reverseItems: [], aggregation: 'sum' },
    { key: 'avoidance_total', label: 'Суммарное избегание', items: avoidanceItems(situations.map((_, i) => i + 1)), reverseItems: [], aggregation: 'sum' },
    { key: 'total', label: 'Общий суммарный балл', items: Array.from({ length: 48 }, (_, i) => i + 1), reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: только страх по первой ситуации — один балл',
    answers: Object.fromEntries(Array.from({ length: 48 }, (_, i) => [String(i + 1), i === 0 ? 1 : 0])),
    expected: { fear_interaction: 0, fear_performance: 1, avoidance_interaction: 0, avoidance_performance: 0, fear_total: 1, avoidance_total: 0, total: 1 },
  },
  {
    title: 'Ручная проверка границ: максимальные ответы во всех 48 полях',
    answers: Object.fromEntries(Array.from({ length: 48 }, (_, i) => [String(i + 1), 3])),
    expected: { fear_interaction: 33, fear_performance: 39, avoidance_interaction: 33, avoidance_performance: 39, fear_total: 72, avoidance_total: 72, total: 144 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'lsas-liebowitz-1987-psytests-ru-24x2-v1',
};
