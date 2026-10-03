import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: '(Почти) никогда' },
  { value: '2', label: 'Иногда' },
  { value: '3', label: 'Часто' },
  { value: '4', label: '(Почти) всегда' },
];

const itemTexts = [
  'Я нахожусь в спешке и испытываю нехватку времени',
  'Я продолжаю работать, даже когда мои коллеги уже ушли с работы',
  'Для меня важно работать не жалея сил, даже если работа мне не по душе',
  'Я всё время занят делом и не даю себе «остыть»',
  'Я чувствую, что что-то внутри меня заставляет меня работать, не жалея сил',
  'Я трачу больше времени на работу, чем на общение с друзьями, любимые занятия и отдых',
  'Я чувствую себя обязанным(ой) работать упорно, даже когда это не доставляет удовольствия',
  'Я делаю два-три дела одновременно, например, обедаю, работаю с документами и говорю по телефону',
  'Я испытываю чувство вины, когда отпрашиваюсь с работы',
  'Мне трудно расслабиться, когда я не работаю',
];

const questions: SeedSection['questions'] = itemTexts.map((text, index) => ({
  code: `test_199_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_199',
  title: 'Голландская шкала трудовой зависимости (DUWAS)',
  description: 'Русскоязычная версия DUWAS оценивает трудоголизм по двум аспектам: чрезмерности работы и навязчивому внутреннему побуждению работать. Она предназначена для описания этих проявлений у работающих взрослых и может помочь автору опроса изучить склонность к избыточной работе и трудности психологического отключения от неё; это исследовательская шкала, а не диагностический инструмент.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 4,
  scales: [
    { key: 'workingExcessively', label: 'Чрезмерность работы (WE)', items: [1, 2, 4, 6, 8], reverseItems: [], aggregation: 'mean' },
    { key: 'workingCompulsively', label: 'Навязчивость работы (WC)', items: [3, 5, 7, 9, 10], reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка ключа: оценки от 1 до 4 по порядку пунктов',
    answers: { '1': 1, '2': 2, '3': 3, '4': 4, '5': 1, '6': 2, '7': 3, '8': 4, '9': 1, '10': 2 },
    expected: { workingExcessively: 2.6, workingCompulsively: 2 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'lovakov-duwas-ru-10item-mean-v1',
};
