import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Полностью не согласен' },
  { value: '2', label: 'Скорее не согласен' },
  { value: '3', label: 'Скорее согласен' },
  { value: '4', label: 'Полностью согласен' },
];

const statements = [
  'Порой я не знаю, существую ли я на самом деле',
  'Я доволен (довольна) своим здоровьем',
  'Я способен (способна) изменить свою жизнь в лучшую сторону',
  'Интернет позволяет человеку «убежать» из собственного тела',
  'Меня преследует ощущение нереальности того, что происходит вокруг меня',
  'Мне нравится моя внешность',
  'У меня есть круг близких мне людей, с которыми мы периодически встречаемся',
  'Меня привлекает то, что, когда я нахожусь онлайн, тело исчезает, и остаются одни мысли',
  'Я как будто выброшен(а) из реальной жизни',
  'Меня устраивает моя физическая форма',
  'Я не променяю очное дружеское общение на виртуальное',
  'Я ценю Интернет за возможность на какое-то время отделаться от физического тела',
  'Мое существование похоже на сон',
  'Я забочусь о своей физической форме',
  'Я сам(а) выбираю свой жизненный путь',
  'В сети, в отличие от обычной жизни, я могу выбрать себе любое тело',
  'Моя жизнь представляется мне иллюзией',
  'Я в хорошей физической форме',
  'Я могу сам(а) о себе позаботиться',
  'Мне нравится возможность оставаться неузнанным (неузнанной) онлайн',
  'Временами мне кажется, что меня вообще не существует',
  'Я вполне здоров(а)',
  'У меня достаточно сил и здоровья, чтобы справиться с жизненными трудностями',
  'Находясь в Интернете, я забываю про свое тело, превращаясь в чистый разум',
];

const questions: SeedSection['questions'] = statements.map((text, index) => ({
  code: `test_809_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_809',
  title: 'Невоплощенность в Интернете (уточненная версия, 2023)',
  description: 'Опросник оценивает переживания технологического развоплощения и невоплощенности, связанные с интернет-средой. Он охватывает виртуализацию и переживание нереальности, принятие своего физического Я, витальность и жизненную активность вне сети, а также предпочтение технологического развоплощения. Версия включает четыре самостоятельные шкалы и подходит для изучения интернет-пользователей; исследование уточненной версии проводилось на людях 16–39 лет.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 4,
  scales: [
    { key: 'virtualization', label: 'Невоплощенность как виртуализация', items: [1, 5, 9, 13, 17, 21], reverseItems: [], aggregation: 'sum' },
    { key: 'embodied_self', label: 'Воплощенное, целостное Я', items: [2, 6, 10, 14, 18, 22], reverseItems: [], aggregation: 'sum' },
    { key: 'vitality', label: 'Витальность воплощенного Я', items: [3, 7, 11, 15, 19, 23], reverseItems: [], aggregation: 'sum' },
    { key: 'tech_disembodiment', label: 'Предпочтение технологического развоплощения', items: [4, 8, 12, 16, 20, 24], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы полностью не согласен дают сумму 6 по каждой шестипунктовой шкале',
    answers: Object.fromEntries(statements.map((_, index) => [String(index + 1), 1])),
    expected: { virtualization: 6, embodied_self: 6, vitality: 6, tech_disembodiment: 6 },
  },
  {
    title: 'Все ответы полностью согласен дают сумму 24 по каждой шестипунктовой шкале',
    answers: Object.fromEntries(statements.map((_, index) => [String(index + 1), 4])),
    expected: { virtualization: 24, embodied_self: 24, vitality: 24, tech_disembodiment: 24 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'kopteva-kalugin-kozlova-2023-refined-24item-four-subscale-sums-v1',
};
