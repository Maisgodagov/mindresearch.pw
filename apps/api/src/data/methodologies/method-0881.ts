import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'Никогда' },
  { value: '1', label: 'Очень редко' },
  { value: '2', label: 'Редко' },
  { value: '3', label: 'Иногда' },
  { value: '4', label: 'Часто' },
  { value: '5', label: 'Очень часто' },
  { value: '6', label: 'Всегда' },
];

const items = [
  'Я чувствую себя эмоционально опустошенным(ой).',
  'К концу рабочего дня я чувствую себя, как выжатый лимон.',
  'Я чувствую себя усталым(ой), когда встаю утром и должен(на) идти на работу.',
  'Я хорошо понимаю, что чувствуют мои пациенты и коллеги, и использую это для более успешного лечения.',
  'Я общаюсь с моими пациентами только формально, без лишних эмоций, и стремлюсь свести время общения с ними до минимума.',
  'Я чувствую себя энергичным(ой) и эмоционально приподнятым(ой).',
  'Я умею находить правильное решение в конфликтных ситуациях с больными и их родственниками.',
  'Я чувствую угнетенность и апатию.',
  'Я могу позитивно влиять на самочувствие и настроение больных (пациентов).',
  'В последнее время я стал(а) более черствым(ой) (бесчувственным) по отношению к больным.',
  'Как правило, окружающие меня люди слишком много требуют от меня. Они скорее утомляют, чем радуют меня.',
  'У меня много планов на будущее, и я верю в их осуществление.',
  'Я испытываю все больше жизненных разочарований.',
  'Я чувствую равнодушие и потерю интереса ко многому, что радовало меня раньше.',
  'Бывает, мне действительно безразлично то, что происходит с некоторыми моими больными.',
  'Мне хочется уединиться и отдохнуть от всего и от всех.',
  'Я легко могу создать атмосферу доброжелательности и оптимизма в отношениях с моими коллегами и в отношениях с моими больными.',
  'Я легко общаюсь с больными и их родственниками независимо от их социального статуса и характера.',
  'Я много успеваю сделать за день.',
  'Я чувствую себя на пределе своих возможностей.',
  'Я многого еще смогу достичь в своей жизни.',
  'Больные, как правило, — неблагодарные люди.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_911_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_911',
  title: 'Опросник профессионального выгорания Маслач (MBI), врачебная версия',
  description: 'Опросник оценивает профессиональное выгорание у врачей и других медицинских работников по трём компонентам: эмоциональному истощению, деперсонализации в отношении пациентов и субъективной оценке личных профессиональных достижений. Раздельные показатели помогают автору опроса увидеть профиль переживаний, связанных с работой; общий индекс перегорания приведён как отдельный производный показатель.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 6,
  scales: [
    { key: 'emotional_exhaustion', label: 'Эмоциональное истощение', items: [1, 2, 3, 6, 8, 13, 14, 16, 20], reverseItems: [], aggregation: 'sum' },
    { key: 'depersonalization', label: 'Деперсонализация', items: [5, 10, 11, 15, 22], reverseItems: [], aggregation: 'sum' },
    { key: 'personal_accomplishment', label: 'Личные профессиональные достижения', items: [4, 7, 9, 12, 17, 18, 19, 21], reverseItems: [], aggregation: 'sum' },
  ],
};

const allAnswers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы никогда: нулевые симптомы, максимальные достижения',
    answers: allAnswers(0),
    expected: { emotional_exhaustion: 0, depersonalization: 0, personal_accomplishment: 0 },
  },
  {
    title: 'Проверочный смешанный профиль по ключу шкал',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), [1, 2, 3, 6, 8, 13, 14, 16, 20].includes(index + 1) ? 2 : [5, 10, 11, 15, 22].includes(index + 1) ? 1 : 4])),
    expected: { emotional_exhaustion: 18, depersonalization: 5, personal_accomplishment: 32 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'maslach-mbi-hss-vodopyanova-medical-2007-v1',
};

