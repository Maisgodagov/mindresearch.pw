import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Полностью не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Более или менее не согласен' },
  { value: '4', label: 'Затрудняюсь ответить' },
  { value: '5', label: 'Более или менее согласен' },
  { value: '6', label: 'Согласен' },
  { value: '7', label: 'Полностью согласен' },
];

const texts = [
  'Если я совершаю ошибку на работе, то мои коллеги критикуют меня за это.',
  'Мой коллектив на работе может справиться со сложными и нестандартными задачами.',
  'В моем коллективе отвергаются люди, отличающиеся от других.',
  'В моем коллективе сотрудники могут рисковать (бросать вызов, задавать смелые вопросы, принимать нестандартные решения и пр.).',
  'Мне трудно просить помощи у моих коллег.',
  'В моем коллективе никто не стал бы преднамеренно вредить мне или саботировать работу.',
  'В моем коллективе мои уникальные навыки и таланты ценятся и используются.',
];

const instrument: SeedSection = {
  code: 'test_2358',
  title: 'Шкала психологической безопасности для рабочих групп (TPS-7)',
  description: 'Семипунктовая шкала Эми Эдмондсон оценивает воспринимаемую психологическую безопасность в конкретной рабочей группе: возможность признавать ошибки, просить помощь, выражать несогласие и рисковать, а также принятие различий и использование сильных сторон участников. Предназначена для работников, отвечающих о своем рабочем коллективе; результаты описывают восприятие группового климата.',
  categoryIds: ['work-organization'],
  questions: texts.map((text, index) => ({
    code: `test_2358_${index + 1}`,
    text,
    type: 'single',
    required: true,
    options,
  })),
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [{
    key: 'psychological_safety',
    label: 'Психологическая безопасность рабочей группы',
    items: [1, 2, 3, 4, 5, 6, 7],
    reverseItems: [1, 3, 5],
    aggregation: 'mean',
  }],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы нейтральны: среднее после реверсирования остается 4',
    answers: Object.fromEntries(Array.from({ length: 7 }, (_, i) => [String(i + 1), 4])),
    expected: { psychological_safety: 4 },
  },
  {
    title: 'Полное согласие: три отрицательных пункта реверсируются, среднее равно 4.43',
    answers: Object.fromEntries(Array.from({ length: 7 }, (_, i) => [String(i + 1), 7])),
    expected: { psychological_safety: 31 / 7 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'edmondson-tps7-2018-russian-psytests-v1',
};
