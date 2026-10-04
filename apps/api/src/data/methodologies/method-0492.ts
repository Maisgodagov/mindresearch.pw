import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const answerOptions = [
  { value: '1', label: 'Полностью не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Ни то, ни другое' },
  { value: '4', label: 'Согласен' },
  { value: '5', label: 'Полностью согласен' },
];

const statements = [
  'Я не люблю участвовать в групповых дискуссиях.',
  'Обычно я чувствую себя комфортно в групповых дискуссиях.',
  'Я чувствую себя нервным и напряженным, когда участвую в групповых дискуссиях.',
  'Мне нравится участвовать в групповых дискуссиях.',
  'Участвуя в групповых дискуссиях с новыми людьми, я чувствую себя напряженным и нервным.',
  'Я чувствую себя спокойным и расслабленным, участвуя в групповых дискуссиях.',
  'Обычно я нервничаю, когда я должен участвовать в собрании.',
  'Обычно я чувствую себя комфортно, когда я должен участвовать в собрании.',
  'Я чувствую себя спокойно и расслабленно, когда я должен выразить свое мнение на собрании.',
  'Я боюсь выражать свои мысли на собрании.',
  'Обычно, общаясь на собраниях, я чувствую себя неловко.',
  'Я чувствую себя расслабленным, отвечая на вопросы во время собрания.',
  'Во время разговоров с новыми знакомыми я очень нервничаю.',
  'Я не боюсь откровенно высказывать свое мнение во время беседы.',
  'Обычно во время беседы я очень напряженный и нервный.',
  'Обычно во время беседы я очень спокоен и расслаблен.',
  'Во время беседы с новыми знакомыми я чувствую себя очень спокойно.',
  'Я боюсь откровенно высказывать свое мнение во время беседы.',
  'Я не боюсь публичных выступлений.',
  'Во время публичных выступлений я чувствую напряжение и закрепощенность в некоторых частях тела.',
  'Я чувствую себя расслабленным во время публичных выступлений.',
  'Во время публичных выступлений мои мысли путаются.',
  'Когда мне нужно публично выступить, я чувствую себя уверенно.',
  'Во время публичных выступлений я так нервничаю, что забываю факты, которые я на самом деле знаю.',
];

export const instrument: SeedSection = {
  code: 'test_526',
  title: 'Личный отчет о коммуникативной тревоге (PRCA-24)',
  description: 'PRCA-24 измеряет тревогу, связанную с реальным или ожидаемым общением. Профиль охватывает групповую дискуссию, собрания, разговоры один на один и публичные выступления. Русская адаптация А. Е. Ильиной предназначена для взрослых респондентов; автору опроса результаты помогают увидеть контексты общения, в которых тревога выражена сильнее.',
  questions: statements.map((text, index) => ({
    code: `test_526_${index + 1}`,
    text,
    type: 'single',
    required: true,
    options: answerOptions,
  })),
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'group_discussion', label: 'Групповая дискуссия', items: [1, 2, 3, 4, 5, 6], reverseItems: [2, 4, 6], aggregation: 'sum' },
    { key: 'meetings', label: 'Собрания', items: [7, 8, 9, 10, 11, 12], reverseItems: [8, 9, 12], aggregation: 'sum' },
    { key: 'interpersonal', label: 'Межличностные беседы', items: [13, 14, 15, 16, 17, 18], reverseItems: [14, 16, 17], aggregation: 'sum' },
    { key: 'public_speaking', label: 'Публичные выступления', items: [19, 20, 21, 22, 23, 24], reverseItems: [19, 21, 23], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Нейтральные ответы дают 18 баллов по каждой субшкале',
    answers: Object.fromEntries(statements.map((_, index) => [String(index + 1), 3])),
    expected: { group_discussion: 18, meetings: 18, interpersonal: 18, public_speaking: 18 },
  },
  {
    title: 'Проверка реверса групповой дискуссии: прямые пункты 5, обратные 1',
    answers: Object.fromEntries(statements.map((_, index) => [String(index + 1), [1, 3, 5].includes(index + 1) ? 5 : [2, 4, 6].includes(index + 1) ? 1 : 3])),
    expected: { group_discussion: 30, meetings: 18, interpersonal: 18, public_speaking: 18 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'mccroskey-prca24-ilyina-ru-2021-v1',
};
