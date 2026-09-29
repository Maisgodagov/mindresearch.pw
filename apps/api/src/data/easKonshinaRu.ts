import type { SeedSection } from '../types.js';
import type { ConfigurableScoring, ValidationCase } from '../scoring/configurable.js';

const options = [
  { value: '1', label: '1 — Совершенно не согласен(на)' },
  { value: '2', label: '2 — Скорее не согласен(на)' },
  { value: '3', label: '3 — Скорее согласен(на)' },
  { value: '4', label: '4 — Совершенно согласен(на)' },
];

const items = [
  'Я и мои родители соглашаемся во всём.',
  'Я обращаюсь к родителям за помощью перед тем, как попытаться решить проблему самостоятельно.',
  'Мне всегда было интересно, как мои родители ведут себя, когда я не рядом с ними.',
  'Даже когда мы с родителями расходимся во взглядах, они всегда правы.',
  'Для подростка лучше обратиться за советом по поводу некоторых вещей к лучшему другу, чем к родителям.',
  'Если я сделал(а) что-то не так, моим родителям приходится исправлять это за мной.',
  'Есть некоторые вещи, которые мои родители обо мне не знают.',
  'Мои родители ведут себя со своими родителями по-другому, чем когда они дома со мной.',
  'Мои родители знают обо мне всё.',
  'Вероятно, я буду удивлен(а), увидев, как мои родители ведут себя на вечеринке.',
  'Я стараюсь придерживаться тех же взглядов, что и мои родители.',
  'Мои родители ведут себя на работе так же, как и дома.',
  'Если у меня возникнет проблема с другом, я обсужу это с мамой или отцом перед тем, как приму решение, что с этим делать.',
  'Мои родители были бы удивлены, увидев, какой(ая) я, когда я не с ними.',
  'Когда я стану родителем, я буду воспитывать своих детей именно так, как мои родители воспитали меня.',
  'Мои родители, вероятно, говорят о разных вещах, когда я рядом и когда меня нет поблизости.',
  'Есть вещи, которые я буду делать иначе, чем моя мать и отец, когда я сам(а) буду родителем.',
  'Мои родители вряд ли когда-либо ошибаются.',
  'Я хотел(а) бы, чтобы мои родители поняли, кто я на самом деле.',
  'Мои родители ведут себя одинаково со своими друзьями и дома со мной.',
];

export const easKonshinaRuInstrument: SeedSection = {
  code: 'test_49',
  title: 'Шкала эмоциональной автономии (EAS), русская версия Коньшиной и Садовниковой',
  description: 'Русская версия шкалы эмоциональной автономии подростков в отношениях с родителями. 20 утверждений, четыре шкалы; апробация авторской версии проведена на московской выборке школьников 14–17 лет.',
  questions: items.map((text, index) => ({ code: `test_49_${index + 1}`, text, type: 'single', required: true, options })),
};

export const easKonshinaRuScoring: ConfigurableScoring = {
  min: 1,
  max: 4,
  scales: [
    { key: 'deidealization', label: 'Деидеализация родителей', items: [1, 4, 11, 15, 18], reverseItems: [1, 4, 11, 15, 18], aggregation: 'sum' },
    { key: 'nondependency', label: 'Самостоятельность / независимость от родителей', items: [2, 5, 6, 13], reverseItems: [2, 6, 13], aggregation: 'sum' },
    { key: 'parentsAsPeople', label: 'Восприятие родителей как отдельных людей', items: [3, 8, 10, 12, 16, 20], reverseItems: [12, 20], aggregation: 'sum' },
    { key: 'individuation', label: 'Индивидуация', items: [7, 9, 14, 17, 19], reverseItems: [9], aggregation: 'sum' },
    { key: 'emotionalAutonomy', label: 'Общий показатель эмоциональной автономии', items: Array.from({ length: 20 }, (_, index) => index + 1), reverseItems: [1, 2, 4, 6, 9, 11, 12, 13, 15, 18, 20], aggregation: 'sum' },
  ],
};

const allAnswers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const mixedAnswers = Object.fromEntries(items.map((_, index) => [String(index + 1), (index % 4) + 1]));

export const easKonshinaRuValidationCases: ValidationCase[] = [
  { title: 'Все ответы 1: проверка обратного кодирования и границы шкал', answers: allAnswers(1), expected: { deidealization: 20, nondependency: 13, parentsAsPeople: 12, individuation: 8, emotionalAutonomy: 53 } },
  { title: 'Все ответы 4: проверка направления ключа', answers: allAnswers(4), expected: { deidealization: 5, nondependency: 7, parentsAsPeople: 18, individuation: 17, emotionalAutonomy: 47 } },
  { title: 'Смешанный профиль: сверка пунктов по четырём шкалам', answers: mixedAnswers, expected: { deidealization: 12, nondependency: 11, parentsAsPeople: 15, individuation: 13, emotionalAutonomy: 51 } },
];
