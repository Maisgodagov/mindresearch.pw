import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'Всегда' },
  { value: '1', label: 'Часто' },
  { value: '2', label: 'Иногда' },
  { value: '3', label: 'Почти никогда' },
  { value: '4', label: 'Никогда' },
];

const items = [
  'Вы едите, по крайней мере, одно горячее блюдо в день.',
  'Вы спите 7–8 часов, по крайней мере, четыре раза в неделю.',
  'Вы постоянно чувствуете любовь других и отдаете свою любовь взамен.',
  'В пределах 50 километров у вас есть хотя бы один человек, на которого вы можете положиться.',
  'Вы упражняетесь до пота хотя бы два раза в неделю.',
  'Вы выкуриваете меньше половины пачки сигарет в день, или не курите вовсе.',
  'За неделю вы потребляете не больше пяти рюмок крепких алкогольных напитков.',
  'Ваш вес соответствует вашему росту: рост (см) – вес (кг) = 100±10.',
  'Ваш доход полностью удовлетворяет ваши основные потребности.',
  'Вас поддерживает ваша вера.',
  'Вы регулярно занимаетесь клубной или общественной деятельностью.',
  'У вас много друзей и знакомых.',
  'У вас есть один или два друга, которым вы полностью доверяете.',
  'Вы здоровы.',
  'Вы можете открыто заявить о своих чувствах, когда вы злы или обеспокоены чем-либо.',
  'Вы регулярно обсуждаете с людьми, с которыми живете, ваши домашние проблемы.',
  'Вы делаете что-то только ради шутки хотя бы раз в неделю или смеетесь три раза в неделю.',
  'Вы можете организовать ваше время эффективно.',
  'За день вы потребляете не более трех чашек кофе, чая или других содержащих кофеин напитков.',
  'У вас есть немного времени для себя в течение каждого дня.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_138_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_138',
  title: 'Бостонский тест на стрессоустойчивость (Stress Audit)',
  description: "Опросник оценивает субъективную уязвимость к стрессу через частоту типичных переживаний и реакций. Итоговый показатель помогает описать воспринимаемую стрессовую нагрузку, но не заменяет оценку причин и последствий стресса.",
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 4,
  scales: [{
    key: 'stress_vulnerability',
    label: 'Уязвимость к стрессу',
    items: Array.from({ length: 20 }, (_, index) => index + 1),
    reverseItems: [],
    aggregation: 'sum',
  }],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: всегда по всем пунктам соответствует исходным баллам 1; сумма 20 минус 20 равна 0',
    answers: Object.fromEntries(Array.from({ length: 20 }, (_, index) => [String(index + 1), 0])),
    expected: { stress_vulnerability: 0 },
  },
  {
    title: 'Ручная проверка: никогда по всем пунктам соответствует исходным баллам 5; сумма 100 минус 20 равна 80',
    answers: Object.fromEntries(Array.from({ length: 20 }, (_, index) => [String(index + 1), 4])),
    expected: { stress_vulnerability: 80 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'stress-audit-miller-smith-1993-shcherbatykh-ru-2005-v1',
};
