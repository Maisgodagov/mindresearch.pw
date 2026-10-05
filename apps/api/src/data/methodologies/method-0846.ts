import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Неверно (Нет)' },
  { value: '2', label: 'Скорее неверно' },
  { value: '3', label: 'Скорее верно' },
  { value: '4', label: 'Верно (Да)' },
];

const questions: SeedSection['questions'] = [
  { code: 'test_876_1', text: 'Я делаю домашние задания, потому что… мне нравится делать уроки.', type: 'single', required: true, options },
  { code: 'test_876_2', text: 'Я делаю домашние задания, потому что… мне стыдно получать плохие отметки.', type: 'single', required: true, options },
  { code: 'test_876_3', text: 'Я делаю домашние задания, потому что… мне нравится знать и уметь всё больше и больше.', type: 'single', required: true, options },
  { code: 'test_876_4', text: 'Я делаю домашние задания, потому что… если не сделаю, учитель будет ругать меня.', type: 'single', required: true, options },
  { code: 'test_876_5', text: 'Я делаю домашние задания, потому что… мне самому важно делать домашние задания.', type: 'single', required: true, options },
  { code: 'test_876_6', text: 'Я делаю домашние задания, потому что… я буду хорошо думать о себе, если сделаю задания.', type: 'single', required: true, options },
  { code: 'test_876_7', text: 'Я делаю домашние задания, потому что… родители контролируют меня и проверяют мои оценки.', type: 'single', required: true, options },
  { code: 'test_876_8', text: 'Я делаю домашние задания, потому что… выполнив домашнюю работу, я себя больше уважаю.', type: 'single', required: true, options },
  { code: 'test_876_9', text: 'Я работаю над заданиями в классе, потому что… мне это интересно.', type: 'single', required: true, options },
  { code: 'test_876_10', text: 'Я работаю над заданиями в классе, потому что… я буду больше уважать себя, выполнив эти задания.', type: 'single', required: true, options },
  { code: 'test_876_11', text: 'Я работаю над заданиями в классе, потому что… мне приятно развиваться.', type: 'single', required: true, options },
  { code: 'test_876_12', text: 'Я работаю над заданиями в классе, потому что… от меня этого требует учитель.', type: 'single', required: true, options },
  { code: 'test_876_13', text: 'Я работаю над заданиями в классе, потому что… я сам хочу выучить новый материал.', type: 'single', required: true, options },
  { code: 'test_876_14', text: 'Я работаю над заданиями в классе, потому что… мне будет стыдно за себя, если я их не сделаю.', type: 'single', required: true, options },
  { code: 'test_876_15', text: 'Я стараюсь ответить на трудные вопросы в классе, потому что… учитель требует, чтобы я пытался отвечать на эти вопросы.', type: 'single', required: true, options },
  { code: 'test_876_16', text: 'Я стараюсь ответить на трудные вопросы в классе, потому что… я сам хочу отвечать на трудные вопросы.', type: 'single', required: true, options },
  { code: 'test_876_17', text: 'Я стараюсь ответить на трудные вопросы в классе, потому что… мне нравится учиться думать.', type: 'single', required: true, options },
  { code: 'test_876_18', text: 'Я стараюсь ответить на трудные вопросы в классе, потому что… я буду плохо о себе думать, если не отвечу.', type: 'single', required: true, options },
  { code: 'test_876_19', text: 'Я стараюсь хорошо учиться в школе, потому что… мне доставляет удовольствие учиться.', type: 'single', required: true, options },
  { code: 'test_876_20', text: 'Я стараюсь хорошо учиться в школе, потому что… я обязан(а) учиться, иначе у меня будут проблемы.', type: 'single', required: true, options },
  { code: 'test_876_21', text: 'Я стараюсь хорошо учиться в школе, потому что… для меня важно хорошо учиться.', type: 'single', required: true, options },
  { code: 'test_876_22', text: 'Я стараюсь хорошо учиться в школе, потому что… если я стану хуже учиться, то меня накажут.', type: 'single', required: true, options },
  { code: 'test_876_23', text: 'Я стараюсь хорошо учиться в школе, потому что… я буду гордиться собой, если буду учиться хорошо.', type: 'single', required: true, options },
  { code: 'test_876_24', text: 'Я стараюсь хорошо учиться в школе, потому что… я должен стараться, чтобы учитель не ругал.', type: 'single', required: true, options },
  { code: 'test_876_25', text: 'Я стараюсь хорошо учиться в школе, потому что… мне будет стыдно учиться плохо.', type: 'single', required: true, options },
  { code: 'test_876_26', text: 'Я стараюсь хорошо учиться в школе, потому что… родители требуют, чтобы я хорошо учился.', type: 'single', required: true, options },
];

const instrument: SeedSection = {
  code: 'test_876',
  title: 'Опросник академической саморегуляции (SRQ-A), русская модифицированная версия',
  description: 'Опросник оценивает причины учебного поведения и качество академической мотивации школьников: интерес к учению и развитию, личную значимость учёбы, самоуважение и гордость/стыд, а также внешнее давление родителей и учителя. Русская модифицированная версия предназначена для учащихся 3–7 классов и позволяет получить профиль семи типов регуляции учебной деятельности.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 4,
  scales: [
    { key: 'intrinsic_know', label: 'Внутренняя мотивация: познание', items: [1, 9, 19], reverseItems: [], aggregation: 'mean' },
    { key: 'intrinsic_development', label: 'Внутренняя мотивация: саморазвитие', items: [3, 11, 17], reverseItems: [], aggregation: 'mean' },
    { key: 'identified_regulation', label: 'Идентифицированная регуляция', items: [5, 13, 16, 21], reverseItems: [], aggregation: 'mean' },
    { key: 'introjected_positive', label: 'Позитивная интроецированная регуляция', items: [6, 8, 10, 23], reverseItems: [], aggregation: 'mean' },
    { key: 'introjected_negative', label: 'Негативная интроецированная регуляция', items: [2, 14, 18, 25], reverseItems: [], aggregation: 'mean' },
    { key: 'external_general', label: 'Внешняя регуляция: общая', items: [7, 20, 22, 26], reverseItems: [], aggregation: 'mean' },
    { key: 'external_teacher', label: 'Внешняя регуляция: учитель', items: [4, 12, 15, 24], reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: единица по всем пунктам даёт среднее 1 в каждой шкале',
    answers: Object.fromEntries(Array.from({ length: 26 }, (_, index) => [String(index + 1), 1])),
    expected: {
      intrinsic_know: 1,
      intrinsic_development: 1,
      identified_regulation: 1,
      introjected_positive: 1,
      introjected_negative: 1,
      external_general: 1,
      external_teacher: 1,
    },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'gordeeva-sychev-lynch-srqa-ru-2020-v1',
};
