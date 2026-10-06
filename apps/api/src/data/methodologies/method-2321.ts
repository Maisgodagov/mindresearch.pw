import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const yesNo = [
  { value: 'yes', label: 'Да' },
  { value: 'no', label: 'Нет' },
];

const items = [
  'Испытывали ли Вы сильную тоску и болезненную печаль по умершему человеку?',
  'Насколько Вы были поглощены мыслями или воспоминаниями об умершем человеке?',
  'Чувствовали ли Вы, что часть Вас умерла вместе с этим человеком?',
  'Испытывали ли Вы трудности с принятием смерти этого человека?',
  'Старались ли Вы избегать напоминаний о том, что этот человек умер?',
  'Испытывали ли Вы сильную эмоциональную боль (например, гнев, горечь или печаль) из-за смерти этого человека?',
  'Возникали ли у Вас трудности с возвращением к жизни после смерти этого человека (например, с общением с друзьями, занятиями интересующими Вас делами или планированием будущего)?',
  'Чувствовали ли Вы эмоциональное оцепенение или заметное снижение силы чувств после смерти этого человека?',
  'Казалась ли Вам жизнь бессмысленной после смерти этого человека?',
  'Чувствовали ли Вы сильное одиночество или отстранённость от других людей после смерти этого человека?',
];

const symptomOptions = [
  { value: '1', label: 'Совсем нет' },
  { value: '2', label: 'Немного' },
  { value: '3', label: 'Умеренно' },
  { value: '4', label: 'Сильно' },
  { value: '5', label: 'Чрезвычайно' },
];

const questions: SeedSection['questions'] = [
  {
    code: 'test_2339_1',
    text: 'Умер ли кто-либо, кто был Вам близок?',
    type: 'single',
    required: true,
    options: yesNo,
  },
  {
    code: 'test_2339_2',
    text: 'Сколько времени прошло со смерти этого человека?',
    type: 'single',
    required: true,
    options: [
      { value: 'under_6_months', label: 'Менее 6 месяцев' },
      { value: '6_to_12_months', label: 'От 6 до 12 месяцев' },
      { value: '12_months_or_more', label: '12 месяцев или больше' },
    ],
  },
  ...items.map((text, index) => ({
    code: `test_2339_${index + 3}`,
    text,
    type: 'single' as const,
    required: true,
    options: symptomOptions,
  })),
  {
    code: 'test_2339_13',
    text: 'Привели ли эти симптомы к значимым нарушениям Вашего социального, профессионального или другого важного функционирования?',
    type: 'single',
    required: true,
    options: yesNo,
  },
];

const instrument: SeedSection = {
  code: 'test_2339',
  title: 'Шкала пролонгированного расстройства горя PG-13-R',
  description: 'PG-13-R оценивает выраженность симптомов пролонгированного расстройства горя после смерти близкого человека: тоску и поглощённость мыслями об умершем, нарушение идентичности, непринятие смерти, избегание напоминаний, эмоциональную боль и оцепенение, трудности возвращения к жизни, потерю смысла и одиночество. Десять симптомных пунктов дают размерную оценку тяжести переживаний; вопросы о факте и давности утраты и о нарушении функционирования служат контрольными критериями. Версия соответствует пересмотренной шкале PG-13-R по DSM-5-TR и предназначена для оценки взрослых, переживших утрату; результат скрининговый и сам по себе не устанавливает диагноз.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'symptomScore', label: 'Суммарная выраженность симптомов горя', items: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12], reverseItems: [], aggregation: 'sum' },
  ],
};

const answers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 3), value]));
const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: десять ответов «совсем нет» дают нижнюю границу 10',
    answers: answers(1),
    expected: { symptomScore: 10 },
  },
  {
    title: 'Ручная проверка: десять ответов «чрезвычайно» дают 50; порог статьи 30 превышен',
    answers: answers(5),
    expected: { symptomScore: 50 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['mood-depression'],
  scoringConfig,
  validationCases,
  formulaVersion: 'pg-13-r-prigerson-2021-murashko-ru-sum-q3-q12-v1',
};
