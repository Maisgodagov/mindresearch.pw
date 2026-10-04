import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Никогда' },
  { value: '2', label: 'Иногда' },
  { value: '3', label: 'Часто' },
  { value: '4', label: 'Почти всегда' },
  { value: '5', label: 'Всегда' },
];

const items = [
  'Мне нравится проводить время с родителями.',
  'Утром мне хочется пойти в школу.',
  'Большинство моих учителей мне нравятся.',
  'Мне кажется, я выгляжу хорошо.',
  'Мои друзья относятся ко мне хорошо.',
  'Мои родители занимаются со мной интересными вещами.',
  'Мне нравится в школе.',
  'Я доволен своими учителями.',
  'Другим со мной интересно.',
  'Друзья хорошо обращаются со мной.',
  'Моя семья лучше большинства других.',
  'В школе интересно.',
  'Я люблю слушать моих учителей.',
  'Я приятный человек.',
  'У меня хорошие друзья.',
  'Члены моей семьи хорошо обращаются друг с другом.',
  'Я бы хотел, чтобы можно было не ходить в школу.',
  'Некоторые мои учителя — интересные люди.',
  'Большинству людей я нравлюсь.',
  'Мне нравится проводить время с друзьями.',
  'Родители справедливо относятся ко мне.',
  'Мне интересно на школьных занятиях.',
  'Я всегда могу обратиться к учителям за помощью.',
  'Есть много вещей, которые у меня хорошо получаются.',
  'У меня достаточно друзей.',
  'Дома я могу заняться множеством интересных вещей.',
  'В школе я чувствую себя плохо.',
  'С учителями интересно разговаривать.',
  'Я нравлюсь себе как человек.',
  'Мои друзья помогут мне, если понадобится.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_734_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_734',
  title: 'Многомерная шкала удовлетворенности жизнью школьников (ШУДЖИ)',
  description: 'ШУДЖИ оценивает удовлетворенность жизнью младшего школьника в пяти областях: семье, школе, отношениях с учителями, отношении к себе и дружбе; также можно получить общий показатель. Профиль помогает исследователю или школьному психологу увидеть, какие сферы связаны с субъективным благополучием ребёнка. Опубликованная русская 30-пунктовая версия разработана и проверена для учащихся 3–4 классов.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'family', label: 'Семья', items: [1, 6, 11, 16, 21, 26], reverseItems: [], aggregation: 'sum' },
    { key: 'school', label: 'Школа', items: [2, 7, 12, 17, 22, 27], reverseItems: [17, 27], aggregation: 'sum' },
    { key: 'teachers', label: 'Учителя', items: [3, 8, 13, 18, 23, 28], reverseItems: [], aggregation: 'sum' },
    { key: 'myself', label: 'Я сам', items: [4, 9, 14, 19, 24, 29], reverseItems: [], aggregation: 'sum' },
    { key: 'friends', label: 'Друзья', items: [5, 10, 15, 20, 25, 30], reverseItems: [], aggregation: 'sum' },
    { key: 'overall', label: 'Общий показатель', items: Array.from({ length: 30 }, (_, index) => index + 1), reverseItems: [17, 27], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: ответы всегда (5), кроме двух обратных пунктов (1)',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), [17, 27].includes(index + 1) ? 1 : 5])),
    expected: { family: 30, school: 30, teachers: 30, myself: 30, friends: 30, overall: 150 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'shudji-sychev-gordeeva-lunkina-osin-sidneva-2018-30items-five-scales-sum-reverse-17-27-v1',
};
