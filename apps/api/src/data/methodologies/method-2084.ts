import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Никогда' },
  { value: '2', label: 'Редко' },
  { value: '3', label: 'Иногда' },
  { value: '4', label: 'Часто' },
  { value: '5', label: 'Всегда' },
];

const items = [
  'Я достойно показываю себя в спорте.',
  'Я так устаю от тренировок, что мне не хватает сил на другие дела.',
  'Лучше бы я на другое тратил силы, которые трачу на спорт.',
  'Я чрезмерно устаю от своих занятий спортом.',
  'Я не слишком многого добиваюсь в спорте.',
  'Я уже не так забочусь о своей результативности, как раньше.',
  'Я не выступаю так, как могу выступать.',
  'У меня такое чувство, что спорт меня уничтожил.',
  'Я уже не занимаюсь спортом так усердно, как раньше.',
  'Мой организм изношен спортом.',
  'Я меньше, чем раньше, беспокоюсь о своих спортивных успехах.',
  'Я истощен оттого, каких физических и психических затрат стоит мне спорт.',
  'Кажется, в том, что я делаю, нет смысла; я не выступаю так, как должен.',
  'Я чувствую себя успешным спортсменом.',
  'По отношению к спорту я испытываю негативные эмоции.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2098_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2098',
  title: 'Шкала выгорания спортсмена (ABQ), русская адаптация Бочавер, Бондарев и Довжик',
  description: 'Шкала оценивает выраженность выгорания в профессиональном спорте по трём аспектам: физическому и эмоциональному истощению, снижению чувства спортивных достижений и обесцениванию спорта. Версия предназначена для профессиональных спортсменов независимо от возраста и вида спорта; её описание адаптации не рекомендует применять опросник к спортсменам-любителям. Результаты помогают автору опроса раздельно рассматривать эти три стороны выгорания.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'exhaustion', label: 'Физическое и эмоциональное истощение', items: [2, 4, 8, 10, 12], reverseItems: [], aggregation: 'mean' },
    { key: 'reduced_accomplishment', label: 'Снижение чувства достижений', items: [1, 5, 7, 13, 14], reverseItems: [1, 14], aggregation: 'mean' },
    { key: 'sport_devaluation', label: 'Обесценивание спорта', items: [3, 6, 9, 11, 15], reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: все ответы «Никогда», обратные пункты перекодированы в 5',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { exhaustion: 1, reduced_accomplishment: 4.2, sport_devaluation: 1 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'abq-raedeke-smith-2001-bochaver-bondarev-dovzhik-2023-v1',
};
