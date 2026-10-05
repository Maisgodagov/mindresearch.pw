import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Совершенно не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Скорее не согласен, чем согласен' },
  { value: '4', label: 'Нейтрален / не могу определиться' },
  { value: '5', label: 'Скорее согласен, чем не согласен' },
  { value: '6', label: 'Согласен' },
  { value: '7', label: 'Полностью согласен' },
];

const items = [
  'На территории России должны жить только те граждане, которые любят ее всем сердцем.',
  'Люди, критически оценивающие историческое прошлое России, не могут считаться истинными патриотами.',
  'Не стоит стремиться менять сформировавшийся в России уклад жизни.',
  'В мире так много критики в адрес России, что мы — ее граждане — не должны критиковать свою страну.',
  'Непатриотично критиковать страну, в которой ты живешь.',
  'Нужно упорно учиться, чтобы, получив востребованную профессию, помогать нашей стране двигаться по пути позитивных изменений.',
  'Тот, кто по-настоящему любит Россию, стремится стать специалистом, который может разрешать возникающие в стране трудности.',
  'Любовь к России выражается, в том числе, в заботе о ее экологическом благополучии.',
  'Патриотизм проявляется в готовности включаться в волонтерскую работу, направленную на помощь тем соотечественникам, которые в ней нуждаются.',
  'Позитивное развитие России зависит от готовности людей активно включаться в мероприятия, которые улучшают повседневную жизнь (праздники, субботники и т. д.).',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1020_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1020',
  title: 'Опросник конструктивного патриотизма (подростковая версия)',
  description: 'Опросник измеряет две формы патриотических установок у старших подростков 14–18 лет: слепой патриотизм, связанный с безусловной поддержкой страны и отказом от критики, и конструктивный патриотизм, выраженный в готовности содействовать позитивным изменениям, профессиональному и общественному развитию. Профиль помогает автору опроса различать эти аспекты отношения к стране; это подростковая версия Васильевой и Микляевой, а не исходный взрослый опросник Шатца.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'blindPatriotism', label: 'Слепой патриотизм', items: [1, 2, 3, 4, 5], reverseItems: [], aggregation: 'sum' },
    { key: 'constructivePatriotism', label: 'Конструктивный патриотизм', items: [6, 7, 8, 9, 10], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: нейтральный ответ во всех пунктах',
    answers: Object.fromEntries(Array.from({ length: 10 }, (_, index) => [String(index + 1), 4])),
    expected: { blindPatriotism: 20, constructivePatriotism: 20 },
  },
  {
    title: 'Ручная проверка: крайние значения по двум шкалам',
    answers: { '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 3, '7': 4, '8': 5, '9': 6, '10': 7 },
    expected: { blindPatriotism: 15, constructivePatriotism: 25 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'vasileva-miklyaeva-constructive-patriotism-adolescent-2023-v1',
};
