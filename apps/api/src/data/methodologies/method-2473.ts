import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '0', label: 'Никогда' },
  { value: '1', label: 'Изредка' },
  { value: '2', label: 'Иногда' },
  { value: '3', label: 'Часто' },
  { value: '4', label: 'Почти всегда' },
];

const statements = [
  'Я способен адаптироваться к происходящим изменениям.',
  'У меня близкие и надежные отношения с другими.',
  'Иногда мне помогает судьба или Бог.',
  'Я могу справиться со всем, что мне встречается на пути.',
  'Прошлые успехи придают мне уверенность.',
  'Я пытаюсь увидеть смешную сторону вещей, когда сталкиваюсь с проблемами.',
  'То, что я справляюсь со стрессом, может сделать меня сильнее.',
  'Я обычно восстанавливаюсь после болезней, ран или других лишений.',
  'Я считаю, что большинство событий происходит не без причины.',
  'Я стараюсь приложить все усилия, вне зависимости от ситуации.',
  'Я верю, что могу достичь своих целей, несмотря на препятствия.',
  'Я не сдаюсь даже в безнадежных ситуациях.',
  'Во времена стресса я знаю, где найти помощь.',
  'Под давлением я сохраняю концентрацию и четкость мыслей.',
  'Я предпочитаю руководить при решении проблем.',
  'Меня не просто лишить воли неудачами.',
  'Я рассматриваю себя, как сильную личность, способную справиться с вызовами и сложностями жизни.',
  'Я принимаю непопулярные или сложные решения.',
  'Я могу справиться с такими неприятными или болезненными ощущениями, как печаль, страх и гнев.',
  'Я должен действовать интуитивно.',
  'У меня сильное чувство цели в жизни.',
  'Я чувствую, что контролирую ситуацию.',
  'Мне нравятся вызовы.',
  'Я работаю для достижения целей.',
  'Я горжусь своими достижениями.',
];

const questions: SeedSection['questions'] = statements.map((text, index) => ({
  code: `test_2491_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2491',
  title: 'Шкала устойчивости Коннор-Дэвидсона (CD-RISC-25)',
  description: 'Шкала оценивает самоотчётную психологическую устойчивость — способность адаптироваться к стрессу, сохранять целенаправленность и восстанавливаться после трудностей. Пункты охватывают адаптацию и восстановление, настойчивость и уверенность, контроль эмоций и мыслей под давлением, отношения и обращение за поддержкой, чувство цели и принятие вызовов. Полная 25-пунктовая версия разработана для взрослых и применялась как в общей, так и в клинической выборках; результат даёт суммарную оценку устойчивости за последний месяц, а не диагностическое заключение.',
  categoryIds: ['trait-resilience'],
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 4,
  scales: [{
    key: 'resilience_total',
    label: 'Общий балл устойчивости',
    items: Array.from({ length: 25 }, (_, index) => index + 1),
    reverseItems: [],
    aggregation: 'sum',
  }],
};

const allZero = Object.fromEntries(statements.map((_, index) => [String(index + 1), 0]));
const manualExample = { ...allZero, '1': 4, '2': 3 };
const allFour = Object.fromEntries(statements.map((_, index) => [String(index + 1), 4]));

const validationCases: ValidationCase[] = [
  { title: 'Проверка крайних значений: все ответы «Никогда»', answers: allZero, expected: { resilience_total: 0 } },
  { title: 'Ручная проверка: пункты 1 и 2 дают 4 + 3, остальные дают 0', answers: manualExample, expected: { resilience_total: 7 } },
  { title: 'Проверка максимума: все ответы «Почти всегда»', answers: allFour, expected: { resilience_total: 100 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'connor-davidson-cd-risc-25-original-sum-0-4-v1',
};
