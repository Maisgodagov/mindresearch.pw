import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Абсолютно не согласен' },
  { value: '2', label: 'Скорее не согласен' },
  { value: '3', label: 'Затрудняюсь ответить' },
  { value: '4', label: 'Скорее согласен' },
  { value: '5', label: 'Полностью согласен' },
];

const items = [
  'Когда кто-то критикует отдел, в котором я работаю, это воспринимается мною как личное оскорбление.',
  'Мне очень интересно, что думают другие сотрудники об отделе, в котором я работаю.',
  'Когда я говорю о сотрудниках моего отдела, я обычно говорю «мы», а не «они».',
  'Когда кто-либо хвалит отдел, в котором я работаю, я воспринимаю это как личный комплимент.',
  'Когда кто-либо критикует отдел, в котором я работаю, я чувствую замешательство (растерянность).',
  'Когда кто-то критикует ОАО «РЖД», это воспринимается мною как личное оскорбление.',
  'Мне очень интересно, что думают другие сотрудники об ОАО «РЖД».',
  'Когда я говорю об ОАО «РЖД», я обычно говорю «мы», а не «они».',
  'Когда кто-либо хвалит ОАО «РЖД», я воспринимаю это как личный комплимент.',
  'Если бы статья в средствах массовой информации критиковала ОАО «РЖД», я бы почувствовал замешательство (растерянность, обиду).',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1030_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1030',
  title: 'Опросник Ю. Липпонена: идентификация с подразделением и организацией',
  description: 'Десятипунктный вариант для работающих сотрудников оценивает организационную идентификацию на двух уровнях: с непосредственным подразделением и с организацией в целом. Пункты охватывают переживание критики и похвалы как относящихся к себе, интерес к мнению окружающих и употребление «мы» при описании группы. В доступном русском бланке организационный блок конкретизирован для ОАО «РЖД»; перед применением в другой организации этот контекст требует отдельной подтверждённой версии.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'department', label: 'Идентификация с подразделением', items: [1, 2, 3, 4, 5], reverseItems: [], aggregation: 'sum' },
    { key: 'organization', label: 'Идентификация с организацией', items: [6, 7, 8, 9, 10], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  { title: 'Минимальные ответы по обеим шкалам', answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])), expected: { department: 5, organization: 5 } },
  { title: 'Максимальные ответы по обеим шкалам', answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 5])), expected: { department: 25, organization: 25 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'lipponen-organizational-identification-arbor-rzd-10-direct-sum-v1',
};
