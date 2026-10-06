import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const optionsFor = (max: number) => Array.from({ length: max + 1 }, (_, score) => ({ value: String(score), label: String(score) }));

const maxByItem = [4, 4, 4, 2, 2, 2, 4, 4, 4, 4, 4, 2, 2, 2, 4, 2, 2];

const titles = [
  'Сниженное настроение (переживания подавленности или печали, безнадежности, беспомощности, собственной малоценности)',
  'Чувство вины', 'Суицидальные намерения', 'Бессонница: ранняя (трудности при засыпании)', 'Бессонница: середина ночи',
  'Бессонница поздняя: ранние утренние часы', 'Работоспособность и активность',
  'Заторможенность (замедленность мышления и речи, нарушение способности концентрировать внимание, снижение моторной активности)',
  'Возбуждение (во время беседы)', 'Психическая тревога',
  'Соматическая тревога: физиологические проявления — гастроинтестинальные (сухость во рту, метеоризм, диспепсия, диарея, спазмы, отрыжка), сердечно-сосудистые (сердцебиение, головные боли), дыхательные (гипервентиляция, одышка), учащенное мочеиспускание и повышенное потоотделение',
  'Соматические симптомы: желудочно-кишечные', 'Общие соматические симптомы',
  'Половые симптомы (например, утрата либидо, менструальные проблемы)', 'Ипохондрия',
  'Потеря веса', 'Критика (критичность отношения к болезни)',
];

const details: Record<number, string> = {
  7: 'В стационаре оценка 3 выставляется при активности не менее трех часов в день (работа в отделении или хобби), кроме обычного самообслуживания; оценка 4 — при отсутствии активности или невозможности справляться с рутинной бытовой деятельностью без посторонней помощи.',
  11: 'Оценивают частоту и тяжесть физиологических проявлений тревоги.',
  16: 'Оценивают по анамнестическим данным; если потеря массы регистрируется еженедельно: 0 — нет потери или она по иной причине, 1 — вероятная потеря вследствие заболевания, 2 — пациент уверенно подтверждает потерю из-за депрессии.',
};

const questions: SeedSection['questions'] = titles.map((title, index) => ({
  code: `test_2102_${index + 1}`,
  text: `${title}${details[index + 1] ? `\n${details[index + 1]}` : ''}\nОценка относится к неделе перед опросом; для пунктов 8 и 9 — к поведению во время беседы, для пункта 16 — к периоду перед эпизодом.`,
  type: 'single', required: true,
  options: optionsFor(maxByItem[index]).map(option => ({ value: option.value, label: option.label })),
}));

export const instrument: SeedSection = {
  code: 'test_2102',
  title: 'Шкала Гамильтона для оценки депрессии (HDRS-17)',
  description: 'Клиническая шкала для количественной оценки выраженности депрессивной симптоматики у пациентов с депрессивными расстройствами. Охватывает настроение, чувство вины и суицидальные намерения, сон, активность и заторможенность, тревогу, соматические симптомы, вес и критичность к болезни; предназначена для оценки специалистом по клиническому интервью и наблюдению, в том числе динамики до, во время и после лечения.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 4,
  scales: [{ key: 'total', label: 'Суммарный балл HDRS-17', items: Array.from({ length: 17 }, (_, index) => index + 1), reverseItems: [], aggregation: 'sum' }],
};

const validationCases: ValidationCase[] = [
  { title: 'Все пункты оценены нулем', answers: Object.fromEntries(Array.from({ length: 17 }, (_, index) => [String(index + 1), 0])), expected: { total: 0 } },
  { title: 'Ручная проверка: максимум каждого из 17 пунктов', answers: Object.fromEntries(maxByItem.map((maximum, index) => [String(index + 1), maximum])), expected: { total: maxByItem.reduce((sum, maximum) => sum + maximum, 0) } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'hamilton-hdrs-17-ru-minzdrav-2024-simple-sum-v1',
};
