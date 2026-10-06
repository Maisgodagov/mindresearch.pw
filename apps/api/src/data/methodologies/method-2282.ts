import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

// Each option stores the source's explicit score, because several items use
// clinically meaningful anchors rather than an answer at every integer value.
const questions: SeedSection['questions'] = [
  {
    code: 'test_2300_1', text: 'Тошнота и рвота. Спросите: «Не испытываете ли Вы тошноты? Не было ли у Вас рвоты?» Наблюдение.', type: 'single', required: true,
    options: [
      { value: '0', label: 'Нет ни тошноты, ни рвоты' }, { value: '1', label: 'Лёгкая тошнота без рвоты' },
      { value: '4', label: 'Подкатывающая тошнота с позывами на рвоту' }, { value: '7', label: 'Постоянная тошнота, частые позывы на рвоту и рвота' },
    ],
  },
  {
    code: 'test_2300_2', text: 'Тремор (пальцев рук и предплечья). Скажите: «Вытяните руки и разведите пальцы». Наблюдение.', type: 'single', required: true,
    options: [
      { value: '0', label: 'Отсутствует' }, { value: '1', label: 'Тремора не видно, но его можно почувствовать пальцами' },
      { value: '4', label: 'Умеренный тремор, в том числе с распространением на предплечье' }, { value: '7', label: 'Тяжёлый тремор, даже без распространения на предплечье' },
    ],
  },
  {
    code: 'test_2300_3', text: 'Пароксизмальная потливость. Наблюдение.', type: 'single', required: true,
    options: [
      { value: '0', label: 'Признаки потливости отсутствуют' }, { value: '1', label: 'Едва уловимая потливость, ладони влажные' },
      { value: '4', label: 'Капли пота на лбу' }, { value: '7', label: 'Тотальный гипергидроз' },
    ],
  },
  {
    code: 'test_2300_4', text: 'Тревога. Спросите: «Вам тревожно? Вы испытываете беспокойство?» Наблюдение.', type: 'single', required: true,
    options: [
      { value: '0', label: 'Нет тревоги, спокоен/спокойна' }, { value: '1', label: 'Слегка тревожен/тревожна' },
      { value: '4', label: 'Умеренно тревожен(на) или старается контролировать себя так, что тревогу можно заподозрить' },
      { value: '7', label: 'Тревога эквивалентна острым паническим состояниям, которые можно видеть при делирии или острых шизофренических реакциях' },
    ],
  },
  {
    code: 'test_2300_5', text: 'Возбуждение (ажитация). Наблюдение.', type: 'single', required: true,
    options: [
      { value: '0', label: 'Нормальная активность' }, { value: '1', label: 'Несколько повышенная активность' },
      { value: '4', label: 'Умеренно выраженная нетерпеливость и беспокойство' }, { value: '7', label: 'Хождение туда-сюда во время обследования/разговора или постоянное метание' },
    ],
  },
  {
    code: 'test_2300_6', text: 'Головная боль, тяжесть в голове. Спросите: «Вы не испытываете каких-либо необычных ощущений в голове? Нет ощущения, что голова как будто стянута обручем?» При оценке не учитывайте головокружение.', type: 'single', required: true,
    options: [
      { value: '0', label: 'Отсутствует' }, { value: '1', label: 'Очень лёгкая' }, { value: '2', label: 'Лёгкая' }, { value: '3', label: 'Умеренная' },
      { value: '4', label: 'Умеренно выраженная' }, { value: '5', label: 'Выраженная' }, { value: '6', label: 'Очень выраженная' }, { value: '7', label: 'Исключительно выраженная' },
    ],
  },
  {
    code: 'test_2300_7', text: 'Тактильные расстройства. Спросите: «Чувствуете ли вы зуд, покалывание, имеется ли ощущение ожога либо онемения, ощущение ползания насекомых по коже?» Наблюдение.', type: 'single', required: true,
    options: [
      { value: '0', label: 'Нет' }, { value: '1', label: 'Очень слабые' }, { value: '2', label: 'Лёгкие' }, { value: '3', label: 'Средней тяжести' },
      { value: '4', label: 'Галлюцинации от средней тяжести до тяжёлых' }, { value: '5', label: 'Тяжёлые галлюцинации' }, { value: '6', label: 'Крайне тяжёлые галлюцинации' }, { value: '7', label: 'Непрерывные галлюцинации' },
    ],
  },
  {
    code: 'test_2300_8', text: 'Слуховые нарушения. Спросите: «Не беспокоят ли Вас звуки вокруг? Не кажутся ли они очень резкими? Не пугают ли они Вас? Вы что-нибудь слышите, что Вас беспокоит? Слышите ли Вы что-нибудь такое, чего на самом деле нет?» Наблюдение.', type: 'single', required: true,
    options: [
      { value: '0', label: 'Отсутствуют' }, { value: '1', label: 'В очень лёгкой степени резкость звуков или пугающий характер звуков' },
      { value: '2', label: 'В лёгкой степени резкость звуков или пугающий характер звуков' }, { value: '3', label: 'В умеренной степени резкость звуков или пугающий характер звуков' },
      { value: '4', label: 'Умеренно выраженные галлюцинации' }, { value: '5', label: 'Выраженные галлюцинации' }, { value: '6', label: 'Исключительно выраженные галлюцинации' }, { value: '7', label: 'Непрекращающиеся галлюцинации' },
    ],
  },
  {
    code: 'test_2300_9', text: 'Визуальные нарушения. Спросите: «Не кажется ли Вам свет очень ярким? Не кажутся ли измененными цвета? Не режет ли свет глаза? Вы что-нибудь видите, что Вас беспокоит? Видите ли Вы что-нибудь такое, чего на самом деле нет?» Наблюдение.', type: 'single', required: true,
    options: [
      { value: '0', label: 'Отсутствуют' }, { value: '1', label: 'В очень лёгкой степени резкость звуков или пугающий характер звуков' },
      { value: '2', label: 'В лёгкой степени резкость звуков или пугающий характер звуков' }, { value: '3', label: 'В умеренной степени резкость звуков или пугающий характер звуков' },
      { value: '4', label: 'Умеренно выраженные галлюцинации' }, { value: '5', label: 'Выраженные галлюцинации' }, { value: '6', label: 'Исключительно выраженные галлюцинации' }, { value: '7', label: 'Непрекращающиеся галлюцинации' },
    ],
  },
  {
    code: 'test_2300_10', text: 'Ориентировка и нарушение ясности сознания. Спросите: «Какое сегодня число? Где Вы? Кто я?»', type: 'single', required: true,
    options: [
      { value: '0', label: 'Ориентирован и может производить порядковые сложения чисел' },
      { value: '1', label: 'Не может производить порядковые сложения чисел и не уверен в дате' },
      { value: '2', label: 'Дезориентирован в дате не более чем на два календарных дня' },
      { value: '3', label: 'Дезориентирован в дате более чем на два календарных дня' },
      { value: '4', label: 'Дезориентирован в месте и/или в личности' },
    ],
  },
];

export const instrument: SeedSection = {
  code: 'test_2300',
  title: 'Шкала оценки состояния отмены алкоголя (CIWA-Ar)',
  description: 'Клиническая шкала CIWA-Ar количественно оценивает выраженность алкогольного синдрома отмены по десяти наблюдаемым и сообщаемым симптомам: тошноте и рвоте, тремору, потливости, тревоге, ажитации, головной боли, тактильным, слуховым и зрительным нарушениям, ориентировке и ясности сознания. Предназначена для врачебной оценки состояния пациентов с алкогольным синдромом отмены при сохранённом контакте; помогает отслеживать тяжесть симптомов и их динамику в клинической помощи.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 7,
  scales: [
    {
      key: 'ciwa_ar_total', label: 'Суммарный балл CIWA-Ar', items: Array.from({ length: 10 }, (_, index) => index + 1), reverseItems: [], aggregation: 'sum',
      itemScores: Object.fromEntries(questions.map((question, index) => [index + 1, Object.fromEntries(question.options.map(option => [option.value, Number(option.value)]))])),
    },
  ],
};

const validationCases: ValidationCase[] = [
  { title: 'Все симптомы отсутствуют', answers: Object.fromEntries(questions.map((_, index) => [String(index + 1), '0'])), expected: { ciwa_ar_total: 0 } },
  { title: 'Максимум по каждому пункту', answers: Object.fromEntries(questions.map((_, index) => [String(index + 1), index === 9 ? '4' : '7'])), expected: { ciwa_ar_total: 67 } },
];

export const methodology: MethodologyRegistration = {
  instrument: { ...instrument, categoryIds: ['clinical-addictive'] },
  categoryIds: ['clinical-addictive'],
  scoringConfig,
  validationCases,
  formulaVersion: 'ciwa-ar-ru-clinical-guidelines-v1',
};
