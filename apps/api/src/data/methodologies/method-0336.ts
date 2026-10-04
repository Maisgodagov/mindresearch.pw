import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const frequency = ['Очень часто', 'Часто', 'Время от времени', 'Редко', 'Никогда']
  .map((label, index) => ({ label, value: 5 - index }));
const liking = ['Очень нравится', 'Нравится', 'Безразлично', 'Не нравится', 'Совсем не нравится']
  .map((label, index) => ({ label, value: 5 - index }));
const yesNo = [{ label: 'Да', value: 1 }, { label: 'Нет', value: 0 }];

const questions: SeedSection['questions'] = [
  {
    code: 'test_390_1', text: 'Как часто ты пользуешься интернетом?', type: 'single', required: true,
    options: [
      { label: 'не пользуюсь интернетом вообще', value: 1 }, { label: 'один-два раза в неделю', value: 2 },
      { label: 'один раз в день', value: 3 }, { label: 'два-три раза в день', value: 4 }, { label: 'я «живу» в интернете', value: 5 },
    ],
  },
  {
    code: 'test_390_2', text: 'Сколько времени в среднем ты проводишь в интернете в день?', type: 'single', required: true,
    options: [
      { label: 'меньше часа', value: 1 }, { label: '1–3 часа', value: 2 }, { label: '3–5 часов', value: 3 },
      { label: '6–8 часов', value: 4 }, { label: 'практически постоянно подключен к интернет-сети', value: 5 },
    ],
  },
  {
    code: 'test_390_3', text: 'Укажи свой стаж знакомства с интернетом:', type: 'single', required: true,
    options: [
      { label: 'менее 1 года', value: 1 }, { label: '1–3 года', value: 2 }, { label: '4–6 лет', value: 3 },
      { label: '7–8 лет', value: 4 }, { label: 'более 9 лет', value: 5 },
    ],
  },
  {
    code: 'test_390_4', text: 'Насколько уверенным пользователем интернета ты себя считаешь?', type: 'single', required: true,
    options: [
      { label: 'Совсем неуверенным', value: 1 }, { label: 'Не очень уверенным', value: 2 },
      { label: 'Довольно уверенным', value: 3 }, { label: 'Уверенным', value: 4 }, { label: 'Очень уверенным', value: 5 },
    ],
  },
  ...[
    ['Радость', 1], ['Страх', 2], ['Удивление', 3], ['Стыд', 4], ['Интерес', 5],
    ['Отвращение', 6], ['Удовольствие', 7], ['Гнев', 8], ['Восхищение', 9],
  ].map(([label, n]) => ({
    code: `test_390_${Number(n) + 4}`, text: `Вопрос 5. Какие эмоции и чувства ты испытываешь, находясь в интернете? (в каждой строке выбери один ответ) — ${label}`,
    type: 'single' as const, required: true, options: frequency,
  })),
  ...[
    'Ты используешь интернет, чтобы уйти от проблем или избавиться от плохого настроения.',
    'Каждый раз ты проводишь в интернете больше времени, чем планировал.',
    'Ты думаешь об интернете, когда находишься вне сети.',
    'Находясь вне сети, ты испытываешь подавленность или беспокойство.',
    'Ты можешь лишиться отношений с кем-либо, перестать ходить в школу из-за интернета.',
  ].map((text, index) => ({
    code: `test_390_${index + 14}`, text: `Вопрос 6. Выскажи свое мнение по ряду вопросов, связанных с использованием интернета. Если согласен с суждением, поставь «+» в графе «Да», если не согласен — в графе «Нет». — ${text}`,
    type: 'single' as const, required: true, options: yesNo,
  })),
  ...[
    'общаться в «ВКонтакте», «Одноклассниках» и других социальных сетях',
    'общаться с друзьями в чатах и мессенджерах',
    'общаться по Скайпу',
    'вести Instagram',
    'вести виртуальный дневник (блог)',
    'искать информацию для учебы или учиться онлайн',
    'искать информацию для культурного и духовного развития',
    'скачивать программы, музыку, фото, видео',
    'слушать аудиозаписи',
    'смотреть видеозаписи',
    'узнавать о последних событиях и новостях в стране и мире',
    'играть в онлайн-игры',
    'принимать участие в интернет-акциях, голосовании и др.',
    'просматривать разные сайты',
    'искать и заказывать товары или услуги в интернете',
  ].map((text, index) => ({
    code: `test_390_${index + 19}`, text: `Вопрос 7. В интернете тебе нравится (в каждой строке выбери один ответ): ${text}`,
    type: 'single' as const, required: true, options: liking,
  })),
];

export const instrument: SeedSection = {
  code: 'test_390',
  title: 'Индекс погруженности в интернет-среду',
  description: 'Стандартизированный опросник Регуш и соавторов для подростков 11–17 лет. Описывает степень интернет-активности через цифровое потребление, самооценку цифровой компетентности и эмоциональное отношение к цифровой среде. Помогает автору опроса получить профиль этих аспектов и общий описательный индекс; показатель не является мерой клинической интернет-зависимости.',
  questions,
};

// Native answer slots are q1-q4, nine rows of q5, five binary q6 statements, then fifteen q7 activities.
// Weighted aggregates express the source's per-question averages/difference using the supported sum engine.
export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'digital_consumption', label: 'Цифровое потребление', items: [1, 2, 14, 15, 16, 17, 18], reverseItems: [], aggregation: 'sum', weights: { 1: 1, 2: 1, 14: 1/5, 15: 1/5, 16: 1/5, 17: 1/5, 18: 1/5 } },
    { key: 'digital_competence', label: 'Цифровая компетентность', items: [3, 4], reverseItems: [], aggregation: 'sum' },
    { key: 'emotional_attitude', label: 'Эмоциональное отношение к цифровой среде', items: [5, 6, 7, 8, 9, 10, 11, 12, 13, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33], reverseItems: [], aggregation: 'sum', weights: { 5: 1/9, 6: -1/9, 7: 1/9, 8: -1/9, 9: 1/9, 10: -1/9, 11: 1/9, 12: -1/9, 13: 1/9, 19: 1/15, 20: 1/15, 21: 1/15, 22: 1/15, 23: 1/15, 24: 1/15, 25: 1/15, 26: 1/15, 27: 1/15, 28: 1/15, 29: 1/15, 30: 1/15, 31: 1/15, 32: 1/15, 33: 1/15 } },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручной контроль: минимум по первым четырём вопросам, нейтральные эмоции, нет по всем суждениям, безразличие ко всем активностям',
    answers: {
      '1': 1, '2': 1, '3': 1, '4': 1,
      '5': 3, '6': 3, '7': 3, '8': 3, '9': 3, '10': 3, '11': 3, '12': 3, '13': 3,
      '14': 0, '15': 0, '16': 0, '17': 0, '18': 0,
      '19': 3, '20': 3, '21': 3, '22': 3, '23': 3,
      '24': 3, '25': 3, '26': 3, '27': 3, '28': 3, '29': 3, '30': 3, '31': 3, '32': 3, '33': 3,
    },
    expected: { digital_consumption: 2, digital_competence: 2, emotional_attitude: 6 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'ipis-regush-et-al-2021-standardized-v1',
};









