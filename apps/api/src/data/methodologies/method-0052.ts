import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const answers = [
  { value: '0', label: 'Да' },
  { value: '1', label: 'Трудно сказать' },
  { value: '2', label: 'Нет' },
];

const items = [
  'Я активен в группе, часто беру инициативу на себя.',
  'Держусь в стороне, проявляю сдержанность в отношениях, так как могу быть неправильно понят однокурсниками.',
  'Однокурсники проявляют ко мне интерес и стремятся общаться со мной.',
  'Могу влиять на мнение и взгляды однокурсников с учетом своих интересов.',
  'Мне трудно общаться, находить общий язык со своими однокурсниками.',
  'Мне комфортно в группе, я легко следую ее нормам и правилам.',
  'Однокурсники относятся ко мне настороженно, мало общаются со мной.',
  'Мне сложно обратиться за помощью к однокурсникам.',
  'На всех занятиях чувствую себя уверенно и комфортно.',
  'В учебе могу в полной мере проявить свою индивидуальность, способности.',
  'На занятиях мне трудно выступать, выражать свои мысли.',
  'Многие учебные предметы являются сложными для меня, я осваиваю их с трудом.',
  'Успешно и в срок справляюсь со всеми учебными заданиями по предметам.',
  'У меня есть собственное мнение по изучаемым предметам и я всегда его высказываю.',
  'Мне трудно задать вопрос, обратиться за помощью к преподавателю.',
  'Нуждаюсь в помощи и дополнительных консультациях преподавателей по многим предметам.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_90_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: answers,
}));

export const instrument: SeedSection = {
  code: 'test_90',
  title: 'Адаптированность студентов в вузе',
  description: 'Опросник Т. Д. Дубовицкой и А. В. Крыловой для оценки адаптированности к учебной группе и учебной деятельности. Для каждого суждения выберите один вариант: «Да», «Трудно сказать» или «Нет».',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 2,
  scales: [
    { key: 'study_group', label: 'Адаптированность к учебной группе', items: [1, 2, 3, 4, 5, 6, 7, 8], reverseItems: [2, 5, 7, 8], aggregation: 'sum' },
    { key: 'study_activity', label: 'Адаптированность к учебной деятельности', items: [9, 10, 11, 12, 13, 14, 15, 16], reverseItems: [11, 12, 15, 16], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы «Да»: прямые суждения по 0, обратные по 2',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 0])),
    expected: { study_group: 8, study_activity: 8 },
  },
  {
    title: 'Все ответы «Нет»: прямые суждения по 2, обратные по 0',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 2])),
    expected: { study_group: 8, study_activity: 8 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'dubovitskaya-krylova-asv-vuz-2010-v1',
};
