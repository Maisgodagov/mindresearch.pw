import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const answerOptions = Array.from({ length: 10 }, (_, index) => ({ value: String(index + 1), label: String(index + 1) }));

const items = [
  'Хочу быть сильным.',
  'Хочу быть стройным, красивым.',
  'Хочу быть здоровым.',
  'Посоветовали врачи.',
  'Хочу научиться выполнять упражнения избранного вида спорта.',
  'Нравится узнавать что-то новое (элементы, связки, движения и т. д.).',
  'Получаю удовольствие, узнавая и выполняя что-то новое (элементы техники; комбинации и т. д.).',
  'Хочу заниматься вместе с друзьями.',
  'Хочу найти новых друзей, познакомиться с другими ребятами.',
  'Нечего делать в свободное время.',
  'Мне нравится участвовать в соревнованиях, побеждать.',
  'Хочу чувствовать себя увереннее.',
  'Хочу выделиться среди ребят.',
  'Хочу добиться значительных результатов (стать чемпионом города; стать мастером спорта и т. д.).',
  'Хочу нравиться сверстникам противоположного пола.',
  'Хочу научиться преодолевать себя, быть настойчивым и упорным в достижении цели.',
  'Хочу тренироваться с ребятами в одной команде.',
  'Нравится чувствовать себя членом команды.',
  'Соревноваться «за команду» не так страшно, как самостоятельно «за себя».',
  'Хочу приносить пользу команде (очки, баллы и т. д.).',
  'Занимаюсь, потому что много играем на тренировках.',
  'Мне нравится тренироваться «для себя», а не «на результат».',
  'Нравится, когда ребята называют спортсменом.',
  'Нравится быть спортсменом.',
  'Я занимаюсь, потому что родители хотят этого.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1457_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: answerOptions,
}));

export const instrument: SeedSection = {
  code: 'test_1457',
  title: 'Почему ты занимаешься спортом? (форма Б)',
  description: 'Методика оценивает мотивацию к занятиям спортом у юных спортсменов старшего дошкольного, младшего школьного и подросткового возраста. Она показывает выраженность мотивов здоровья, познания, общения, самоутверждения и спортивных результатов, команды, процесса тренировок и влияния родителей; профиль помогает автору опроса понять, какие стороны спортивного опыта поддерживают участие ребёнка.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 10,
  scales: [
    { key: 'health', label: 'Мотивы здоровья', items: [1, 2, 3, 4], reverseItems: [], aggregation: 'mean' },
    { key: 'cognitive', label: 'Познавательные мотивы', items: [5, 6, 7], reverseItems: [], aggregation: 'mean' },
    { key: 'communication', label: 'Коммуникативные мотивы', items: [8, 9, 10], reverseItems: [], aggregation: 'mean' },
    { key: 'self_assertion', label: 'Мотивы самоутверждения / результативные мотивы', items: [11, 12, 13, 14, 15, 16], reverseItems: [], aggregation: 'mean' },
    { key: 'team', label: 'Мотивы команды', items: [17, 18, 19, 20], reverseItems: [], aggregation: 'mean' },
    { key: 'process', label: 'Процессуальные мотивы', items: [21, 22, 23, 24], reverseItems: [], aggregation: 'mean' },
    { key: 'parents', label: 'Мотивы родителей', items: [25], reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная сверка по таблице ключа: ответы 1–25 равны своим номерам',
    answers: Object.fromEntries(Array.from({ length: 25 }, (_, index) => [String(index + 1), index + 1])),
    expected: { health: 2.5, cognitive: 6, communication: 9, self_assertion: 14, team: 18.5, process: 23, parents: 25 },
  },
  {
    title: 'Постоянный ответ 1 даёт среднее 1 по каждой шкале',
    answers: Object.fromEntries(Array.from({ length: 25 }, (_, index) => [String(index + 1), 1])),
    expected: { health: 1, cognitive: 1, communication: 1, self_assertion: 1, team: 1, process: 1, parents: 1 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'khvatskaya-latysheva-why-sport-form-b-mean-7scales-v1',
};
