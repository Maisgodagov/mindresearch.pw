import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const responseLabels = [
  'Абсолютно неправдоподобно',
  'Неправдоподобно',
  'Немного неправдоподобно',
  'Что-то среднее',
  'Немного правдоподобно',
  'Правдоподобно',
  'Абсолютно правдоподобно',
];

// Тексты пунктов воспроизведены по русскому бланку PsyTests; нумерация — порядок исходной версии BAFT.
const items = [
  'Чтобы жить той жизнью, какой я хочу, мне нужно совладать со своим беспокойством и страхом.',
  'Проявления нервозности выглядят нехорошо, и я страдаю из-за этого.',
  'Я не могу заниматься тем, чем хочется, когда испытываю беспокойство и страх.',
  'Я должен сохранять контроль над своими эмоциями.',
  'Если бы я был таким, как другие люди, я бы мог взять под контроль свои тревожные мысли и чувства.',
  'Мои тревожные мысли и чувства являются проблемой.',
  'Я уверен, что опозорюсь и выставлю себя на посмешище, если другие люди заметят, как я нервничаю и трясусь.',
  'Меня пугают необычные телесные ощущения, и мне нужно что-то сделать, чтобы их ослабить или избавиться от них, прежде чем я смогу заниматься чем-либо.',
  'Мои тревожные мысли и чувства ненормальны.',
  'Мне важно прислушиваться к своему телу в поисках признаков и симптомов тревоги, чтобы обезопасить себя.',
  'Когда я очень встревожен или напуган, мне кажется, что я, вполне вероятно, могу умереть.',
  'Я могу потерять над собой контроль, когда чувствую тревогу или страх.',
  'Я должен что-то сделать со своей тревогой или страхом, когда они появляются.',
  'Когда появляются неприятные мысли, я должен выкинуть их из головы.',
  'Когда я плохо себя чувствую, я должен бороться с этим чувством, чтобы оно ушло.',
  'Мое счастье и успех зависят от того, насколько хорошо я себя чувствую.',
];

const options = responseLabels.map((label, index) => ({ value: String(index + 1), label }));

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1157_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1157',
  title: 'Опросник правдоподобности тревожных чувств и мыслей (BAFT)',
  description: 'BAFT оценивает когнитивное слияние с тревожными мыслями и чувствами — насколько человек воспринимает их как правдивые и определяющие его действия. Профиль охватывает соматические опасения, чрезмерную борьбу за регуляцию эмоций и негативную оценку тревожных переживаний. Оригинальная версия изучалась на студенческой неклинической и высокотревожной взрослой выборках; русская версия PsyTests представляет перевод, для которого авторы страницы не сообщают отдельной психометрической адаптации. Методика может помочь исследователю или специалисту описать эти процессы в контексте тревоги и ACT/КПТ, но сама по себе не устанавливает диагноз.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'total', label: 'Общий балл BAFT', items: Array.from({ length: 16 }, (_, index) => index + 1), reverseItems: [], aggregation: 'sum' },
    { key: 'somatic_concerns', label: 'Соматические проблемы', items: [8, 9, 10, 11, 12], reverseItems: [], aggregation: 'sum' },
    { key: 'emotion_regulation', label: 'Регуляция эмоций', items: [4, 13, 14, 15, 16], reverseItems: [], aggregation: 'sum' },
    { key: 'negative_evaluation', label: 'Негативная оценка', items: [1, 2, 3, 5, 6, 7], reverseItems: [], aggregation: 'sum' },
  ],
};

const answers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: все пункты оценены как абсолютно неправдоподобные',
    answers: answers(1),
    expected: { total: 16, somatic_concerns: 5, emotion_regulation: 5, negative_evaluation: 6 },
  },
  {
    title: 'Ручная проверка: все пункты оценены как абсолютно правдоподобные',
    answers: answers(7),
    expected: { total: 112, somatic_concerns: 35, emotion_regulation: 35, negative_evaluation: 42 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'baft-herzberg-2012-16-items-three-subscales-sums-v1',
};
