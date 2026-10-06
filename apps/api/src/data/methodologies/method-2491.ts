import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const itemTexts = [
  'Я щедр по отношению к своим друзьям.',
  'Я быстро прихожу в себя после испуга или неожиданности.',
  'Мне нравится иметь дело с новыми и необычными ситуациями.',
  'Обычно мне удаётся произвести на людей благоприятное впечатление.',
  'Мне нравится пробовать новые блюда, которых я раньше не ел.',
  'Меня считают очень энергичным человеком.',
  'Мне нравится выбирать разные маршруты даже в хорошо знакомых местах.',
  'Я более любознателен, чем большинство людей.',
  'Большинство людей, которых я встречаю, мне симпатичны.',
  'Обычно я тщательно обдумываю свои действия, прежде чем что-либо сделать.',
  'Мне нравится заниматься новыми и необычными делами.',
  'Моя повседневная жизнь полна вещей, которые поддерживают мой интерес.',
  'Я бы назвал себя человеком с довольно сильным характером.',
  'Обычно я довольно быстро перестаю злиться на человека.',
];

const responseOptions = [
  { value: '1', label: 'Совершенно не соответствует' },
  { value: '2', label: 'Скорее не соответствует' },
  { value: '3', label: 'Отчасти соответствует' },
  { value: '4', label: 'Полностью соответствует' },
];

const questions: SeedSection['questions'] = itemTexts.map((text, index) => ({
  code: `test_2509_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: responseOptions,
}));

export const instrument: SeedSection = {
  code: 'test_2509',
  title: 'Шкала эго-пластичности ER89',
  description: 'ER89 оценивает эго-резильентность как устойчивую способность гибко регулировать самоконтроль и адаптироваться к меняющимся требованиям ситуации. Пункты охватывают открытость новому, любознательность, энергичность, социальную лёгкость и восстановление после эмоциональных реакций. Русский бланк представлен для общей самооценки взрослых; опубликованная страница перевода не сообщает о его психометрической адаптации.',
  categoryIds: ['trait-resilience'],
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 4,
  scales: [
    { key: 'egoResiliency', label: 'Эго-пластичность (эго-резильентность)', items: itemTexts.map((_, index) => index + 1), reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: все ответы 1 дают минимум 14',
    answers: Object.fromEntries(itemTexts.map((_, index) => [String(index + 1), 1])),
    expected: { egoResiliency: 14 },
  },
  {
    title: 'Ручная проверка ключа: ответ 4 на пункты 1–14 даёт максимум 56 без реверса',
    answers: Object.fromEntries(itemTexts.map((_, index) => [String(index + 1), 4])),
    expected: { egoResiliency: 56 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['trait-resilience'],
  scoringConfig,
  validationCases,
  formulaVersion: 'block-kremen-er89-1996-v1',
};
