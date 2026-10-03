import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'Вообще не беспокоюсь' },
  { value: '1', label: 'Немного' },
  { value: '2', label: 'Умеренно' },
  { value: '3', label: 'Довольно часто' },
  { value: '4', label: 'Постоянно' },
];

const items = [
  'Что закончатся деньги',
  'Что я не могу быть настойчивым или выражать свое мнение',
  'Что перспективы моей будущей работы безрадостны',
  'Что моя семья будет сердиться на меня или не одобрит что-то, что я делаю',
  'Что я никогда не достигну поставленной цели',
  'Что я не удержу на высоте современных требований свою рабочую нагрузку',
  'Что финансовые проблемы ограничат возможности организовать отдых и путешествия',
  'Что я не могу сосредоточиться',
  'Что я не могу позволить себе что-нибудь',
  'Что я чувствую себя неуверенно',
  'Что я не могу оплатить счета',
  'Что мои условия жизни неадекватны',
  'Что жизнь может оказаться лишенной смысла',
  'Что я недостаточно усердно работаю',
  'Что другие люди не одобрят меня',
  'Что мне трудно поддерживать стабильные отношения',
  'Что я оставляю работу незавершенной',
  'Что мне не хватает уверенности в себе',
  'Что я непривлекателен',
  'Что я могу выставить себя глупо',
  'Что я потеряю близких друзей',
  'Что я не многого достиг',
  'Что меня не любят',
  'Что я опоздаю на встречу',
  'Что я допускаю ошибки на работе',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_168_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_168',
  title: 'Вопросник волнений (WDQ)',
  description: 'Русская версия WDQ: 25 пунктов, оценивающих беспокойство в пяти жизненных областях. Отметьте, насколько вас беспокоит каждое утверждение: от «Вообще не беспокоюсь» (0) до «Постоянно» (4).',
  questions,
};

const domains = [
  { key: 'relationships', label: 'Взаимоотношения', items: [4, 16, 19, 21, 23] },
  { key: 'confidence', label: 'Недостаток уверенности', items: [2, 10, 15, 18, 20] },
  { key: 'future', label: 'Будущее без ясных перспектив', items: [3, 5, 8, 13, 22] },
  { key: 'work', label: 'Работа', items: [6, 14, 17, 24, 25] },
  { key: 'financial', label: 'Финансы', items: [1, 7, 9, 11, 12] },
];

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 4,
  scales: [
    { key: 'total', label: 'Общий балл', items: Array.from({ length: 25 }, (_, i) => i + 1), reverseItems: [], aggregation: 'sum' },
    ...domains.map(({ key, label, items }) => ({ key, label, items, reverseItems: [], aggregation: 'sum' as const })),
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: только пункт о закончившихся деньгах оценен на 4',
    answers: Object.fromEntries(Array.from({ length: 25 }, (_, i) => [String(i + 1), i === 0 ? 4 : 0])),
    expected: { total: 4, relationships: 0, confidence: 0, future: 0, work: 0, financial: 4 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'wdq-tallis-eysenck-mathews-1992-ru-yarysheva-2018-v1',
};
