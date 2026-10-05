import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Почти всегда' },
  { value: '2', label: 'Очень часто' },
  { value: '3', label: 'Довольно часто' },
  { value: '4', label: 'Довольно редко' },
  { value: '5', label: 'Очень редко' },
  { value: '6', label: 'Почти никогда' },
];

const items = [
  'Я могу испытывать какую-либо эмоцию и не осознавать ее, пока не пройдет некоторое время.',
  'Я проливаю или ломаю вещи из-за небрежности, невнимательности или потому что думаю о чем-то другом.',
  'Мне трудно оставаться сосредоточенным на том, что происходит в настоящем.',
  'Я склонен спешить, чтобы добраться туда, куда иду, не обращая внимания на впечатления во время пути.',
  'Я обычно не замечаю физического напряжения или дискомфорта до тех пор, пока они не привлекут мое внимание.',
  'Я забываю имя человека почти сразу после того, как впервые его услышал.',
  'Кажется, я действую на автомате, почти не осознавая, что делаю.',
  'Я выполняю дела в спешке, не будучи в действительности сосредоточенным на них.',
  'Я настолько сосредоточен на цели, которую хочу достичь, что теряю связь с тем, что делаю для этого прямо сейчас.',
  'Я выполняю работу или задачи автоматически, не осознавая, что делаю.',
  'Я слушаю кого-либо вполуха, одновременно занимаясь чем-то еще.',
  'Я приезжаю в какое-либо место как бы на автопилоте и затем удивляюсь, зачем я туда приехал.',
  'Я часто поглощен мыслями о будущем или прошлом.',
  'Я замечаю, что делаю что-то, не обращая внимания.',
  'Я перекусываю, не осознавая, что ем.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_898_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_898',
  title: 'Опросник внимательности и осознанности (MAAS)',
  description: 'Русская версия MAAS А. М. Голубева оценивает диспозиционную осознанность в повседневной жизни через частоту невнимательных и автоматических действий. Пункты охватывают внимание к текущей деятельности, телесным ощущениям и эмоциям, присутствие в общении, а также отвлечение на прошлое и будущее. Предназначена для самооценки взрослых респондентов и исследовательского сравнения показателей; это одномерная версия, а не многокомпонентная адаптация МООП.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 6,
  scales: [
    { key: 'mindful_awareness', label: 'Осознанность в повседневной жизни', items: Array.from({ length: 15 }, (_, index) => index + 1), reverseItems: Array.from({ length: 15 }, (_, index) => index + 1), aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: ответы 1 по всем пунктам переходят в 6 после реверсирования; сумма 90',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { mindful_awareness: 90 },
  },
  {
    title: 'Ручная проверка: ответы 6 по всем пунктам переходят в 1 после реверсирования; сумма 15',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 6])),
    expected: { mindful_awareness: 15 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'brown-ryan-maas-golubev-ru-2012-reverse-all-sum-v1',
};
