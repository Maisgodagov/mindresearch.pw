import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Совершенно не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Скорее не согласен, чем согласен' },
  { value: '4', label: 'Когда как' },
  { value: '5', label: 'Скорее согласен, чем не согласен' },
  { value: '6', label: 'Согласен' },
  { value: '7', label: 'Совершенно согласен' },
];

const items = [
  'Меня можно назвать целеустремленным человеком.',
  'Я терпеливо изучаю что-то новое, пока не пойму суть.',
  'Иногда я ловлю себя на том, что продолжаю что-то делать, даже если это бессмысленно.',
  'Я всегда достигаю своих целей.',
  'Несмотря на трудности, я настойчиво продолжаю действовать, пока не решу проблему.',
  'Я буду продолжать пытаться что-то делать, даже если знаю, что мои действия бесполезны.',
  'Фраза: «Кто стремится, тот добьется» – это про меня.',
  'Мой девиз «Терпение и труд все перетрут».',
  'Ничто не заставит меня изменить свое мнение.',
  'Я могу долго сохранять интерес к делу, которое надо завершить.',
  'Люди гораздо чаще терпят неудачу из-за недостатка настойчивости, чем из-за недостатка таланта.',
  'Я до конца отстаиваю свое мнение в споре.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2220_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2220',
  title: 'Шкала настойчивости',
  description: 'Многоаспектная шкала настойчивости для подростков 12–18 лет и взрослых 17–61 года. Она раздельно оценивает настойчивость в достижении целей, настойчивость в преодолении трудностей и неуместную настойчивость; профиль помогает автору опроса изучить целенаправленное усилие и упорство, которое сохраняется даже при бесполезности действий.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'goals', label: 'Настойчивость в достижении целей', items: [1, 4, 7, 10], reverseItems: [], aggregation: 'sum' },
    { key: 'difficulties', label: 'Настойчивость в преодолении трудностей', items: [2, 5, 8, 11], reverseItems: [], aggregation: 'sum' },
    { key: 'inappropriate', label: 'Неуместная настойчивость', items: [3, 6, 9, 12], reverseItems: [], aggregation: 'sum' },
  ],
};

const answers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Все ответы в нейтральной середине шкалы', answers: answers(4), expected: { goals: 16, difficulties: 16, inappropriate: 16 } },
  { title: 'Ручная проверка: ответы от 1 до 12 по кругу 1–7', answers: Object.fromEntries(items.map((_, index) => [String(index + 1), (index % 7) + 1])), expected: { goals: 16, difficulties: 16, inappropriate: 16 } },
];

export const methodology: MethodologyRegistration = {
  categoryIds: ["trait-goal"],
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'odintsova-radchikova-perseverance-scale-2024-v1',
};
