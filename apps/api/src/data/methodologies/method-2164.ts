import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const items = [
  'Я забываю номера телефонов',
  'Я забываю, что и куда положил',
  'Оторвавшись от книги, не могу найти место, которое читал',
  'Мне нужно составить список дел, чтобы ничего не забыть',
  'Я забываю о назначенных встречах',
  'Я забываю, что планировал сделать по дороге домой',
  'Я забываю имена старых знакомых',
  'Мне трудно сосредоточиться',
  'Мне трудно пересказать содержание телепередачи',
  'Я не узнаю знакомых людей',
  'Мне трудно вникнуть в смысл того, что говорят окружающие',
  'Я быстро забываю имена людей, с которыми знакомлюсь',
  'Я забываю, какой сегодня день недели',
  'Когда кто-то говорит, я не могу сосредоточиться',
  'Я перепроверяю, закрыл ли дверь и выключил ли плиту',
  'Я пишу с ошибками',
  'Я легко отвлекаюсь',
  'Перед новым делом меня нужно проинструктировать несколько раз',
  'Мне трудно сосредоточиться, когда я читаю',
  'Я тут же забываю, что мне сказали',
  'Мне трудно принять решение',
  'Я все делаю очень медленно',
  'Моя голова бывает пустой',
  'Я забываю, какое сегодня число.',
];

const options = [
  { value: '0', label: 'никогда' },
  { value: '1', label: 'редко' },
  { value: '2', label: 'иногда' },
  { value: '3', label: 'часто' },
  { value: '4', label: 'очень часто' },
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2178_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2178',
  title: 'Опросник для самодиагностики когнитивного расстройства Макнера и Кана (сокращённая русская форма, 24 пункта)',
  description: 'Сокращённая русская форма предназначена для предварительной самооценки частоты повседневных когнитивных затруднений у пациентов, прежде всего старшего возраста. Охватывает забывчивость, внимание и концентрацию, узнавание и понимание речи, ориентировку во времени, принятие решений и выполнение привычных дел. Это скрининговая оценка жалоб, а не самостоятельная диагностика.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 4,
  scales: [{
    key: 'total',
    label: 'Суммарная частота когнитивных затруднений',
    items: Array.from({ length: 24 }, (_, index) => index + 1),
    reverseItems: [],
    aggregation: 'sum',
  }],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы «никогда»: сумма 0, ниже порога 42',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 0])),
    expected: { total: 0 },
  },
  {
    title: 'Ручная проверка: пункты 1–23 = 2, пункт 24 = 3; сумма 49',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), index === 23 ? 3 : 2])),
    expected: { total: 49 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'mcnair-kahn-cds-ru-minzdrav-guidelines-2020-24item-sum-0-4-cutoff-gt42-v1',
};
