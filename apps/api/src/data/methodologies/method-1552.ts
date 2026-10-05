import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const ratingOptions = [
  { value: '1', label: 'Совсем не похоже на меня' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
  { value: '6', label: '6' },
  { value: '7', label: 'Очень похоже на меня' },
];

const prototypes = [
  {
    key: 'secure', label: 'Надёжный стиль (A)',
    text: 'Мне приятно испытывать близость и/или взаимозависимость: легко сближаться с другими людьми, чувствовать свою зависимость от них и их зависимость от меня. Я редко беспокоюсь о том, что меня могут бросить или о том, что кто-то может слишком сильно сблизиться со мной.',
  },
  {
    key: 'fearful', label: 'Боязливый стиль (B)',
    text: 'Мне нелегко сближаться с другими людьми. Я хочу этого, но мне сложно полностью полагаться на людей и зависеть от кого-то. Я боюсь, что если позволю себе довериться другому человеку, он может ранить меня.',
  },
  {
    key: 'preoccupied', label: 'Тревожный стиль (C)',
    text: 'Я очень нуждаюсь в близости: мне кажется, что люди не хотят сближаться со мной так, как того хотелось бы мне. Я часто беспокоюсь о том, действительно ли мой партнёр любит меня и хочет ли оставаться со мной. Я хочу полностью слиться с другим человеком, и это желание порой отпугивает людей.',
  },
  {
    key: 'dismissing', label: 'Отвергающий стиль (D)',
    text: 'Я могу обходиться без близких эмоциональных отношений; мне важно чувствовать свою свободу и самодостаточность, поэтому я предпочитаю ни от кого не зависеть сам и не вызывать зависимость от меня у других.',
  },
];

const questions: SeedSection['questions'] = [
  {
    code: 'test_1569_1',
    text: 'Ниже приводится характеристика четырёх стилей взаимоотношений, чаще всего описываемых людьми. Выберите тот стиль, который подходит вам больше других или описывает вас наилучшим образом.',
    type: 'single', required: true,
    options: prototypes.map((prototype) => ({ value: prototype.key, label: `${prototype.label}: ${prototype.text}` })),
  },
  ...prototypes.map((prototype, index) => ({
    code: `test_1569_${index + 2}`,
    text: `${prototype.label}. ${prototype.text}\n\nНасколько это описание похоже на вас?`,
    type: 'single' as const, required: true, options: ratingOptions,
  })),
];

export const instrument: SeedSection = {
  code: 'test_1569',
  title: 'Самооценка генерализованного типа привязанности (RQ)',
  description: 'Краткая методика К. Бартоломью и Л. Хоровица оценивает общий стиль привязанности взрослого человека в значимых отношениях независимо от того, являются ли они детско-родительскими, дружескими или романтическими. Четыре прототипа охватывают надёжную, боязливую, тревожную и отвергающую модели близости, зависимости и ожиданий от себя и других; автор опроса может использовать её для описания предпочтительного стиля и выраженности каждого прототипа.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: prototypes.map((prototype, index) => ({
    key: prototype.key,
    label: prototype.label,
    items: [index + 2],
    reverseItems: [],
    aggregation: 'sum' as const,
  })),
};

const validationCases: ValidationCase[] = [
  {
    title: 'Вручную проверено: оценки A=7, B=1, C=4, D=2',
    answers: { '2': '7', '3': '1', '4': '4', '5': '2' },
    expected: { secure: 7, fearful: 1, preoccupied: 4, dismissing: 2 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'rq-bartholomew-horowitz-1991-ru-7point-v1',
};
