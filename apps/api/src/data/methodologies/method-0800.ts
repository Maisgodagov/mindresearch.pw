import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const statements = [
  'Для меня более комфортно социальное взаимодействие online, чем лицом к лицу',
  'Когда я не бываю online какое-то время, то меня начинает беспокоить мысль о выходе в сеть',
  'Я предпочитаю общаться с людьми online, чем лицом к лицу',
  'Я использую социальные сети, чтобы почувствовать себя лучше, когда мне грустно',
  'Я использую социальные сети, чтобы поговорить с другими, когда чувствую себя в изоляции',
  'Мне сложно контролировать количество времени проводимого online',
  'Я использую социальные сети, чтобы почувствовать себя лучше, когда расстраиваюсь',
  'Я буду чувствовать себя потерянно, если не смогу быть online',
  'Мне трудно контролировать мое пребывание в сети',
  'Я навязчиво думаю о выходе в сеть, когда я offline',
  'Когда я offline, мне сложно сопротивляться желанию выйти в сеть',
  'Я предпочитаю социальные взаимодействия online, чем общение лицом к лицу',
  'Мое использование социальных сетей создало проблемы в моей жизни',
  'Мое использование социальных сетей создало трудности в управлении жизнью',
];

const options = [
  { value: '1', label: 'Полностью не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Скорее не согласен' },
  { value: '4', label: 'Ни то ни другое' },
  { value: '5', label: 'Скорее согласен' },
  { value: '6', label: 'Согласен' },
  { value: '7', label: 'Полностью согласен' },
];

const questions: SeedSection['questions'] = statements.map((text, index) => ({
  code: `test_830_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

const instrument: SeedSection = {
  code: 'test_830',
  title: 'Общая шкала проблемного использования интернета-3 (GPIUS3), русскоязычная версия',
  description: 'GPIUS3 измеряет когнитивные и поведенческие признаки проблемного использования интернета и социальных сетей у подростков и молодёжи. Пять аспектов: предпочтение онлайн-общения, регуляция настроения, когнитивная поглощённость жизнью в сети, компульсивное использование и негативные последствия. Опросник предназначен для русскоязычной подростковой и молодёжной выборки; его показатели описывают особенности использования и сами по себе не являются диагнозом.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'online_communication_preference', label: 'Предпочтение онлайн-общения', items: [1, 3, 12], reverseItems: [], aggregation: 'sum' },
    { key: 'mood_regulation', label: 'Регуляция настроения', items: [4, 5, 7], reverseItems: [], aggregation: 'sum' },
    { key: 'cognitive_preoccupation', label: 'Когнитивная поглощённость', items: [2, 8, 10], reverseItems: [], aggregation: 'sum' },
    { key: 'compulsive_use', label: 'Компульсивное использование', items: [6, 9, 11], reverseItems: [], aggregation: 'sum' },
    { key: 'negative_consequences', label: 'Негативные последствия', items: [13, 14], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка сумм пяти шкал по ключу статьи',
    answers: { '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 1, '9': 2, '10': 3, '11': 4, '12': 5, '13': 6, '14': 7 },
    expected: {
      online_communication_preference: 9,
      mood_regulation: 16,
      cognitive_preoccupation: 6,
      compulsive_use: 12,
      negative_consequences: 13,
    },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'gerasimova-kholmogorova-gpius3-14item-five-subscale-sums-v1',
  details: {
    version: 'Русскоязычная GPIUS3, 14 пунктов (Герасимова и Холмогорова, 2018)',
    summary: instrument.description!,
    steps: [
      'Ответы кодируются от 1 («Полностью не согласен») до 7 («Полностью согласен»).',
      'Для каждой шкалы складываются указанные в публикации ответы; отдельного общего балла ключ не задаёт.',
      'Обратных пунктов нет. Диапазоны сумм: 3–21 для четырёх трёхпунктовых шкал и 2–14 для шкалы негативных последствий.',
    ],
    keys: [
      { label: 'Предпочтение онлайн-общения', value: 'Пункты 1, 3, 12; сумма ответов.' },
      { label: 'Регуляция настроения', value: 'Пункты 4, 5, 7; сумма ответов.' },
      { label: 'Когнитивная поглощённость', value: 'Пункты 2, 8, 10; сумма ответов.' },
      { label: 'Компульсивное использование', value: 'Пункты 6, 9, 11; сумма ответов.' },
      { label: 'Негативные последствия', value: 'Пункты 13, 14; сумма ответов.' },
    ],
    notes: ['В публикации русская модификация содержит 14 пунктов: пункт 7 исходной 15-пунктовой модели исключён. Здесь воспроизведены нумерация приложения и ключ русской модификации. Авторы указывают пригодность для подростковой и молодёжной выборки; нормативные границы и диагностические пороги в этой регистрации не вводятся.'],
    sources: [
      { title: 'Герасимова А. А., Холмогорова А. Б. «Общая шкала проблемного использования интернета: апробация и валидизация в российской выборке третьей версии опросника» (2018), полный текст, приложение с бланком и ключом', url: 'https://doi.org/10.17759/cpp.2018260304' },
      { title: 'Общая шкала проблемного использования интернета, GPIUS3 — русская страница методики Psytests', url: 'https://psytests.org/cyber/gpius3.html' },
      { title: 'Киберпсихология: тесты и опросники — путеводитель Psytests', url: 'https://psytests.org/guide/cyberpsychology-ru.html' },
      { title: 'Caplan S. E. Theory and measurement of generalized problematic Internet use: A two-step approach (2010), исходная теоретическая модель GPIUS2', url: 'https://doi.org/10.1016/j.chb.2010.03.012' },
    ],
  },
};
