import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const answers = [
  'Совсем не похоже',
  'Мало похоже',
  'Не очень похоже',
  'В равной степени похоже и не похоже',
  'Достаточно похоже',
  'В значительной степени похоже',
  'Очень похоже',
].map((label, index) => ({ value: String(index + 1), label }));

const items = [
  'Предлагает оригинальные идеи',
  'Генерирует большое количество идей',
  'Заражает энтузиазмом',
  'Может держать в голове и работать с несколькими идеями одновременно',
  'Всегда найдет выход из тупиковой ситуации',
  'Не создает новое, а улучшает то, что уже есть',
  'Смотрит на привычные проблемы под другим углом',
  'Часто идет на риск, действуя не по шаблону',
  'Предпочитает вносить разнообразие в обыденные/повседневные задачи',
  'Отстаивает свое мнение в случае разногласий с группой',
  'Получает драйв от частых изменений',
  'Предпочитает, чтобы изменения происходили постепенно',
  'Подходит к делу основательно и тщательно',
  'Скрупулезно прорабатывает детали',
  'Методичен(а) и организован(а)',
  'С удовольствием занимается кропотливой работой',
  'Последователен(а)',
  'Устанавливает строгий порядок в рабочих процессах, за которые отвечает',
  'Старается не выделяться из толпы',
  'Легко соглашается с мнением команды на работе',
  'Предпочитает не нарушать правила даже при необходимости',
  'Не действует, если нет полномочий',
  'С осторожностью берет на себя полномочия',
  'Предпочитает работу, которая выполняется на основе четких инструкций',
  'Предсказуем(а)',
  'Предпочитает коллег, которые не нарушают стабильность',
  'Делится идеями, только когда они востребованы',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_874_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: answers,
}));

export const instrument: SeedSection = {
  code: 'test_874',
  title: 'Опросник «Адаптор — инноватор»',
  description: 'Русскоязычная адаптация опросника Киртона для учителей и администрации школ измеряет когнитивный стиль в рабочих ситуациях по трём аспектам: оригинальность и независимость, доскональность и самоорганизованность, инертность и запрос на инструкции. Помогает исследовать способы генерации идей, отношения к последовательной проработке задач, правилам и стабильности в образовательных коллективах; авторы также допускают применение в близких группах образовательной и социальной сфер.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'originality_independence', label: 'Оригинальность и независимость', items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], reverseItems: [], aggregation: 'sum' },
    { key: 'thoroughness_self_organization', label: 'Доскональность и самоорганизованность', items: [12, 13, 14, 15, 16, 17, 18], reverseItems: [], aggregation: 'sum' },
    { key: 'inertia_instruction_request', label: 'Инертность и запрос на инструкции', items: [19, 20, 21, 22, 23, 24, 25, 26, 27], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: все ответы 1 дают минимумы трёх шкал',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { originality_independence: 11, thoroughness_self_organization: 7, inertia_instruction_request: 9 },
  },
  {
    title: 'Ручная проверка: все ответы 7 дают максимумы трёх шкал',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 7])),
    expected: { originality_independence: 77, thoroughness_self_organization: 49, inertia_instruction_request: 63 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'andreeva-sternik-khavenson-adaptor-innovator-2024-ru-v1',
};
