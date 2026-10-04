import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Совсем нет / не применимо' },
  { value: '2', label: 'Немного' },
  { value: '3', label: 'Довольно сильно' },
  { value: '4', label: 'Очень сильно' },
];

const statements = [
  'Искал(а) более прочной связи с Богом.',
  'Искал(а) любви и заботы Бога.',
  'Просил(а) помощи у Бога в том, чтобы отпустить свой гнев.',
  'Старался(-ась) воплощать свои планы в жизнь, полагаясь на Бога.',
  'Пытался(-ась) увидеть, что Бог, возможно, старается укрепить меня в той или иной ситуации.',
  'Просил(а) прощения за мои грехи.',
  'Концентрировался(-ась) на вере, чтобы перестать беспокоиться о своих проблемах.',
  'Задавался(-ась) вопросом, не оставил ли меня Господь.',
  'Чувствовал(а), что Бог наказывает меня за отсутствие преданности.',
  'Интересовался(-ась), что я сделал(а) такого, за что Бог наказывает меня.',
  'Сомневался(-ась) в любви Божией ко мне.',
  'Задавался(-ась) вопросом, не отвернулась ли от меня моя Церковь.',
  'Полагал(а), что это происки лукавого.',
];

const questions: SeedSection['questions'] = statements.map((text, index) => ({
  code: `test_495_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

const instrument: SeedSection = {
  code: 'test_495',
  title: 'Краткий опросник религиозного совладания (Brief RCOPE), обновлённая русскоязычная православная версия (2025)',
  description: 'Опросник измеряет выраженность позитивного и негативного религиозного совладания со стрессом и жизненными трудностями: обращение к Богу за поддержкой и смыслом, а также духовное напряжение, сомнения и переживание оставленности или наказания. Эта редакция предназначена для исследований среди русскоязычных православных христиан; отдельные субшкалы можно анализировать самостоятельно.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 4,
  scales: [
    { key: 'positive_religious_coping', label: 'Позитивное религиозное совладание', items: [1, 2, 3, 4, 5, 6, 7], reverseItems: [], aggregation: 'mean' },
    { key: 'negative_religious_coping', label: 'Негативное религиозное совладание', items: [8, 9, 10, 11, 12, 13], reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: ответы 1 на позитивные пункты и 4 на негативные',
    answers: Object.fromEntries(Array.from({ length: 13 }, (_, index) => [String(index + 1), index < 7 ? 1 : 4])),
    expected: { positive_religious_coping: 1, negative_religious_coping: 4 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'shankov-zolotareva-russian-brief-rcope-2025-v1',
};
