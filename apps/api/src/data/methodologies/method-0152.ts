import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const itemTexts = [
  'В последнее время… Я быстро устаю',
  'В последнее время… Думаю, что у меня дела лучше, чем у некоторых ребят',
  'В последнее время… Я чувствую себя свободнее',
  'В последнее время… У меня появились головокружения/слабость/подташнивание',
  'В последнее время… Учителя недовольны мной (больше замечаний)',
  'В последнее время… Мне не хватает уверенности в себе',
  'В последнее время… Я чувствую себя в безопасности',
  'В последнее время… Я избегаю трудностей',
  'В последнее время… Я могу легко расстроиться и даже заплакать',
  'В последнее время… У меня стало больше конфликтов',
  'В последнее время… Домашние задания стали интереснее',
  'В последнее время… Я хуже понимаю объяснения учителей',
  'В последнее время… Я долго переживаю неприятности',
  'В последнее время… Я не высыпаюсь',
  'В последнее время… Хочу, чтобы в 5-м классе учили прошлогодние учителя',
];

const options = [
  { value: '1', label: 'Да' },
  { value: '0', label: 'Нет' },
];

const questions: SeedSection['questions'] = itemTexts.map((text, index) => ({
  code: `test_188_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_188',
  title: 'Выявление тревожности у пятиклассников в период адаптации',
  description: 'Экспресс-методика О. Хмельницкой оценивает изменения самочувствия, связанные со школьной тревожностью в период адаптации к пятому классу. Охватывает утомляемость и телесные проявления, уверенность и безопасность, переживания о трудностях, конфликтах, учителях и учебных заданиях. Предназначена для учащихся пятых классов; результат отражает суммарный балл по авторскому ключу.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 1,
  scales: [
    {
      key: 'schoolAnxiety',
      label: 'Тревожность в период адаптации',
      items: [1, 4, 5, 6, 8, 9, 10, 12, 13, 14, 15],
      reverseItems: [2, 3, 7, 11],
      aggregation: 'sum',
    },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы «Нет» — только обратные пункты дают баллы',
    answers: Object.fromEntries(itemTexts.map((_, index) => [String(index + 1), 0])),
    expected: { schoolAnxiety: 4 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'khmelnitskaya-fifth-grade-adaptation-anxiety-15item-yes-no-v1',
};
