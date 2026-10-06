import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Совсем не согласен' },
  { value: '2', label: 'Скорее не согласен' },
  { value: '3', label: 'Скорее согласен' },
  { value: '4', label: 'Полностью согласен' },
];

const items = [
  'Мне нравится доводить до конца начатые мною вещи.',
  'Мое обдумывание вещей всегда тщательное и имеет конкретную цель.',
  'Когда я в хорошем расположении духа, я часто попадаю в проблемные ситуации.',
  'Незаконченные задачи меня очень беспокоят.',
  'Мне нравится остановиться и всё обдумать, прежде чем начать действовать.',
  'Когда я плохо себя чувствую, для того чтобы улучшить свое текущее состояние я зачастую делаю те вещи, о которых в будущем буду сожалеть.',
  'Когда я начал что-то делать, мне хочется довести это до конца.',
  'Иногда, когда я плохо себя чувствую, я не могу перестать делать то, что я делаю, хотя от этого мне становится хуже.',
  'Мне нравится рисковать.',
  'Я теряю контроль, когда пребываю в отличном настроении.',
  'Я всегда завершаю начатое.',
  'Я предпочитаю подходить к вещам рационально и взвешенно.',
  'Когда я расстроен, я обычно действую, не задумываясь о последствиях.',
  'Я открыт к новым, неожиданным ощущениям, даже если они немного пугающие и необычные.',
  'Когда я чувствую себя отверженным, я говорю те вещи, о которых впоследствии сожалею.',
  'Я бы хотел научиться управлять самолетом.',
  'Другие бывают шокированы или обеспокоены тем, что я делаю, когда я очень взволнован.',
  'Я бы хотел испытать острые ощущения при спуске на лыжах с крутой горы.',
  'Я всегда тщательно обдумываю свои действия перед тем, как начать что-то делать.',
  'Я склонен действовать, не задумываясь, когда действительно взволнован.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2160_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2160',
  title: 'Шкала импульсивного поведения, SUPPS-P (короткая русскоязычная версия)',
  description: 'Короткая русскоязычная версия UPPS-P оценивает пять аспектов импульсивности: негативную и позитивную срочность (склонность действовать необдуманно при отрицательных и положительных эмоциях), поиск острых ощущений, недостаток усидчивости и недостаток преднамеренности. Подходит для исследовательской оценки взрослых; русская апробация проведена на выборке 18–21-летних, поэтому результаты для других возрастных групп следует интерпретировать с учётом ограниченности данных адаптации.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 4,
  scales: [
    { key: 'negative_urgency', label: 'Негативная срочность', items: [6, 8, 13, 15], reverseItems: [6, 8, 13, 15], aggregation: 'mean' },
    { key: 'lack_perseverance', label: 'Недостаточная усидчивость', items: [1, 4, 7, 11], reverseItems: [1, 4, 7], aggregation: 'mean' },
    { key: 'lack_premeditation', label: 'Недостаточная преднамеренность', items: [2, 5, 12, 19], reverseItems: [5, 12, 19], aggregation: 'mean' },
    { key: 'sensation_seeking', label: 'Поиск острых ощущений', items: [9, 14, 16, 18], reverseItems: [], aggregation: 'mean' },
    { key: 'positive_urgency', label: 'Позитивная срочность', items: [3, 10, 17, 20], reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Проверка реверса и средних: четыре согласия по пунктам негативной срочности дают 3 балла',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { negative_urgency: 4, lack_perseverance: 2.5, lack_premeditation: 2.5, sensation_seeking: 1, positive_urgency: 1 },
  },
  {
    title: 'Проверка обратного профиля на всех крайних ответах',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 4])),
    expected: { negative_urgency: 1, lack_perseverance: 2.5, lack_premeditation: 2.5, sensation_seeking: 4, positive_urgency: 4 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'gagarina-ru-supps-p-2021-mean-v1',
};
