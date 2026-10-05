import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const answers = Array.from({ length: 7 }, (_, index) => ({
  value: String(7 - index),
  label: String(7 - index),
}));

const itemRows = [
  ['К1', 'Есть четкие представления о том, как надо общаться в различных ситуациях'],
  ['К2', 'Всегда могу представить результаты своих взаимодействий с другими людьми'],
  ['К3', 'Четко знаю, к какой социальной группе (социальным группам) я могу себя отнести'],
  ['Э1', 'По разным вопросам в день я общаюсь с большим количеством людей'],
  ['Э2', 'Чувствую себя успешным в социальных контактах'],
  ['Э3', 'Нравится быть лидером, организовывать других людей'],
  ['Э4', 'Стремлюсь к общению с нужными людьми и людьми с высоким статусом'],
  ['М1', 'Есть желание помогать окружающим, альтруизм'],
  ['М2', 'Заинтересован в мероприятиях, в которых участвуют другие люди'],
  ['М3', 'Всегда замечаю, что окружающие нуждаются в посторонней помощи'],
  ['М4', 'Стараюсь быть полезным обществу'],
  ['П1', 'Позитивен в социальных контактах'],
  ['П2', 'В неопределенных ситуациях социальная активность помогает'],
  ['П3', 'Считаю, что во взаимодействии с другими людьми надо стараться учитывать все точки зрения'],
  ['П4', 'Обычно проявляю заинтересованность в других людях'],
] as const;

const questions: SeedSection['questions'] = itemRows.map(([key, text], index) => ({
  code: `test_1244_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: answers,
}));

export const instrument: SeedSection = {
  code: 'test_1244',
  title: 'Опросник социально-ориентированной активности',
  description: 'Методика оценивает социально-ориентированную активность личности по когнитивному, эмоционально-статусному, мотивационному и поведенческому компонентам. Разработана и опубликована для студентов; полезна в опросах молодежи, когда важно описать представления о взаимодействии, переживание социальных контактов, готовность помогать и просоциальные способы поведения.',
  questions,
};

const scaleRows = [
  { key: 'cognitive', label: 'Когнитивный компонент социально-ориентированной активности', items: [1, 2, 3] },
  { key: 'emotional_status', label: 'Эмоционально-статусный компонент социально-ориентированной активности', items: [4, 5, 6, 7] },
  { key: 'motivational', label: 'Мотивационный компонент социально-ориентированной активности', items: [8, 9, 10, 11] },
  { key: 'behavioral', label: 'Поведенческий компонент социально-ориентированной активности', items: [12, 13, 14, 15] },
];

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: scaleRows.map(({ key, label, items }) => ({ key, label, items, reverseItems: [], aggregation: 'mean' })),
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы равны 7: среднее каждой шкалы 7',
    answers: Object.fromEntries(itemRows.map((_, index) => [String(index + 1), 7])),
    expected: { cognitive: 7, emotional_status: 7, motivational: 7, behavioral: 7 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'shamionov-grigoryeva-soa-15item-mean-v1',
};
