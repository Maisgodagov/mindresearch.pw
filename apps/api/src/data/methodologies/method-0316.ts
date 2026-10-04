import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const responseOptions = [
  { value: '1', label: 'Никогда' },
  { value: '2', label: 'Редко' },
  { value: '3', label: 'Иногда' },
  { value: '4', label: 'Часто' },
  { value: '5', label: 'Очень часто' },
];

const itemTexts = [
  'Я говорил что-то неприятное другим, просто чтобы посмеяться',
  'Мы с одноклассниками задирали/дразнили других учеников',
  'Я вступал в драку с теми, кого считал физически слабее себя',
  'Другие учащиеся намеренно задирали или провоцировали меня',
  'Я подвергался насмешкам со стороны других',
  'Другие учащиеся оскорбляли/обзывали меня',
  'Другие учащиеся били меня или применяли ко мне физическую силу (например, толкали)',
  'Я помогал доставать/мучать других учащихся / издеваться над другими учащимися',
  'Я дразнил других учащихся (подшучивал с целью задеть)',
  'Я участвовал в физической драке',
  'Я угрожал ударить другого ученика или причинить боль (сделать больно)',
  'Я ввязывался в драку, потому что меня разозлили',
  'Если меня ударяли первым, то я наносил ответный удар',
  'В состоянии гнева я намеренно причинял другому эмоциональный вред (например, говорил обидные вещи)',
  'Я распространял слухи или сплетни о других учащихся',
  'Я начинал (провоцировал) споры или конфликты',
  'Провоцировал людей на конфликт',
  'Устраивал бойкоты и «выживал» кого-то из группы общения',
];

const instruction = 'Для каждого из следующих вопросов выберите, сколько раз Вы совершали следующие действия или сколько раз это происходило с вами в школьные годы. Как часто в школе с Вами случалось следующее?';

const questions: SeedSection['questions'] = itemTexts.map((text, index) => ({
  code: `test_348_${index + 1}`,
  text: `${instruction}\n\n${text}`,
  type: 'single',
  required: true,
  options: responseOptions,
}));

export const instrument: SeedSection = {
  code: 'test_348',
  title: 'Иллинойсская шкала буллинга (IBS), русская ретроспективная версия',
  description: 'Ретроспективная версия IBS для взрослых оценивает опыт буллинга в школьные годы по трём отдельным аспектам: виктимизации, вербальной агрессии и физической агрессии. Она помогает автору опроса описать прошлый опыт участия в травле и сопоставить выраженность этих аспектов; валидизация русской версии проводилась на выборке от 17 лет.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'verbal_aggression', label: 'Вербальная агрессия', items: [1, 2, 8, 9, 14, 15, 16, 17, 18], reverseItems: [], aggregation: 'sum' },
    { key: 'victimization', label: 'Виктимизация', items: [4, 5, 6, 7], reverseItems: [], aggregation: 'sum' },
    { key: 'physical_aggression', label: 'Физическая агрессия', items: [3, 10, 11, 12, 13], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы «Никогда»',
    answers: Object.fromEntries(itemTexts.map((_, index) => [String(index + 1), 1])),
    expected: { verbal_aggression: 9, victimization: 4, physical_aggression: 5 },
  },
  {
    title: 'Все ответы «Очень часто»',
    answers: Object.fromEntries(itemTexts.map((_, index) => [String(index + 1), 5])),
    expected: { verbal_aggression: 45, victimization: 20, physical_aggression: 25 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'ibs-mikhailova-istomina-krasko-2026-retrospective-v1',
};
