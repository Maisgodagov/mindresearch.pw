import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '3', label: 'Оказал наибольшее влияние' },
  { value: '2', label: 'В некоторой степени способствовал выбору' },
  { value: '1', label: 'Совсем не играл никакой роли' },
];

const items = [
  'Возможность стать профессионалом в этой области.',
  'Возможность познакомиться с новыми людьми.',
  'Возможность получения хорошей зарплаты.',
  'Сегодня — это наиболее престижная сфера деятельности.',
  'Семейные традиции.',
  'Желание получить высшее образование.',
  'Чистота, комфортные условия будущей работы.',
  'Дело, которым я буду заниматься, мне кажется интересным.',
  'Возможность общения с интересными людьми.',
  'Наличие дополнительных льгот и привилегий.',
  'Этот вид деятельности обеспечит комфорт и уважение.',
  'Советы родителей и взрослых.',
  'Возможность получить наиболее основательные знания в интересующей меня сфере.',
  'Выбранный вид деятельности — спокойный, размеренный, не требующий напряжения.',
  'Возможность реализовать умения и идеи в этой сфере.',
  'Хочу продолжить учебу вместе со своими одноклассниками.',
  'Отсутствие вредных и опасных для здоровья факторов.',
  'Возможность делать карьеру.',
  'Советы друзей.',
  'Меня всегда интересовали школьные предметы, связанные с этой областью.',
  'Место моей будущей учебы близко от дома.',
];

const scaleDefs = [
  ['professional', 'Собственно профессиональная мотивация (интерес к будущей деятельности)', [1, 8, 15]],
  ['communicative', 'Коммуникативная мотивация (потребность в общении)', [2, 9, 16]],
  ['pragmatic', 'Прагматичная мотивация (стремление к материальной обеспеченности)', [3, 10, 17]],
  ['status', 'Статусная мотивация (забота о престиже)', [4, 11, 18]],
  ['social', 'Социальная мотивация (важность мнения значимых людей)', [5, 12, 19]],
  ['educational', 'Учебная мотивация (познавательные потребности)', [6, 13, 20]],
  ['external', 'Внешняя мотивация (случайные причины)', [7, 14, 21]],
] as const;

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1775_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1775',
  title: 'Тест мотивации выбора профессии (Л. А. Ясюкова)',
  description: 'Методика выявляет мотивы профессионального выбора выпускников старших классов: интерес к самой деятельности, общение, материальная обеспеченность, престиж, влияние значимых людей, познавательные мотивы и случайные внешние обстоятельства. Профиль помогает автору опроса увидеть, какие причины сильнее связаны с выбором дальнейшего обучения или работы у подростков, стоящих перед окончанием школы.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 3,
  scales: scaleDefs.map(([key, label, items]) => ({
    key,
    label,
    items: [...items],
    reverseItems: [],
    aggregation: 'sum' as const,
  })),
};

const allAnswers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  {
    title: 'учная проверка: минимальный ответ по всем 21 пунктам',
    answers: allAnswers(1),
    expected: { professional: 3, communicative: 3, pragmatic: 3, status: 3, social: 3, educational: 3, external: 3 },
  },
  {
    title: 'учная проверка: максимальный ответ по всем 21 пунктам',
    answers: allAnswers(3),
    expected: { professional: 9, communicative: 9, pragmatic: 9, status: 9, social: 9, educational: 9, external: 9 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'yasyukova-profession-choice-motivation-2003-v1',
};
