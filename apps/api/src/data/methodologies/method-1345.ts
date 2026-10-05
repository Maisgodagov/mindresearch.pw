import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '5', label: 'Полностью согласен' },
  { value: '4', label: 'Скорее согласен, чем не согласен' },
  { value: '3', label: 'Трудно сказать, согласен или нет' },
  { value: '2', label: 'Скорее не согласен, чем согласен' },
  { value: '1', label: 'Совсем не согласен' },
];

const items = [
  'Меня пугает, с какой скоростью принимаются решения в разных сферах жизни.',
  'Я не успеваю следить за обновлением информации в социальных сетях.',
  'Хотелось бы общаться с другими людьми в более спокойном, медленном режиме.',
  'В общении между людьми всё происходит быстрее, чем раньше.',
  'Мне близка точка зрения, что раньше было удобнее управлять информацией.',
  'В настоящее время можно чего-то достичь гораздо быстрее, чем раньше.',
  'Я теряюсь из-за быстрой смены событий.',
  'Сейчас можно сделать хорошую карьеру быстрее, чем раньше.',
  'Мне хотелось бы замедлить темп событий в окружающей меня жизни.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1373_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1373',
  title: 'Отношение к скорости социальных процессов',
  description: 'Опросник измеряет отношение к социальному ускорению как аспект субъективного времени: когнитивное осознание того, что процессы и достижения ускорились, и аффективное неприятие этого ускорения. Пункты охватывают принятие решений, общение, социальные сети, управление информацией, смену событий и карьеру. Подходит для исследовательских опросов взрослых; опубликованная проверка включала работников и выпускников профессиональных учебных заведений.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'awareness', label: 'Осознание социального ускорения', items: [4, 6, 8], reverseItems: [], aggregation: 'mean' },
    { key: 'rejection', label: 'Неприятие социального ускорения', items: [1, 2, 3, 5, 7, 9], reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Минимальные ответы дают среднее 1 по обеим шкалам',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { awareness: 1, rejection: 1 },
  },
  {
    title: 'Максимальные ответы дают среднее 5 по обеим шкалам',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 5])),
    expected: { awareness: 5, rejection: 5 },
  },
  {
    title: 'Смешанный профиль проверяет состав обеих шкал',
    answers: { '1': 5, '2': 1, '3': 3, '4': 2, '5': 4, '6': 5, '7': 2, '8': 3, '9': 1 },
    expected: { awareness: 10 / 3, rejection: 16 / 6 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'demin-stepanova-social-process-speed-2023-9items-mean-v1',
};
