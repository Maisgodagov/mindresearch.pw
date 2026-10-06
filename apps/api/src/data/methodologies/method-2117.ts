import type { SeedSection } from '../../types.js';
import type { ConfigurableScoring, ValidationCase } from '../../scoring/configurable.js';
import type { MethodologyRegistration } from '../methodologyRegistry.js';

const options = Array.from({ length: 11 }, (_, value) => ({ value: String(value), label: String(value) }));

const items = [
  'Мне нужно спать 8 часов в сутки, чтобы чувствовать себя выспавшимся и хорошо функционировать в течение дня.',
  'Если я не выспался в одну ночь, мне нужно «отоспаться» на следующий день днем или следующей ночью спать дольше.',
  'Меня беспокоит, что хроническая бессонница может иметь серьезные последствия для моего здоровья.',
  'Меня тревожит, что я могу потерять контроль над моей способностью спать.',
  'После бессонной ночи я знаю, что это скажется на моей активности на следующий день.',
  'Мне кажется, мне скорее стоит принять снотворное, чтобы быть бодрым и хорошо функционировать в течение дня, чем плохо спать ночью.',
  'Если я чувствую себя раздраженным, подавленным или тревожным в течение дня, это, в основном, потому, что я плохо спал накануне.',
  'Я знаю, что когда я плохо сплю одну ночь, это нарушит мой сон на целую неделю.',
  'Без нормального сна ночью я вряд ли смогу функционировать на следующий день.',
  'Я никогда не могу предсказать, хорошо или плохо буду спать следующей ночью.',
  'Мне практически не удается преодолеть отрицательные последствия бессонной ночи.',
  'Когда я чувствую себя уставшим, обессиленным или просто не могу хорошо работать в течение дня, это происходит, в основном, потому, что я плохо спал накануне.',
  'Мне кажется, что бессонница – это, по большей части, результат нарушения обмена веществ.',
  'Я чувствую, что бессонница разрушает мою способность наслаждаться жизнью и не дает мне заниматься тем, что мне нравится.',
  'Прием лекарств, вероятно, единственный способ справиться с бессонницей.',
  'Я стараюсь не брать на себя или отменять обязательства (семейные, социальные) после бессонной ночи.',
];

const questions: SeedSection['questions'] = items.map((text, index) => ({
  code: `test_2131_${index + 1}`,
  text,
  type: 'single',
  required: true,
  options,
}));

export const instrument: SeedSection = {
  code: 'test_2131',
  title: 'Шкала дисфункциональных убеждений в отношении сна (DBAS-16)',
  description: 'DBAS-16 оценивает выраженность дисфункциональных убеждений и установок о сне и бессоннице, включая ожидания относительно необходимого сна, тревогу и беспомощность, воспринимаемые последствия бессонницы и представления о лекарствах. Подходит для взрослых с трудностями сна и для исследовательской или клинической оценки когнитивных факторов, поддерживающих инсомнию; русская версия Рассказовой и Тхостова.',
  questions,
};

export const scoringConfig: ConfigurableScoring = {
  min: 0,
  max: 10,
  scales: [
    { key: 'total', label: 'Общий показатель дисфункциональных убеждений о сне', items: Array.from({ length: 16 }, (_, i) => i + 1), reverseItems: [], aggregation: 'mean' },
    { key: 'expectations', label: 'Ожидания относительно сна', items: [1, 2], reverseItems: [], aggregation: 'mean' },
    { key: 'worry_helplessness', label: 'Тревога и беспомощность в отношении бессонницы', items: [3, 4, 8, 10, 11, 14], reverseItems: [], aggregation: 'mean' },
    { key: 'consequences', label: 'Воспринимаемые последствия бессонницы', items: [5, 7, 9, 12, 16], reverseItems: [], aggregation: 'mean' },
    { key: 'medication', label: 'Убеждения о медикаментах', items: [6, 13, 15], reverseItems: [], aggregation: 'mean' },
  ],
};

const validationCases: ValidationCase[] = [
  {
    title: 'Все ответы 0 дают нулевые средние по всем шкалам',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 0])),
    expected: { total: 0, expectations: 0, worry_helplessness: 0, consequences: 0, medication: 0 },
  },
  {
    title: 'Все ответы 10 дают максимальные средние по всем шкалам',
    answers: Object.fromEntries(items.map((_, index) => [String(index + 1), 10])),
    expected: { total: 10, expectations: 10, worry_helplessness: 10, consequences: 10, medication: 10 },
  },
];

export const methodology: MethodologyRegistration = {
  instrument,
  scoringConfig,
  validationCases,
  formulaVersion: 'dbas-16-rasskazova-tkhostov-morin-2007-0-10-four-domains-v1',
};
