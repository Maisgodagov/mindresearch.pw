import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Абсолютно неверно' },
  { value: '2', label: 'Не верно' },
  { value: '3', label: 'Скорее не верно' },
  { value: '4', label: 'Нечто среднее' },
  { value: '5', label: 'Скорее верно' },
  { value: '6', label: 'Верно' },
  { value: '7', label: 'Абсолютно верно' },
];

const stateStatements = [
  'В данный момент я чувствую себя живым(ой) и полным(ой) сил.',
  'Сейчас я не чувствую себя очень энергичным(ой).',
  'Сейчас меня настолько переполняет энергия, что, кажется, она вот-вот разорвет меня.',
  'В данный момент я полон(на) энергии и решимости.',
  'Сейчас я испытываю энтузиазм, думая о завтрашнем дне.',
  'В данный момент я бодр(а) и готов(а) к действию.',
  'Сейчас я чувствую себя заряженным(ной) энергией.',
];

const traitStatements = [
  'Я чувствую себя живым(ой) и полным(ой) сил.',
  'Я недостаточно энергичен(на).',
  'Временами я настолько полон(на) энергии, что она просто разрывает меня.',
  'Я полон(на) энергии и решимости.',
  'Я с нетерпением жду наступления каждого нового дня.',
  'Я почти всегда бодр(а) и готов(а) действовать.',
  'Я чувствую, что заряжен(а) энергией.',
];

const statements = [...stateStatements, ...traitStatements];
const questions: SeedSection['questions'] = statements.map((text, index) => ({
  code: `test_2452_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2452',
  title: 'Шкалы субъективной витальности (Vt-s и Vt-d)',
  description: 'Русская адаптация Л. А. Александровой оценивает субъективное переживание физической и психической энергии. Включает отдельные семипунктовые шкалы витальности как состояния «здесь и сейчас» (Vt-s) и диспозиционной витальности — характерной для человека в жизни в целом (Vt-d); полезна для изучения текущего ощущения жизненных сил и устойчивого энергетического тонуса. Русские формулировки даны в грамматических вариантах для разных родов.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'vitality_state', label: 'Витальность как состояние (Vt-s)', items: [1, 2, 3, 4, 5, 6, 7], reverseItems: [2], aggregation: 'sum' },
    { key: 'vitality_dispositional', label: 'Диспозиционная витальность (Vt-d)', items: [8, 9, 10, 11, 12, 13, 14], reverseItems: [9], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная сверка реверсивного пункта и сумм по двум независимым шкалам',
    answers: { '1': 1, '2': 1, '3': 1, '4': 1, '5': 1, '6': 1, '7': 1, '8': 7, '9': 7, '10': 7, '11': 7, '12': 7, '13': 7, '14': 7 },
    expected: { vitality_state: 13, vitality_dispositional: 43 },
  },
  {
    title: 'Ручная сверка: минимальные прямые и максимальный обратный ответ дают минимум шкалы',
    answers: { '1': 1, '2': 7, '3': 1, '4': 1, '5': 1, '6': 1, '7': 1, '8': 1, '9': 7, '10': 1, '11': 1, '12': 1, '13': 1, '14': 1 },
    expected: { vitality_state: 7, vitality_dispositional: 7 },
  },
];

export const methodology: MethodologyRegistration = {
  categoryIds: ["framework-sdt"],
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'alexandrova-subjective-vitality-vts-vtd-7-item-1to7-reverse-2-sum-v1',
};
