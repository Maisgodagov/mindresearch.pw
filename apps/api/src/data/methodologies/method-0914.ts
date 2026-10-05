import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const responseOptions = [
  { value: '1', label: 'Неверно' },
  { value: '2', label: 'Пожалуй, неверно' },
  { value: '3', label: 'Пожалуй, верно' },
  { value: '4', label: 'Верно' },
];

const itemText = [
  'Не люблю одалживать свои вещи, даже если об этом просят мои друзья.',
  'Знаю многих людей, чью машину или квартиру мне хотелось бы иметь.',
  'Сильно огорчаюсь, если теряю или порчу какую-нибудь вещь.',
  'Испытываю неприятные чувства, когда другой человек пользуется моим имуществом.',
  'Обычно я расстраиваюсь, когда мои знакомые делают покупки, которые мне не по карману.',
  'Мне свойственно привязываться к вещам.',
  'Мне не нравится принимать гостей в своем доме.',
  'Я обделен(а) судьбой больше, чем большинство окружающих людей.',
  'Думаю, что сильно расстроюсь, если у меня украдут даже недорогую вещь.',
];

const questions: SeedSection['questions'] = itemText.map((text, index) => ({
  code: `test_944_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: responseOptions,
}));

export const instrument: SeedSection = {
  code: 'test_944',
  title: 'Опросник диспозиционного материализма (ОДМ)',
  description: 'Опросник оценивает диспозиционный материализм как устойчивую индивидуально-психологическую склонность придавать особую значимость материальным сторонам жизни. Он охватывает жадность, зависть к чужим материальным благам и собственническое отношение к вещам; опубликованный вариант рассчитан на взрослых респондентов и был разработан и проверен на выборках россиян и белорусов.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 4,
  scales: [
    { key: 'greed', label: 'Жадность', items: [1, 4, 7], reverseItems: [], aggregation: 'sum' },
    { key: 'envy', label: 'Зависть', items: [2, 5, 8], reverseItems: [], aggregation: 'sum' },
    { key: 'possessiveness', label: 'Собственничество', items: [3, 6, 9], reverseItems: [], aggregation: 'sum' },
    { key: 'materialism', label: 'Общий материализм', items: [1, 2, 3, 4, 5, 6, 7, 8, 9], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все пункты отмечены как «Неверно»: минимум по каждой шкале',
    answers: { '1': '1', '2': '1', '3': '1', '4': '1', '5': '1', '6': '1', '7': '1', '8': '1', '9': '1' },
    expected: { greed: 3, envy: 3, possessiveness: 3, materialism: 9 },
  },
  {
    title: 'Все пункты отмечены как «Верно»: максимум по каждой шкале',
    answers: { '1': '4', '2': '4', '3': '4', '4': '4', '5': '4', '6': '4', '7': '4', '8': '4', '9': '4' },
    expected: { greed: 12, envy: 12, possessiveness: 12, materialism: 36 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'odm-karpinsky-kiselnikova-2019-v1',
};
