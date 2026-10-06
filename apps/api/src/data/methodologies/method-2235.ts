import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'Никогда' },
  { value: '1', label: 'Редко' },
  { value: '2', label: 'Иногда' },
  { value: '3', label: 'Часто' },
  { value: '4', label: 'Всегда' },
];

const items = [
  'Я так много думаю об этом человеке, что мне трудно выполнять повседневные обязанности.',
  'Воспоминания о человеке, который умер, причиняют мне страдания.',
  'Я не могу принять смерть человека, который умер.',
  'Я тоскую по человеку, который умер.',
  'Меня тянет в места и к вещам, связанным с человеком, который умер.',
  'Я не могу не чувствовать злость по поводу его/ее смерти.',
  'Я не верю в то, что случилось.',
  'Я ошеломлен и потрясен тем, что случилось.',
  'С тех пор как он умер, мне трудно доверять людям.',
  'С тех пор как он умер, я потерял способность заботиться о других людях или я чувствую, что отдаляюсь от людей, о которых забочусь.',
  'Я испытываю боль в той же области или имею те же симптомы, что и умерший.',
  'Я делаю всё, что в моих силах, чтобы избежать напоминаний об умершем.',
  'Я чувствую, что жизнь пуста без умершего.',
  'Умерший разговаривает со мной.',
  'Умерший предстает передо мной.',
  'Я чувствую, что несправедливо жить, когда этот человек умер.',
  'Я чувствую горечь в связи со смертью этого человека.',
  'Я завидую тем, кто не потерял близкого человека.',
  'Мне одиноко большую часть времени, с тех пор как он умер.',
];

const itemNumbers = items.map((_, index) => index + 1);
const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2253_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2253',
  title: 'Шкала осложненного горя (ICG)',
  description: '19-пунктовый скрининговый опросник оценивает выраженность осложненного горя после утраты. Он охватывает тоску и поглощенность мыслями об умершем, неверие и потрясение, гнев и горечь, отчуждение, избегание напоминаний, телесные и перцептивные переживания, пустоту и одиночество. Предназначен для оценки переживаний людей, перенесших утрату; результат помогает описывать выраженность симптомов, но сам по себе не устанавливает диагноз.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 4,
  scales: [{
    key: 'total',
    label: 'Общий балл ICG',
    items: itemNumbers,
    reverseItems: [],
    aggregation: 'sum',
  }],
};

const allAnswers = (value: number) => Object.fromEntries(itemNumbers.map(item => [String(item), value]));
const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: все ответы «Никогда» дают 0',
    answers: allAnswers(0),
    expected: { total: 0 },
  },
  {
    title: 'Ручная проверка: все ответы «Всегда» дают 76',
    answers: allAnswers(4),
    expected: { total: 76 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['mood-depression'],
  scoringConfig,
  validationCases,
  formulaVersion: 'icg-19-prigerson-1995-psytests-ru-v1',
};
