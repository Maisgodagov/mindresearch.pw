import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = [
  { value: '1', label: 'Полностью не согласен' },
  { value: '2', label: 'Не согласен' },
  { value: '3', label: 'Скорее не согласен' },
  { value: '4', label: 'Ни согласен, ни не согласен' },
  { value: '5', label: 'Скорее согласен' },
  { value: '6', label: 'Согласен' },
  { value: '7', label: 'Полностью согласен' },
];

const items = [
  'Я испытываю разнообразные эмоции.',
  'Мои эмоции меняются, пока я рассматриваю произведения медиаискусства.',
  'Я чувствую себя растроганным.',
  'Я испытываю ощущения в теле.',
  'Я сравниваю прошлую культуру медиаискусства с современной культурой.',
  'Я рассматриваю произведение медиаискусства как дополнение временного периода, в котором оно было создано.',
  'Я пытаюсь поместить произведение медиаискусства в его исторический контекст.',
  'Я связываю произведение медиаискусства с другими работами нашего времени.',
  'Для меня важна композиция произведения медиаискусства.',
  'Для меня важны цвета произведения медиаискусства.',
  'Я сосредотачиваюсь на едва уловимых аспектах произведения медиаискусства.',
  'Я стремлюсь к полному пониманию произведения медиаискусства.',
  'Я пытаюсь понять, что хотел донести автор произведения медиаискусства.',
  'Я получаю новые представления о произведении медиаискусства.',
  'Я рассматриваю произведение медиаискусства как продолжение мысли художника.',
  'У меня есть четкое представление о том, на что обращать внимание при созерцании произведения медиаискусства.',
  'Обычно мне кажется, что мои мысли о произведении медиаискусства верны.',
  'Я чувствую, что способен понять произведение медиаискусства.',
  'Я теряю счет времени, когда созерцаю произведения медиаискусства.',
  'Я теряюсь в мыслях, когда созерцаю произведения медиаискусства.',
  'Я полностью сосредоточен на рассмотрении произведения медиаискусства.',
  'Опыт созерцания произведения медиаискусства обогащает меня.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_1344_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_1344',
  title: 'Опросник эстетического опыта искусства новых медиа (AEQ-NmA)',
  description: 'Оценивает эстетический опыт при восприятии произведений искусства новых медиа у старших подростков и молодёжи. Охватывает эмоциональный отклик, культурный контекст, перцептивное внимание, понимание произведения и два аспекта потока: его проксимальные условия и субъективный опыт погружения.',
  questions,
};

const scales = [
  { key: 'emotions', label: 'Эмоции', items: [1, 2, 3, 4] },
  { key: 'culture', label: 'Культура', items: [5, 6, 7, 8] },
  { key: 'perception', label: 'Перцепция', items: [9, 10, 11] },
  { key: 'understanding', label: 'Понимание', items: [12, 13, 14, 15] },
  { key: 'flow_proximal', label: 'Поток — проксимальные условия', items: [16, 17, 18] },
  { key: 'flow_experience', label: 'Поток — опыт', items: [19, 20, 21, 22] },
  { key: 'total', label: 'Общий балл', items: Array.from({ length: 22 }, (_, index) => index + 1) },
];

export const scoringConfig: ConfigurableScoring = {
  min: 1,
  max: 7,
  scales: scales.map(scale => ({ ...scale, reverseItems: [], aggregation: 'sum' as const })),
};

const allAnswers = (value: number) => Object.fromEntries(items.map((_, index) => [String(index + 1), value]));
const validationCases: ValidationCase[] = [
  { title: 'Все ответы — «Полностью не согласен»', answers: allAnswers(1), expected: { emotions: 4, culture: 4, perception: 3, understanding: 4, flow_proximal: 3, flow_experience: 4, total: 22 } },
  { title: 'Все ответы — «Полностью согласен»', answers: allAnswers(7), expected: { emotions: 28, culture: 28, perception: 21, understanding: 28, flow_proximal: 21, flow_experience: 28, total: 154 } },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'aeq-nma-shestova-kozhukhar-2025-v1',
};
