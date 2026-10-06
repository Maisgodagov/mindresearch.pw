import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '3', label: 'Очень неприятно / страшно (красная карточка)' },
  { value: '2', label: 'Немного неприятно (зелёная карточка)' },
  { value: '0', label: 'Не страшно (жёлтая или голубая карточка)' },
];

const items = [
  'Отвечаешь у доски на занятии.',
  'Тебя ругает мама или папа.',
  'Встречаешься с ребятами из детского сада.',
  'Пойдёшь в гости к незнакомым людям.',
  'Ты дома остаёшься один.',
  'Сам подходишь разговаривать с воспитателем.',
  'Не можешь справиться с заданием на занятии.',
  'Сравниваешь себя с другими ребятами.',
  'Думаешь о своих делах.',
  'На тебя смотрят как на маленького.',
  'Ты часто плачешь.',
  'Воспитатель тебе неожиданно задаёт вопрос на занятии.',
  'Никто не обращает на тебя внимание на занятии, когда ты хорошо, красиво выполнил работу.',
  'С тобой не согласны, спорят с тобой.',
  'Встречаешься со старшими ребятами во дворе, в подъезде.',
  'На тебя не обращают внимания, когда ты что-то делаешь, играешь.',
  'Тебе снятся страшные сны.',
  'Воспитатель даёт трудное задание.',
  'Выбираешь в игре главные роли.',
  'Оценивают твою работу дома или ребята.',
  'Не понимаешь объяснения воспитателя.',
  'Ребята смеются, когда отвечаешь на занятии.',
  'Смотришь ужасы по телевизору, рассказывают тебе «страшные» истории.',
  'Думаешь о том, что будет, когда ты вырастешь большим.',
  'На тебя сердятся (непонятно почему) взрослые (мама, папа, воспитательница).',
  'Воспитатель оценивает твою работу, которую ты выполнил на занятии.',
  'На тебя смотрят (наблюдают за тобой), когда ты что-то делаешь.',
  'У тебя что-то не получается.',
  'Ребята с тобой не играют (не берут никогда в игру), не дружат с тобой.',
  'Воспитатель тебе делает замечание на занятии.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2470_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2470',
  title: 'Шкала тревожности ребёнка (Г. Я. Кудрина)',
  description: 'Методика выявляет ситуации, которые ребёнок считает источниками тревоги и страхов. Она охватывает учебные ситуации детского сада, представления ребёнка о себе и межличностное общение; предназначена для беседы с детьми старшего дошкольного возраста и помогает автору опроса увидеть области переживаний, требующие внимания.',
  categoryIds: ['mood-anxiety'],
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 3,
  scales: [
    { key: 'educational', label: 'Учебная тревожность', items: [1, 6, 7, 12, 13, 18, 21, 22, 26, 30], reverseItems: [], aggregation: 'sum' },
    { key: 'self_evaluative', label: 'Самооценочная тревожность', items: [5, 8, 9, 11, 17, 19, 20, 23, 24, 28], reverseItems: [], aggregation: 'sum' },
    { key: 'interpersonal', label: 'Межличностная тревожность', items: [2, 3, 4, 10, 14, 15, 16, 25, 27, 29], reverseItems: [], aggregation: 'sum' },
    { key: 'total', label: 'Общий показатель тревожности', items: Array.from({ length: 30 }, (_, index) => index + 1), reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ситуации не страшны: нулевые суммы',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 0])),
    expected: { educational: 0, self_evaluative: 0, interpersonal: 0, total: 0 },
  },
  {
    title: 'Красная карточка во всех ситуациях: 30 баллов по каждому разделу',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 3])),
    expected: { educational: 30, self_evaluative: 30, interpersonal: 30, total: 90 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'kudrina-child-anxiety-scale-senior-preschool-ru-v1',
};
