import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const answers = [
  { value: '0', label: 'Никогда' },
  { value: '1', label: 'Редко' },
  { value: '2', label: 'Иногда' },
  { value: '3', label: 'Часто' },
  { value: '4', label: 'Всегда' },
];

const items = [
  'Я сплю в дневное время от двух часов и дольше.',
  'Я ложусь спать каждый день в разное время.',
  'Я встаю каждый день в разное время.',
  'Менее чем за час до отхода ко сну я интенсивно занимаюсь физкультурой, до появления пота.',
  'Я остаюсь в постели дольше, чем следует, два или три раза в неделю.',
  'Я употребляю алкоголь, табак или кофеин менее чем за четыре часа до отхода ко сну или уже в постели.',
  'Я делаю что-то, что может меня взбодрить, прямо перед сном (например, играю в видеоигры, сижу в интернете, убираюсь).',
  'Я ложусь в постель в состоянии стресса, злой, расстроенный или нервный.',
  'Я использую свою кровать для чего-то, кроме сна и секса (например, смотрю телевизор, читаю, ем).',
  'Я сплю на неудобной постели (например, низкого качества матрас или подушка, слишком тёплое или недостаточно тёплое одеяло).',
  'Я сплю в некомфортной комнате (например, слишком освещённой, душной, жаркой, холодной или шумной).',
  'Я делаю важные дела перед сном (например, учусь, доделываю работу, разбираюсь с финансами).',
  'Лёжа в постели, я размышляю, составляю планы или беспокоюсь о чём-то.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_354_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options: answers,
}));

export const instrument: SeedSection = {
  code: 'test_354',
  title: 'Индекс гигиены сна (Sleep Hygiene Index, SHI)',
  description: 'Индекс гигиены сна оценивает частоту поведенческих привычек и условий спальни, которые могут мешать сну: регулярность режима, дневной сон, стимулирующая активность и вещества перед сном, эмоциональное напряжение, использование кровати и комфорт среды. Оригинальная версия Mastin, Bryson и Corwyn рассчитана на самоотчёт взрослых; русский перевод psytests.org опубликован как перевод оригинала, без заявленной российской адаптации.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 4,
  scales: [
    { key: 'total', label: 'Общий балл SHI', items: Array.from({ length: 13 }, (_, i) => i + 1), reverseItems: [], aggregation: 'sum' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Ручная проверка: все ответы «Никогда» дают минимальную сумму',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 0])),
    expected: { total: 0 },
  },
  {
    title: 'Ручная проверка: все ответы «Всегда» дают максимальную сумму',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 4])),
    expected: { total: 52 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'shi-mastin-bryson-corwyn-2006-psytests-ru-v1',
};
