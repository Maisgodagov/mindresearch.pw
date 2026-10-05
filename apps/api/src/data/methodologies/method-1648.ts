import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const answers = [
  { value: '2', label: 'Да' },
  { value: '1', label: 'Не уверен (Да–Нет)' },
  { value: '0', label: 'Нет' },
];

const items = [
  'Чаще всего у меня хорошее самочувствие.',
  'Я стал(а) раздражительным(ой).',
  'В последнее время я стал(а) хуже видеть.',
  'Я стал(а) забывчивым(ой).',
  'После работы я чувствую себя разбитым(ой).',
  'Мне нравится работать в коллективе.',
  'У меня часто бывает подавленное настроение.',
  'Я чувствую постоянную тяжесть в голове.',
  'У меня отекают ноги.',
  'У меня бывают головокружения.',
  'У меня бывает ощущение, что мне трудно вздохнуть.',
  'Мне всегда хочется как можно быстрее закончить работу и уйти домой.',
  'После сна я обычно встаю вялым(ой) и плохо отдохнувшим(ей).',
  'Мой рабочий день обычно пролетает незаметно.',
  'Я стал(а) часто ссориться со своими близкими.',
  'После пробуждения я засыпаю с трудом.',
  'Я постоянно испытываю неприятные ощущения в глазах.',
  'В последнее время меня стали раздражать вещи, к которым раньше я относился(лась) спокойно.',
  'Я стал(а) вялым(ой) и безразличным(ой).',
  'Мне трудно удержать в памяти даже те дела, которые нужно сделать сегодня.',
  'В последнее время мне стало трудно работать.',
  'У меня ровный и спокойный характер.',
  'Меня мучают боли в висках и во лбу.',
  'У меня часто бывают приступы сердцебиений.',
  'Когда я работаю, у меня почти всё время болят спина и шея.',
  'У меня часто возникает ощущение тошноты.',
  'У меня часто болит голова.',
  'Моя работа мне перестала нравиться.',
  'Я постоянно хочу спать днём.',
  'Мои близкие стали замечать, что у меня портится характер.',
  'Когда я читаю, мне приходится напрягать глаза.',
  'Чаще всего у меня беспокойный сон.',
  'Я с удовольствием прихожу на работу.',
  'Я всё время чувствую себя усталым(ой).',
  'В последнее время я чувствую общее недомогание.',
  'Я чувствую себя абсолютно здоровым человеком.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1665_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: answers,
}));

export const instrument: SeedSection = {
  code: 'test_1665',
  title: 'Степень хронического утомления',
  description: 'Опросник оценивает субъективную выраженность хронического утомления и функционального истощения по физическому дискомфорту, общему самочувствию и когнитивным затруднениям, эмоциональным изменениям, мотивации и социальному взаимодействию. Подходит для скрининговой оценки взрослых в контексте повседневной и профессиональной деятельности; результаты не являются медицинским диагнозом.',
  questions,
};

const all = Array.from({ length: 36 }, (_, index) => index + 1);
const reverseItems = [1, 6, 14, 22, 33, 36];

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 2,
  scales: [
    { key: 'ichru', label: 'Индекс хронического утомления (ИХРУ)', items: all, reverseItems, aggregation: 'sum' },
    { key: 'physiological_discomfort', label: 'Физиологический дискомфорт', items: [8, 9, 10, 11, 13, 16, 17, 23, 24, 25, 26, 27, 29, 31, 32], reverseItems: [], aggregation: 'sum' },
    { key: 'wellbeing_cognitive', label: 'Снижение общего самочувствия и когнитивный дискомфорт', items: [1, 3, 4, 5, 19, 20, 21, 34, 35, 36], reverseItems: [1, 36], aggregation: 'sum' },
    { key: 'emotional_affective', label: 'Нарушения в эмоционально-аффективной сфере', items: [2, 7, 15, 18, 22, 30], reverseItems: [22], aggregation: 'sum' },
    { key: 'motivation_social', label: 'Снижение мотивации и изменения в социальном общении', items: [6, 12, 14, 28, 33], reverseItems: [6, 14, 33], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: ответ «Да» во всех пунктах; прямые = 2, обратные = 0',
    answers: Object.fromEntries(all.map(item => [String(item), 2])),
    expected: { ichru: 60, physiological_discomfort: 30, wellbeing_cognitive: 16, emotional_affective: 10, motivation_social: 4 },
  },
  {
    title: 'Ручная проверка: ответ «Нет» во всех пунктах; прямые = 0, обратные = 2',
    answers: Object.fromEntries(all.map(item => [String(item), 0])),
    expected: { ichru: 12, physiological_discomfort: 0, wellbeing_cognitive: 4, emotional_affective: 2, motivation_social: 6 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'leonova-shishkina-chronic-fatigue-36-2003-v1',
};
