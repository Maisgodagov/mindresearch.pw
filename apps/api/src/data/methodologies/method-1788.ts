import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Редко' },
  { value: '2', label: 'Иногда' },
  { value: '3', label: 'Часто' },
];

const items = [
  'Я думаю, что меня недооценивают в коллективе.',
  'Я стараюсь работать, даже если бываю не совсем здоров.',
  'Я постоянно переживаю за качество своей работы.',
  'Я бываю настроен агрессивно.',
  'Я не терплю критики в свой адрес.',
  'Я бываю раздражителен.',
  'Я стараюсь быть лидером там, где это возможно.',
  'Меня считают человеком настойчивым и напористым.',
  'Я страдаю бессонницей.',
  'Своим недругам я могу дать отпор.',
  'Я эмоционально и болезненно переживаю неприятности.',
  'У меня не хватает времени на отдых.',
  'У меня возникают конфликтные ситуации.',
  'Мне недостает власти, чтобы реализовать себя.',
  'У меня не хватает времени, чтобы заняться любимым делом.',
  'Я всё делаю быстро.',
  'Я испытываю страх, что не поступлю в институт (или потеряю работу).',
  'Я действую сгоряча, а затем переживаю за свои дела и поступки.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1805_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1805',
  title: 'Тест на самооценку стрессоустойчивости личности (Киршева — Рябчикова)',
  description: 'Опросник даёт ориентировочную самооценку стрессоустойчивости по типичным проявлениям напряжения и поведения: раздражительности, конфликтности, переживанию критики и неприятностей, перегрузке и трудностям отдыха. Версия из 18 утверждений предназначена для общей самооценки взрослых; результаты помогают автору опроса изучать субъективную устойчивость к стрессовым и конфликтным ситуациям, но не являются клиническим диагнозом.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 3,
  scales: [{
    key: 'stress_resilience',
    label: 'Самооценка стрессоустойчивости',
    items: Array.from({ length: 18 }, (_, index) => index + 1),
    reverseItems: [],
    aggregation: 'sum',
  }],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы «Редко»: 18 пунктов по 1 баллу дают 18',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { stress_resilience: 18 },
  },
  {
    title: 'Все ответы «Часто»: 18 пунктов по 3 балла дают 54',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 3])),
    expected: { stress_resilience: 54 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'kirsh-eva-ryabchikova-18item-ru-sum-1-3-v1',
};
