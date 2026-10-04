import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

// Русская адаптация WAI-S, клиентская форма из приложения к публикации 2025 года.
const answers = [
  { value: '1', label: 'Никогда' },
  { value: '2', label: 'Очень редко' },
  { value: '3', label: 'Редко' },
  { value: '4', label: 'Иногда' },
  { value: '5', label: 'Часто' },
  { value: '6', label: 'Очень часто' },
  { value: '7', label: 'Всегда' },
];

const items = [
  '_______ и я согласны с тем, что мне нужно делать в терапии, чтобы улучшить мою ситуацию',
  'То, что я делаю в терапии, дает мне новый взгляд на мою проблему',
  '_________________ не понимает, чего я пытаюсь достичь в терапии',
  'Я уверен(а) в способности _________ помочь мне',
  '____________ и я работаем над достижением взаимно согласованных целей',
  'Я чувствую, что ___________ ценит и понимает меня',
  'Мы договариваемся о том, над чем мне важно работать',
  '_________ и я доверяем друг другу',
  'У меня с ___________ разные представления о том, в чем заключаются мои проблемы',
  'Мы пришли к хорошему пониманию того, какие изменения будут полезны для меня',
  'Я считаю, что то, как мы работаем с моей проблемой, правильно',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_621_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: answers,
}));

const instrument: SeedSection = {
  code: 'test_621',
  title: 'Методика измерения рабочего (психотерапевтического) альянса WAI-S — форма клиента',
  description: 'Клиентская форма WAI-S оценивает субъективное качество рабочего альянса между клиентом и психотерапевтом в процессе психотерапии или психологического консультирования. Пункты охватывают согласованность действий и целей работы, понимание проблемы, доверие и эмоциональную связь; форма подходит взрослым клиентам, оценивающим отношения со своим терапевтом.',
  questions,
};

const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: [
    { key: 'alliance', label: 'Общий показатель рабочего альянса (форма клиента)', items: Array.from({ length: 11 }, (_, i) => i + 1), reverseItems: [3, 9], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: ответы 1 по прямым пунктам и 7 по обратным дают минимальную сумму',
    answers: Object.fromEntries(Array.from({ length: 11 }, (_, i) => [String(i + 1), [3, 9].includes(i + 1) ? 7 : 1])),
    expected: { alliance: 11 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'wai-s-russian-client-2025-reverse-3-9-sum-v1',
};
