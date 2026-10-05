import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const items = [
  'Я чувствую себя так, как будто я столкнулся лицом к лицу со всем миром.',
  'Я нехороший человек.',
  'Почему у меня никогда ничего не получается?',
  'Меня никто не понимает.',
  'Я не раз подводил окружающих людей.',
  'Я думаю, что не смогу дальше идти по жизни.',
  'Мне бы хотелось быть лучше.',
  'Я очень слабый человек.',
  'Моя жизнь идет совсем не в том направлении, в каком бы мне хотелось.',
  'Я глубоко разочарован в себе.',
  'Меня больше ничего не радует.',
  'Я больше не могу этого выносить.',
  'Я никак не могу найти силы, чтобы начать делать что-либо.',
  'Что со мной не так?',
  'Лучше бы я был кем-то другим.',
  'Я никак не могу организовать себя.',
  'Я ненавижу себя.',
  'Я никчемный.',
  'Лучше бы я просто исчез.',
  'В чем моя проблема?',
  'Я неудачник.',
  'Моя жизнь в полном беспорядке.',
  'Я постоянно терплю неудачи в делах.',
  'У меня никогда ничего не получится.',
  'Я чувствую себя таким беспомощным.',
  'Что-то должно измениться.',
  'Должно быть, со мной что-то не так.',
  'Мое будущее безнадежно.',
  'На это просто не стоит затрачивать усилия.',
  'Я ничего не могу довести до конца.',
];

const options = [
  { value: '1', label: 'Не посещали вовсе' },
  { value: '2', label: 'Иногда' },
  { value: '3', label: 'Относительно часто' },
  { value: '4', label: 'Часто' },
  { value: '5', label: 'Всё время' },
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_871_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_871',
  title: 'Опросник автоматических мыслей (ATQ)',
  description: 'Оценивает частоту негативных автоматических самоутверждений за последнюю неделю, связанных с депрессивной симптоматикой. Охватывает социальную дезадаптацию и желание перемен, негативное восприятие себя и ожидания, низкую самооценку и беспомощность. Русская адаптация А. В. Ялтонской (2013); предназначен для оценки взрослых, в том числе динамики когниций при работе с депрессивными расстройствами.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'total', label: 'Общий балл частоты негативных автоматических мыслей', items: Array.from({ length: 30 }, (_, i) => i + 1), reverseItems: [], aggregation: 'sum' },
    { key: 'pmdc', label: 'Социальная дезадаптация и желание перемен (PMDC)', items: [7, 10, 14, 20, 26], reverseItems: [], aggregation: 'mean' },
    { key: 'nsne', label: 'Негативное восприятие себя и негативные ожидания (NSNE)', items: [2, 3, 9, 21, 23, 24, 28], reverseItems: [], aggregation: 'mean' },
    { key: 'lse', label: 'Низкая самооценка (LSE)', items: [17, 18], reverseItems: [], aggregation: 'mean' },
    { key: 'helplessness', label: 'Беспомощность', items: [29, 30], reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  { title: 'Все пункты отмечены как «Иногда»', answers: Object.fromEntries(items.map((_, i) => [String(i + 1), 2])), expected: { total: 60, pmdc: 2, nsne: 2, lse: 2, helplessness: 2 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'atq-30-hollon-kendall-yaltonskaya-ru-v1',
};
