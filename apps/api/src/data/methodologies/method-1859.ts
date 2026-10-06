import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '+', label: '+' },
  { value: '-', label: '-' },
  { value: '?', label: '?' },
];

const statements = [
  'Ребята стараются хорошо выполнять дела, полезные всей школе.',
  'Когда мы собираемся вместе, мы обязательно говорим об общих делах класса.',
  'Для нас важно, чтобы каждый в классе мог высказывать свое мнение.',
  'У нас получается лучше, если мы что-то делаем все вместе, а не каждый по отдельности.',
  'После уроков мы не спешим расходиться и продолжаем общаться друг с другом.',
  'Мы участвуем в чем-то, если рассчитываем на награду или успех.',
  'Классному руководителю с нами интересно.',
  'Если классный руководитель нам предлагает, что делать, он учитывает наши мнения.',
  'Классный руководитель стремится, чтобы каждый в классе понимал, зачем мы делаем то или иное дело.',
  'Ребята нашего класса всегда хорошо себя ведут.',
  'Мы согласны на трудную работу, если она нужна школе.',
  'Мы заботимся о том, чтобы наш класс был самым дружным в школе.',
  'Лидером класса может быть тот, кто выражает мнение других ребят.',
  'Если дело интересное, то весь класс в нем активно участвует.',
  'В общих делах класса нам больше всего нравится помогать друг другу.',
  'Нас легче вовлечь в дело, если доказать его пользу для каждого.',
  'Дело идет намного лучше, когда вместе с нами классный руководитель.',
  'При затруднениях мы свободно обращаемся за помощью к классному руководителю.',
  'Если дело не удается, классный руководитель делит ответственность с нами.',
  'В нашем классе ребята всегда и во всем правы.',
];

const questions: SeedSection['questions'] = statements.map((text, index) => ({
  code: `test_1876_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1876',
  title: 'Тест уровня сотрудничества в классе (ТУСОВКА)',
  description: 'Групповая методика для оценки сотрудничества и развития коллектива школьников. Десять шкал охватывают ценность школы, класса, личности, творчества, диалога и рефлексии, восприятие творческих, диалогических и рефлексивных качеств классного руководителя, а также откровенность ответов. Версия Евсеевой предназначена для школьных коллективов 5–9 классов; рассматриваются только анонимные групповые результаты.',
  questions,
};

// Each question is one scale. '+' scores 1, '?' scores 0.5, and '-' scores 0,
// except items 10 and 20, where '-' scores 1, '?' 0.5, and '+' 0.
const direct = (item: number) => ({ [item]: { '+': 1, '-': 0, '?': 0.5 } });
const reversed = (item: number) => ({ [item]: { '+': 0, '-': 1, '?': 0.5 } });
const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 1,
  scales: [
    { key: 'school_value', label: 'Ценность школы', items: [1, 11], reverseItems: [], aggregation: 'mean', itemScores: { ...direct(1), ...direct(11) } },
    { key: 'class_value', label: 'Ценность класса', items: [2, 12], reverseItems: [], aggregation: 'mean', itemScores: { ...direct(2), ...direct(12) } },
    { key: 'person_value', label: 'Ценность личности', items: [3, 13], reverseItems: [], aggregation: 'mean', itemScores: { ...direct(3), ...direct(13) } },
    { key: 'creativity_value', label: 'Ценность творчества', items: [4, 14], reverseItems: [], aggregation: 'mean', itemScores: { ...direct(4), ...direct(14) } },
    { key: 'dialogue_value', label: 'Ценность диалога', items: [5, 15], reverseItems: [], aggregation: 'mean', itemScores: { ...direct(5), ...direct(15) } },
    { key: 'reflection_value', label: 'Ценность рефлексии', items: [6, 16], reverseItems: [], aggregation: 'mean', itemScores: { ...direct(6), ...direct(16) } },
    { key: 'teacher_creativity', label: 'Оценка творческости классного руководителя', items: [7, 17], reverseItems: [], aggregation: 'mean', itemScores: { ...direct(7), ...direct(17) } },
    { key: 'teacher_dialogue', label: 'Оценка диалогичности классного руководителя', items: [8, 18], reverseItems: [], aggregation: 'mean', itemScores: { ...direct(8), ...direct(18) } },
    { key: 'teacher_reflection', label: 'Оценка рефлексивности классного руководителя', items: [9, 19], reverseItems: [], aggregation: 'mean', itemScores: { ...direct(9), ...direct(19) } },
    { key: 'candor', label: 'Откровенность', items: [10, 20], reverseItems: [10, 20], aggregation: 'mean', itemScores: { ...reversed(10), ...reversed(20) } },
  ],
};

const checkedAnswers: Record<string, string> = Object.fromEntries(Array.from({ length: 20 }, (_, i) => [String(i + 1), '+']));
const validationCases: ValidationCase[] = [{
  title: 'Ручная проверка: согласие со всеми утверждениями; обратные пункты дают 0',
  answers: checkedAnswers,
  expected: { school_value: 1, class_value: 1, person_value: 1, creativity_value: 1, dialogue_value: 1, reflection_value: 1, teacher_creativity: 1, teacher_dialogue: 1, teacher_reflection: 1, candor: 0 },
}];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'evseeva-tusovka-2003-v1',
};
