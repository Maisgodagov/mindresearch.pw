import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const yesNo = [
  { value: '1', label: 'Да' },
  { value: '0', label: 'Нет' },
];

const items = [
  'Для меня существует мало возможностей повлиять на большинство важных проблем, с которыми мы сегодня сталкиваемся.',
  'Всё стало настолько сложно в сегодняшнем мире, что я действительно не понимаю, что происходит.',
  'Для того чтобы достичь успеха в сегодняшнем мире, приходится совершать некоторые неправильные поступки.',
  'Меня не интересуют телепрограммы, фильмы или журналы, которые нравятся большинству людей.',
  'Я часто чувствую себя одиноким.',
  'Мне не нравится большая часть работы, которую я делаю, но я чувствую, что должен её делать, чтобы иметь другие необходимые и желаемые вещи.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2269_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: yesNo,
}));

const instrument: SeedSection = {
  code: 'test_2269',
  title: 'Шкала отчуждения Миддлтона',
  description: 'Краткая шестипунктовая шкала оценивает шесть индикаторов отчуждения: бессилие, бессмысленность, безнормность, культурное отчуждение, социальное отчуждение и отчуждение от работы. Подходит для исследовательских опросов взрослых респондентов; пять индикаторов образуют общий показатель, а культурное отчуждение рассматривается отдельно.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 1,
  scales: [
    { key: 'general', label: 'Общее отчуждение (без культурного отчуждения)', items: [1, 2, 3, 5, 6], reverseItems: [], aggregation: 'count-option', optionValue: '1' },
    { key: 'powerlessness', label: 'Бессилие', items: [1], reverseItems: [], aggregation: 'count-option', optionValue: '1' },
    { key: 'meaninglessness', label: 'Бессмысленность', items: [2], reverseItems: [], aggregation: 'count-option', optionValue: '1' },
    { key: 'normlessness', label: 'Безнормность', items: [3], reverseItems: [], aggregation: 'count-option', optionValue: '1' },
    { key: 'cultural', label: 'Культурное отчуждение', items: [4], reverseItems: [], aggregation: 'count-option', optionValue: '1' },
    { key: 'social', label: 'Социальное отчуждение', items: [5], reverseItems: [], aggregation: 'count-option', optionValue: '1' },
    { key: 'work', label: 'Отчуждение от работы', items: [6], reverseItems: [], aggregation: 'count-option', optionValue: '1' },
  ],
};

const validationCases: ValidationCase[] = [
  { title: 'Все ответы «Нет»: ни один индикатор отмечен', answers: { '1': '0', '2': '0', '3': '0', '4': '0', '5': '0', '6': '0' }, expected: { general: 0, powerlessness: 0, meaninglessness: 0, normlessness: 0, cultural: 0, social: 0, work: 0 } },
  { title: 'Все ответы «Да»: пять пунктов общего индекса; культура отдельно', answers: { '1': '1', '2': '1', '3': '1', '4': '1', '5': '1', '6': '1' }, expected: { general: 5, powerlessness: 1, meaninglessness: 1, normlessness: 1, cultural: 1, social: 1, work: 1 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['social-attitude'],
  scoringConfig,
  validationCases,
  formulaVersion: 'middleton-1963-lytkin-2014-five-item-general-index-v1',
};
