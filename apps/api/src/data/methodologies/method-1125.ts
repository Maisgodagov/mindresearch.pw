import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const responseLabels = [
  'Во мне не произошло никаких перемен после этой ситуации.',
  'Во мне произошли перемены в очень малой степени после этой ситуации.',
  'Во мне произошли перемены в малой степени после этой ситуации.',
  'Во мне произошли перемены в умеренной степени после этой ситуации.',
  'Во мне произошли перемены в большой степени после этой ситуации.',
  'Во мне произошли перемены в очень большой степени после этой ситуации.',
];

const items = [
  'У меня поменялись жизненные приоритеты.',
  'Я гораздо лучше понимаю ценность собственной жизни.',
  'У меня появились новые интересы.',
  'Я чувствую большую уверенность в себе.',
  'Я стал лучше понимать духовные проблемы.',
  'Я нахожу, что я больше рассчитываю на людей в трудную минуту.',
  'Я направил свою жизнь по новому пути.',
  'Я испытываю большую близость с окружающими.',
  'Я более охотно выражаю свои эмоции.',
  'Я лучше понимаю, что могу справляться с трудностями.',
  'Я могу сделать свою жизнь лучше.',
  'Я в большей степени способен принимать вещи такими, какие они есть.',
  'Я могу больше ценить каждый день своей жизни.',
  'У меня появились возможности, которые не были мне доступны.',
  'У меня появилось больше сострадания к людям.',
  'Я трачу больше усилий на налаживание взаимоотношений.',
  'Я с большей вероятностью попытаюсь изменить то, что нуждается в изменении.',
  'Я стал более религиозным.',
  'Я обнаружил, что я сильнее, чем я полагал.',
  'Я много узнал о том, какими бывают замечательными люди.',
  'Я стал больше признавать, что нуждаюсь в других людях.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1155_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: responseLabels.map((label, value) => ({ value: String(value), label })),
}));

export const instrument: SeedSection = {
  code: 'test_1155',
  title: 'Опросник посттравматического роста (PTGI), адаптация М. Ш. Магомед-Эминова',
  description: 'Опросник оценивает субъективно воспринимаемые позитивные изменения после пережитого кризиса или травматического события. Пять аспектов охватывают отношение к другим, новые возможности, силу личности, духовные изменения и повышение ценности жизни; подходит для взрослых, переживших значимое трудное событие, в версии PTGI из 21 пункта.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 5,
  scales: [
    { key: 'relations', label: 'Отношение к другим', items: [6, 8, 9, 15, 16, 20, 21], reverseItems: [], aggregation: 'sum' },
    { key: 'new_possibilities', label: 'Новые возможности', items: [3, 7, 11, 14, 17], reverseItems: [], aggregation: 'sum' },
    { key: 'personal_strength', label: 'Сила личности', items: [4, 10, 12, 19], reverseItems: [], aggregation: 'sum' },
    { key: 'spiritual_change', label: 'Духовные изменения', items: [5, 18], reverseItems: [], aggregation: 'sum' },
    { key: 'appreciation_of_life', label: 'Повышение ценности жизни', items: [1, 2, 13], reverseItems: [], aggregation: 'sum' },
    { key: 'total', label: 'Индекс посттравматического роста', items: Array.from({ length: 21 }, (_, index) => index + 1), reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: ответ 0 по всем пунктам даёт нулевые суммы по пяти шкалам и общему индексу',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 0])),
    expected: { relations: 0, new_possibilities: 0, personal_strength: 0, spiritual_change: 0, appreciation_of_life: 0, total: 0 },
  },
  {
    title: 'Ручная проверка: ответ 5 по всем пунктам даёт суммы, равные числу пунктов каждой шкалы, умноженному на 5',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 5])),
    expected: { relations: 35, new_possibilities: 25, personal_strength: 20, spiritual_change: 10, appreciation_of_life: 15, total: 105 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'ptgi-tedeschi-calhoun-magomed-eminov-2004-ru-v1',
};
