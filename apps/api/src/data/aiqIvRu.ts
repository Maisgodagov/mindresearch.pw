import type { SeedSection } from '../types.js';
import type { ConfigurableScoring, ValidationCase } from '../scoring/configurable.js';

const options = [
  { value: '1', label: '1 — Не имеет значения для моего понимания, кто я такой' },
  { value: '2', label: '2 — Имеет очень небольшое значение для моего понимания, кто я такой' },
  { value: '3', label: '3 — Довольно-таки важно для моего понимания, кто я такой' },
  { value: '4', label: '4 — Очень важно для моего понимания, кто я такой' },
  { value: '5', label: '5 — Чрезвычайно важно для моего понимания, кто я такой' },
];

// Short Russian form: the 35 items belonging to the four scored AIQ-IV orientations.
// The ten special/unscored items in the 45-item form are intentionally omitted.
const items: Array<{ originalNumber: number; text: string }> = [
  { originalNumber: 2, text: 'Мои личные ценности и моральные нормы.' },
  { originalNumber: 3, text: 'Моя репутация, моя популярность среди других людей.' },
  { originalNumber: 4, text: 'Принадлежность к роду, ко многим поколениям моей семьи.' },
  { originalNumber: 5, text: 'Мои мечты и воображение.' },
  { originalNumber: 6, text: 'Как другие люди реагируют на то, что я говорю и делаю.' },
  { originalNumber: 7, text: 'Моя расовая или этническая принадлежность.' },
  { originalNumber: 8, text: 'Мои личные цели и надежды на будущее.' },
  { originalNumber: 9, text: 'Моя внешность: рост, вес, телесная конституция.' },
  { originalNumber: 10, text: 'Моя религия и религиозные убеждения.' },
  { originalNumber: 11, text: 'Мои эмоции и чувства.' },
  { originalNumber: 12, text: 'Моя репутация: что другие думают обо мне.' },
  { originalNumber: 13, text: 'Место, где я живу или где я вырос/выросла.' },
  { originalNumber: 14, text: 'Мои мысли и идеи.' },
  { originalNumber: 15, text: 'Моя привлекательность для других людей.' },
  { originalNumber: 17, text: 'Мои манеры, особенности поведения и то, какое впечатление я произвожу на других.' },
  { originalNumber: 18, text: 'Как я справляюсь со своими страхами и тревогами.' },
  { originalNumber: 20, text: 'Мое поведение при встречах с другими людьми.' },
  { originalNumber: 21, text: 'Мое осознание себя как уникальной личности, отличной от других.' },
  { originalNumber: 22, text: 'Мои отношения с близкими мне людьми.' },
  { originalNumber: 24, text: 'Мое чувство принадлежности к своей группе, своему сообществу.' },
  { originalNumber: 25, text: 'Осознание того, что я внутренне остаюсь одним и тем же человеком, хотя жизнь привносит много внешних изменений.' },
  { originalNumber: 26, text: 'Быть хорошим другом для тех, кто мне дорог.' },
  { originalNumber: 27, text: 'Знание о самом себе, о том, какой я человек на самом деле.' },
  { originalNumber: 28, text: 'Моя готовность быть заботливым партнером в близких отношениях.' },
  { originalNumber: 29, text: 'Гордость за мою страну, гордость, что я гражданин.' },
  { originalNumber: 31, text: 'Готовность делиться важными для себя переживаниями с близкими друзьями.' },
  { originalNumber: 32, text: 'Моя личная оценка себя, мое личное мнение о себе.' },
  { originalNumber: 34, text: 'Взаимность в межличностных отношениях.' },
  { originalNumber: 35, text: 'Иметь глубокую связь и взаимопонимание с другим человеком.' },
  { originalNumber: 37, text: 'Развитие участливого отношения к другим людям.' },
  { originalNumber: 38, text: 'Мои политические взгляды или моя политическая активность.' },
  { originalNumber: 39, text: 'Мое стремление понять истинные мысли и чувства моего друга или партнера.' },
  { originalNumber: 41, text: 'Тесная душевная связь с другими людьми.' },
  { originalNumber: 42, text: 'Мой родной язык, наличие в моей речи акцента, знание местного диалекта или иностранного языка.' },
  { originalNumber: 43, text: 'Мое ощущение связанности с близкими мне людьми.' },
];

const compactItem = (originalNumber: number) => items.findIndex(item => item.originalNumber === originalNumber) + 1;
const questions: SeedSection['questions'] = items.map(({ originalNumber, text }) => ({
  code: `test_41_${originalNumber}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const aiqIvRuInstrument: SeedSection = {
  code: 'test_41',
  title: 'Аспекты идентичности, AIQ-IV — русская 35-пунктовая форма',
  description: 'Краткая русскоязычная форма AIQ-IV для оценки четырёх ориентаций идентичности: личной, реляционной, социальной (публичной) и коллективной. Оценивается значимость аспектов для понимания себя; общий балл не рассчитывается.',
  questions,
};

export const aiqIvRuScoring: ConfigurableScoring = {
  min: 1,
  max: 5,
  scales: [
    { key: 'personal', label: 'Личная идентичность', items: [2, 5, 8, 11, 14, 18, 21, 25, 27, 32].map(compactItem), reverseItems: [], aggregation: 'sum' },
    { key: 'relational', label: 'Реляционная идентичность', items: [22, 26, 28, 31, 34, 35, 37, 39, 41, 43].map(compactItem), reverseItems: [], aggregation: 'sum' },
    { key: 'public', label: 'Социальная (публичная) идентичность', items: [3, 6, 9, 12, 15, 17, 20].map(compactItem), reverseItems: [], aggregation: 'sum' },
    { key: 'collective', label: 'Коллективная идентичность', items: [4, 7, 10, 13, 24, 29, 38, 42].map(compactItem), reverseItems: [], aggregation: 'sum' },
  ],
};

const allAnswers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const mixedAnswers = { ...allAnswers(2) };
for (const originalNumber of [2, 22, 3, 4]) mixedAnswers[String(compactItem(originalNumber))] = 5;

export const aiqIvRuValidationCases: ValidationCase[] = [
  { title: 'Минимальные значения по четырём шкалам', answers: allAnswers(1), expected: { personal: 10, relational: 10, public: 7, collective: 8 } },
  { title: 'Максимальные значения по четырём шкалам', answers: allAnswers(5), expected: { personal: 50, relational: 50, public: 35, collective: 40 } },
  { title: 'Смешанный профиль: по одному повышенному ответу в каждой шкале', answers: mixedAnswers, expected: { personal: 23, relational: 23, public: 17, collective: 19 } },
];
