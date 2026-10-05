import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const labels = [
  'Никогда не соответствует истине',
  'Верно очень редко',
  'Верно редко',
  'Верно иногда',
  'Верно часто',
  'Верно почти всегда',
  'Всегда верно',
];
const options = labels.map((label, index) => ({ value: String(index), label }));

const itemTexts = [
  'Я продолжаю жить независимо от того, какой у меня уровень боли.',
  'Моя жизнь идет хорошо, несмотря на то, что у меня хроническая боль.',
  'Это нормально — испытывать боль.',
  'Я с удовольствием пожертвовал бы важными вещами в своей жизни, чтобы управлять этой болью лучше.',
  'Мне не нужно контролировать мою боль, чтобы хорошо справляться со своей жизнью.',
  'Хотя многое изменилось, я живу нормальной жизнью, несмотря на свою хроническую боль.',
  'Мне нужно сконцентрироваться на способах избавиться от боли.',
  'Есть много занятий, которыми я занимаюсь, когда чувствую боль.',
  'Я веду полноценную жизнь несмотря на хроническую боль.',
  'Контроль боли менее важен, чем любая другая цель в моей жизни.',
  'Мои мысли и чувства относительно боли должны измениться, прежде чем я смогу предпринять важные шаги в своей жизни.',
  'Несмотря на боль, сейчас я придерживаюсь определенного курса в своей жизни.',
  'Контроль уровня боли имеет первостепенное значение, когда я чем-либо занимаюсь.',
  'Прежде чем строить любые серьезные планы, мне нужно для начала взять под контроль свою боль.',
  'Даже когда боль усиливается, я всё еще могу выполнять свои обязанности.',
  'Я бы лучше контролировал свою жизнь, если бы я мог контролировать свои негативные мысли по поводу боли.',
  'Я избегаю ситуаций, в которых моя боль может усилиться.',
  'Мои тревоги и опасения по поводу того, как повлияет на меня боль, совершенно верны.',
  'Какое облегчение осознавать, что мне не нужно что-то делать со своей болью, чтобы жить дальше.',
  'Мне приходится прилагать большие усилия, чтобы делать что-либо, когда я испытываю боль.',
];

export const instrument: SeedSection = {
  code: 'test_1172',
  title: 'Опросник принятия хронической боли, пересмотренный (CPAQ-R)',
  description: 'CPAQ-R оценивает принятие хронической боли через два аспекта: участие в повседневной и значимой деятельности независимо от боли и готовность испытывать боль без безуспешных попыток её избегать или контролировать. Предназначен для самооценки людьми с хронической болью; русскоязычный текст опубликован, однако сведения о психометрической адаптации на русскоязычной выборке отсутствуют.',
  questions: itemTexts.map((text, index) => ({
    code: `test_1172_${index + 1}`,
    text,
    type: 'single',
    required: true,
    options,
  })),
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 6,
  scales: [
    { key: 'activityEngagement', label: 'Участие в деятельности (0–66)', items: [1, 2, 3, 5, 6, 8, 9, 10, 12, 15, 19], reverseItems: [], aggregation: 'sum' },
    { key: 'painWillingness', label: 'Готовность к боли (0–54)', items: [4, 7, 11, 13, 14, 16, 17, 18, 20], reverseItems: [], aggregation: 'sum' },
    { key: 'total', label: 'Общий индекс принятия хронической боли (0–120)', items: Array.from({ length: 20 }, (_, index) => index + 1), reverseItems: [], aggregation: 'sum' },
  ],
};

export const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: все ответы 0 дают нулевые суммы по обеим шкалам и общему индексу',
    answers: Object.fromEntries(Array.from({ length: 20 }, (_, index) => [String(index + 1), 0])),
    expected: { activityEngagement: 0, painWillingness: 0, total: 0 },
  },
  {
    title: 'Ручная проверка: все ответы 6 дают максимумы 66, 54 и 120',
    answers: Object.fromEntries(Array.from({ length: 20 }, (_, index) => [String(index + 1), 6])),
    expected: { activityEngagement: 66, painWillingness: 54, total: 120 },
  },
  {
    title: 'Ручная проверка ключа: ответ 1 во всех пунктах; пункты готовности реверсируются по правилу 6 − ответ',
    answers: Object.fromEntries(Array.from({ length: 20 }, (_, index) => [String(index + 1), 1])),
    expected: { activityEngagement: 11, painWillingness: 9, total: 20 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'mcCracken-vowles-eccleston-cpaq-r-russian-20item-0to6-two-subscale-sums-v1',
};
