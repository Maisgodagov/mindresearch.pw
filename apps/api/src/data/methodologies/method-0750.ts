import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'Незначимый мотив' },
  { value: '1', label: 'Незначимый мотив' },
  { value: '2', label: 'Незначимый мотив' },
  { value: '3', label: 'Значимый мотив' },
  { value: '4', label: 'Значимый мотив' },
  { value: '5', label: 'Очень значимый мотив' },
];

const groups = [
  'Что способствовало вашему выбору данной специальности?',
  'Что наиболее значимо для вас в вашем учении?',
  'Получение диплома дает вам возможность:',
];

const items = [
  'Бесплатное поступление, низкая плата за обучение',
  'Занятия в профильной спецшколе, спецклассе',
  'Желание получить высшее образование',
  'Семейные традиции, желание родителей',
  'Совет друзей, знакомых',
  'Престиж, авторитет вуза и факультета',
  'Интерес к профессии',
  'Наилучшие способности именно в этой области',
  'Стремление прожить беззаботный период жизни',
  'Нравится общение с детьми',
  'Случайность',
  'Нежелание идти в армию (для юношей)',
  'Использовать педагогические знания для воспитания своих детей (для девушек)',
  'Успешно продолжить обучение на последующих курсах',
  'Успешно учиться, сдавать экзамены на «хорошо» и «отлично»',
  'Приобрести глубокие и прочные знания',
  'Быть постоянно готовым к очередным занятиям',
  'Не запускать изучение учебных предметов',
  'Не отставать от сокурсников',
  'Выполнять педагогические требования',
  'Достичь уважения преподавателей',
  'Быть примером для сокурсников',
  'Добиться одобрения окружающих',
  'Избежать осуждения и наказания за плохую учебу',
  'Получить интеллектуальное удовлетворение',
  'Достичь социального признания, уважения',
  'Самореализации',
  'Иметь гарантию стабильности',
  'Получить интересную работу',
  'Получить высокооплачиваемую работу',
  'Работать в государственных структурах',
  'Работать в частных организациях',
  'Работать в школе',
  'Основать свое дело',
  'Обучения в аспирантуре',
  'Самосовершенствования',
  'Диплом сегодня ничего не дает',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_780_${index + 1}`,
  text: `${groups[index < 13 ? 0 : index < 25 ? 1 : 2]}\n${text}`,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_780',
  title: 'Мотивация учения студентов педагогического вуза',
  description: 'Методика оценивает структуру учебной мотивации студентов педагогического вуза: мотивы выбора специальности и поступления, актуальные мотивы учебной деятельности и ожидаемые профессиональные мотивы. Раздельные показатели внутренней и внешней мотивации помогают автору опроса изучить, какие познавательные, социальные, прагматические и профессиональные основания поддерживают учение будущих педагогов; версия рассчитана на студентов педагогических вузов.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 5,
  scales: [
    { key: 'intrinsic_admission', label: 'Внутренние мотивы поступления', items: [2, 3, 7, 8, 10], reverseItems: [], aggregation: 'sum' },
    { key: 'intrinsic_study', label: 'Широкие познавательные мотивы учения', items: [13, 14, 15, 16, 24], reverseItems: [], aggregation: 'sum' },
    { key: 'intrinsic_professional', label: 'Релевантные профессиональные мотивы', items: [26, 27, 32, 34, 35], reverseItems: [], aggregation: 'sum' },
    { key: 'intrinsic_total', label: 'Внутренняя мотивация учения, умноженная на 1,25', items: [2, 3, 7, 8, 10, 13, 14, 15, 16, 24, 26, 27, 32, 34, 35], reverseItems: [], aggregation: 'sum', weights: { 2: 1.25, 3: 1.25, 7: 1.25, 8: 1.25, 10: 1.25, 13: 1.25, 14: 1.25, 15: 1.25, 16: 1.25, 24: 1.25, 26: 1.25, 27: 1.25, 32: 1.25, 34: 1.25, 35: 1.25 } },
    { key: 'extrinsic_admission', label: 'Внешние мотивы поступления', items: [1, 4, 5, 6, 9, 11, 12], reverseItems: [], aggregation: 'sum' },
    { key: 'extrinsic_study', label: 'Узкие учебно-познавательные мотивы', items: [17, 18, 19, 20, 21, 22, 23], reverseItems: [], aggregation: 'sum' },
    { key: 'extrinsic_professional', label: 'Иррелевантные профессиональные мотивы', items: [25, 28, 29, 30, 31, 33, 36], reverseItems: [], aggregation: 'sum' },
    { key: 'extrinsic_total', label: 'Внешняя мотивация учения', items: [1, 4, 5, 6, 9, 11, 12, 17, 18, 19, 20, 21, 22, 23, 25, 28, 29, 30, 31, 33, 36], reverseItems: [], aggregation: 'sum' },
  ],
};

const allZero = Object.fromEntries(items.map((_, index) => [String(index + 1), 0]));
const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка по ключу: нулевые оценки дают нулевые суммы по всем подшкалам и итогам',
    answers: allZero,
    expected: { intrinsic_admission: 0, intrinsic_study: 0, intrinsic_professional: 0, intrinsic_total: 0, extrinsic_admission: 0, extrinsic_study: 0, extrinsic_professional: 0, extrinsic_total: 0 },
  },
  {
    title: 'Ручная проверка по ключу: максимумы внутренних подшкал 25, внешний максимум 105, внутренняя сумма скорректирована ×1,25',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 5])),
    expected: { intrinsic_admission: 25, intrinsic_study: 25, intrinsic_professional: 25, intrinsic_total: 93.75, extrinsic_admission: 35, extrinsic_study: 35, extrinsic_professional: 35, extrinsic_total: 105 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'pakulina-ketko-motivaciya-ucheniya-pedvuz-36items-v1',
};
