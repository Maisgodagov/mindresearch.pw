import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Полностью не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Кое в чем не согласен' },
  { value: '4', label: 'Ни то, ни другое' },
  { value: '5', label: 'Кое в чем согласен' },
  { value: '6', label: 'Согласен' },
  { value: '7', label: 'Полностью согласен' },
];

const items = [
  'Мне требуется много времени, чтобы «раскачаться» и начать действовать.',
  'Я планирую мои дела ежедневно.',
  'Меня выводят из себя и выбивают из привычного графика непредвиденные дела.',
  'Обычно я намечаю программу на день и стараюсь ее выполнить.',
  'Мне бывает трудно завершить начатое.',
  'Я не могу отказаться от начатого дела, даже если оно мне «не по зубам».',
  'Я знаю, чего хочу, и делаю всё, чтобы этого добиться.',
  'Я заранее выстраиваю план предстоящего дня.',
  'Мне более важно то, что я делаю и переживаю в данный момент, а не то, что будет или было.',
  'Я могу начать делать несколько дел и ни одно из них не закончить.',
  'Я планирую мои повседневные дела согласно определенным принципам.',
  'Я считаю себя человеком, живущим «здесь-и-сейчас».',
  'Я не могу перейти к другому делу, если не завершил предыдущего.',
  'Я считаю себя целенаправленным человеком.',
  'Вместо того чтобы заниматься делами, я часто попусту трачу время.',
  'Мне нравится вести дневник и фиксировать в нем происходящее со мной.',
  'Иногда я даже не могу заснуть, вспомнив о недоделанных делах.',
  'У меня есть к чему стремиться.',
  'Мне нравится пользоваться ежедневником и иными средствами планирования времени.',
  'Моя жизнь направлена на достижение определенных результатов.',
  'У меня бывают трудности с упорядочением моих дел.',
  'Мне нравится писать отчеты по итогам работы.',
  'Я ни к чему не стремлюсь.',
  'Если я не закончил какое-то дело, то это не выходит у меня из головы.',
  'У меня есть главная цель в жизни.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1218_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1218',
  title: 'Опросник самоорганизации деятельности (ОСД)',
  description: 'ОСД оценивает самоорганизацию деятельности через шесть аспектов: планомерность, целеустремленность, настойчивость, фиксацию на структурированном распорядке, использование внешних средств организации и ориентацию на настоящее. Подходит для русскоязычных взрослых и старших подростков в исследовательских и опросных задачах; это версия из публикации Е. Ю. Мандриковой 2010 года.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'planning', label: 'Планомерность', items: [2, 4, 8, 11], reverseItems: [], aggregation: 'sum' },
    { key: 'goal_directedness', label: 'Целеустремленность', items: [7, 14, 18, 20, 23, 25], reverseItems: [23], aggregation: 'sum' },
    { key: 'persistence', label: 'Настойчивость', items: [1, 5, 10, 15, 21], reverseItems: [1, 5, 10, 15, 21], aggregation: 'sum' },
    { key: 'fixation', label: 'Фиксация на структурировании деятельности', items: [3, 6, 13, 17, 24], reverseItems: [], aggregation: 'sum' },
    { key: 'self_organization', label: 'Самоорганизация с помощью внешних средств', items: [16, 19, 22], reverseItems: [], aggregation: 'sum' },
    { key: 'present_orientation', label: 'Ориентация на настоящее', items: [9, 12], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: все ответы 1; пункты 1, 5, 10, 15, 21 и 23 реверсируются в 7',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: {
      planning: 4,
      goal_directedness: 12,
      persistence: 35,
      fixation: 5,
      self_organization: 3,
      present_orientation: 2,
    },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'osd-mandrikova-2010-25item-v1',
};
