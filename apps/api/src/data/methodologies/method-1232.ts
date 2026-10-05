import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'никогда' },
  { value: '2', label: 'редко' },
  { value: '3', label: 'иногда' },
  { value: '4', label: 'часто' },
  { value: '5', label: 'очень часто' },
  { value: '6', label: 'постоянно' },
];

const items = [
  'Играете ли вы в компьютерные игры?',
  'Запрещают ли родители играть вам в компьютерные игры из-за того, что вы тратите на них слишком много времени?',
  'Откладываете ли вы выполнение школьных домашних заданий, чтобы поиграть за компьютером?',
  'Чувствуете ли вы себя раздраженным, если по каким-то причинам вам необходимо прекратить компьютерную игру?',
  'Расстраиваетесь ли вы, если в течение дня вам не удается поиграть за компьютером?',
  'Думаете ли вы о результатах, достигнутых в компьютерной игре?',
  'Планируете ли вы повысить уровень своих результатов в игре?',
  'Приходилось ли вам засиживаться за компьютерной игрой допоздна?',
  'Чувствуете ли вы тягу к компьютерным играм?',
  'Отказываетесь ли вы от общения с друзьями, чтобы поиграть за компьютером?',
  'Случалось ли вам тратить на компьютерные игры деньги, которые были предназначены для других целей?',
  'Приходилось ли вам играть за компьютером более 5 часов в день?',
  'Предпочитаете ли вы компьютерную игру чтению интересной книги или просмотру фильма?',
  'Играете ли вы с друзьями в компьютерные игры?',
  'Замечаете ли вы, как летит время, пока вы играете в компьютерную игру?',
  'Как часто вы играли бы в компьютерные игры, если бы у вас была такая возможность?',
  'Случалось ли вам скрывать от родителей, что вы играли за компьютером?',
  'Используете ли вы компьютерную игру для того, чтобы уйти от проблем или от плохого настроения?',
  'Обсуждаете ли вы результаты компьютерных игр с друзьями?',
  'Злитесь ли вы, когда вас кто-то отвлекает от компьютерной игры?',
  'Случалось ли вам уставать из-за того, что вы слишком долго играли за компьютером?',
  'Стремитесь ли вы все свое свободное время играть за компьютером?',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1261_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1261',
  title: 'Опросник степени увлеченности компьютерными играми',
  description: 'Опросник А. В. Гришиной оценивает выраженность увлеченности компьютерными играми у младших подростков. Пять аспектов охватывают эмоциональную привлекательность игр, самоконтроль игрового поведения, целевую ориентацию на игровые результаты, отношение родителей и предпочтение виртуального общения реальному; исходная проверка проводилась на школьниках 11–12 лет.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 6,
  scales: [
    { key: 'emotionalAttitude', label: 'Эмоциональное отношение к компьютерным играм (Иэ)', items: [4, 5, 13, 18, 20], reverseItems: [], aggregation: 'sum' },
    { key: 'selfControl', label: 'Самоконтроль в компьютерных играх (Ис)', items: [3, 8, 9, 11, 12, 15, 16, 21, 22], reverseItems: [], aggregation: 'sum' },
    { key: 'goalOrientation', label: 'Целевая направленность на компьютерные игры (Иц)', items: [1, 6, 7], reverseItems: [], aggregation: 'sum' },
    { key: 'parentalAttitude', label: 'Родительское отношение к компьютерным играм (Ир)', items: [2, 17], reverseItems: [], aggregation: 'sum' },
    { key: 'virtualCommunication', label: 'Предпочтение виртуального общения реальному (Ио)', items: [10, 14, 19], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы «никогда»: ручная проверка сумм пунктов шкал',
    answers: Object.fromEntries(Array.from({ length: 22 }, (_, index) => [String(index + 1), 1])),
    expected: { emotionalAttitude: 5, selfControl: 9, goalOrientation: 3, parentalAttitude: 2, virtualCommunication: 3 },
  },
  {
    title: 'Все ответы «постоянно»: ручная проверка сумм пунктов шкал',
    answers: Object.fromEntries(Array.from({ length: 22 }, (_, index) => [String(index + 1), 6])),
    expected: { emotionalAttitude: 30, selfControl: 54, goalOrientation: 18, parentalAttitude: 12, virtualCommunication: 18 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'grishina-computer-game-engagement-2014-v1',
};
