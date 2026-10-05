import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const frequencyOptions = [
  { value: '1', label: 'Никогда' },
  { value: '2', label: 'Очень редко' },
  { value: '3', label: 'Иногда' },
  { value: '4', label: 'Часто' },
  { value: '5', label: 'Очень часто' },
];

const items = [
  'Я рассказываю что-то самому себе.',
  'Я спорю с самим собой.',
  'Я отвечаю сам себе во внутреннем разговоре.',
  'Я отвечаю сам себе во внутреннем споре.',
  'Я разговариваю с воображаемым собеседником, которого придумал сам (это не кто-то из известных мне людей).',
  'Если «да», то: при этом я отвечаю себе от его лица.',
  'Я спорю с воображаемым собеседником, которого придумал сам (это не кто-то из известных мне людей).',
  'Если «да», то: при этом я отвечаю себе от его лица.',
  'Я разговариваю с воображаемым собеседником (собеседниками), который (которые) представляет (представляют) какого-то значимого для меня человека, людей.',
  'В прошлом бывали ситуации, когда я рассказывал что-то самому себе.',
  'В прошлом бывали ситуации, когда я спорил с самим собой.',
  'В прошлом бывали ситуации, когда я разговаривал с самим собою и отвечал себе.',
  'В прошлом бывали ситуации, когда я мысленно разговаривал с воображаемым собеседником, которого придумал сам (это не кто-то из известных мне людей).',
  'Если «да», то: при этом я отвечал себе от его лица.',
  'В прошлом бывали ситуации, когда я мысленно спорил с воображаемым собеседником, которого придумал сам (это не кто-то из известных мне людей).',
  'Если «да», то: при этом я отвечал себе от его лица.',
  'В прошлом бывали ситуации, когда я мысленно разговаривал с воображаемым собеседником, который представляет какого-то (каких-то) значимого (значимых) для меня человека, людей.',
  'Если «да», то: при этом я отвечал себе от его лица.',
  'В ситуации стресса я чаще спорю с самим собой.',
  'В ситуации стресса я чаще во внутреннем разговоре отвечаю самому себе.',
  'В ситуации стресса я чаще разговариваю с воображаемым собеседником.',
  'В ситуации стресса я чаще спорю с воображаемым собеседником.',
  'Я отвечаю сам себе во внутреннем разговоре, при этом ответ возникает сам собой, он не контролируется мною.',
  'Я отвечаю сам себе во внутреннем споре, при этом ответ возникает сам собой, он не контролируется мною.',
  'В прошлом бывали ситуации, когда я отвечал сам себе во внутреннем разговоре, при этом ответ возникал сам собой, он не контролировался мною.',
  'В прошлом бывали ситуации, когда я отвечал сам себе во внутреннем споре, при этом ответ возникал сам собой, он не контролировался мною.',
  'В ситуации стресса я чаще отвечаю сам себе во внутреннем разговоре, при этом ответ возникает сам собой, он не контролируется мною.',
  'Как часто, помимо слов, в Ваших внутренних размышлениях возникают зрительные образы?',
  'Если зрительные образы при размышлениях возникают, то насколько яркими они являются?',
];

const imageOptions = [
  { value: '1', label: 'Не возникают' },
  { value: '2', label: 'Не яркие' },
  { value: '3', label: 'Скорее яркие' },
  { value: '4', label: 'Яркие' },
  { value: '5', label: 'Очень яркие' },
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1057_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: index === 28 ? imageOptions : frequencyOptions,
}));

export const instrument: SeedSection = {
  code: 'test_1057',
  title: 'Опросник мыслительного потока',
  description: 'Опросник Е. А. Дорошевой оценивает выраженность компонентов внутренней речи — рассказов самому себе, внутренних споров и разговоров с воображаемыми или значимыми собеседниками, в том числе усиление этих форм в стрессе и непроизвольные ответы, — а также частоту и яркость внутренних зрительных образов. Подходит для самоотчёта подростков от 13 лет и взрослых; отдельные профили субшкал помогают описать организацию мыслительного потока.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'self_narration', label: 'Рассказы самому себе', items: [1, 10], reverseItems: [], aggregation: 'mean' },
    { key: 'inner_disputes', label: 'Внутренние споры', items: [2, 4, 11, 19], reverseItems: [], aggregation: 'mean' },
    { key: 'imaginary_interlocutor', label: 'Вымышленный собеседник', items: [5, 6, 7, 8, 13, 14, 15, 16], reverseItems: [], aggregation: 'mean' },
    { key: 'significant_interlocutor', label: 'Собеседник — значимый человек', items: [9, 17, 18], reverseItems: [], aggregation: 'mean' },
    { key: 'uncontrolled_replies', label: 'Неконтролируемые ответы', items: [23, 24, 25, 26, 27], reverseItems: [], aggregation: 'mean' },
    { key: 'stress_interlocutor', label: 'Усиление обращений к воображаемому собеседнику в стрессе', items: [21, 22], reverseItems: [], aggregation: 'mean' },
    { key: 'visual_images', label: 'Частота и яркость внутренних образов', items: [28, 29], reverseItems: [], aggregation: 'mean' },
    { key: 'total', label: 'Общий показатель мыслительного потока', items: Array.from({ length: 29 }, (_, index) => index + 1), reverseItems: [], aggregation: 'sum' },
  ],
};

const allAnswers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: на минимальном ответе все средние шкалы равны 1, общий балл 29',
    answers: allAnswers(1),
    expected: { self_narration: 1, inner_disputes: 1, imaginary_interlocutor: 1, significant_interlocutor: 1, uncontrolled_replies: 1, stress_interlocutor: 1, visual_images: 1, total: 29 },
  },
  {
    title: 'Ручная проверка: на максимальном ответе все средние шкалы равны 5, общий балл 145',
    answers: allAnswers(5),
    expected: { self_narration: 5, inner_disputes: 5, imaginary_interlocutor: 5, significant_interlocutor: 5, uncontrolled_replies: 5, stress_interlocutor: 5, visual_images: 5, total: 145 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'thought-stream-questionnaire-dorosheva-2023-v1',
};
