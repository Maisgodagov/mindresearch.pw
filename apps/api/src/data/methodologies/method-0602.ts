import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const itemTexts = [
  'Интересное дело',
  'Общение с разными людьми',
  'Помощь товарищам',
  'Возможность передать свои знания',
  'Творчество',
  'Приобретение новых знаний, умений',
  'Возможность руководить другими',
  'Участие в делах своего коллектива',
  'Вероятность заслужить уважение товарищей',
  'Сделать доброе дело для других',
  'Выделиться среди других',
  'Выработать у себя определённые черты характера',
];

const options = [
  { value: '0', label: 'Не привлекает совсем' },
  { value: '1', label: 'Привлекает слабо' },
  { value: '2', label: 'Привлекает в значительной степени' },
  { value: '3', label: 'Привлекает очень сильно' },
];

const questions: SeedSection['questions'] = itemTexts.map((text, index) => ({
  code: `test_633_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_633',
  title: 'Методика изучения мотивов участия школьников в деятельности',
  description: 'Методика Л. В. Байбородовой выявляет, какие мотивы преобладают у школьника при участии в совместной деятельности: коллективистские (помощь и вклад в дела группы), личностные (интерес, общение, творчество и развитие) или престижные (руководство и признание). Подходит для изучения мотивационной направленности школьников в коллективных и общественно полезных делах; профиль помогает автору опроса увидеть, какие стороны совместной деятельности привлекают учащихся сильнее.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 3,
  scales: [
    { key: 'collectivist', label: 'Коллективистские мотивы', items: [3, 4, 8, 10], reverseItems: [], aggregation: 'mean' },
    { key: 'personal', label: 'Личностные мотивы', items: [1, 2, 5, 6, 12], reverseItems: [], aggregation: 'mean' },
    { key: 'prestige', label: 'Престижные мотивы', items: [7, 9, 11], reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Вручная проверка: максимальные оценки по всем пунктам дают среднее 3 по каждому блоку',
    answers: Object.fromEntries(itemTexts.map((_, index) => [String(index + 1), 3])),
    expected: { collectivist: 3, personal: 3, prestige: 3 },
  },
  {
    title: 'Вручная проверка ключа: только пункт 3 оценён в 3 балла, он входит в коллективистский блок',
    answers: Object.fromEntries(itemTexts.map((_, index) => [String(index + 1), index === 2 ? 3 : 0])),
    expected: { collectivist: 0.75, personal: 0, prestige: 0 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'baiborodova-school-participation-motives-12item-three-block-means-v1',
};
