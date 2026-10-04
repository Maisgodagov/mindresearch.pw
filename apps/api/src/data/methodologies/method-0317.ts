import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const responseOptions = [
  { value: '1', label: 'Никогда' },
  { value: '2', label: 'Редко' },
  { value: '3', label: 'Часто' },
  { value: '4', label: 'Всегда' },
];

const prompts = [
  'Легко ли вы раздражаетесь из-за мелочей?',
  'Нервничаете ли вы, если приходится чего-либо ждать?',
  'Краснеете ли вы, когда испытываете неловкость?',
  'Можете ли вы в раздражении обидеть кого-нибудь?',
  'Критика выводит вас из себя?',
  'Если вас толкнут в общественном транспорте, постараетесь ли вы ответить обидчику тем же или скажете что-нибудь обидное? При управлении автомобилем часто ли жмёте на клаксон?',
  'Вы постоянно чем-то занимаетесь, всё ваше время заполнено деятельностью?',
  'В последнее время вы опаздываете или приходите раньше времени?',
  'Часто ли вы перебиваете других, дополняете высказывания?',
  'Страдаете ли вы отсутствием аппетита?',
  'Часто ли вы испытываете беспричинное беспокойство?',
  'Кружится ли у вас голова по утрам?',
  'Испытываете ли вы постоянную усталость?',
  'Даже после продолжительного сна вы чувствуете себя разбитым?',
  'У вас возникают проблемы с сердечной деятельностью?',
  'Страдаете ли вы от болей в области спины и шеи?',
  'Часто ли вы барабаните пальцами по столу, а сидя — покачиваете ногой?',
  'Мечтаете ли вы о признании, хотите ли, чтобы вас хвалили за то, что вы делаете?',
  'Считаете ли вы себя лучше других, но, как правило, никто этого не замечает?',
  'Вы не можете сконцентрироваться на необходимом деле?',
];

const questions: SeedSection['questions'] = prompts.map((prompt, index) => ({
  code: `test_349_${index + 1}`,
  text: prompt,
  type: 'single',
  required: true,
  options: responseOptions,
}));

export const instrument: SeedSection = {
  code: 'test_349',
  title: 'Инвентаризация симптомов стресса (Т. Иванченко и соавторы)',
  description: 'Методика оценивает частоту субъективно отмечаемых стрессовых признаков и общую подверженность негативным последствиям стресса. Пункты охватывают раздражительность и эмоциональное напряжение, беспокойство и усталость, телесные жалобы, поведенческую активность и концентрацию. Подходит как инвентаризация самооценки для взрослых респондентов; источник не задаёт отдельной возрастной нормы.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 4,
  scales: [
    { key: 'total', label: 'Общая сумма симптомов стресса', items: prompts.map((_, i) => i + 1), reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  { title: 'Все ответы «Никогда»', answers: Object.fromEntries(prompts.map((_, i) => [String(i + 1), 1])), expected: { total: 20 } },
  { title: 'Все ответы «Всегда»', answers: Object.fromEntries(prompts.map((_, i) => [String(i + 1), 4])), expected: { total: 80 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'ivanchenko-stress-symptoms-inventory-vodopyanova-2009-v1',
};
