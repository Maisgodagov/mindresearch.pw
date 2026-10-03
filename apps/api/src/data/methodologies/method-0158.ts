import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '5', label: 'Полностью согласен' },
  { value: '4', label: 'Скорее согласен, чем не согласен' },
  { value: '3', label: 'Трудно сказать: согласен или нет' },
  { value: '2', label: 'Скорее не согласен, чем согласен' },
  { value: '1', label: 'Совсем не согласен' },
];

const items = [
  'Я легко могу адаптироваться к изменениям в своей работе',
  'Я легко могу сменить организацию, если это необходимо',
  'Я могу адаптироваться к изменениям внутри моей организации',
  'Обычно я предвижу и быстро использую изменения в трудовой обстановке',
  'У меня очень негативное отношение к изменениям моих функций на работе',
  'Мне нравится работать с новыми людьми',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_193_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_193',
  title: 'Гибкость личности в трудовой сфере',
  description: 'Экспресс-шкала для оценки принятия изменений и способности менять поведение при изменении условий на рабочем месте и рынке труда. Пункты охватывают адаптацию к изменениям в работе и организации, мобильность между организациями, использование изменений, отношение к смене функций и готовность взаимодействовать с новыми людьми. Русская адаптация Дёмина и Киреевой предназначена для исследований и прикладной оценки работающих и других взрослых, действующих на внутреннем и внешнем рынке труда.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [{
    key: 'total',
    label: 'Гибкость личности в трудовой сфере',
    items: [1, 2, 3, 4, 5, 6],
    reverseItems: [5],
    aggregation: 'sum',
  }],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы «полностью согласен»: обратный пункт перекодирован в 1',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 5])),
    expected: { total: 26 },
  },
  {
    title: 'Все ответы «совсем не согласен»: обратный пункт перекодирован в 5',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { total: 10 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'personal-flexibility-labour-demin-kireeva-2022-6item-reverse-5-v1',
};
