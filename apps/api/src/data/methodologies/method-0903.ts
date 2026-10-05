import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Совсем не похоже на меня' },
  { value: '2', label: 'Не очень похоже на меня' },
  { value: '3', label: 'Нечто среднее, не уверен' },
  { value: '4', label: 'В чем-то похоже на меня' },
  { value: '5', label: 'Очень похоже на меня' },
];

const items = [
  'Иногда я не могу сдержать желание ударить другого человека.',
  'Я прямо говорю своим друзьям, если я с ними в чем-то не согласен.',
  'Я быстро вспыхиваю, но и быстро остываю.',
  'Бывает, что я просто схожу с ума от ревности.',
  'Если меня спровоцировать, я могу ударить другого человека.',
  'Я часто не согласен с другими людьми.',
  'Я раздражаюсь, когда у меня что-то не получается.',
  'Временами мне кажется, что жизнь мне что-то недодала.',
  'Если кто-то ударит меня, я дам сдачи.',
  'Людям, которые меня раздражают, я говорю всё, что о них думаю.',
  'Иногда я чувствую, что вот-вот взорвусь.',
  'Другим постоянно везет.',
  'Я дерусь чаще, чем окружающие.',
  'Я всегда начинаю спорить с теми, кто не согласен с моим мнением.',
  'У меня спокойный характер.',
  'Я не понимаю, почему иной раз мне бывает так горько.',
  'Если для защиты моих прав мне надо применить физическую силу, я так и сделаю.',
  'Друзья говорят, что я спорщик.',
  'Некоторые мои друзья считают, что я вспыльчив.',
  'Я знаю, что мои так называемые «друзья» сплетничают обо мне.',
  'Некоторые люди своим обращением ко мне могут довести меня до драки.',
  'Иногда я выхожу из себя без особой причины.',
  'Я не доверяю слишком доброжелательным людям.',
  'Я не могу представить себе причину, достаточную, чтобы ударить другого человека.',
  'Мне трудно сдерживать раздражение.',
  'Иногда мне кажется, что люди насмехаются надо мной за глаза.',
  'Бывало, что я угрожал своим знакомым.',
  'Если человек слишком мил со мной, значит, он от меня что-то хочет.',
  'Иногда я настолько выходил из себя, что ломал вещи.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_933_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_933',
  title: 'Опросник агрессивности Басса — Перри (BPAQ), полная русская версия',
  description: 'Полная 29-пунктовая русская версия BPAQ оценивает склонность к агрессивным проявлениям у подростков 14–17 лет: физическую и вербальную агрессию, гнев и враждебность (обиду и подозрительность). Профиль помогает автору опроса описать поведенческие, эмоциональные и когнитивные компоненты агрессивности; опубликованная русская психометрическая проверка этой редакции проведена на подростковой выборке, поэтому результаты для других возрастов требуют осторожной интерпретации.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'physicalAggression', label: 'Физическая агрессия', items: [1, 5, 9, 13, 17, 21, 24, 27, 29], reverseItems: [24], aggregation: 'sum' },
    { key: 'anger', label: 'Гнев', items: [3, 7, 11, 15, 19, 22, 25], reverseItems: [15], aggregation: 'sum' },
    { key: 'hostility', label: 'Враждебность', items: [4, 8, 12, 16, 20, 23, 26, 28], reverseItems: [], aggregation: 'sum' },
    { key: 'verbalAggression', label: 'Вербальная агрессия', items: [2, 6, 10, 14, 18], reverseItems: [], aggregation: 'sum' },
    { key: 'total', label: 'Общий показатель агрессивности', items: Array.from({ length: 29 }, (_, index) => index + 1), reverseItems: [15, 24], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: минимальные ответы; обратные пункты пересчитаны в максимум',
    answers: Object.fromEntries(Array.from({ length: 29 }, (_, index) => [String(index + 1), 1])),
    expected: { physicalAggression: 13, anger: 11, hostility: 8, verbalAggression: 5, total: 37 },
  },
  {
    title: 'Ручная проверка: максимальные ответы дают минимальные обратные баллы',
    answers: Object.fromEntries(Array.from({ length: 29 }, (_, index) => [String(index + 1), 5])),
    expected: { physicalAggression: 41, anger: 29, hostility: 40, verbalAggression: 25, total: 135 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'buss-perry-bpaq-lobaskova-2021-29item-sum-v1',
};
