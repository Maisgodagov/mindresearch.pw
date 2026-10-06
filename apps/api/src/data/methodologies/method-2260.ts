import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Никогда' },
  { value: '2', label: 'Редко' },
  { value: '3', label: 'Иногда' },
  { value: '4', label: 'Часто' },
  { value: '5', label: 'Очень часто' },
];

const statements = [
  'Есть ли у вас ощущение, что ваше увлечение играми полностью поглощает вас? (Например: вы часто размышляете о том, как сыграли в прошлый раз, и с нетерпением ждете новой игровой сессии? Считаете ли вы, что компьютерные игры стали наиболее важным занятием в вашей жизни?)',
  'Испытываете ли вы раздражение, тревогу или даже грусть, когда пытаетесь уменьшить количество времени, которое тратите на игры, или пытаетесь совсем бросить играть?',
  'Испытываете ли вы потребность тратить всё больше времени за игрой для того, чтобы получить удовлетворение или удовольствие?',
  'Преследуют ли вас постоянные неудачи, когда вы пытаетесь контролировать время, проводимое за играми, или пытаетесь бросить играть?',
  'Утратили ли вы Интерес к своим прежним хобби и прочим видам развлечений в результате увлечения компьютерными играми?',
  'Продолжаете ли вы играть тогда, когда знаете, что это приводит к проблемам между вами и другими людьми?',
  'Приходилось ли вам когда-либо обманывать членов своей семьи, психотерапевта или других людей по поводу количества времени, которые вы тратите на игры?',
  'Играете ли вы в игры для того, чтобы временно устраниться от проблем или избавиться от плохого настроения (например, беспомощность, чувство вины, тревожность)?',
  'Страдают ли из-за вашего увлечения играми важные отношения, работа, учеба или возможности вашего карьерного роста?',
];

const questions: SeedSection['questions'] = statements.map((text, index) => ({
  code: `test_2278_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2278',
  title: 'Шкала оценки зависимости от Интернет-игр (IGDS9-SF), русская версия',
  description: 'Краткая скрининговая шкала оценивает выраженность девяти критериев расстройства, связанного с интернет-играми, включая поглощённость играми, потерю контроля, симптомы отмены, толерантность и негативные последствия для отношений, учёбы и работы. Русская адаптация предназначена для оценки игрового поведения геймеров; результат отражает выраженность признаков, а не заменяет клиническую диагностику.',
  categoryIds: ['cyberpsychology'],
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'total', label: 'Общая выраженность признаков IGD (сумма, 9–45)', items: Array.from({ length: 9 }, (_, i) => i + 1), reverseItems: [], aggregation: 'sum' },
    { key: 'criteria_very_often', label: 'Критерии с ответом «Очень часто» (0–9)', items: Array.from({ length: 9 }, (_, i) => i + 1), reverseItems: [], weights: Object.fromEntries(Array.from({ length: 9 }, (_, i) => [i + 1, 0])), aggregation: 'sum' },
  ],
};

// The criterion count is separately tallied by threshold; generic weighted
// scoring cannot express per-item thresholding, so only total is registered.
scoringConfig.scales = [scoringConfig.scales[0]];

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: ответы 1–9 суммируются без реверсивных пунктов',
    answers: Object.fromEntries(Array.from({ length: 9 }, (_, i) => [String(i + 1), i + 1 <= 5 ? 1 : 2])),
    expected: { total: 13 },
  },
  {
    title: 'Ручная проверка: все ответы «Очень часто» дают 45 баллов',
    answers: Object.fromEntries(Array.from({ length: 9 }, (_, i) => [String(i + 1), 5])),
    expected: { total: 45 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'igds9-sf-russian-adaptation-petrov-chernyak-2019-sum-1-to-5-v1',
};
