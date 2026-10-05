import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const questions: SeedSection['questions'] = [
  {
    code: 'test_842_1',
    text: 'Как вы оцениваете свою принадлежность классу?',
    type: 'single', required: true,
    options: [
      { value: '5', label: 'Считаю себя активным, полноправным членом коллектива.' },
      { value: '4', label: 'Участвую в большинстве дел класса, но часть одноклассников делают это активнее меня.' },
      { value: '3', label: 'Участвую примерно в половине дел класса.' },
      { value: '2', label: 'Не чувствую привязанности к классу и в его делах участвую редко.' },
      { value: '1', label: 'Делами класса не интересуюсь и участвовать в них не желаю.' },
    ],
  },
  {
    code: 'test_842_2',
    text: 'Хотели бы вы перейти в другой класс, если бы представилась такая возможность?',
    type: 'single', required: true,
    options: [
      { value: '1', label: 'Очень хотел бы.' },
      { value: '2', label: 'Скорее всего, перешел бы, чем остался.' },
      { value: '3', label: 'Не вижу никакой разницы.' },
      { value: '4', label: 'Скорее всего, остался бы в своем классе.' },
      { value: '5', label: 'Очень хотел бы остаться в своем классе.' },
    ],
  },
  {
    code: 'test_842_3',
    text: 'Взаимоотношения учащихся в вашем классе.',
    type: 'single', required: true,
    options: [
      { value: '3', label: 'Лучше, чем в других классах.' },
      { value: '2', label: 'Такие же, как в других классах.' },
      { value: '1', label: 'Хуже, чем в других классах.' },
    ],
  },
  {
    code: 'test_842_4',
    text: 'Взаимоотношения учеников вашего класса с учителями.',
    type: 'single', required: true,
    options: [
      { value: '3', label: 'Лучше, чем в других классах.' },
      { value: '2', label: 'Такие же, как в других классах.' },
      { value: '1', label: 'Хуже, чем в других классах.' },
    ],
  },
  {
    code: 'test_842_5',
    text: 'Отношение одноклассников к учебе.',
    type: 'single', required: true,
    options: [
      { value: '3', label: 'Лучше, чем в других классах.' },
      { value: '2', label: 'Такое же, как в других классах.' },
      { value: '1', label: 'Хуже, чем в других классах.' },
    ],
  },
];

export const instrument: SeedSection = {
  code: 'test_842',
  title: 'Определение привлекательности для школьника группы одноклассников',
  description: 'Модификация индекса групповой сплочённости Сишора оценивает привлекательность классного коллектива для школьника через чувство принадлежности и участие в делах класса, желание остаться в классе, отношения между учениками и с учителями, а также отношение одноклассников к учёбе. Подходит для школьников, оценивающих свой текущий класс; профиль ответов помогает автору опроса увидеть воспринимаемые сильные стороны и источники напряжённости.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [{ key: 'attractiveness', label: 'Привлекательность группы одноклассников', items: [1, 2, 3, 4, 5], reverseItems: [], aggregation: 'sum' }],
};

const allAnswers = (value: number) => Object.fromEntries(questions.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Ручной контроль: минимальная привлекательность (1 + 1 + 1 + 1 + 1)', answers: allAnswers(1), expected: { attractiveness: 5 } },
  { title: 'Ручной контроль: ответы с опубликованными баллами (5 + 5 + 3 + 3 + 3)', answers: { '1': 5, '2': 5, '3': 3, '4': 3, '5': 3 }, expected: { attractiveness: 19 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'ivashkin-classmate-group-attractiveness-1990-v1',
};
