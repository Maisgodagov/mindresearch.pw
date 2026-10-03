import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'Нет' },
  { value: '1', label: 'Слегка' },
  { value: '2', label: 'Несколько' },
  { value: '3', label: 'Значительно' },
  { value: '4', label: 'Сильно' },
];

const itemTexts = [
  'Ощущение слабости',
  'Сердцебиение, перебои в сердце или замирание сердца',
  'Чувство давления или переполнения в животе',
  'Склонность к плачу',
  'Зуд',
  'Обмороки',
  'Повышенная сонливость',
  'Пониженная половая возбудимость',
  'Боли в суставах и конечностях',
  'Головокружение',
  'Боли в пояснице или спине',
  'Сильная потливость',
  'Боли в шее (затылке) или плечевых суставах',
  'Нарушения ходьбы',
  'Рвота',
  'Расстройства зрения',
  'Припадки (приступы, судороги)',
  'Тошнота',
  'Увеличение веса',
  'Ощущение кома в горле, сужения горла или спазма',
  'Позывы к мочеиспусканию',
  'Кожные изменения',
  'Отрыжка',
  'Повышенная чувствительность к холоду',
  'Изжога или кислая отрыжка',
  'Спазм в руке при письме',
  'Головные боли',
  'Повышенная чувствительность к теплу',
  'Быстрая истощаемость',
  'Расстройства сна',
  'Повышенная половая возбудимость',
  'Усталость',
  'Нарушение равновесия',
  'Затруднения при глотании',
  'Кашель',
  'Чувство оглушенности (помрачения сознания)',
  'Онемение конечностей (омертвение, жжение или мурашки, покалывание в кистях рук и стопах)',
  'Запоры',
  'Отсутствие аппетита',
  'Приступы жара, приливы крови',
  'Чувство тяжести или усталости в ногах',
  'Вялость',
  'Поносы',
  'Параличи',
  'Колющие или тянущие боли в груди',
  'Дрожание',
  'Боли в горле',
  'Лёгкое покраснение',
  'Холодные ноги (ступни)',
  'Волчий голод',
  'Боли в желудке',
  'Приступы одышки (удушья)',
  'Боли в нижней части живота',
  'Уменьшение веса',
  'Ощущение давления в голове',
  'Сердечные приступы',
  'Речевые расстройства',
];

const questions: SeedSection['questions'] = itemTexts.map((text, index) => ({
  code: `test_195_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_195',
  title: 'Гиссенский опросник соматических жалоб (GBB; русская адаптация 1993 года)',
  description: 'Клинический опросник регистрирует субъективные соматические жалобы и их интенсивность. Четыре субшкалы охватывают истощение, желудочные жалобы, боли в различных частях тела («ревматический фактор») и сердечные жалобы; суммарная шкала отражает интенсивность жалоб по этим комплексам. Подходит для клинического и медико-психологического обследования взрослых пациентов и наблюдения динамики симптомов; не предназначен для диагностики соматических заболеваний.',
  questions,
};

const scales = [
  { key: 'exhaustion', label: 'Истощение', items: [1, 7, 29, 32, 36, 42] },
  { key: 'gastric', label: 'Желудочные жалобы', items: [3, 15, 18, 23, 25, 51] },
  { key: 'rheumaticFactor', label: 'Боли в различных частях тела (ревматический фактор)', items: [9, 11, 13, 27, 41, 55] },
  { key: 'cardiac', label: 'Сердечные жалобы', items: [2, 10, 20, 45, 52, 56] },
];

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 4,
  scales: [
    ...scales.map(({ key, label, items }) => ({ key, label, items, reverseItems: [], aggregation: 'sum' as const })),
    { key: 'complaintIntensity', label: 'Интенсивность (давление) жалоб', items: scales.flatMap(scale => scale.items), reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ключевые ответы отсутствуют',
    answers: Object.fromEntries(itemTexts.map((_, index) => [String(index + 1), 0])),
    expected: { exhaustion: 0, gastric: 0, rheumaticFactor: 0, cardiac: 0, complaintIntensity: 0 },
  },
  {
    title: 'Проверка ключа: ответы 1 по пунктам четырёх шкал',
    answers: Object.fromEntries(itemTexts.map((_, index) => [String(index + 1), [1, 2, 3, 7, 9, 10, 11, 13, 15, 18, 20, 23, 25, 27, 29, 32, 36, 41, 42, 45, 51, 52, 55, 56].includes(index + 1) ? 1 : 0])),
    expected: { exhaustion: 6, gastric: 6, rheumaticFactor: 6, cardiac: 6, complaintIntensity: 24 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'gissen-gbb-57-ru-1993-v1',
};
