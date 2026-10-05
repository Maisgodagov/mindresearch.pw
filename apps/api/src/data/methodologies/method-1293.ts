import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Полностью не согласен' },
  { value: '2', label: 'Скорее не согласен' },
  { value: '3', label: 'И согласен, и нет' },
  { value: '4', label: 'Скорее согласен' },
  { value: '5', label: 'Полностью согласен' },
];

const items = [
  'Любимым делом, интересной работой, которые важны для человека.',
  'Личным успехом, собственными достижениями, которыми восхищаются окружающие.',
  'Личным физическим и психическим здоровьем.',
  'Безопасностью других людей, ненанесением вреда людям.',
  'Истинной дружбой, близкими друзьями.',
  'Здоровьем окружающих.',
  'Доверием людей, возможностью не обманывать, проявлять порядочность к ним.',
  'Сохранением природной среды.',
  'Безопасностью семьи и близких людей.',
  'Признанием и уважением окружающих.',
  'Свободой и независимостью в суждениях и поступках.',
  'Эмоциональной и духовной близостью с близким человеком.',
  'Личными творческими устремлениями (творческой деятельностью).',
  'Соблюдением требований закона, норм, интересов других людей.',
  'Защитой других людей.',
  'Личным авторитетом, влиянием на окружающих.',
  'Беззаботной, веселой жизнью, полной удовольствий.',
  'Жизнью, наполненной новыми впечатлениями, событиями и изменениями.',
  'Традициями, обычаями, верованиями окружающих людей.',
  'Собственными убеждениями, личными принципами.',
  'Социальной справедливостью — стремлением к равенству и защите прав людей.',
  'Благополучием и благосостоянием людей.',
];

const questions: SeedSection['questions'] = items.map((item, index) => ({
  code: `test_1321_${index + 1}`,
  text: `Большинство людей готовы пренебречь ради личной материальной выгоды (больших денег, богатства) следующим значимым аспектом повседневной жизни: ${item}`,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1321',
  title: 'Опросник ценностного материализма',
  description: 'Измеряет приоритет личной материальной выгоды относительно индивидуальных ценностей в ситуации ценностного конфликта. Охватывает достижения, безопасность, близкие отношения, самостоятельность, власть, гедонизм, стимуляцию, традиции, конформизм и универсализм. Стандартная 22-пунктовая версия разработана В. А. и Н. Н. Хащенко; авторская апробация включала взрослых 17–59 лет.',
  questions,
};

const allItems = items.map((_, index) => index + 1);
const valueScale = (key: string, label: string, itemNumbers: number[]) => ({
  key,
  label,
  items: itemNumbers,
  reverseItems: [] as number[],
  aggregation: 'sum' as const,
  // Для суммы S по n пунктам это точно реализует 100 * (S - n) / (4n).
  weights: Object.fromEntries(itemNumbers.map(item => [item, 25 / itemNumbers.length])),
});

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    valueScale('overall', 'Общий ценностный материализм (проценты)', allItems),
    valueScale('achievement', 'Достижение (проценты)', [1, 2]),
    valueScale('security', 'Безопасность (проценты)', [3, 4, 6, 9]),
    valueScale('benevolence', 'Благожелательность (проценты)', [5, 7, 12]),
    valueScale('universalism', 'Универсализм (проценты)', [8, 15, 21, 22]),
    valueScale('power', 'Власть (проценты)', [10, 16]),
    valueScale('selfDirection', 'Самостоятельность (проценты)', [11, 13, 20]),
    valueScale('conformity', 'Конформизм (проценты)', [14]),
    valueScale('hedonism', 'Гедонизм (проценты)', [17]),
    valueScale('stimulation', 'Стимуляция (проценты)', [18]),
    valueScale('tradition', 'Традиция (проценты)', [19]),
  ],
};

const answers = Object.fromEntries(allItems.map(item => [String(item), 3]));
const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: нейтральные ответы дают 50% по общему и частным показателям',
    answers,
    expected: Object.fromEntries(scoringConfig.scales.map(scale => [scale.key, 50])),
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'khashchenko-value-materialism-2023-22-v1',
};
