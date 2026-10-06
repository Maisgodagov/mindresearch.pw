import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Ни разу' },
  { value: '2', label: 'Редко' },
  { value: '3', label: 'Иногда' },
  { value: '4', label: 'Довольно часто' },
  { value: '5', label: 'Часто' },
  { value: '6', label: 'Очень часто' },
  { value: '7', label: 'Постоянно' },
];

const items = [
  'Улучшать процесс работы, чтобы его можно было выполнять лучше или быстрее.',
  'Приходить на работу в выходные дни или работать дома.',
  'Помогать коллеге, у которого много работы.',
  'Предлагать новые способы выполнения работы.',
  'Приходить на работу раньше остальных.',
  'Помогать новым сотрудникам освоиться на работе.',
  'Вносить предложения по улучшению продукта или услуги.',
  'Выходить на работу, даже если плохо себя чувствую.',
  'Консультировать коллег по вопросам, в которых я хорошо разбираюсь.',
  'Искать способы сделать работу подразделения более эффективной.',
  'Возвращаться из отпуска или с больничного раньше срока по производственной необходимости.',
  'Подменять коллегу, если он не может выйти на работу.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2516_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2516',
  title: 'Шкала экстраролевого трудового поведения',
  description: 'Самооценочная шкала частоты трудовых действий, выходящих за пределы формальных ожиданий руководителей и коллег. Профиль охватывает инициативы по совершенствованию выполнения работы, сверхурочное выполнение и помощь коллегам; предназначена для работающих взрослых в версии Б. Г. Ребзуева.',
  categoryIds: ['work'],
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'improvement', label: 'Совершенствование выполнения', items: [1, 4, 7, 10], reverseItems: [], aggregation: 'mean' },
    { key: 'overtime', label: 'Сверхурочное выполнение', items: [2, 5, 8, 11], reverseItems: [], aggregation: 'mean' },
    { key: 'helping', label: 'Помощь коллегам', items: [3, 6, 9, 12], reverseItems: [], aggregation: 'mean' },
    { key: 'total', label: 'Экстраролевое трудовое поведение', items: items.map((_, i) => i + 1), reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: ответы 1–12; средние субшкал и общий показатель',
    answers: Object.fromEntries(items.map((_, i) => [String(i + 1), i + 1])),
    expected: { improvement: 5.5, overtime: 6.5, helping: 7.5, total: 6.5 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'rebzuev-extra-role-work-behavior-2009-v1',
};
