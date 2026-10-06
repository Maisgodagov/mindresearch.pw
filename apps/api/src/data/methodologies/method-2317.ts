import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const responseOptions = [
  { value: '1', label: 'Полностью не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Скорее не согласен' },
  { value: '4', label: 'Нейтрально' },
  { value: '5', label: 'Скорее согласен' },
  { value: '6', label: 'Согласен' },
  { value: '7', label: 'Полностью согласен' },
];

const items = [
  'Я предпочитаю общение в социальных сетях общению лицом к лицу.',
  'Общение в социальных сетях для меня более комфортно, чем общение в реальной жизни.',
  'Я предпочитаю общаться с людьми в социальных сетях, а не в реальности.',
  'Я заходил(а) в социальную сеть, чтобы с кем-то поговорить, когда мне было одиноко.',
  'Я заходил(а) в социальную сеть, чтобы мне стало лучше, когда я чувствовал(а) себя плохо.',
  'Я заходил(а) в социальную сеть, чтобы мне стало лучше, когда расстраивался/лась.',
  'Если я некоторое время не захожу в социальную сеть, меня начинают терзать мысли, что надо зайти.',
  'Если бы я потерял(а) доступ к социальным сетям, я не знал(а) бы что делать.',
  'Я поглощен(а) навязчивыми мыслями о том, что нужно зайти в социальную сеть, даже когда не сижу в Интернете.',
  'Мне сложно контролировать, сколько времени я провожу в социальных сетях.',
  'Я считаю, что мне нелегко контролировать мое пребывание в социальных сетях.',
  'Мне тяжело противостоять непреодолимому желанию зайти в социальную сеть, когда я занят(а) чем-то вне Интернета.',
  'Социальные сети усложнили мне жизнь.',
  'Из-за того, что я проводил(а) много времени в социальных сетях, я пренебрегал(а) своей социальной жизнью и различными мероприятиями.',
  'Пользование социальными сетями привело к проблемам в моей жизни.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2335_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: responseOptions,
}));

export const instrument: SeedSection = {
  code: 'test_2335',
  title: 'Шкала проблемного использования социальных сетей',
  description: 'Русскоязычная версия оценивает проблемные аспекты использования социальных сетей у активных пользователей: предпочтение онлайн-общения, регуляцию эмоций, когнитивную поглощённость, компульсивное использование и негативные последствия. Профиль из пяти аспектов и общий балл помогают исследовать характер вовлечённости; методика апробирована на русскоязычной выборке взрослых пользователей и не является самостоятельным клиническим диагнозом.',
  questions,
};

const seq = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, index) => from + index);
const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'onlinePreference', label: 'Предпочтение онлайн-общения', items: seq(1, 3), reverseItems: [], aggregation: 'sum' },
    { key: 'moodRegulation', label: 'Регуляция эмоций', items: seq(4, 6), reverseItems: [], aggregation: 'sum' },
    { key: 'cognitivePreoccupation', label: 'Когнитивная поглощённость', items: seq(7, 9), reverseItems: [], aggregation: 'sum' },
    { key: 'compulsiveUse', label: 'Компульсивное использование', items: seq(10, 12), reverseItems: [], aggregation: 'sum' },
    { key: 'negativeConsequences', label: 'Негативные последствия', items: seq(13, 15), reverseItems: [], aggregation: 'sum' },
    { key: 'total', label: 'Общий балл проблемного использования', items: seq(1, 15), reverseItems: [], aggregation: 'sum' },
  ],
};

const answers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: нейтральные ответы дают 12 баллов на каждую субшкалу и 60 в сумме',
    answers: answers(4),
    expected: { onlinePreference: 12, moodRegulation: 12, cognitivePreoccupation: 12, compulsiveUse: 12, negativeConsequences: 12, total: 60 },
  },
  {
    title: 'Ручная проверка: минимальные ответы дают нижнюю границу всех шкал',
    answers: answers(1),
    expected: { onlinePreference: 3, moodRegulation: 3, cognitivePreoccupation: 3, compulsiveUse: 3, negativeConsequences: 3, total: 15 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['cyberpsychology'],
  scoringConfig,
  validationCases,
  formulaVersion: 'sirota-problematic-social-networks-use-2018-v1',
};
