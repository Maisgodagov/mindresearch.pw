import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const items = [
  'Мне было трудно сконцентрироваться.',
  'Я чувствовал беспомощность.',
  'Я был рассеян и не мог вспомнить, что я на самом деле делал.',
  'Я чувствовал отвращение.',
  'Я думал о том, чтобы причинить себе боль.',
  'Я не доверял другим людям.',
  'Я не верил в свое право на жизнь.',
  'Мне было одиноко.',
  'Я испытывал сильное внутреннее напряжение.',
  'У меня возникали образы, которых я очень пугался.',
  'Я ненавидел себя.',
  'Я хотел себя наказать.',
  'Я страдал от стыда.',
  'Мое настроение стремительно сменялось тревогой, гневом и депрессией.',
  'Я страдал от голосов и шумов в моей голове и снаружи.',
  'Критика оказывала на меня разрушительное воздействие.',
  'Я чувствовал себя уязвимым.',
  'Мысль о смерти определенно была притягательна для меня.',
  'Мне всё казалось бессмысленным.',
  'Я боялся потерять контроль над собой.',
  'Я чувствовал отвращение к себе.',
  'Я чувствовал, будто бы нахожусь очень далеко от самого себя.',
  'Я чувствовал себя никчемным.',
];

const options = [
  { value: '0', label: 'Вовсе нет' },
  { value: '1', label: 'Чуть-чуть' },
  { value: '2', label: 'В некоторой степени' },
  { value: '3', label: 'В большой степени' },
  { value: '4', label: 'Да, очень сильно' },
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1429_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1429',
  title: 'Перечень симптомов пограничного расстройства, краткая версия (BSL-23)',
  description: 'BSL-23 оценивает выраженность характерной для пограничного расстройства личности симптоматики за последнюю неделю: эмоциональную нестабильность, самообесценивание, стыд, недоверие, внутреннее напряжение и диссоциативные переживания. Подходит для взрослых клинических и исследовательских групп для количественного описания симптомной нагрузки и её динамики; результат не является диагнозом.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 4,
  scales: [{
    key: 'mean',
    label: 'Средний балл BSL-23',
    items: Array.from({ length: 23 }, (_, index) => index + 1),
    reverseItems: [],
    aggregation: 'mean',
  }],
};

const allAnswers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Все пункты отмечены «Вовсе нет»', answers: allAnswers(0), expected: { mean: 0 } },
  { title: 'Все пункты отмечены «Да, очень сильно»', answers: allAnswers(4), expected: { mean: 4 } },
  { title: 'Ручной контроль: один максимальный ответ, остальные минимальные', answers: { ...allAnswers(0), '1': 4 }, expected: { mean: 4 / 23 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'bsl-23-ru-mean-0-4-v1',
};
