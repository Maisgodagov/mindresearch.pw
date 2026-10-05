import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Совсем не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Скорее не согласен' },
  { value: '4', label: 'Ни согласен, ни не согласен' },
  { value: '5', label: 'Скорее согласен' },
  { value: '6', label: 'Согласен' },
  { value: '7', label: 'Полностью согласен' },
];

const itemTexts = [
  'Чтобы повысить самооценку',
  'Чтобы самоутвердиться',
  'Чтобы узнать, насколько я нравлюсь другим',
  'Чтобы лучше оценить свою собственную привлекательность',
  'Чтобы найти серьезные отношения',
  'Чтобы найти свою любовь',
  'Чтобы встретить будущего(ую) супруга(у)',
  'Чтобы расширить свой сексуальный опыт',
  'Чтобы реализовать свои сексуальные фантазии',
  'Чтобы найти любовника/любовницу',
  'Чтобы расширить опыт общения',
  'Чтобы во время путешествий находить компанию, с которой можно повеселиться',
  'Чтобы найти новых друзей',
  'Чтобы завести новые знакомства',
  'От нечего делать',
  'Ради развлечения',
  'Чтобы отвлечься на учебе/работе',
  'Из любопытства',
  'Чтобы забыть своего бывшего/свою бывшую',
  'Чтобы отвлечься от мыслей о бывшем/бывшей',
  'Чтобы улучшить свое материальное положение',
  'Чтобы получить выгоду',
];

const questions: SeedSection['questions'] = itemTexts.map((text, index) => ({
  code: `test_788_${index + 1}`,
  text: `Я планирую использовать сервис онлайн-знакомств … ${text}`,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_788',
  title: 'Мотивы пользования сервисами онлайн-знакомств',
  description: 'Русскоязычная адаптация для взрослых пользователей и потенциальных пользователей сервисов онлайн-знакомств. Измеряет выраженность семи мотивов: социального признания и повышения самооценки, поиска серьезных отношений, секса, расширения круга знакомств, развлечения, расставания с бывшими и материальной мотивации. Профиль шкал помогает автору опроса описать, какие причины использования таких сервисов чаще поддерживают респондентов.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'social_recognition', label: 'Социальное признание (повышение самооценки)', items: [1, 2, 3, 4], reverseItems: [], aggregation: 'mean' },
    { key: 'serious_relationships', label: 'Поиск серьезных отношений', items: [5, 6, 7], reverseItems: [], aggregation: 'mean' },
    { key: 'sex', label: 'Секс', items: [8, 9, 10], reverseItems: [], aggregation: 'mean' },
    { key: 'social_network', label: 'Расширение круга знакомств', items: [11, 12, 13, 14], reverseItems: [], aggregation: 'mean' },
    { key: 'entertainment', label: 'Развлечение', items: [15, 16, 17, 18], reverseItems: [], aggregation: 'mean' },
    { key: 'moving_on', label: 'Расставание с бывшими', items: [19, 20], reverseItems: [], aggregation: 'mean' },
    { key: 'material', label: 'Материальная мотивация', items: [21, 22], reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: все ответы 1 дают минимум 1 по каждой шкале',
    answers: Object.fromEntries(itemTexts.map((_, index) => [String(index + 1), 1])),
    expected: { social_recognition: 1, serious_relationships: 1, sex: 1, social_network: 1, entertainment: 1, moving_on: 1, material: 1 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'tms-ru-vorobieva-shmidt-nestik-2023-22item-v1',
};
