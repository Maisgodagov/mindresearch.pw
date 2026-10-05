import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'Никогда' },
  { value: '1', label: 'Иногда' },
  { value: '2', label: 'Довольно часто' },
  { value: '3', label: 'Часто' },
  { value: '4', label: 'Всегда или почти всегда' },
];

const items = [
  'В ситуации социального общения, где я почти никого не знаю.',
  'Когда я смотрю на себя в зеркало.',
  'Когда окружающие видят меня до того, как я привел(а) себя в порядок.',
  'Когда я нахожусь в обществе привлекательных людей моего пола.',
  'Когда я нахожусь в обществе привлекательных людей противоположного пола.',
  'Когда кто-то смотрит на те части моего тела, которые мне не нравятся.',
  'Когда я смотрю в зеркало на свое обнаженное тело.',
  'Когда я в магазине примеряю новую одежду.',
  'После плотного обеда.',
  'Когда я вижу красивых людей в журналах или на экране телевизора.',
  'Когда я встаю на весы.',
  'В ожидании или во время сексуальной близости.',
  'Когда у меня плохое настроение.',
  'Когда заходит разговор о внешности.',
  'Когда кто-то нелестно высказывается по поводу моей внешности.',
  'Когда я вижу себя на фотографии или в видеозаписи.',
  'Когда я думаю о том, как мне хотелось бы выглядеть.',
  'Когда я думаю о том, как я буду выглядеть в более старшем возрасте.',
  'Когда я наедине с определенным человеком.',
  'Во время других ситуаций досуга и отдыха.',
];

const allItems = Array.from({ length: 20 }, (_, index) => index + 1);
const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1605_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1605',
  title: 'Ситуативная неудовлетворенность образом тела (SIBID-S)',
  description: 'Краткая 20-пунктовая форма SIBID-S оценивает частоту негативных эмоциональных переживаний, связанных с собственной внешностью, в конкретных социальных и повседневных ситуациях. Профиль ответов помогает исследователю или специалисту выявить контексты, в которых чаще возникают неловкость, неудовлетворенность телом или стресс; форма разработана для взрослых и подростков и применялась к мужчинам и женщинам.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 4,
  scales: [
    { key: 'situational_dysphoria', label: 'Ситуативная неудовлетворенность образом тела', items: allItems, reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: ответ «Иногда» по всем 20 ситуациям',
    answers: Object.fromEntries(allItems.map((item) => [String(item), 1])),
    expected: { situational_dysphoria: 1 },
  },
  {
    title: 'Ручная проверка верхней границы шкалы',
    answers: Object.fromEntries(allItems.map((item) => [String(item), 4])),
    expected: { situational_dysphoria: 4 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'sibids-russian-baranskaya-tataurova-2011-mean-0-4-v1',
};
