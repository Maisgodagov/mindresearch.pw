import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Совсем не нужно' },
  { value: '2', label: 'Не нужно' },
  { value: '3', label: 'Скорее не нужно' },
  { value: '4', label: 'Все равно' },
  { value: '5', label: 'Скорее нужно' },
  { value: '6', label: 'Нужно' },
  { value: '7', label: 'Необходимо' },
];

const items: { text: string; scale: 'security' | 'pragmatic' | 'development' | 'stability' }[] = [
  { scale: 'security', text: 'Представлять жизненную философию' },
  { scale: 'security', text: 'Направлять жизнь' },
  { scale: 'security', text: 'Соответствовать личности обитателей' },
  { scale: 'security', text: 'Раскрывать характер обитателей другим людям' },
  { scale: 'security', text: 'Демонстрировать возраст обитателей' },
  { scale: 'security', text: 'Обеспечивать приватность (неприкосновенность)' },
  { scale: 'security', text: 'Демонстрировать статус обитателя' },
  { scale: 'security', text: 'Демонстрировать уровень достатка' },
  { scale: 'security', text: 'Демонстрировать силу власти' },
  { scale: 'pragmatic', text: 'Быть доступным (территориально и финансово)' },
  { scale: 'pragmatic', text: 'Быть просторным' },
  { scale: 'pragmatic', text: 'Дать возможность перемещаться' },
  { scale: 'pragmatic', text: 'Дать возможность ухаживать за собой' },
  { scale: 'pragmatic', text: 'Дать возможность питаться в своем режиме' },
  { scale: 'pragmatic', text: 'Дать возможность спать, когда хочется' },
  { scale: 'pragmatic', text: 'Быть укрытием' },
  { scale: 'pragmatic', text: 'Быть целью возвращения' },
  { scale: 'pragmatic', text: 'Быть безопасным' },
  { scale: 'pragmatic', text: 'Дать возможность читать' },
  { scale: 'pragmatic', text: 'Дать возможность слушать музыку' },
  { scale: 'pragmatic', text: 'Дать возможность смотреть фильмы' },
  { scale: 'pragmatic', text: 'Дать возможность пользоваться Интернетом' },
  { scale: 'development', text: 'Дать возможность для семейных развлечений' },
  { scale: 'pragmatic', text: 'Дать возможность принимать гостей' },
  { scale: 'pragmatic', text: 'Дать возможность управлять общением' },
  { scale: 'pragmatic', text: 'Позволить организовывать день' },
  { scale: 'pragmatic', text: 'Позволять заниматься разными видами деятельности' },
  { scale: 'pragmatic', text: 'Позволить чувствовать себя на «своей» территории' },
  { scale: 'pragmatic', text: 'Позволить изменять облик жилища' },
  { scale: 'pragmatic', text: 'Позволить восстановить силы' },
  { scale: 'pragmatic', text: 'Позволить ничего не делать и ни о чем не заботиться' },
  { scale: 'pragmatic', text: 'Давать силы и вдохновение' },
  { scale: 'development', text: 'Хранить семейную историю' },
  { scale: 'pragmatic', text: 'Быть местом для хобби и увлечений' },
  { scale: 'pragmatic', text: 'Позволить иметь домашних животных' },
  { scale: 'development', text: 'Задавать правила и режим жизни' },
  { scale: 'stability', text: 'Задавать границы личного пространства обитателей и зоны для разных видов деятельности' },
  { scale: 'development', text: 'Допускать домашние ритуалы' },
  { scale: 'development', text: 'Давать информацию чувствам: слуху, зрению, обонянию' },
  { scale: 'development', text: 'Быть оригинальным' },
  { scale: 'development', text: 'Быть красивым' },
  { scale: 'development', text: 'Быть чистым' },
  { scale: 'development', text: 'Обеспечивать общение с соседями' },
  { scale: 'development', text: 'Поддаваться контролю со стороны его обитателей' },
  { scale: 'development', text: 'Напоминать о детстве' },
  { scale: 'development', text: 'Напоминать о событиях жизни' },
  { scale: 'development', text: 'Обладать историей' },
  { scale: 'stability', text: 'Позволить выбрать, чем заниматься' },
  { scale: 'stability', text: 'Обеспечивать чувство стабильности' },
  { scale: 'stability', text: 'Быть комфортным' },
  { scale: 'stability', text: 'Быть практичным' },
  { scale: 'stability', text: 'Быть добротным' },
  { scale: 'stability', text: 'Быть технологичным' },
  { scale: 'pragmatic', text: 'Позволять развиваться' },
  { scale: 'development', text: 'Содержать много интересных или полезных предметов' },
];

const questions: SeedSection['questions'] = items.map((item, index) => ({
  code: `test_2019_${index + 1}`,
  text: `Мой дом должен (может)… ${item.text}`,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2019',
  title: 'Функциональность домашней среды (ФДС)',
  description: 'Опросник оценивает функциональность и дружественность домашней среды как системы возможностей жилища. Профиль охватывает повседневную практичность дома, его вклад в развитие и связь с внешним миром, стабильность и комфорт, а также защищенность и самопрезентацию обитателей. Версия авторов 2015 года подходит для изучения представлений подростков и взрослых об их реальном или желаемом жилище; результаты помогают описывать потребности и возможные уязвимые области домашней среды.',
  questions,
};

const byScale = (scale: typeof items[number]['scale']) => items.flatMap((item, index) => item.scale === scale ? [index + 1] : []);
const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'pragmatic', label: 'Прагматичность', items: byScale('pragmatic'), reverseItems: [], aggregation: 'mean' },
    { key: 'development', label: 'Развитие', items: byScale('development'), reverseItems: [], aggregation: 'mean' },
    { key: 'stability', label: 'Стабильность', items: byScale('stability'), reverseItems: [], aggregation: 'mean' },
    { key: 'security', label: 'Защищенность', items: byScale('security'), reverseItems: [], aggregation: 'mean' },
    { key: 'total', label: 'Общая функциональность домашней среды', items: Array.from({ length: 4 }, (_, index) => index + 1), reverseItems: [], aggregation: 'formula', formula: 'pragmatic + development + stability + security (sum of four subscale means)' },
  ],
};

const answers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Ручная проверка: все ответы «Совсем не нужно»', answers: answers(1), expected: { pragmatic: 1, development: 1, stability: 1, security: 1, total: 4 } },
  { title: 'Ручная проверка: все ответы «Необходимо»', answers: answers(7), expected: { pragmatic: 7, development: 7, stability: 7, security: 7, total: 28 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'nartova-bochaver-home-environment-functionality-2015-four-means-sum-v1',
};
