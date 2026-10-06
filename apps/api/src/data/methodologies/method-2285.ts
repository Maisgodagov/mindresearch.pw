import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = Array.from({ length: 7 }, (_, index) => ({ value: String(index + 1), label: String(index + 1) }));

const situations = [
  'Ситуация сверхурочной работы без дополнительного вознаграждения',
  'Опоздания на работу, отсутствие на рабочем месте, частые отгулы, нетрезвое состояние сотрудников, с которыми вы совместно работаете',
  'Нетактичное поведение (или несправедливое отношение) руководителя',
  'Необходимость делать работу за других без морального и материального вознаграждения',
  'Сбои в работе из-за трудностей взаимодействия (плохих коммуникаций) с другими подразделениями предприятия',
  'Грубость и несдержанность коллег (заказчиков, клиентов, бизнес-партнеров)',
];

const poles: [string, string][] = [
  ['Ситуация возникает редко', 'Ситуация повторяется часто'],
  ['Я чувствую себя спокойно', 'Я чувствую себя взвинченным, раздраженным'],
  ['Ситуация полезна для меня', 'Ситуация причиняет вред для моего морального самочувствия и благополучия'],
  ['Ситуация находится у меня под контролем', 'У меня нет возможности повлиять на подобные ситуации или прояснить их'],
  ['Это никак не отражается на моей работе', 'Это мешает мне качественно и в срок делать свою работу'],
  ['Ситуация часто улучшается сама по себе, без моего участия', 'Ситуация остается неизменной, если я не вмешаюсь'],
];

const questions: SeedSection['questions'] = situations.flatMap((situation, situationIndex) => poles.map(([low, high], poleIndex) => ({
  code: `test_2303_${situationIndex * 6 + poleIndex + 1}`,
  text: `${situation}. ${low} / ${high}`,
  type: 'single' as const,
  required: true,
  options,
})));

export const instrument: SeedSection = {
  code: 'test_2303',
  title: 'Шкала оценки стрессогенности ПТС (вариант для специалистов торгово-производственной организации)',
  description: 'Методика Н. Е. Водопьяновой оценивает стрессогенность профессионально-трудных ситуаций на рабочем месте по частоте, эмоциональной напряженности, личной значимости, контролируемости, влиянию на продуктивность и неопределенности развития. Эта версия содержит шесть типичных ситуаций для сотрудников торгово-производственной организации и подходит авторам опросов, изучающим рабочие стрессоры и субъективное восприятие трудных ситуаций.',
  questions,
};

const sequence = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, index) => from + index);
const itemsForPole = (pole: number) => situations.map((_, situationIndex) => situationIndex * 6 + pole);

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'repeatability', label: 'Повторяемость', items: itemsForPole(1), reverseItems: [], aggregation: 'mean' },
    { key: 'emotional_tension', label: 'Эмоциональная напряженность', items: itemsForPole(2), reverseItems: [], aggregation: 'mean' },
    { key: 'personal_significance', label: 'Личная значимость', items: itemsForPole(3), reverseItems: [], aggregation: 'mean' },
    { key: 'uncontrollability', label: 'Неконтролируемость', items: itemsForPole(4), reverseItems: [], aggregation: 'mean' },
    { key: 'productivity', label: 'Влияние на продуктивность', items: itemsForPole(5), reverseItems: [], aggregation: 'mean' },
    { key: 'uncertainty', label: 'Неопределенность развития', items: itemsForPole(6), reverseItems: [], aggregation: 'mean' },
    { key: 'loss_situations', label: 'Ситуации потери (ПТС 1 и 4)', items: [...sequence(1, 6), ...sequence(19, 24)], reverseItems: [], aggregation: 'mean' },
    { key: 'threat_situations', label: 'Ситуации угрозы потери (ПТС 2 и 5)', items: [...sequence(7, 12), ...sequence(25, 30)], reverseItems: [], aggregation: 'mean' },
    { key: 'challenge_situations', label: 'Ситуации вызова (ПТС 3 и 6)', items: [...sequence(13, 18), ...sequence(31, 36)], reverseItems: [], aggregation: 'mean' },
    { key: 'stress_index', label: 'Общий индекс стрессогенности', items: sequence(1, 36), reverseItems: [], aggregation: 'mean' },
  ],
};

const uniformAnswers = (value: number) => Object.fromEntries(sequence(1, 36).map(item => [String(item), value]));
const validationCases: ValidationCase[] = [
  { title: 'Ручная проверка: все оценки 1 дают минимум по каждому критерию', answers: uniformAnswers(1), expected: { repeatability: 1, emotional_tension: 1, personal_significance: 1, uncontrollability: 1, productivity: 1, uncertainty: 1, loss_situations: 1, threat_situations: 1, challenge_situations: 1, stress_index: 1 } },
  { title: 'Ручная проверка: все оценки 7 дают максимум по каждому критерию', answers: uniformAnswers(7), expected: { repeatability: 7, emotional_tension: 7, personal_significance: 7, uncontrollability: 7, productivity: 7, uncertainty: 7, loss_situations: 7, threat_situations: 7, challenge_situations: 7, stress_index: 7 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  categoryIds: ['work'],
  scoringConfig,
  validationCases,
  formulaVersion: 'vodopyanova-pts-trade-production-six-situations-2006-v1',
};
