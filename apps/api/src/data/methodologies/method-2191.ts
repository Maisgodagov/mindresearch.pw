import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Не согласен' },
  { value: '2', label: 'Скорее не согласен' },
  { value: '3', label: 'Затрудняюсь с ответом' },
  { value: '4', label: 'Скорее согласен' },
  { value: '5', label: 'Полностью согласен' },
];

const items = [
  'В сложной ситуации мне удается максимально концентрировать свое внимание на путях ее преодоления',
  'Когда у меня возникает состояние тревожности, его трудно остановить',
  'Я хорошо понимаю, что чувствуют другие люди еще до их общения со мной',
  'При возникновении конфликтной ситуации с кем-либо мне удается сохранить самообладание',
  'Находясь в сложной ситуации, я стараюсь упорядочить свои мысли',
  'В трудных жизненных ситуациях моя память работает плохо',
  'Я могу оценить свой уровень самоконтроля как достаточный для преодоления большинства сложных ситуаций',
  'Направляя мысли на решение конфликта, я обычно нахожу приемлемые способы его решения',
  'Я могу прочитать отношение ко мне другого человека по его глазам',
  'Состояние тревожности нарушает ход моих мыслей',
  'Я способен(на) сознательно направлять свое внимание на позитивное решение сложных жизненных проблем',
  'Я могу дать точное предсказание о поведении других людей, когда я знаю их мысли и чувства',
  'В сложных жизненных ситуациях память может меня обмануть',
  'Я не способен управлять своей тревожностью.',
  'В трудных ситуациях я не доверяю своей памяти',
  'Обычно я могу легко определить намерения другого человека',
  'Я не могу контролировать тревожные мысли в состоянии конфликта',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2205_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2205',
  title: 'Шкала метакогнитивной регуляции трудных жизненных ситуаций (МиРТЖС)',
  description: 'Методика оценивает знания человека о собственных ресурсах регуляции поведения в трудных, стрессовых или конфликтных ситуациях. Она охватывает самоконтроль поведения, контроль тревожности, функционирование памяти и интуитивное познание людей; подходит для старшеклассников, студентов и взрослых, включая учебные и профессиональные группы, спортсменов и людей в сложных ситуациях. Версия Филенко и Богомаза (2024).',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'behavior_self_control', label: 'Самоконтроль поведения', items: [1, 4, 5, 7, 8, 11], reverseItems: [], aggregation: 'mean' },
    { key: 'anxiety_control', label: 'Контроль тревожности', items: [2, 10, 14, 17], reverseItems: [2, 10, 14, 17], aggregation: 'mean' },
    { key: 'memory_functioning', label: 'Функционирование памяти', items: [6, 13, 15], reverseItems: [6, 13, 15], aggregation: 'mean' },
    { key: 'intuitive_people_cognition', label: 'Интуитивное познание людей', items: [3, 9, 12, 16], reverseItems: [], aggregation: 'mean' },
  ],
};

const answers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Все ответы «не согласен»', answers: answers(1), expected: { behavior_self_control: 1, anxiety_control: 5, memory_functioning: 5, intuitive_people_cognition: 1 } },
  { title: 'Все ответы «полностью согласен»', answers: answers(5), expected: { behavior_self_control: 5, anxiety_control: 1, memory_functioning: 1, intuitive_people_cognition: 5 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'mirtzhs-filenko-bogomaz-2024-v1',
};
