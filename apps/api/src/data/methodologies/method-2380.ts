import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Совсем не согласен' },
  { value: '2', label: 'Пожалуй, не согласен' },
  { value: '3', label: 'Затрудняюсь с ответом' },
  { value: '4', label: 'Пожалуй, согласен' },
  { value: '5', label: 'Согласен полностью' },
];

const items = [
  'Я люблю находиться на открытом воздухе, даже в плохую погоду.',
  'Предназначение некоторых биологических видов в том и состоит, чтобы вымереть или исчезнуть.',
  'Люди имеют право использовать природные ресурсы, как им хочется.',
  'Для меня идеальным местом отдыха была бы отдаленная от цивилизации, дикая местность.',
  'Я всегда думаю о том, как мои действия сказываются на окружающей среде.',
  'Мне нравится копаться в земле и ощущать ее на своих руках.',
  'Моя связь с природой и окружающей средой – это часть моей духовности.',
  'Я много знаю об экологических проблемах.',
  'Я замечаю дикую природу везде, где бы я ни был.',
  'Я не часто выхожу на природу.',
  'Ничего из того, что я делаю, не повлияет на проблемы в других местах на планете.',
  'Я не отделен от природы, а являюсь частью природы.',
  'Мысль о том, чтобы находиться глубоко в лесу, далеко от цивилизации, пугает меня.',
  'Мои чувства к природе не влияют на мою повседневную жизнь.',
  'Животные, птицы и растения должны иметь меньше прав, чем люди.',
  'Даже находясь на улицах города, я замечаю природу вокруг себя.',
  'Мое отношение к природе – важная часть того, что я есть.',
  'Специальная забота о природе не нужна, потому что природа достаточно сильна, чтобы оправиться от любого человеческого воздействия.',
  'Состояние других биологических видов – индикатор будущего для людей.',
  'Я много думаю о страданиях животных.',
  'Я чувствую себя тесно связанным со всеми живыми существами и Землей.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2398_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2398',
  title: 'Шкала связанности с природой (Nature Relatedness Scale, NRS; русская адаптация И. В. Кряж)',
  description: 'Методика оценивает субъективную связанность человека с природой по эмоциональному самоотождествлению с природой, экологическим убеждениям и ощущению влияния человека на живой мир, а также по опыту и стремлению бывать на природе. Подходит для взрослых респондентов и исследовательских опросов; включает полную 21-пунктовую версию NRS в русской адаптации И. В. Кряж.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'overall', label: 'Общая связанность с природой', items: Array.from({ length: 21 }, (_, i) => i + 1), reverseItems: [2, 3, 10, 11, 13, 14, 15, 18], aggregation: 'mean' },
    { key: 'self', label: 'NR-Self: идентификация и связь с природой', items: [5, 7, 8, 12, 14, 16, 17, 21], reverseItems: [14], aggregation: 'mean' },
    { key: 'perspective', label: 'NR-Perspective: экологические убеждения и субъектность', items: [2, 3, 11, 15, 18, 19, 20], reverseItems: [2, 3, 11, 15, 18], aggregation: 'mean' },
    { key: 'experience', label: 'NR-Experience: опыт взаимодействия с природой', items: [1, 4, 6, 9, 10, 13], reverseItems: [10, 13], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: нейтральные ответы по всем пунктам дают среднее 3 по общей и каждой подшкале',
    answers: Object.fromEntries(Array.from({ length: 21 }, (_, i) => [String(i + 1), 3])),
    expected: { overall: 3, self: 3, perspective: 3, experience: 3 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument: { ...instrument, categoryIds: ['social-attitude'] },
  scoringConfig,
  validationCases,
  formulaVersion: 'nisbet-zelenski-murphy-nrs-21-kryazh-ru-reverse-mean-v1',
};
