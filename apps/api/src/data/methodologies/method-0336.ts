import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const frequency = [
  { value: '1', label: 'Никогда' },
  { value: '2', label: 'Редко' },
  { value: '3', label: 'Время от времени' },
  { value: '4', label: 'Часто' },
  { value: '5', label: 'Очень часто' },
];

const enjoyment = [
  { value: '1', label: 'Совсем не нравится' },
  { value: '2', label: 'Не нравится' },
  { value: '3', label: 'Безразлично' },
  { value: '4', label: 'Нравится' },
  { value: '5', label: 'Очень нравится' },
];

const rows = [
  'Общаться во «ВКонтакте», «Одноклассниках» и других социальных сетях',
  'Общаться с друзьями в чатах и мессенджерах',
  'Общаться по Скайпу',
  'Вести Instagram',
  'Вести виртуальный дневник (блог)',
  'Искать информацию для учёбы или учиться онлайн',
  'Искать информацию для культурного и духовного развития',
  'Скачивать программы, музыку, фото, видео',
  'Слушать аудиозаписи',
  'Смотреть видеозаписи',
  'Узнавать о последних событиях и новостях в стране и мире',
  'Играть в онлайн-игры',
  'Принимать участие в интернет-акциях, голосовании и др.',
  'Просматривать разные сайты',
  'Искать и заказывать товары или услуги в интернете',
];

const prompts: SeedSection['questions'] = [
  { code: 'test_368_1', text: 'Как часто ты пользуешься интернетом?', type: 'single', required: true, options: [
    { value: '1', label: 'Не пользуюсь интернетом вообще' }, { value: '2', label: 'Один-два раза в неделю' }, { value: '3', label: 'Один раз в день' }, { value: '4', label: 'Два-три раза в день' }, { value: '5', label: 'Я «живу» в интернете' },
  ] },
  { code: 'test_368_2', text: 'Сколько времени в среднем ты проводишь в интернете в день?', type: 'single', required: true, options: [
    { value: '1', label: 'Меньше часа' }, { value: '2', label: '1–3 часа' }, { value: '3', label: '3–5 часов' }, { value: '4', label: '6–8 часов' }, { value: '5', label: 'Практически постоянно подключён к интернет-сети' },
  ] },
  { code: 'test_368_3', text: 'Укажи свой стаж знакомства с интернетом:', type: 'single', required: true, options: [
    { value: '1', label: 'Менее 1 года' }, { value: '2', label: '1–3 года' }, { value: '3', label: '4–6 лет' }, { value: '4', label: '7–8 лет' }, { value: '5', label: 'Более 9 лет' },
  ] },
  { code: 'test_368_4', text: 'Насколько уверенным пользователем интернета ты себя считаешь?', type: 'single', required: true, options: [
    { value: '1', label: 'Совсем неуверенным' }, { value: '2', label: 'Не очень уверенным' }, { value: '3', label: 'Довольно уверенным' }, { value: '4', label: 'Уверенным' }, { value: '5', label: 'Очень уверенным' },
  ] },
  { code: 'test_368_5', text: 'Какие эмоции и чувства ты испытываешь, находясь в интернете? В каждой строке выбери один ответ.', type: 'matrix', required: true, options: frequency, items: ['Радость', 'Страх', 'Удивление', 'Стыд', 'Интерес', 'Отвращение', 'Удовольствие', 'Гнев', 'Восхищение'].map((label, index) => ({ code: String(index + 1), label })) },
  { code: 'test_368_6', text: 'Выскажи своё мнение по ряду вопросов, связанных с использованием интернета. Если ты согласен с суждением, выбери «Да», если не согласен — «Нет».', type: 'matrix', required: true, options: [{ value: '1', label: 'Да' }, { value: '0', label: 'Нет' }], items: [
    'Ты используешь интернет, чтобы уйти от проблем или избавиться от плохого настроения.',
    'Каждый раз ты проводишь в интернете больше времени, чем планировал.',
    'Ты думаешь об интернете, когда находишься вне сети.',
    'Находясь вне сети, ты испытываешь подавленность или беспокойство.',
    'Ты можешь лишиться отношений с кем-либо, перестать ходить в школу из-за интернета.',
  ].map((label, index) => ({ code: String(index + 1), label })) },
  { code: 'test_368_7', text: 'В интернете тебе нравится? В каждой строке выбери один ответ.', type: 'matrix', required: true, options: enjoyment, items: rows.map((label, index) => ({ code: String(index + 1), label })) },
];

export const instrument: SeedSection = {
  code: 'test_368',
  title: 'Индекс погружённости в интернет-среду',
  description: 'Методика оценивает выраженность интернет-погружённости подростков через цифровое потребление, самооценку цифровой компетентности и эмоциональное отношение к цифровой среде. Она помогает автору опроса получить профиль этих трёх аспектов и общий индекс для исследовательского изучения интернет-активности; стандартизированная версия рассчитана на подростков 11–17 лет и не является диагностикой интернет-зависимости.',
  questions: prompts,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 5,
  scales: [
    { key: 'digital_consumption', label: 'Цифровое потребление', items: [1, 2, 6], reverseItems: [], aggregation: 'sum' },
    { key: 'digital_competence', label: 'Цифровая компетентность', items: [3, 4], reverseItems: [], aggregation: 'sum' },
    { key: 'emotional_attitude', label: 'Эмоциональное отношение к цифровой среде', items: [5, 7], reverseItems: [], aggregation: 'sum' },
    { key: 'total', label: 'Индекс погружённости в интернет-среду', items: [1, 2, 3, 4, 5, 6, 7], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  { title: 'Вручную проверено: минимум по пунктам 1–4, отрицательные ответы по пункту 6 и нейтральные эмоции/активности', answers: { '1': 1, '2': 1, '3': 1, '4': 1, '5': 3, '6': 0, '7': 3 }, expected: { digital_consumption: 2, digital_competence: 2, emotional_attitude: 6, total: 10 } },
  { title: 'Вручную проверено: максимальные базовые оценки, все эмоции частые, все суждения подтверждены и все активности нравятся', answers: { '1': 5, '2': 5, '3': 5, '4': 5, '5': 5, '6': 1, '7': 5 }, expected: { digital_consumption: 15, digital_competence: 10, emotional_attitude: 10, total: 35 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'regush-et-al-2021-internet-immersion-index-standardized-v1',
};
