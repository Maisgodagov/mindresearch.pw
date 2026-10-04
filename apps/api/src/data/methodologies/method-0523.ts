import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const items = [
  { name: 'здоровье', scale: 'practice' },
  { name: 'ум, способности', scale: 'intelligence' },
  { name: 'характер', scale: 'character' },
  { name: 'авторитет у сверстников', scale: 'peer_authority' },
  { name: 'умение многое делать своими руками, умелые руки', scale: 'manual_skills' },
  { name: 'внешность', scale: 'appearance' },
  { name: 'уверенность в себе', scale: 'self_confidence' },
];

const questions: SeedSection['questions'] = items.flatMap(({ name }, index) => [
  {
    code: `test_558_${index + 1}_self`,
    text: `По шкале «${name}» отметьте уровень развития у вас этого качества, стороны вашей личности в данный момент времени. Нижняя точка означает самое низкое развитие, верхняя — наивысшее.`,
    type: 'scale' as const,
    required: true,
    scale: { min: 0, max: 100, step: 1, minLabel: 'Самое низкое развитие', maxLabel: 'Наивысшее развитие' },
  },
  {
    code: `test_558_${index + 1}_aspiration`,
    text: `По шкале «${name}» отметьте, при каком уровне развития этого качества вы были бы удовлетворены собой или почувствовали гордость за себя. Нижняя точка означает самое низкое развитие, верхняя — наивысшее.`,
    type: 'scale' as const,
    required: true,
    scale: { min: 0, max: 100, step: 1, minLabel: 'Самое низкое развитие', maxLabel: 'Наивысшее развитие' },
  },
]);

export const instrument: SeedSection = {
  code: 'test_558',
  title: 'Самооценка по Дембо—Рубинштейн (модификация А. М. Прихожан)',
  description: 'Модификация Дембо—Рубинштейн оценивает самооценку и уровень притязаний школьников 10–16 лет по отдельным сферам: уму и способностям, характеру, авторитету среди сверстников, практическим умениям, внешности и уверенности в себе. Профиль помогает автору опроса сравнить текущую оценку подростком своих качеств с желаемым уровнем; здоровье используется как тренировочная шкала.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 100,
  scales: items.slice(1).flatMap(({ scale, name }, index) => [
    { key: `${scale}_self`, label: `Самооценка: ${name}`, items: [2 * (index + 2) - 1], reverseItems: [], aggregation: 'mean' as const },
    { key: `${scale}_aspiration`, label: `Уровень притязаний: ${name}`, items: [2 * (index + 2)], reverseItems: [], aggregation: 'mean' as const },
  ]),
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: по всем шести учитываемым качествам самооценка 40, притязания 75; здоровье исключено',
    answers: Object.fromEntries(items.flatMap((_, index) => [[String(index * 2 + 1), index === 0 ? 20 : 40], [String(index * 2 + 2), index === 0 ? 60 : 75]])),
    expected: Object.fromEntries(items.slice(1).flatMap(({ scale }) => [[`${scale}_self`, 40], [`${scale}_aspiration`, 75]])),
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'dembo-rubinstein-prihozhan-1988-v1',
};
