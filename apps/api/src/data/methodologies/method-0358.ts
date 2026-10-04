import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const alternatives = ['A', 'B', 'C', 'D'] as const;
const options = Array.from({ length: 101 }, (_, value) => ({ value: String(value), label: `${value} баллов` }));

const dimensions = [
  { title: 'Важнейшие характеристики', options: [
    'Организация уникальна по своим особенностям. Она подобна большой семье. Люди выглядят имеющими много общего.',
    'Организация очень динамична и проникнута предпринимательством. Люди готовы жертвовать собой и идти на риск.',
    'Организация ориентирована на результат. Главная забота — добиться выполнения задания. Люди ориентированы на соперничество и достижение поставленной цели.',
    'Организация жестко структурирована и строго контролируется. Действия людей, как правило, определяются формальными процедурами.',
  ] },
  { title: 'Общий стиль лидерства в организации', options: [
    'Общий стиль лидерства в организации представляет собой пример мониторинга, стремления помочь или научить.',
    'Общий стиль лидерства в организации служит примером предпринимательства, новаторства и склонности к риску.',
    'Общий стиль лидерства в организации служит примером деловитости, наступательности, ориентации на результат.',
    'Общий стиль лидерства в организации являет собой пример координации, четкой организации или плавного ведения дел.',
  ] },
  { title: 'Управление работниками', options: [
    'Стиль руководства в организации характеризуется поощрением совместной деятельности, единодушия и участия коллектива в принятии решений.',
    'Стиль руководства в организации характеризуется поощрением индивидуального риска, новаторства, свободы и самобытности каждого.',
    'Стиль руководства в организации характеризуется высокой требовательностью, жестким стремлением к конкурентоспособности и поощрением достижений.',
    'Стиль руководства в организации характеризуется гарантией занятости, требованием подчинения, предсказуемости и стабильности в отношениях.',
  ] },
  { title: 'Связующая сущность организации', options: [
    'Организацию связывают воедино преданность делу и взаимное доверие. Обязательность является главным качеством организации.',
    'Организацию связывают воедино приверженность новаторству и совершенствованию. Акцентируется необходимость быть на передовых рубежах.',
    'Организацию связывает воедино акцент на достижении цели и выполнении задачи. Общепринятые темы — наступательность и победа.',
    'Организацию связывают воедино формальные правила и официальная политика. Важно поддержание плавного хода деятельности организации.',
  ] },
  { title: 'Стратегические цели', options: [
    'Организация заостряет внимание на поддержании высокого доверия, открытости и соучастия.',
    'Организация акцентирует внимание на обретении новых ресурсов и решении новых проблем. Ценятся пробы нового и изыскания новых возможностей.',
    'Организация акцентирует внимание на конкурентных действиях и достижениях. Доминирует целевое напряжение сил и стремление к победе на рынке предоставления аналогичных услуг.',
    'Организация акцентирует внимание на неизменности и стабильности. Важнее всего контроль и плавность ведения дел.',
  ] },
  { title: 'Критерии успеха', options: [
    'Организация определяет успех на базе развития человеческих ресурсов, коллективной работы, увлеченности работников делом и заботой о людях.',
    'Организация определяет успех на базе обладания уникальной или новейшей технологией. Организация — лидер и новатор в данной профессионально-трудовой сфере.',
    'Организация определяет успех на базе конкурентного лидерства (опережение конкурентов).',
    'Организация определяет успех на базе надежных, стабильных показателей, четких планов, низких производственных затрат.',
  ] },
];

const questions: SeedSection['questions'] = dimensions.flatMap((dimension, dimensionIndex) =>
  (['now', 'preferred'] as const).flatMap((state) => alternatives.map((alternative, alternativeIndex) => {
    const itemNumber = dimensionIndex * 8 + (state === 'now' ? 0 : 4) + alternativeIndex + 1;
    return {
      code: `test_394_${state}_${dimensionIndex + 1}_${alternative}`,
      text: `${state === 'now' ? 'ТЕПЕРЬ' : 'ПРЕДПОЧТИТЕЛЬНО'} — ${dimension.title}. Альтернатива ${alternative}: ${dimension.options[alternativeIndex]} Распределите между альтернативами A–D ровно 100 баллов; укажите баллы для этой альтернативы.`,
      type: 'single' as const,
      required: true,
      options,
      validation: { group: `ocai_${state}_${dimensionIndex + 1}`, groupTotal: 100, alternative },
      _itemNumber: itemNumber,
    };
  })),
).map(({ _itemNumber, ...question }) => question);

export const instrument: SeedSection = {
  code: 'test_394',
  title: 'Инструмент оценки организационной культуры OCAI',
  description: 'OCAI формирует профиль текущей и предпочтительной культуры организации по четырём типам: клановому, адхократическому, рыночному и иерархическому. Шесть аспектов охватывают характеристики организации, лидерство, управление работниками, связующие ценности, стратегические цели и критерии успеха. Предназначен для сотрудников, оценивающих конкретную организацию или организационное подразделение; эта версия содержит русский бланк Камерона и Куинна.',
  questions,
};

const positions = (state: 'now' | 'preferred', alternativeIndex: number) => dimensions.map((_, dimensionIndex) => dimensionIndex * 8 + (state === 'now' ? 0 : 4) + alternativeIndex + 1);
const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 100,
  scales: [
    { key: 'now_clan', label: 'Текущий профиль: клановая культура (A)', items: positions('now', 0), reverseItems: [], aggregation: 'mean' },
    { key: 'now_adhocracy', label: 'Текущий профиль: адхократическая культура (B)', items: positions('now', 1), reverseItems: [], aggregation: 'mean' },
    { key: 'now_market', label: 'Текущий профиль: рыночная культура (C)', items: positions('now', 2), reverseItems: [], aggregation: 'mean' },
    { key: 'now_hierarchy', label: 'Текущий профиль: иерархическая культура (D)', items: positions('now', 3), reverseItems: [], aggregation: 'mean' },
    { key: 'preferred_clan', label: 'Предпочтительный профиль: клановая культура (A)', items: positions('preferred', 0), reverseItems: [], aggregation: 'mean' },
    { key: 'preferred_adhocracy', label: 'Предпочтительный профиль: адхократическая культура (B)', items: positions('preferred', 1), reverseItems: [], aggregation: 'mean' },
    { key: 'preferred_market', label: 'Предпочтительный профиль: рыночная культура (C)', items: positions('preferred', 2), reverseItems: [], aggregation: 'mean' },
    { key: 'preferred_hierarchy', label: 'Предпочтительный профиль: иерархическая культура (D)', items: positions('preferred', 3), reverseItems: [], aggregation: 'mean' },
  ],
};

const validationAnswers = Object.fromEntries(dimensions.flatMap((_, dimensionIndex) => [
  ...alternatives.map((__, alternativeIndex) => [String(dimensionIndex * 8 + alternativeIndex + 1), [55, 20, 20, 5][alternativeIndex]] as const),
  ...alternatives.map((__, alternativeIndex) => [String(dimensionIndex * 8 + 4 + alternativeIndex + 1), [35, 30, 25, 10][alternativeIndex]] as const),
]));
const validationCases: ValidationCase[] = [
  { title: 'Ручная проверка: опубликованные профили из примера 55/20/20/5 и 35/30/25/10', answers: validationAnswers, expected: { now_clan: 55, now_adhocracy: 20, now_market: 20, now_hierarchy: 5, preferred_clan: 35, preferred_adhocracy: 30, preferred_market: 25, preferred_hierarchy: 10 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'ocai-cameron-quinn-ru-six-dimensions-100point-profile-mean-v1',
};
