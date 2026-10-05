import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = Array.from({ length: 9 }, (_, index) => ({
  value: String(index + 1),
  label: index === 0 ? 'Абсолютно не согласен' : index === 8 ? 'Абсолютно согласен' : String(index + 1),
}));

const items = [
  'Мне не нравится общаться с партнёрами по команде.',
  'Меня не удовлетворяет количество времени, которое я провожу в игре.',
  'Я не буду скучать по игрокам своей команды после окончания сезона.',
  'Я не доволен уровнем стремления моей команды победить.',
  'Среди партнёров по команде есть мои лучшие друзья.',
  'Эта команда не даёт мне возможность улучшить свой личный результат.',
  'Другие тусовки мне нравятся больше, чем командные.',
  'Мне не нравится стиль игры в моей команде.',
  'Большую роль в моей жизни играет общение с партнёрами по команде.',
  'Мы все, как один, стремимся достигнуть наилучших результатов.',
  'Игроки нашей команды предпочитают проводить свободное время вне команды.',
  'Мы нашей командой несём ответственность за поражение или плохую игру.',
  'Наши игроки по команде редко собираются вместе.',
  'У игроков нашей команды возникают разногласия по поводу игры.',
  'Наша команда хотела бы провести время вместе после сезона.',
  'Если у кого-то из игроков возникают проблемы на тренировках, все ему помогают.',
  'Партнёры по команде вне поля не держатся вместе.',
  'Во время тренировочного процесса и игры партнёры не обсуждают ответственность каждого игрока.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1256_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1256',
  title: 'Опросник сплочённости спортивной команды (GEQ)',
  description: 'Опросник оценивает сплочённость спортивной команды по четырём аспектам: личную привлекательность отношений с командой, личную привлекательность командной деятельности, единство команды в общении и единство в достижении спортивных результатов. Подходит для изучения игроков конкретной команды; русская версия опубликована и проверена на подростковых и взрослых футболистах.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 9,
  scales: [
    { key: 'io', label: 'Индивидуальная привлекательность отношений (ИО)', items: [1, 3, 5, 7, 9], reverseItems: [1, 3, 7], aggregation: 'mean' },
    { key: 'id', label: 'Индивидуальная привлекательность деятельности (ИД)', items: [2, 4, 6, 8], reverseItems: [2, 4, 6, 8], aggregation: 'mean' },
    { key: 'go', label: 'Групповое единство в общении (ГО)', items: [11, 13, 15, 17], reverseItems: [11, 13, 17], aggregation: 'mean' },
    { key: 'gd', label: 'Групповое единство в деятельности (ГД)', items: [10, 12, 14, 16, 18], reverseItems: [14, 18], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы 5: после реверсирования средние равны 5',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 5])),
    expected: { io: 5, id: 5, go: 5, gd: 5 },
  },
  {
    title: 'Все утверждения поддерживают сплочённость: крайние согласия дают 9 по четырём шкалам',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), [5, 9, 10, 12, 15, 16].includes(index + 1) ? 9 : 1])),
    expected: { io: 9, id: 9, go: 9, gd: 9 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'geq-devishvili-mdivani-korneev-2016-nine-point-reverse-12-v1',
};
