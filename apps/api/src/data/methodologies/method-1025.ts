import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  'Абсолютно не согласен',
  'Не согласен',
  'Скорее не согласен',
  'Не могу определиться',
  'Скорее согласен',
  'Согласен',
  'Абсолютно согласен',
].map((label, index) => ({ value: String(index + 1), label }));

const items = [
  'Это не стоит моего времени или усилий — отплатить кому-то, кто обидел меня.',
  'Это важно для меня — поквитаться с человеком, который причинил мне боль.',
  'Я стараюсь свести счёты с любым, кто причинил мне боль.',
  'Лучше никогда не испытывать жажду мести.',
  'Я живу по принципу «пусть прошлое останется в прошлом».',
  'Нет ничего неправильного в том, чтобы отыграться на ком-то, кто причинил вам боль.',
  'Я не просто злюсь, я даю сдачи.',
  'Мне кажется, что легко простить тех, кто причинил мне боль.',
  'Я не мстительный человек.',
  'Я верю в правило «око за око, зуб за зуб».',
  'Месть — это аморально.',
  'Если кто-то доставляет мне неприятности, я найду способ заставить его пожалеть об этом.',
  'Люди, которые настаивают на мести, отвратительны.',
  'Если ко мне были несправедливы, я не прощу себе, если не отомщу.',
  'Это вопрос чести — поквитаться с тем, кто причинил вам боль.',
  'Обычно лучше проявить милосердие, чем отомстить.',
  'Любой, кто провоцирует меня, заслуживает быть наказанным мной.',
  'Всегда лучше «подставить другую щёку».',
  'Желание мести заставило бы меня стыдиться.',
  'Месть сладка.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1055_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1055',
  title: 'Опросник мстительности и прощения (ОМП)',
  description: 'Русскоязычная адаптация оценивает личностные суждения об уместности ответной мести и склонности к прощению. Две самостоятельные шкалы — «Мстительность» и «Прощение» — подходят для исследований взрослых респондентов и не сводят прощение к низкой мстительности.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'vengefulness', label: 'Мстительность', items: [2, 3, 6, 7, 10, 12, 14, 15, 17, 20], reverseItems: [], aggregation: 'sum' },
    { key: 'forgiveness', label: 'Прощение', items: [1, 4, 5, 8, 9, 11, 13, 16, 18, 19], reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы минимальны: по 10 баллов на каждую шкалу',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 1])),
    expected: { vengefulness: 10, forgiveness: 10 },
  },
  {
    title: 'Максимум по мстительности и минимум по прощению',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), [2, 3, 6, 7, 10, 12, 14, 15, 17, 20].includes(index + 1) ? 7 : 1])),
    expected: { vengefulness: 70, forgiveness: 10 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'omp-kolyvanova-enikolopov-2024-v1',
};
